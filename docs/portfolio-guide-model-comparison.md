# Historical Portfolio Guide model bake-off

October 8, 2026, America/Los_Angeles. This is a historical answer-model study, separate from the earlier routing-disabled/enabled experiment and from current release validation. No new expanded paid bake-off was run for this content update.

Twelve questions covered four existing page/role/next-read cases and eight broader creative, enterprise AI, director-fit, healthcare, scientific-research, cross-project comparison, ownership and architecture questions. Luna and Terra each had two repeats in alternating order. GPT-5 and Sol each had one exploratory repeat. All used Luna Decisions routing, low reasoning effort, hybrid retrieval disabled, and a fixed source-aware gpt-5-mini judge blinded to answer-model identity. The rubric scored groundedness, uncertainty handling, source separation, helpfulness and concision from 1–5, alongside deterministic checks.

| Answer model | Trials | Deterministic passes | Source-aware judged passes | Median workflow | Mean helpfulness / 5 |
| --- | ---: | ---: | ---: | ---: | ---: |
| gpt-5 | 12 | 12/12 | 11/12 | 14.65 s | 4.25 |
| gpt-5.6-terra | 24 | 24/24 | 23/24 | 4.82 s | 4.54 |
| gpt-6-luna | 24 | 24/24 | 23/24 | 5.84 s | 4.33 |
| gpt-6.1-sol | 12 | 12/12 | 11/12 | 7.37 s | 4.33 |

These are the original main-study results before the final ownership guardrail repair. The table retains the failures. Eight separate ownership follow-ups passed after the repair, across all four models, without replacing main trials. Terra and Luna produced similarly supported answers on this set; Terra was the faster candidate. Sol showed no clear quality gain here and took longer. Small authored sets and unequal repeats limit generalization.

Latency measures the entire generation workflow, including routing and career retrieval, and excludes judging. Eight of 60 routing-eligible main trials hit the 1.5-second router timeout and used the page-grounded fallback. On 18 paired Terra/Luna trials without either router timing out, medians were 4.55 s and 5.09 s, with a median paired difference of 0.69 s. This is not a general API latency guarantee.

No reconciled dollar-cost comparison was recorded. Across 24 trials, Terra used 378,696 answer input tokens and 9,744 output tokens; Luna used 404,482 input and 10,396 output tokens. Cache hits and answer-call counts differed, and these figures exclude judge/router token costs. They do not establish lower bills or savings.

The original judge lacked some enriched source material. All 72 unchanged answers were regraded after receiving complete captured sources; four unchanged answers then needed recommendation-bucket corrections. Original grades and rechecks remain preserved. Answer-generation fingerprints were stable during the paired Terra/Luna study; the judge file changed during source-packet repair. Later code changes and live career retrieval make this a different study from the earlier routing comparison.

This evidence informed the local Terra configuration alongside product judgment. Daniel separately confirmed Terra as the intended answer model on October 17. That decision is not proof of deployed configuration or a universal model winner.

Source records retained locally: the original docs/portfolio-guide-model-comparison.md and artifacts/gpt6-improvements/{summary,luna-terra-results,gpt5-after-results,sol-results,final-judges,recommendation-rechecks,ownership-final-results}.json. The original aggregate summary SHA-256 is 92557907b590b5bda274dbbd6adaed1181d23edf8bbc1a381f6ae5c32c363272. Full source-file fingerprints and exact 12-case membership are in the review evidence. No raw private records are published here.
