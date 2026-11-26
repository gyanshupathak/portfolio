import { BLOBS, FRAGMENT_SHADER, VERTEX_SHADER } from "./sculpture-source";

export type SculptureEngine = {
  setPaused: (paused: boolean) => void;
  setDark: (dark: boolean) => void;
  /** 0 at rest, 1 once the hero has scrolled out. */
  setScroll: (progress: number) => void;
  destroy: () => void;
};

type EngineOptions = {
  src: string | null;
  crop: { x: number; y: number; width: number };
  /** Element whose box the card fills; the blobs roam the whole canvas. */
  anchor: HTMLElement;
  paused: boolean;
  dark: boolean;
  /** Called once the first frame with the photo is on screen. */
  onReady: () => void;
  onFail: () => void;
};

const MAX_PIXEL_RATIO = 1.5;
const MAX_PIXELS = 1_600_000;
const REVEAL_SECONDS = 1.8;
/** Per 60fps frame easing for tilt and the pointer-following blob. */
const EASE = 0.05;
/** Half the visible height of the z = 0 plane, from the camera in the shader. */
const VIEW = 4.4 / 2.55;
/** Share of the anchor box the card fills. */
const FILL = 0.94;
/** Card half size in its own space, matching CARD_HALF in the shader. */
const CARD_HALF = { x: 0.8, y: 1.0 };

/** Blobs that wander the whole canvas: frequencies, phases, size. */
const WANDERERS = [
  { fx: 0.11, fy: 0.17, phase: 0.6, z: -0.5, size: 0.42 },
  { fx: 0.08, fy: 0.13, phase: 2.9, z: -0.9, size: 0.34 },
];

/** Blobs that circle the card, relative to its size. */
const ORBITERS = [
  { r: 1.25, speed: 0.38, phase: 0.4, y: 0.55, size: 0.3 },
  { r: 1.4, speed: -0.29, phase: 3.4, y: -0.6, size: 0.24 },
];

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Sculpture shader failed to compile:", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * Starts the hero scene on `canvas`. Returns `null` when WebGL2 is not
 * available, in which case the caller keeps the CSS version.
 * The loop only runs while the canvas is on screen and the tab is visible.
 */
