/** Number of orange blobs orbiting the card. Keep in sync with the engine. */
export const BLOBS = 5;

export const VERTEX_SHADER = /* glsl */ `#version 300 es
out vec2 v_uv;
void main() {
  vec2 pos = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = pos * 2.0 - 1.0;
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}
`;

/*
 * A raymarched scene: the portrait printed on a thin rounded card that
 * leans toward the pointer, and glossy orange blobs that melt into each
 * other as they orbit it, passing in front of and behind the card.
 * The photo itself is shown as it is, only lit.
 */
export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D u_tex;
uniform vec2 u_res;
uniform vec2 u_img;       // photo size in pixels
uniform vec3 u_crop;      // left, top, width of the photo crop as fractions
uniform vec2 u_tilt;      // card rotation around y and x, radians
uniform vec3 u_card;      // card centre in world space
uniform float u_cardScale;
uniform float u_dark;     // 0 light theme, 1 dark theme
uniform float u_reveal;   // entrance, 0..1
uniform float u_hasTex;
uniform vec4 u_blobs[${BLOBS}]; // xyz centre, w radius

in vec2 v_uv;
out vec4 outColor;

const vec3 ORANGE = vec3(1.0, 0.31, 0.0);
const vec3 CARD_HALF = vec3(0.8, 1.0, 0.035);

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

mat3 cardRot() { return rotX(u_tilt.y) * rotY(u_tilt.x); }

float blobField(vec3 p) {
  float d = 1e5;
  for (int i = 0; i < ${BLOBS}; i++) {
    vec4 b = u_blobs[i];
    d = smin(d, length(p - b.xyz) - b.w, 0.42);
  }
  return d;
}

float cardScale() { return u_cardScale * mix(0.82, 1.0, u_reveal); }

// World point in the card's own unscaled space.
vec3 cardLocal(vec3 p) { return transpose(cardRot()) * (p - u_card) / cardScale(); }

float cardField(vec3 p) {
  return sdRoundBox(cardLocal(p), CARD_HALF, 0.07) * cardScale();
}

// x: distance, y: material (0 card, 1 blob)
vec2 map(vec3 p) {
  float card = cardField(p);
  float blob = blobField(p);
  return card < blob ? vec2(card, 0.0) : vec2(blob, 1.0);
}

vec3 normalAt(vec3 p) {
  const vec2 e = vec2(0.0015, -0.0015);
  return normalize(
    e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x +
    e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);
}

vec3 environment(vec3 dir) {
  vec3 sky = mix(vec3(1.0), vec3(0.16), u_dark);
  vec3 ground = mix(vec3(1.0, 0.86, 0.78), vec3(0.35, 0.09, 0.0), u_dark);
  vec3 c = mix(ground, sky, smoothstep(-0.3, 0.6, dir.y));
  // A soft studio softbox up and to the left.
  c += vec3(1.0) * pow(max(dot(dir, normalize(vec3(-0.6, 0.7, 0.5))), 0.0), 18.0) * 1.4;
  return c;
}

vec3 photoAt(vec3 p) {
  vec3 q = cardLocal(p);
  vec2 local = q.xy / CARD_HALF.xy * 0.5 + 0.5;
  local.y = 1.0 - local.y;
  float frameAspect = CARD_HALF.x / CARD_HALF.y;
  float height = u_crop.z * (u_img.x / u_img.y) / frameAspect;
  vec2 uv = vec2(u_crop.x, u_crop.y) + local * vec2(u_crop.z, height);
  return texture(u_tex, clamp(uv, 0.0, 1.0)).rgb;
}

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 uv = v_uv * vec2(aspect, 1.0);
  vec3 ro = vec3(0.0, 0.0, 4.4);
  vec3 rd = normalize(vec3(uv, -2.55));

  float t = 0.0;
  vec2 hit = vec2(-1.0);
  for (int i = 0; i < 90; i++) {
    vec3 p = ro + rd * t;
    vec2 m = map(p);
    if (m.x < 0.0008) { hit = vec2(t, m.y); break; }
    t += m.x * 0.9;
    if (t > 10.0) break;
  }

  if (hit.x < 0.0) {
    outColor = vec4(0.0);
    return;
  }

  vec3 p = ro + rd * hit.x;
  vec3 n = normalAt(p);
  vec3 lightDir = normalize(vec3(-0.5, 0.8, 0.75));
  vec3 viewDir = -rd;
  float diffuse = max(dot(n, lightDir), 0.0);
  float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
  vec3 color;

  if (hit.y > 0.5) {
    // Glossy orange: wrapped diffuse, a sharp highlight and the studio reflected in it.
    vec3 refl = reflect(rd, n);
    float wrap = diffuse * 0.65 + 0.35;
    color = ORANGE * wrap;
    color *= mix(0.85, 0.55, u_dark) + 0.45 * smoothstep(-0.4, 0.8, n.y);
    color += environment(refl) * (0.08 + fresnel * 0.55) * mix(1.0, 0.8, u_dark);
    float spec = pow(max(dot(refl, lightDir), 0.0), 70.0);
    color += vec3(1.0) * spec * 1.2;
    // Darken where a blob tucks in near the card.
    color *= mix(0.65, 1.0, smoothstep(0.0, 0.25, cardField(p)));
  } else {
    vec3 q = cardLocal(p);
    vec3 localN = transpose(cardRot()) * n;
    bool front = localN.z > 0.6 && abs(q.x) < CARD_HALF.x - 0.02 && abs(q.y) < CARD_HALF.y - 0.02;
    vec3 base;
    if (front && u_hasTex > 0.5) {
      base = photoAt(p);
    } else if (front) {
      base = mix(vec3(0.92), vec3(0.14), u_dark);
    } else {
      base = mix(vec3(0.98, 0.97, 0.95), vec3(0.12), u_dark);
    }
    color = base * (0.82 + 0.22 * diffuse);
    // A faint gloss across the print.
    color += vec3(1.0) * pow(max(dot(reflect(rd, n), lightDir), 0.0), 40.0) * 0.18;
    // Soft orange shadow and bounce from blobs close to the surface.
    float near = blobField(p);
    color *= mix(0.55, 1.0, smoothstep(0.0, 0.45, near));
    color += ORANGE * (1.0 - smoothstep(0.0, 0.3, near)) * 0.18;
  }

  outColor = vec4(color, 1.0);
}
`;
