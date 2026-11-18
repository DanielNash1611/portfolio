import * as THREE from "three";

// Original spectral-cello vertex/fragment shaders from Daniel's Gravity app.
// The preview fixes note animation at rest and drives dispersion from scrolling.
const vertexShader = `
  attribute float soundingString;
  uniform float noteResonance;
  uniform float noteAge;
  uniform float noteMotion;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vEye;
  varying vec3 vObjectNormal;
  void main() {
    vPosition = position;
    vObjectNormal = normal;
    vec3 animated = position;
    float stringSpan = clamp((position.y - 0.646) / 1.209, 0.0, 1.0);
    animated.x += soundingString * noteMotion * noteResonance * 0.0022
      * sin(stringSpan * 3.14159265) * sin(stringSpan * 28.0 - noteAge * 90.0);
    vec4 viewPosition = modelViewMatrix * vec4(animated, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vEye = -viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = `
  uniform vec3 accent;
  uniform vec3 core;
  uniform vec3 skyLightDirection;
  uniform vec3 skyLightColor;
  uniform float skyLightStrength;
  uniform float strength;
  uniform float surface;
  uniform float role;
  uniform float themeAmount;
  uniform float activity;
  uniform float noteAttack;
  uniform float noteResonance;
  uniform float noteAge;
  uniform float noteMotion;
  uniform float opacity;
  uniform float dispersion;
  uniform vec2 dissolveRange;
  uniform sampler2D surfaceMap;
  uniform float textureReady;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vEye;
  varying vec3 vObjectNormal;
  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }
  // Wisps stay anchored to the instrument, including in pause/reduced motion.
  float mineral(vec3 p) {
    vec3 cell = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(cell), hash(cell + vec3(1,0,0)), f.x),
                   mix(hash(cell + vec3(0,1,0)), hash(cell + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(cell + vec3(0,0,1)), hash(cell + vec3(1,0,1)), f.x),
                   mix(hash(cell + vec3(0,1,1)), hash(cell + vec3(1,1,1)), f.x), f.y), f.z);
  }
  // Project through the authored volume, so the texture follows the body from
  // every listening angle without UV seams or a camera-facing image panel.
  float nebula(vec3 p, vec3 normal) {
    vec3 weights = pow(abs(normal), vec3(4.0));
    weights /= max(dot(weights, vec3(1.0)), 0.0001);
    p = p * 1.35 + vec3(0.47, 0.19, 0.31);
    return dot(vec3(texture2D(surfaceMap, p.yz).r,
      texture2D(surfaceMap, p.xz).r, texture2D(surfaceMap, p.xy).r), weights);
  }
  void main() {
    float facing = abs(dot(normalize(vNormal), normalize(vEye)));
    float rim = pow(1.0 - facing, 2.8);
    float bridge = exp(-length((vPosition - vec3(0.0, 0.63, 0.15)) * vec3(13.0, 10.0, 6.0)));
    float interior = exp(-length((vPosition - vec3(0.0, 0.72, 0.0)) * vec3(7.0, 4.2, 3.5)));
    float grain = mineral(vPosition * vec3(32.0, 18.0, 34.0));
    float strata = mineral(vPosition * vec3(9.0, 44.0, 11.0));
    float vapor = mineral(vPosition * vec3(12.0, 8.0, 14.0) + strata * 1.8);
    float veil = smoothstep(0.24, 0.78, vapor);
    float lowerFade = smoothstep(dissolveRange.x, dissolveRange.y,
      vPosition.y + (vapor - 0.5) * 0.17);
    float fittings = step(4.5, role) * (1.0 - step(5.5, role));
    float fineDetail = step(2.5, role) * (1.0 - step(3.5, role));
    float filament = step(3.5, role) * (1.0 - step(4.5, role));
    float edge = step(1.5, role) * (1.0 - step(2.5, role));
    float bridgeFitting = step(5.5, role);
    float body = surface * (1.0 - fittings)
      * (0.12 + 0.88 * (1.0 - smoothstep(1.22, 1.55, vPosition.y)));
    float nebulaDensity = nebula(vPosition, normalize(vObjectNormal));
    float textureLight = smoothstep(0.075, 0.58, nebulaDensity) * textureReady;
    // Feather the rounded contour tubes toward their silhouette. Strings retain
    // a clear core; the surrounding bloom supplies the softer outward falloff.
    float contourFeather = mix(1.0, 0.12 + 0.88 * smoothstep(0.0, 0.8, facing), edge + fineDetail);
    // Break up uniform linework gently without moving or erasing the silhouette.
    contourFeather *= mix(1.0, 0.55 + veil * 0.45, edge + fineDetail);
    float soundHole = edge * smoothstep(0.085, 0.11, abs(vPosition.x))
      * (1.0 - smoothstep(0.20, 0.23, abs(vPosition.x)))
      * smoothstep(0.56, 0.61, vPosition.y) * (1.0 - smoothstep(0.88, 0.94, vPosition.y));

    // Light catches the contour; open, uneven veils let the sky show through.
    float atomicAlpha = mix(strength, strength * (0.065 + rim * 0.40), surface);
    atomicAlpha += surface * veil * (0.012 + interior * (0.026 + activity * 0.012));
    atomicAlpha *= mix(1.0, 0.55, fittings);
    vec3 atomicColor = mix(accent, core, min(0.85, bridge * 0.5 + filament * 0.5 + edge * 0.18));
    atomicColor *= 1.1 + rim * 0.25 + interior * activity * 0.22;

    // A translucent stellar envelope: warm light has depth without a solid shell.
    vec3 amber = mix(vec3(0.68, 0.23, 0.055), vec3(1.0, 0.58, 0.22), veil);
    vec3 celestialSurface = amber * (0.75 + rim * 0.5) * mix(1.0, 0.65, fittings);
    float skyFacing = max(0.0, dot(normalize(vObjectNormal), skyLightDirection));
    celestialSurface += skyLightColor * skyLightStrength * skyFacing * (0.3 + rim * 0.7);
    atomicColor += skyLightColor * skyLightStrength * skyFacing * (0.2 + rim * 0.8);
    celestialSurface += vec3(1.0, 0.45, 0.10) * interior * (0.12 + activity * 0.12);
    vec3 celestialLight = mix(vec3(1.0, 0.52, 0.16), core,
      filament * 0.62 + edge * 0.22 + bridgeFitting * 0.35);
    celestialLight *= 1.1 + soundHole * (0.5 + activity * 0.35) + bridge * 0.2;
    vec3 celestialColor = mix(celestialLight, celestialSurface, surface);
    float celestialAlpha = mix(strength * mix(0.78, 0.30, fineDetail),
      (0.018 + rim * 0.10 + veil * (0.016 + interior * 0.025)) * mix(1.0, 0.5, fittings), surface);
    celestialAlpha += soundHole * 0.13 + filament * 0.12;

    // One resonance departs the bridge per recorded double-stop change.
    // In reduced motion the same note is readable as stationary light.
    float distanceFromBridge = length((vPosition - vec3(0.0, 0.646, 0.20)) * vec3(1.0, 0.75, 1.8));
    float travelingWave = exp(-pow((distanceFromBridge - noteAge * 0.82) / 0.085, 2.0));
    float response = noteResonance * mix(interior * 0.65, travelingWave, noteMotion);
    float stringLight = filament * (noteAttack * 1.9 + noteResonance * 0.45);
    vec3 noteColor = mix(accent, core, 0.72);
    vec3 color = mix(atomicColor, celestialColor, themeAmount);
    vec3 texturedLight = mix(accent, core, 0.10 + textureLight * 0.22)
      * (0.55 + textureLight * 1.1);
    color = mix(color, texturedLight, body * textureReady);
    // Concentrate the remaining light at the bridge rather than filling the shell.
    color += core * surface * bridge * (1.35 + activity * 0.25);
    color += noteColor * (response * (0.6 + edge * 0.55) + stringLight + bridge * noteAttack * 1.4);
    float dissolveField = 0.12 + grain * 0.48 + clamp(vPosition.y / 2.1, 0.0, 1.0) * 0.3;
    float remaining = mix(1.0 - dispersion,
      1.0 - smoothstep(dissolveField, dissolveField + 0.12, dispersion * 1.12), noteMotion);
    float alpha = (mix(atomicAlpha, celestialAlpha, themeAmount)
      + body * textureLight * 0.12
      + surface * bridge * 0.18 + response * surface * 0.14
      + noteAttack * filament * 0.28) * contourFeather * lowerFade * opacity * remaining;
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function spectralCelloMaterial(name: string, texture: THREE.Texture) {
  const surface = name.startsWith("01") || name.startsWith("05");
  const strength =
    name.startsWith("01") || name.startsWith("05")
      ? 0.2
      : name.startsWith("03")
        ? 0.032
        : name.startsWith("06")
          ? 0.12
          : name.startsWith("04")
            ? 0.65
            : 0.36;
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      accent: { value: new THREE.Color("#ffae42") },
      core: { value: new THREE.Color("#ffe3aa") },
      skyLightDirection: { value: new THREE.Vector3(0, 0, -1) },
      skyLightColor: { value: new THREE.Color("#c5aec8") },
      skyLightStrength: { value: 0.12 },
      strength: { value: strength },
      surface: { value: surface ? 1 : 0 },
      role: { value: Number.parseInt(name, 10) || 0 },
      themeAmount: { value: 1 },
      activity: { value: 0 },
      opacity: { value: 1 },
      noteAttack: { value: 0 },
      noteResonance: { value: 0 },
      noteAge: { value: 0 },
      noteMotion: { value: 0 },
      dispersion: { value: 0 },
      dissolveRange: { value: new THREE.Vector2(0.18, 0.65) },
      surfaceMap: { value: texture },
      textureReady: { value: 1 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: !name.startsWith("04"),
    side: THREE.DoubleSide,
  });
}
