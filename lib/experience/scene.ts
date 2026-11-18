import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  narrativeFrame,
  dissipationVector,
  disperseParticles,
} from "./narrative";
import { renderBudget } from "./continuity";
import { scrollGravityPose } from "./world";
import { spectralCelloMaterial } from "./spectral-cello";
import { CelloSunlight } from "./cello-sunlight";
import { createDirectionalSkyMesh, skyDirection } from "./gravity-sky";
import {
  gravityCelloCamera,
  gravityCelloSound,
  normalizeGravityPoint,
} from "./gravity-camera";
import type { Perspective, Point3, SpatialFrame } from "./types";

export interface SceneInput {
  progress: number;
  paused: boolean;
  perspective: Perspective;
  pointer: readonly [number, number];
  stage: number;
  suspended?: boolean;
  playing?: boolean;
}
export interface SceneController {
  dispose(): void;
  update(time: number): void;
  resize(width: number, height: number): void;
}
export interface SceneOptions {
  read(): SceneInput;
  onSpatial(frame: SpatialFrame): void;
  onFailure(): void;
  signal: AbortSignal;
}

/** One canvas survives every transformation. Instrument geometry is the original
 * Blender export; only the presentation and the two-body excerpt are local. */
export async function createExperienceScene(
  scene: THREE.Group,
  camera: THREE.PerspectiveCamera,
  options: SceneOptions,
  width: number,
): Promise<SceneController> {
  const materials: THREE.MeshStandardMaterial[] = [];
  const celloMaterials: THREE.ShaderMaterial[] = [];
  let render: (time: number) => void = () => {};
  let disposed = false;
  let narrow = width < 760;
  const geometries = new Set<THREE.BufferGeometry>();
  const ownedMaterials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  const retain = (root: THREE.Object3D) =>
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material)
        ? object.material
        : [object.material]) {
        ownedMaterials.add(material);
        for (const value of Object.values(material))
          if (value instanceof THREE.Texture) textures.add(value);
      }
    });
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    options.signal.removeEventListener("abort", dispose);
    scene.traverse((object) => {
      if (
        object instanceof THREE.Mesh ||
        object instanceof THREE.Points ||
        object instanceof THREE.Line
      ) {
        geometries.add(object.geometry);
        for (const material of Array.isArray(object.material)
          ? object.material
          : [object.material])
          ownedMaterials.add(material);
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    ownedMaterials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
    scene.clear();
  };
  const resize = (width: number, height: number) => {
    if (disposed || !width || !height) return;
    narrow = width < 760;
    camera.aspect = width / height;
    camera.setViewOffset(
      width,
      height,
      narrow ? 0 : -width * 0.205,
      narrow ? height * 0.23 : 0,
      width,
      height,
    );
    camera.updateProjectionMatrix();
  };
  options.signal.addEventListener("abort", dispose, { once: true });

  try {
    const loader = new GLTFLoader();
    const load = async (name: string) => {
      const response = await fetch(`/models/experience/${name}.glb`, {
        signal: options.signal,
      });
      if (!response.ok) throw new Error(`Unable to load ${name}`);
      const model = await loader.parseAsync(
        await response.arrayBuffer(),
        "/models/experience/",
      );
      retain(model.scene);
      if (disposed || options.signal.aborted) {
        model.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) object.geometry.dispose();
        });
        ownedMaterials.forEach((material) => material.dispose());
        textures.forEach((texture) => texture.dispose());
        throw new DOMException("Cancelled", "AbortError");
      }
      return model.scene;
    };
    const loaded = await Promise.allSettled([
      load("gravity-cello"),
      load("gravity-performers"),
    ]);
    if (loaded.some((item) => item.status === "rejected"))
      throw new Error("The instrument models could not load.");
    const celloSource = (loaded[0] as PromiseFulfilledResult<THREE.Group>)
      .value;
    const performerSource = (loaded[1] as PromiseFulfilledResult<THREE.Group>)
      .value;
    const violinSource = performerSource.getObjectByName("violin-celestial");
    if (!violinSource) throw new Error("The original violin model is missing.");

    const textureLoader = new THREE.TextureLoader();
    const loadTexture = async (url: string) => {
      const texture = await textureLoader.loadAsync(url);
      if (disposed || options.signal.aborted) {
        texture.dispose();
        throw new DOMException("Cancelled", "AbortError");
      }
      textures.add(texture);
      return texture;
    };
    const nebula = await loadTexture(
      "/images/experience/gravity/cello-nebula.webp",
    );
    nebula.colorSpace = THREE.NoColorSpace;
    nebula.wrapS = nebula.wrapT = THREE.MirroredRepeatWrapping;
    const skyPhoto = await loadTexture(
      "/images/experience/gravity/sombrero.webp",
    );
    skyPhoto.colorSpace = THREE.SRGBColorSpace;
    const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
    blank.needsUpdate = true;
    textures.add(blank);
    const sky = createDirectionalSkyMesh(
      "gravity-original-sombrero-sky",
      [
        { yaw: 0, elevation: 0, width: 70, brightness: 1 },
        { yaw: 90, elevation: 18, width: 8, brightness: 0 },
        { yaw: -140, elevation: -24, width: 5, brightness: 0 },
        { yaw: 0, elevation: 90, width: 2.4, brightness: 0 },
      ],
      blank,
    );
    const skyUniforms = sky.material.uniforms;
    const skyWidth = 2 * Math.tan((70 * Math.PI) / 360);
    skyUniforms.next0.value = skyPhoto;
    skyUniforms.nextFrame.value[0].set(
      skyWidth,
      (skyWidth * 1195) / 1280,
      0.5,
      0.5,
    );
    skyUniforms.nextTone.value[0].set(0.006, 0.22, 0.48);
    skyUniforms.starDensity.value = narrow ? 0.03 : 0.05;
    scene.add(sky);

    function instrument(
      source: THREE.Object3D,
      size: number,
      color: string,
      spectral = false,
    ) {
      const body = source.clone(true);
      const bounds = new THREE.Box3().setFromObject(body);
      const center = bounds.getCenter(new THREE.Vector3());
      const scale = size / bounds.getSize(new THREE.Vector3()).y;
      const root = new THREE.Group();
      root.scale.setScalar(scale);
      root.userData.assetCenter = center.toArray();
      root.userData.assetScale = scale;
      const normalized = new THREE.Group();
      normalized.position.copy(center).negate();
      root.add(normalized);
      body.updateMatrixWorld(true);
      const batches = new Map<string, THREE.BufferGeometry[]>();
      body.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const original = (
          Array.isArray(object.material) ? object.material[0] : object.material
        ).name;
        const geometry = object.geometry
          .clone()
          .applyMatrix4(object.matrixWorld);
        for (const key of Object.keys(geometry.attributes))
          if (key !== "position" && key !== "normal")
            geometry.deleteAttribute(key);
        const batch = batches.get(original) ?? [];
        batch.push(geometry);
        batches.set(original, batch);
      });
      for (const [original, batch] of batches) {
        const merged = mergeGeometries(batch);
        batch.forEach((geometry) => geometry.dispose());
        if (!merged)
          throw new Error("The instrument geometry could not be prepared.");
        if (spectral) {
          merged.setAttribute(
            "soundingString",
            new THREE.BufferAttribute(
              new Float32Array(merged.attributes.position.count),
              1,
            ),
          );
          const material = spectralCelloMaterial(original, nebula);
          celloMaterials.push(material);
          const mesh = new THREE.Mesh(merged, material);
          mesh.renderOrder = original.startsWith("04") ? 1 : 0;
          normalized.add(mesh);
          continue;
        }
        const surface = /^(01|05)|shell|surface|body/i.test(original);
        const material = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: surface ? 0.08 : 0.4,
          metalness: 0.28,
          roughness: 0.36,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        material.userData.baseOpacity = surface ? 0.09 : 0.62;
        materials.push(material);
        normalized.add(new THREE.Mesh(merged, material));
      }
      scene.add(root);
      return root;
    }
    const cello = instrument(celloSource, 2.55, "#f6cd86", true);
    const celloCenter = cello.userData.assetCenter as Point3;
    const celloScale = cello.userData.assetScale as number;
    const celloEye = normalizeGravityPoint(
      gravityCelloCamera.position,
      celloCenter,
      celloScale,
    );
    const celloTarget = normalizeGravityPoint(
      gravityCelloCamera.target,
      celloCenter,
      celloScale,
    );
    const celloSound = normalizeGravityPoint(
      gravityCelloSound,
      celloCenter,
      celloScale,
    );
    const sunlight = new CelloSunlight();
    cello.children[0].add(sunlight.mesh);
    const violins = [
      instrument(violinSource, 0.5, "#dfc4ee"),
      instrument(violinSource, 0.43, "#c9e8e2"),
    ];
    scene.add(new THREE.AmbientLight("#dce7ed", 0.9));
    const keyLight = new THREE.DirectionalLight("#fff5d6", 1.8);
    keyLight.position.set(2, 4, 5);
    scene.add(keyLight);

    const count = renderBudget(width, false).particles;
    const dispersal = new Float32Array(count * 3);
    const assembled = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    cello.updateMatrixWorld(true);
    const vertices: THREE.Vector3[] = [];
    cello.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const attribute = object.geometry.getAttribute("position");
      const step = Math.max(1, Math.floor(attribute.count / 130));
      for (let i = 0; i < attribute.count; i += step)
        vertices.push(
          new THREE.Vector3()
            .fromBufferAttribute(attribute, i)
            .applyMatrix4(object.matrixWorld),
        );
    });
    if (!vertices.length) throw new Error("The cello geometry is empty.");
    for (let i = 0; i < count; i++) {
      assembled.set(vertices[(i * 71) % vertices.length].toArray(), i * 3);
      dispersal.set(dissipationVector(i), i * 3);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: "#326d62",
      size: 0.027,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    const trails = violins.map(() => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(70 * 3), 3),
      );
      const colors = new Float32Array(70 * 3);
      for (let i = 0; i < 70; i++) {
        const c = new THREE.Color("#c8dce3").multiplyScalar(
          (1 - i / 70) ** 1.5,
        );
        colors.set(c.toArray(), i * 3);
      }
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geometry, material);
      line.frustumCulled = false;
      scene.add(line);
      return { geometry, material };
    });
    const forward = new THREE.Vector3();
    const up = new THREE.Vector3();
    const desiredCamera = new THREE.Vector3();
    const focus = new THREE.Vector3();
    camera.position.set(0, 0.15, 7.5);

    render = () => {
      if (disposed || document.hidden) return;
      const input = options.read();
      if (input.suspended) return;
      const frame = narrativeFrame(input.progress);
      const pose = scrollGravityPose(frame.progress);
      const positionsInWorld = [celloSound, ...pose.sources.slice(1)];
      particleMaterial.color.set("#e8cfa8");
      particleMaterial.opacity = frame.particles;
      particleMaterial.size = narrow ? 0.042 : 0.033;
      particles.visible = frame.visibility > 0.001;
      skyUniforms.presence.value = frame.visibility;
      sky.visible = frame.visibility > 0.001;
      // The full app's opening camera looks down from above; this excerpt's
      // audience camera is level. Keep its real Sombrero region in the visible
      // space above the mobile copy, rather than behind the reading gradient.
      const skyForward = skyDirection(narrow ? 0 : 16, narrow ? 24 : 10);
      const skyRight = new THREE.Vector3()
        .crossVectors(skyForward, new THREE.Vector3(0, 1, 0))
        .normalize();
      const skyUp = new THREE.Vector3()
        .crossVectors(skyRight, skyForward)
        .normalize();
      skyUniforms.basis0.value.set(
        skyRight.x,
        skyUp.x,
        skyForward.x,
        skyRight.y,
        skyUp.y,
        skyForward.y,
        skyRight.z,
        skyUp.z,
        skyForward.z,
      );
      // Particles leave the actual cello's sampled surface, then drift outwards.
      // The same deterministic vectors bring them back when scrolling reverses.
      disperseParticles(assembled, dispersal, positions, frame.dissolve);
      particleGeometry.attributes.position.needsUpdate = true;
      for (const material of materials)
        material.opacity =
          material.userData.baseOpacity *
          frame.gravity *
          (input.playing ? 1.3 : 1);
      const close = input.perspective === "cello";
      for (const material of celloMaterials) {
        material.uniforms.opacity.value = frame.gravity;
        material.uniforms.dispersion.value = frame.dissolve;
        material.uniforms.dissolveRange.value.set(
          close ? 0.78 : 0.18,
          close ? 1.13 : 0.65,
        );
      }
      sunlight.update(1, frame.gravity, frame.dissolve, 0, 0);
      cello.visible = frame.gravity > 0.001;
      violins.forEach((violin, index) => {
        violin.position.fromArray(positionsInWorld[index + 1]);
        violin.rotation.y = pose.seconds * (index ? -0.18 : 0.24);
        violin.visible = frame.gravity > 0.001;
        const trail = trails[index];
        const buffer = trail.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j < 70; j++) {
          const point = pose.trails[index][j];
          for (let axis = 0; axis < 3; axis++)
            buffer[j * 3 + axis] =
              point[axis] +
              frame.dissolve * Math.sin(j * 0.12 + index + axis) * 1.4;
        }
        trail.geometry.attributes.position.needsUpdate = true;
        trail.material.opacity = frame.gravity * 0.5;
      });
      const pointer = input.paused ? [0, 0] : input.pointer;
      desiredCamera.set(
        (close ? celloEye[0] : 0) + pointer[0] * (close ? 0.06 : 0.7),
        (close ? celloEye[1] : 0.15) + pointer[1] * (close ? 0.04 : 0.4),
        close
          ? celloEye[2]
          : (narrow ? 8.8 : 6.8) + Math.sin(frame.progress * Math.PI * 2) * 0.4,
      );
      camera.position.copy(desiredCamera);
      camera.fov = close ? gravityCelloCamera.fov : 43 - frame.gravity * 4;
      camera.updateProjectionMatrix();
      camera.lookAt(close ? focus.fromArray(celloTarget) : focus.set(0, 0, 0));
      camera.updateMatrixWorld(true);
      skyUniforms.orientation.value.setFromMatrix4(camera.matrixWorld);
      skyUniforms.lens.value = Math.tan((camera.fov * Math.PI) / 360);
      skyUniforms.aspect.value = camera.aspect;
      camera.getWorldDirection(forward);
      up.set(0, 1, 0).applyQuaternion(camera.quaternion);
      options.onSpatial({
        sources: positionsInWorld,
        listener: camera.position.toArray(),
        forward: forward.toArray(),
        up: up.toArray(),
      });
    };
    return { dispose, update: render, resize };
  } catch (error) {
    dispose();
    throw error;
  }
}
