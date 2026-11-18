#!/usr/bin/env node
// Runtime perf benchmark. Usage:
//   node scripts/perf/bench.mjs --url http://localhost:4200 --out out.json [--label baseline] [--profiles desktop,mobile] [--headed]
import { chromium, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]);
    return acc;
  }, []),
);
const URL_ = args.url || 'http://localhost:4200';
const OUT = args.out || 'bench.json';
const LABEL = args.label || 'run';
const PROFILES = String(args.profiles || 'desktop,mobile').split(',');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BAD_GPU = /swiftshader|llvmpipe|software/i;

const GPU_ARGS = [
  '--enable-gpu',
  '--use-angle=d3d11',
  '--ignore-gpu-blocklist',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
];

async function renderer(browser) {
  const p = await browser.newPage();
  const r = await p.evaluate(() => {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return 'no-webgl';
    const e = gl.getExtension('WEBGL_debug_renderer_info');
    return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'unknown';
  });
  await p.close();
  return r;
}

async function launch() {
  const attempts = [];
  if (!args.headed) {
    attempts.push({ name: 'chrome-headless', opts: { channel: 'chrome', headless: true, args: GPU_ARGS } });
    attempts.push({ name: 'chromium-headless', opts: { headless: true, args: GPU_ARGS } });
  }
  attempts.push({ name: 'chrome-headed', opts: { channel: 'chrome', headless: false, args: GPU_ARGS } });
  attempts.push({ name: 'chromium-headed', opts: { headless: false, args: GPU_ARGS } });
  let last;
  for (const a of attempts) {
    try {
      const browser = await chromium.launch(a.opts);
      const r = await renderer(browser);
      if (!BAD_GPU.test(r) && r !== 'no-webgl') return { browser, mode: a.name, renderer: r, gpuReal: true };
      console.error(`[launch] ${a.name}: renderer "${r}" is not GPU-real, trying next`);
      last = { renderer: r };
      await browser.close();
    } catch (e) {
      console.error(`[launch] ${a.name} failed: ${e.message.split('\n')[0]}`);
    }
  }
  const browser = await chromium.launch({ headless: false, args: GPU_ARGS });
  return { browser, mode: 'fallback-headed', renderer: last?.renderer ?? 'unknown', gpuReal: false };
}

