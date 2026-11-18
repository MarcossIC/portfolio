# Runtime perf benchmark

```
node scripts/perf/bench.mjs --url http://localhost:4200 --out out.json [--label baseline] [--profiles desktop,mobile] [--headed]
```

Launch order tries Chrome/Chromium headless with D3D11 ANGLE flags; if the WebGL
`UNMASKED_RENDERER` is SwiftShader/llvmpipe it falls back to headed. The renderer
string is stored in the JSON (`renderer`, `gpuReal`). Numbers with `gpuReal: false` are not comparable.

Profiles: `desktop` (1440x900, DPR 1.5) and `mobile` (Pixel 7, touch, CDP CPU throttle 4x).
Scenarios: `hero-idle` (5s), `hero-mouse` (desktop, Lissajous 5s), `scroll` (top to bottom ~8s),
`hover-sweep` (desktop, up to 60 interactive elements).

Metrics (page rAF deltas): `fps`, `p50/p95/p99/max` frame time in ms, `jankyPct` = frames > 25ms,
`over50` = frames > 50ms. `cdp` = CDP Performance.getMetrics deltas during the scenario
(counts; Duration fields in ms): layouts, style recalcs, script and total task time.
Load: FCP, LCP, TBT (sum of longtask excess over 50ms from FCP to load+5s), CLS, `canvasAt` (ms when
`hero-galaxy canvas` first appears). rAF is capped by display refresh. Run twice to judge variance.