export function createSculptureEngine(
  canvas: HTMLCanvasElement,
  options: EngineOptions,
): SculptureEngine | null {
  const context = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  });
  if (!context) return null;
  const gl: WebGL2RenderingContext = context;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  gl.clearColor(0, 0, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const uRes = uniform("u_res");
  const uImg = uniform("u_img");
  const uTilt = uniform("u_tilt");
  const uCard = uniform("u_card");
  const uCardScale = uniform("u_cardScale");
  const uDark = uniform("u_dark");
  const uReveal = uniform("u_reveal");
  const uHasTex = uniform("u_hasTex");
  const uBlobs = uniform("u_blobs");
  gl.uniform1i(uniform("u_tex"), 0);
  gl.uniform3f(uniform("u_crop"), options.crop.x, options.crop.y, options.crop.width);
  gl.uniform2f(uImg, 1, 1);
  gl.uniform1f(uHasTex, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let paused = options.paused;
  let dark = options.dark;
  let onScreen = true;
  let destroyed = false;
  let ready = !options.src;
  let frame = 0;
  let lastTick = 0;
  let elapsed = 0;
  let reveal = 0;
  let scroll = 0;

  /** Pointer over the canvas, -1..1 on both axes. */
  const pointer = { x: 0.4, y: 0 };
  const tilt = { x: 0, y: 0 };
  const follower = { x: 0, y: 0 };
  /** Visible half extents of the z = 0 plane, and the card placement. */
  const view = { halfW: VIEW, halfH: VIEW };
  const card = { x: 0, y: 0, scale: 1 };
  const blobs = new Float32Array(BLOBS * 4);

  function layout() {
    const box = canvas.getBoundingClientRect();
    const slot = options.anchor.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return;
    const aspect = box.width / box.height;
    view.halfW = VIEW * aspect;
    view.halfH = VIEW;
    const cx = (slot.left + slot.width / 2 - box.left) / box.width;
    const cy = (slot.top + slot.height / 2 - box.top) / box.height;
    card.x = (cx * 2 - 1) * view.halfW;
    card.y = (1 - cy * 2) * view.halfH;
    const byHeight = ((slot.height * FILL) / box.height) * view.halfH / CARD_HALF.y;
    const byWidth = ((slot.width * FILL) / box.width) * view.halfW / CARD_HALF.x;
    card.scale = Math.max(0.1, Math.min(byHeight, byWidth));
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    const fullWidth = canvas.clientWidth * ratio;
    const fullHeight = canvas.clientHeight * ratio;
    const scale = Math.min(1, Math.sqrt(MAX_PIXELS / Math.max(1, fullWidth * fullHeight)));
    const width = Math.max(1, Math.round(fullWidth * scale));
    const height = Math.max(1, Math.round(fullHeight * scale));
    layout();
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }

  function step(delta: number) {
    elapsed += delta;
    reveal = Math.min(1, reveal + delta / REVEAL_SECONDS);
    const mix = 1 - Math.pow(1 - EASE, delta * 60);
    const grow = easeOut(reveal);
    const unit = Math.min(1, view.halfW / VIEW);

    tilt.x += (pointer.x * 0.4 + Math.sin(elapsed * 0.35) * 0.08 + scroll * 0.9 - tilt.x) * mix;
    tilt.y += (-pointer.y * 0.28 + Math.sin(elapsed * 0.27) * 0.04 - tilt.y) * mix;

    let slot = 0;
    const put = (x: number, y: number, z: number, radius: number) => {
      blobs[slot * 4] = x;
      blobs[slot * 4 + 1] = y;
      blobs[slot * 4 + 2] = z;
      blobs[slot * 4 + 3] = radius * grow;
      slot += 1;
    };

    for (const blob of WANDERERS) {
      put(
        Math.sin(elapsed * blob.fx + blob.phase) * view.halfW * 0.88,
        Math.sin(elapsed * blob.fy + blob.phase * 1.7) * view.halfH * 0.78 + scroll * 0.8,
        blob.z + Math.sin(elapsed * 0.3 + blob.phase) * 0.4,
        blob.size * unit,
      );
    }

    const spread = 1 + scroll * 0.9;
    for (const blob of ORBITERS) {
      const angle = elapsed * blob.speed + blob.phase;
      put(
        card.x + Math.cos(angle) * blob.r * card.scale * spread,
        card.y + (blob.y + Math.sin(elapsed * 0.5 + blob.phase) * 0.2) * card.scale,
        Math.sin(angle) * blob.r * 0.8 * card.scale * spread,
        blob.size * card.scale,
      );
    }

    // The last blob drifts after the pointer, anywhere on the canvas.
    follower.x += (pointer.x * view.halfW * 0.92 - follower.x) * mix;
    follower.y += (pointer.y * view.halfH * 0.85 - follower.y) * mix;
    put(follower.x, follower.y, 0.5 + Math.sin(elapsed * 0.8) * 0.15, 0.2 * unit);
  }

  function draw() {
    if (!ready) return;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uTilt, tilt.x, tilt.y);
    gl.uniform3f(uCard, card.x, card.y, 0);
    gl.uniform1f(uCardScale, card.scale);
    gl.uniform1f(uDark, dark ? 1 : 0);
    gl.uniform1f(uReveal, easeOut(reveal));
    gl.uniform4fv(uBlobs, blobs);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function tick(now: number) {
    frame = 0;
    if (destroyed) return;
    const delta = Math.min((now - lastTick) / 1000, 0.05);
    lastTick = now;
    step(delta);
    draw();
    schedule();
  }

  function shouldRun() {
    return !destroyed && ready && !paused && onScreen && !document.hidden;
  }

  function schedule() {
    if (frame || !shouldRun()) return;
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    if (shouldRun()) {
      if (!frame) {
        lastTick = performance.now();
        schedule();
      }
    } else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  function onPointerMove(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
    pointer.x = Math.max(-1.1, Math.min(1.1, x));
    pointer.y = Math.max(-1.1, Math.min(1.1, y));
  }

  function onContextLost(event: Event) {
    event.preventDefault();
    destroy();
    options.onFail();
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (!frame && !destroyed) draw();
  });
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    sync();
  });

  const image = new Image();
  function start() {
    resize();
    step(0);
    draw();
    options.onReady();
    sync();
  }
  if (options.src) {
    image.decoding = "async";
    image.onload = () => {
      if (destroyed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform2f(uImg, image.naturalWidth, image.naturalHeight);
      gl.uniform1f(uHasTex, 1);
      ready = true;
      start();
    };
    image.onerror = () => {
      if (destroyed) return;
      ready = true;
      start();
    };
    image.src = options.src;
  } else {
    requestAnimationFrame(() => {
      if (!destroyed) start();
    });
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    image.onload = null;
    image.onerror = null;
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("visibilitychange", sync);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    gl.deleteTexture(texture);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
  }

  resize();
  resizeObserver.observe(canvas);
  resizeObserver.observe(options.anchor);
  intersectionObserver.observe(canvas);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("visibilitychange", sync);
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    setPaused(next) {
      paused = next;
      sync();
    },
    setDark(next) {
      dark = next;
      if (!frame && !destroyed) draw();
    },
    setScroll(progress) {
      scroll = progress;
    },
    destroy,
  };
}
