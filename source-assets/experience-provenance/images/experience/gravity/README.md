# Gravity preview assets

These are resized derivatives of the current Gravity application's assets, copied
from `/Users/danielnash/Documents/Gravity` on 2026-11-13. Original files are unchanged.

- `cello-nebula.webp`: Daniel's `src/assets/cello-nebula-texture.png`, used by the
  actual spectral cello shader. The shader is adapted in
  `lib/experience/spectral-cello.ts`; note-driven movement stays disabled in this
  scroll-controlled visual excerpt. The bridge corona is copied from
  `src/visual/webgl/cello-sunlight.ts` to `lib/experience/cello-sunlight.ts`.
- `sombrero.webp`: `src/assets/astronomy/sombrero-galaxy-webb-nircam.jpg`.
  Sombrero Galaxy, NASA/ESA/CSA James Webb Space Telescope, NIRCam.
  Credit: **NASA, ESA, CSA, STScI**.
  [Official image](https://esawebb.org/images/sombrerogalaxy1/),
  [ESA/Webb usage](https://esawebb.org/copyright/).
  The original source is resized to 1280px wide, with its proportions and colors
  preserved. The directional-sky projection is from Gravity's
  `src/visual/webgl/directional-sky.ts` and is copied to
  `lib/experience/gravity-sky.ts`. This excerpt uses the default Sombrero region,
  rather than loading all four simultaneous sky photographs in the full app.

The instrument `.glb` assets already in `public/models/experience/` remain the
original Gravity Blender exports. The preview now uses the app's string-level
cello listening pose (`src/core/spatial-stage.ts`), transformed through the same
asset normalization as the model. It does not change the actual Gravity app.
