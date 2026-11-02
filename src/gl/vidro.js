import * as THREE from 'three'
import { criarPalco } from './stage.js'

const LARGURA = 1024
const ALTURA = 640

const FRAGMENT = /* glsl */ `
precision highp float;
precision highp sampler2DArray;
varying vec2 vUv;
uniform float uPos, uTempo;
uniform vec2 uRes, uCartao;
uniform sampler2DArray uFotos;

const float N = 5.0;
const float RAIO = 26.0;

float caixa(vec2 p, vec2 meio, float r) {
  vec2 q = abs(p) - meio + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// A fita de sites passando atrás do vidro
vec3 fita(vec2 p) {
  float passo = uCartao.x + 40.0;
  float x = p.x + uPos * passo;
  float i = floor(x / passo + 0.5);
  vec2 local = vec2(x - i * passo, p.y);
  float d = caixa(local, uCartao * 0.5, RAIO);
  if (d > 0.0) return vec3(0.028, 0.03, 0.045);
  vec2 uv = local / uCartao + 0.5;
  float camada = mod(mod(i, N) + N, N);
  return texture(uFotos, vec3(uv.x, 1.0 - uv.y, camada)).rgb;
}

void main() {
  vec2 p = (vUv - 0.5) * uRes;
  vec2 lente = uCartao * 0.5 + 14.0;
  float d = caixa(p, lente, RAIO + 10.0);

  vec3 cor;
  if (d > 0.0) {
    cor = fita(p) * 0.34;
  } else {
    // Perto da borda o vidro puxa a imagem de dentro, e cada cor desvia um pouco diferente
    vec2 e = vec2(1.0, 0.0);
    vec2 n = normalize(vec2(
      caixa(p + e.xy, lente, RAIO + 10.0) - caixa(p - e.xy, lente, RAIO + 10.0),
      caixa(p + e.yx, lente, RAIO + 10.0) - caixa(p - e.yx, lente, RAIO + 10.0)) + 1e-5);
    float aro = min(34.0, uCartao.x * 0.06);
    float curva = pow(smoothstep(-aro, 0.0, d), 2.5);
    vec2 desvio = -n * curva * aro * 1.35;
    cor = vec3(fita(p + desvio * 1.14).r, fita(p + desvio).g, fita(p + desvio * 0.86).b);
    float brilho = smoothstep(-2.5, -0.5, d) * (0.3 + 0.5 * max(dot(n, normalize(vec2(-0.5, 0.8))), 0.0));
    cor += vec3(0.85, 0.85, 1.0) * brilho + vec3(0.31, 0.275, 0.898) * curva * 0.06;
  }
  gl_FragColor = vec4(cor, 1.0);
}
`

async function carregarFotos(ids) {
  const dados = new Uint8Array(LARGURA * ALTURA * 4 * ids.length)
  const ctx = Object.assign(document.createElement('canvas'), { width: LARGURA, height: ALTURA }).getContext('2d', { willReadFrequently: true })
  const fotos = await Promise.all(ids.map((id) => {
    const img = new Image()
    img.src = `${import.meta.env.BASE_URL}shots/${id}.webp`
    return img.decode().then(() => img)
  }))
  fotos.forEach((img, i) => {
    ctx.drawImage(img, 0, 0, LARGURA, ALTURA)
    dados.set(ctx.getImageData(0, 0, LARGURA, ALTURA).data, i * LARGURA * ALTURA * 4)
  })
  return dados
}

export async function criarVidro({ canvas, ids, indice }) {
  const textura = new THREE.DataArrayTexture(await carregarFotos(ids), LARGURA, ALTURA, ids.length)
  textura.colorSpace = THREE.NoColorSpace
  textura.minFilter = textura.magFilter = THREE.LinearFilter
  textura.needsUpdate = true

  const uniforms = {
    uTempo: { value: 0 },
    uPos: { value: indice },
    uRes: { value: new THREE.Vector2(1, 1) },
    uCartao: { value: new THREE.Vector2(1, 1) },
    uFotos: { value: textura },
  }
  let alvo = indice

  const palco = criarPalco({
    canvas,
    fragmentShader: FRAGMENT,
    uniforms,
    aoRedimensionar(w, h) {
      const largura = Math.min(w * 0.82, (h - 56) * 1.6)
      uniforms.uCartao.value.set(largura, largura / 1.6)
    },
    aCadaQuadro() {
      const { value } = uniforms.uPos
      uniforms.uPos.value = palco?.reduzido ? alvo : value + (alvo - value) * 0.09
    },
  })

  return {
    irPara(v) {
      alvo = v
      if (palco.reduzido) palco.desenhar()
    },
    arrastar(v) {
      alvo = v
      uniforms.uPos.value = v
      if (palco.reduzido) palco.desenhar()
    },
    largura: () => uniforms.uCartao.value.x + 40,
    destruir() {
      textura.dispose()
      palco.destruir()
    },
  }
}