const INIT = () => {
  window.__perf = { lt: [], cls: 0, fcp: null, lcp: null, canvasAt: null };
  const obs = (type, cb) => {
    try { new PerformanceObserver((l) => l.getEntries().forEach(cb)).observe({ type, buffered: true }); } catch (e) {}
  };
  obs('longtask', (e) => window.__perf.lt.push({ start: e.startTime, dur: e.duration }));
  obs('layout-shift', (e) => { if (!e.hadRecentInput) window.__perf.cls += e.value; });
  obs('paint', (e) => { if (e.name === 'first-contentful-paint') window.__perf.fcp = e.startTime; });
  obs('largest-contentful-paint', (e) => { window.__perf.lcp = e.startTime; });
  const check = () => {
    if (!window.__perf.canvasAt && document.querySelector('hero-galaxy canvas')) {
      window.__perf.canvasAt = performance.now();
      return true;
    }
    return false;
  };
  new MutationObserver((_, o) => { if (check()) o.disconnect(); }).observe(document, { childList: true, subtree: true });
  window.__fr = {
    d: [], on: false, last: 0,
    start() {
      this.d = []; this.on = true; this.last = 0;
      const f = (t) => {
        if (!this.on) return;
        if (this.last) this.d.push(t - this.last);
        this.last = t;
        requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    },
    stop() { this.on = false; return this.d; },
  };
};

const pct = (s, p) => s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
const rnd = (x) => Math.round(x * 100) / 100;
function frameStats(d) {
  if (!d.length) return {};
  const s = [...d].sort((a, b) => a - b);
  const total = d.reduce((a, b) => a + b, 0);
  return {
    frames: d.length,
    fps: rnd(1000 / (total / d.length)),
    p50: rnd(pct(s, 50)), p95: rnd(pct(s, 95)), p99: rnd(pct(s, 99)), max: rnd(s[s.length - 1]),
    jankyPct: rnd((d.filter((x) => x > 16.7 * 1.5).length / d.length) * 100),
    over50: d.filter((x) => x > 50).length,
  };
}

const KEYS = ['LayoutCount', 'RecalcStyleCount', 'LayoutDuration', 'RecalcStyleDuration', 'ScriptDuration', 'TaskDuration'];
async function cdpMetrics(cdp) {
  const { metrics } = await cdp.send('Performance.getMetrics');
  return Object.fromEntries(metrics.filter((m) => KEYS.includes(m.name)).map((m) => [m.name, m.value]));
}

async function measure(page, cdp, fn) {
  await page.evaluate(() => window.__fr.start());
  const m0 = await cdpMetrics(cdp);
  const t0 = Date.now();
  await fn();
  const m1 = await cdpMetrics(cdp);
  const d = await page.evaluate(() => window.__fr.stop());
  const delta = {};
  for (const k of KEYS) delta[k] = Math.round((m1[k] - m0[k]) * (k.endsWith('Duration') ? 1000 : 1) * 10) / 10; // durations in ms
  return { wallMs: Date.now() - t0, ...frameStats(d), cdp: delta };
}

const INTERACTIVE = 'a, button, .project-card-container, project-article';
const VISIBLE_FN = `(e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }`;

async function runProfile(browser, name) {
  const mobile = name === 'mobile';
  const ctx = await browser.newContext(
    mobile ? { ...devices['Pixel 7'] } : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 },
  );
  const page = await ctx.newPage();
  await page.addInitScript(INIT);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Performance.enable');
  if (mobile) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const t0 = Date.now();
  await page.goto(URL_, { waitUntil: 'load' });
  const loadMs = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0];
    return n && n.loadEventEnd ? n.loadEventEnd : performance.now();
  });
  let canvas = true;
  await page.waitForSelector('hero-galaxy canvas', { timeout: 30000 }).catch(() => { canvas = false; });
  await sleep(Math.max(0, loadMs + 5000 - (Date.now() - t0)) + 500); // reach load+5s for TBT
  const load = await page.evaluate((loadMs) => {
    const p = window.__perf;
    const tbt = p.lt.filter((l) => l.start >= (p.fcp ?? 0) && l.start <= loadMs + 5000).reduce((a, l) => a + Math.max(0, l.dur - 50), 0);
    const r = (x) => (x == null ? null : Math.round(x * 10) / 10);
    return {
      fcp: r(p.fcp), lcp: r(p.lcp), tbt: r(tbt), cls: Math.round(p.cls * 10000) / 10000,
      longtasks: p.lt.length, longtaskMax: r(Math.max(0, ...p.lt.map((l) => l.dur))),
      canvasAt: r(p.canvasAt), loadEvent: r(loadMs),
    };
  }, loadMs);
  load.canvasFound = canvas;

  const scenarios = {};
  await sleep(2000);
  scenarios['hero-idle'] = await measure(page, cdp, () => sleep(5000));

  if (!mobile) {
    scenarios['hero-mouse'] = await measure(page, cdp, async () => {
      const N = 250, T = 5000, cx = 720, cy = 450;
      const s = Date.now();
      for (let i = 0; i <= N; i++) {
        const t = (i / N) * 2 * Math.PI;
        await page.mouse.move(cx + 500 * Math.sin(3 * t), cy + 300 * Math.sin(2 * t + 0.5), { steps: 2 });
        const wait = s + (i / N) * T - Date.now();
        if (wait > 0) await sleep(wait);
      }
    });
  }

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await sleep(500);
  scenarios['scroll'] = await measure(page, cdp, async () => {
    if (!mobile) {
      const h = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      const steps = 200, dy = h / steps;
      await page.mouse.move(720, 450);
      for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy); await sleep(40); }
    } else {
      await page.evaluate(() => new Promise((res) => {
        const h = document.documentElement.scrollHeight - innerHeight, D = 8000, s = performance.now();
        const f = (t) => {
          const k = Math.min(1, (t - s) / D);
          window.scrollTo({ top: h * k, behavior: 'instant' });
          k < 1 ? requestAnimationFrame(f) : res();
        };
        requestAnimationFrame(f);
      }));
    }
  });
  scenarios['scroll'].scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);

  if (!mobile) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await sleep(800);
    const count = await page.evaluate(
      ({ sel, vis }) => [...document.querySelectorAll(sel)].filter(eval(vis)).length,
      { sel: INTERACTIVE, vis: VISIBLE_FN },
    );
    const n = Math.min(count, 60);
    scenarios['hover-sweep'] = await measure(page, cdp, async () => {
      for (let i = 0; i < n; i++) {
        const box = await page.evaluate(
          ({ sel, vis, i }) => {
            const els = [...document.querySelectorAll(sel)].filter(eval(vis));
            const e = els[i];
            if (!e) return null;
            e.scrollIntoView({ block: 'center', behavior: 'instant' });
            const r = e.getBoundingClientRect();
            return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
          },
          { sel: INTERACTIVE, vis: VISIBLE_FN, i },
        );
        if (box) await page.mouse.move(box.x, box.y, { steps: 4 });
        await sleep(150);
      }
    });
    scenarios['hover-sweep'].elements = n;
  }
  await ctx.close();
  return { load, scenarios };
}

const { browser, mode, renderer: rend, gpuReal } = await launch();
console.log(`Launch: ${mode} | renderer: ${rend} | GPU-real: ${gpuReal}`);
const result = {
  label: LABEL, url: URL_, date: new Date().toISOString(), launchMode: mode, renderer: rend, gpuReal,
  chromium: browser.version(), profiles: {},
};
for (const p of PROFILES) {
  console.log(`Running profile ${p}...`);
  result.profiles[p] = await runProfile(browser, p);
}
await browser.close();
fs.mkdirSync(path.dirname(path.resolve(OUT)), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(result, null, 2));

const pad = (v, n) => String(v ?? '-').padEnd(n);
for (const [p, r] of Object.entries(result.profiles)) {
  const l = r.load;
  console.log(`\n== ${p} == FCP ${l.fcp}  LCP ${l.lcp}  TBT ${l.tbt}  CLS ${l.cls}  canvas@ ${l.canvasAt}  longtasks ${l.longtasks} (max ${l.longtaskMax})`);
  console.log(['scenario', 'fps', 'p50', 'p95', 'p99', 'max', 'jank%', '>50', 'layouts', 'recalc', 'layoutMs', 'styleMs', 'scriptMs', 'taskMs'].map((x, i) => pad(x, i ? 9 : 13)).join(''));
  for (const [s, m] of Object.entries(r.scenarios)) {
    const c = m.cdp;
    console.log([s, m.fps, m.p50, m.p95, m.p99, m.max, m.jankyPct, m.over50, c.LayoutCount, c.RecalcStyleCount, c.LayoutDuration, c.RecalcStyleDuration, c.ScriptDuration, c.TaskDuration].map((x, i) => pad(x, i ? 9 : 13)).join(''));
  }
}
console.log(`\nJSON written to ${OUT}`);
