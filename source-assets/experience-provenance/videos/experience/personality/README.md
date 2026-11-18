# Introduction footage test

Source: Daniel Nash's `20261113_122035.mp4`, supplied 2026-11-13 for a portfolio
personality test. Excerpts: 00:05–00:10.5 (entrance/look) and 00:22.5–00:25.25
(walk-out). Original stays outside the repository.

The original person and movement were isolated with local Apple Vision person
segmentation. `daniel-intro-enter-exit.mp4` composites that cutout onto the preview's `#f3eee4` cream;
it uses H.264, 400 × 520, 24 fps, eight seconds, and has no audio track. It is mirrored
so Daniel enters from the outer edge and turns toward the introduction. Using an
opaque cream composite keeps this test independent of transparent-video codec
support on mobile browsers. It is specific to the flat cream hero background.
The matching WebP still retains transparency and is served directly as an already
compressed small asset.

The scroll version is 920,830 bytes, with all 192 frames independently
decodable (H.264 intra frames, no B frames, fast-start MP4). The portrait stays
paused; native scroll progress chooses its timestamp in either direction. Only
the most recent target is retained while a seek is pending. No playback clock,
touch interception, or request loop runs while the visitor is still. Initial
reduced-motion/reading views request only the poster. The former autoplay and
entrance-only encodes are archived in `output/personality-video-test/`.

The two takes use a six-frame pose blend beginning at media time 5.25 seconds.
Scroll progress 0–0.58 reaches frame 125 (the look toward the headline), 0.58–0.66
holds it for reading, and 0.66–1 advances through the real walk-out. Four trailing
frames clear mask remnants after the performer has left the crop. The headline
has no scroll transform: its native section releases as soon as the look is
complete, at progress 0.58. The next section enters while the performer is still
walking out. The portrait offsets that native movement to stay visible through
the exit; incoming content paints above it so text and links remain clear. The
full footage still spans about 1.6 viewports of scrolling, while the held HTML
stage uses only the first 58 percent of that distance.
Compact phone layouts preserve the stage from 540px in height; smaller windows
use the already-turned still and ordinary document flow.

This is temporary test footage, including the original lighting and occasional
automatic-matte imperfections. The full-body crop, source lighting, and edge
quality can be replaced after the final shoot. It is used only on `/experience`.
