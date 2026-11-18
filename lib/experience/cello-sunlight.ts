import * as THREE from "three";
import { gravityCelloSound as CELLO_SOUND_POSITION } from "./gravity-camera";

/** Celestial bridge light: fixed to the sound source, with no decorative clock. */
export class CelloSunlight {
  readonly mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.2),
    new THREE.ShaderMaterial({
      uniforms: { strength: { value: 0 } },
      vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 center = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        // Retain rays at close listening distances without filling the screen.
        float worldScale = length(modelMatrix[0].xyz);
        center.xy += position.xy * clamp(-center.z / worldScale * 0.45, 0.32, 1.0) * worldScale;
        gl_Position = projectionMatrix * center;
      }`,
      fragmentShader: `
      uniform float strength;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        float angle = atan(p.y, p.x);
        float rays = pow(max(0.0, cos(angle * 17.0 + sin(angle * 7.0) * 1.3)), 22.0)
          + pow(max(0.0, cos(angle * 9.0 + 0.6)), 38.0) * 0.5;
        float nucleus = exp(-r * r / 0.0016);
        float light = nucleus + exp(-r * 14.0) * 0.55
          + exp(-r * 4.7) * rays * 0.5;
        float alpha = light * (1.0 - smoothstep(0.7, 1.0, r)) * strength;
        if (alpha < 0.001) discard;
        vec3 color = mix(vec3(1.0, 0.39, 0.075), vec3(1.0, 0.94, 0.72), exp(-r * 9.0));
        gl_FragColor = vec4(color * 2.8, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );

  constructor() {
    this.mesh.name = "cello-solar-corona";
    this.mesh.position.fromArray(CELLO_SOUND_POSITION);
    this.mesh.visible = false;
    this.mesh.frustumCulled = false;
  }

  update(
    theme: number,
    opacity: number,
    dispersion: number,
    activity: number,
    attack: number,
  ): void {
    const unit = (value: number) =>
      Number.isFinite(value) ? THREE.MathUtils.clamp(value, 0, 1) : 0;
    this.mesh.material.uniforms.strength.value =
      unit(theme) *
      unit(opacity) *
      (1 - unit(dispersion)) *
      (0.62 + unit(activity) * 0.18 + unit(attack) * 0.16);
    this.mesh.visible = this.mesh.material.uniforms.strength.value > 0.001;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
