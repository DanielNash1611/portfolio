import * as THREE from "three";

const radians = THREE.MathUtils.degToRad;
const openingRotation = new THREE.Quaternion().setFromRotationMatrix(
  new THREE.Matrix4().lookAt(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1.55, -6.8),
    new THREE.Vector3(0, 1, 0),
  ),
);

export function skyDirection(yaw: number, elevation: number): THREE.Vector3 {
  const y = radians(yaw),
    e = radians(elevation);
  return new THREE.Vector3(
    Math.sin(y) * Math.cos(e),
    Math.sin(e),
    -Math.cos(y) * Math.cos(e),
  ).applyQuaternion(openingRotation);
}

/** Perspective for the distant sky even when the foreground is orthographic. */
export function skyLensTangent(camera: THREE.Camera): number {
  if (Number.isFinite(camera.userData.skyLensTangent))
    return camera.userData.skyLensTangent;
  const p = camera.projectionMatrix.elements;
  const perspective = THREE.MathUtils.clamp(-p[11], 0, 1);
  return THREE.MathUtils.lerp(Math.tan(radians(52) / 2), 1 / p[5], perspective);
}

const vertexShader = `
  varying vec2 screen;
  void main() { screen = position.xy; gl_Position = vec4(position.xy, 1.0, 1.0); }
`;

