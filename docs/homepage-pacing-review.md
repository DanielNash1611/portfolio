# Mobile homepage pacing review

Baseline: `1f8d7e7` (beamed music glyphs, deliberate compass/orchestra/quote checkpoints).

The baseline DOM was audited in the previously approved `f01f1b6` preview at **500 × 759 CSS pixels**. Its animation budgets and section CSS are unchanged through `1f8d7e7`. The revised values below are calculated from the new source functions/CSS using those measured dimensions; they are **not measurements of the protected new preview**. Phone testing is still needed to judge feel.

| Sequence                               |           Before | Revised mobile homepage | What remains readable longer                                      |
| -------------------------------------- | ---------------: | ----------------------: | ----------------------------------------------------------------- |
| Hero question-to-outcome transition    |     190px (25vh) |            342px (45vh) | Slower alignment; no hero midpoint stop                           |
| Compass unfolding, 646px stage         |            620px |                 1,066px | Each real panel keeps the same swipe target                       |
| Orchestra overture, 646px stage        |          1,098px |                 2,067px | Notes reveal and gather over more travel                          |
| Fully formed orchestra before fade     |             22px |                   413px | A gentle swipe after its checkpoint stays on the formed orchestra |
| Light journey per method, 759px canvas |          1,442px |                 1,973px | Fully readable band grows from 692px to 947px                     |
| Guiding principles travel              | 1,973px (260svh) |        2,581px (340svh) | Three principles share a longer native runway                     |
| Featured recommendations travel        |            840px |                 1,440px | Don → Zac → Sumanth, each held until fresh input, then split      |
| Controlled touch settling              |            320ms |                   480ms | Farther compass/card landings animate more gently                 |

At **390 × 844**, where the product-proof sequence can pin, its 731px stage gets **3,509px** of native travel instead of **2,047px**. At 500 × 759 it continues using the existing normal-flow product fallback: no attempt is made to pin content that does not fit.

## Ordinary content and transitions

These are spacing changes, not gesture locks or scroll-speed multipliers.

| Content at 500 × 759                          |                  Before |                                   Revised |
| --------------------------------------------- | ----------------------: | ----------------------------------------: |
| Normal-flow product outer padding, top/bottom |               36 / 16px |                                 56 / 40px |
| Each product's vertical padding               |           32px per side |                             52px per side |
| Product copy/art gap                          |                    22px |                                      34px |
| Product artwork minimum height                |                   360px |                                     420px |
| Three normal-flow product cards combined      |        2,318px measured | ~2,698px calculated with the same content |
| Creative-story vertical padding               |           25px per side |                             52px per side |
| Contact section vertical padding              |           52px per side |                             96px per side |
| Creative section vertical padding             |           58px per side |                             96px per side |
| Toolkit outer vertical padding                |           58px per side |                             80px per side |
| Expanded method header padding, top/bottom    |                32 / 0px |                                 64 / 64px |
| Method footer vertical padding                |           26px per side |                             64px per side |
| Disclosure summary                            | 50–85px observed height |       96px minimum, 28px vertical padding |

The native scroll delta still follows the user's finger and browser inertia. A fast flick can pass ordinary text; these changes do not intercept that content. The existing deliberate compass, orchestra and quote targets remain the only gesture checkpoints. The split target lands inside its fully grouped plateau to tolerate native pixel rounding.

## Scope and fallback

New travel/spacing applies only beneath `data-home-pacing="true"`, on narrow/coarse-pointer layouts. Wide fine-pointer desktop retains its prior budgets, timing and spacing. Other experience routes retain their previous pacing. Reduced-motion, reading, short-layout fallbacks, keyboard, native widgets, dialogs and pinch/zoom retain their existing behavior.

The orchestra keeps the same .28 formation checkpoint. Mobile raw scroll from .28 to .48 maps to visual progress .28 to .30, leaving a broad fully formed interval. The inverse mapping is used by its slider/replay controls. No choreography coordinates, note colors or beamed note artwork change.

The forest still caches layout and uses its compact renderer. No additional hot-scroll layout reads or global scroll locking are introduced. Optional full Gravity/game experiences and media playback retain their own controls.

## Verification limits

Source/model tests cover enlarged budgets, continuous/reversible orchestra mapping, exact control inverses, desktop invariance, compass exit/reverse, each featured quote before split, and the five readable light scenes plus sunrise. Browser inspection established the baseline at 500 × 759. Live revised layout, actual native touch momentum and physical-phone feel require access to the exact new preview; no new guest token is authorized for this build.