const fragmentShader = `
  varying vec2 screen;
  uniform mat3 orientation;
  uniform float lens;
  uniform float aspect;
  uniform float presence;
  uniform float transition;
  uniform float starDensity;
  uniform vec3 speckColor;
  uniform float speckStrength;
  uniform vec3 speckOffset;
  uniform vec2 oldView;
  uniform vec2 nextView;
  uniform vec3 journey;
  uniform float scaleView;
  uniform sampler2D old0; uniform sampler2D old1; uniform sampler2D old2;
  uniform sampler2D old3;
  uniform sampler2D next0; uniform sampler2D next1; uniform sampler2D next2;
  uniform sampler2D next3;
  uniform mat3 basis0; uniform mat3 basis1; uniform mat3 basis2;
  uniform mat3 basis3;
  uniform vec4 oldFrame[4]; uniform vec4 nextFrame[4];
  uniform vec3 oldTone[4]; uniform vec3 nextTone[4];

  vec3 photo(sampler2D source, vec3 ray, mat3 basis, vec4 frame, vec3 tone) {
    // A photograph occupies one bounded angular region of the sphere. Tangent
    // projection preserves its proportions; nothing wraps or repeats at a pole.
    vec3 local = transpose(basis) * ray;
    if (local.z <= 0.0) return vec3(0.0);
    vec2 uv = local.xy / local.z / frame.xy + frame.zw;
    if (min(uv.x, uv.y) <= 0.0 || max(uv.x, uv.y) >= 1.0) return vec3(0.0);
    vec2 edge = smoothstep(vec2(0.0), vec2(tone.y), uv)
      * smoothstep(vec2(0.0), vec2(tone.y), 1.0 - uv);
    vec3 color = max(texture2D(source, uv).rgb - tone.x, 0.0);
    return color * edge.x * edge.y * tone.z;
  }

  vec3 hash3(vec3 p) {
    return fract(sin(vec3(dot(p, vec3(127.1,311.7,74.7)),
      dot(p, vec3(269.5,183.3,246.1)), dot(p, vec3(113.5,271.9,124.6)))) * 43758.5453);
  }

  float stars(vec3 ray) {
    // Three-dimensional cells avoid latitude pinching and cube-map face seams.
    vec3 p = ray * 180.0;
    vec3 cell = floor(p), f = fract(p);
    float result = 0.0;
    float aa = max(length(fwidth(p)), .018);
    for (int x = -1; x <= 1; x++) {
      for (int y = -1; y <= 1; y++) {
        for (int z = -1; z <= 1; z++) {
          vec3 offset = vec3(float(x), float(y), float(z));
          vec3 random = hash3(cell + offset + speckOffset);
          if (random.z > 1.0 - starDensity) {
            float d = length(offset + random - f);
            float radius = .035 + pow(random.x, 12.0) * .09;
            result += (1.0 - smoothstep(radius, radius + aa, d))
              * radius / (radius + aa) * (.2 + random.y * .8);
          }
        }
      }
    }
    return result;
  }

  void main() {
    vec3 ray = normalize(orientation * vec3(screen.x * aspect * lens, screen.y * lens, -1.0));
    vec3 oldRay = normalize(orientation * vec3((screen.x + oldView.x) * aspect * lens * oldView.y * scaleView, screen.y * lens * oldView.y * scaleView, -1.0));
    vec3 nextRay = normalize(orientation * vec3((screen.x + nextView.x) * aspect * lens * nextView.y * scaleView, screen.y * lens * nextView.y * scaleView, -1.0));
    vec3 a = vec3(0.0);
    if (transition < 1.0) {
      a = photo(old0, oldRay, basis0, oldFrame[0], oldTone[0]);
      a += photo(old1, oldRay, basis1, oldFrame[1], oldTone[1]);
      a += photo(old2, oldRay, basis2, oldFrame[2], oldTone[2]);
      a += photo(old3, oldRay, basis3, oldFrame[3], oldTone[3]);
    }
    vec3 b = photo(next0, nextRay, basis0, nextFrame[0], nextTone[0]);
    b += photo(next1, nextRay, basis1, nextFrame[1], nextTone[1]);
    b += photo(next2, nextRay, basis2, nextFrame[2], nextTone[2]);
    b += photo(next3, nextRay, basis3, nextFrame[3], nextTone[3]);
    vec3 color = vec3(.00012, .00015, .00025) + mix(a, b, transition);
    color += speckColor * stars(ray) * speckStrength;
    // Sparse radial dust gives the changing photographs a sense of distance.
    // No additional sky samples, continuous idle animation or full-screen flash.
    if (journey.x > .001) {
      vec2 p = vec2(screen.x * aspect + journey.z * .45, screen.y);
      float radius = length(p);
      float lane = (atan(p.y, p.x) + 3.141593) * 65.0;
      float random = fract(sin(floor(lane) * 127.1) * 43758.5453);
      float line = 1.0 - smoothstep(.015, .055, abs(fract(lane) - .5));
      float tail = pow(max(0.0, 1.0 - fract(radius * .7 - journey.y * 2.5 + random)), 7.0);
      color += speckColor * line * tail * step(.84, random) * smoothstep(.2, 1.1, radius) * journey.x * .32;
    }
    gl_FragColor = vec4(color, presence);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export interface SkyPlacement {
  yaw: number;
  elevation: number;
  width: number;
  brightness: number;
}

/** Shared ray projection and soft angular regions for both visual environments. */
export function createDirectionalSkyMesh(
  name: string,
  placements: readonly SkyPlacement[],
  blank: THREE.Texture,
) {
  if (placements.length !== 4)
    throw new Error(
      "A surrounding environment requires four authored regions.",
    );
  const uniforms: Record<string, THREE.IUniform> = {
    orientation: { value: new THREE.Matrix3() },
    lens: { value: Math.tan(radians(52) / 2) },
    aspect: { value: 1 },
    presence: { value: 0 },
    transition: { value: 1 },
    starDensity: { value: 0.08 },
    speckColor: { value: new THREE.Vector3(0.7, 0.78, 0.9) },
    speckStrength: { value: 0.45 },
    speckOffset: { value: new THREE.Vector3() },
    oldView: { value: new THREE.Vector2(0, 1) },
    nextView: { value: new THREE.Vector2(0, 1) },
    journey: { value: new THREE.Vector3() },
    scaleView: { value: 1 },
    oldFrame: {
      value: placements.map(() => new THREE.Vector4(1, 1, 0.5, 0.5)),
    },
    nextFrame: {
      value: placements.map(() => new THREE.Vector4(1, 1, 0.5, 0.5)),
    },
    oldTone: { value: placements.map(() => new THREE.Vector3(0, 0.2, 0)) },
    nextTone: { value: placements.map(() => new THREE.Vector3(0, 0.2, 0)) },
  };
  placements.forEach((placement, index) => {
    const direction = skyDirection(placement.yaw, placement.elevation);
    const right = new THREE.Vector3()
      .crossVectors(direction, new THREE.Vector3(0, 1, 0))
      .normalize();
    const up = new THREE.Vector3().crossVectors(right, direction).normalize();
    uniforms["basis" + index] = {
      value: new THREE.Matrix3().set(
        right.x,
        up.x,
        direction.x,
        right.y,
        up.y,
        direction.y,
        right.z,
        up.z,
        direction.z,
      ),
    };
    uniforms["old" + index] = { value: blank };
    uniforms["next" + index] = { value: blank };
  });
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      fog: false,
    }),
  );
  mesh.name = name;
  mesh.renderOrder = -1000;
  mesh.frustumCulled = false;
  return mesh;
}
