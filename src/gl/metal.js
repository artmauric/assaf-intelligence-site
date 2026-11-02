import * as THREE from 'three'
import { criarPalco } from './stage.js'

const FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTempo, uRolagem, uRaio;
uniform vec2 uRes, uPonteiro;
uniform sampler2D uLetras;

const vec3 TEMA = vec3(0.31, 0.275, 0.898);
const vec3 TEMA_CLARO = vec3(0.635, 0.616, 1.0);

// Dobras da chapa: senos deformados por eles mesmos, sem ruído, para manter curvas longas
float chapa(vec2 p) {
  float t = uTempo * 0.11;
  vec2 q = p + 0.42 * vec2(sin(p.y * 1.25 + t * 1.3), cos(p.x * 0.95 - t));
  float a = sin(q.x * 1.45 + q.y * 0.65 + 1.5 * sin(q.y * 0.9 - t * 0.8));
  float b = sin(q.y * 1.9 - q.x * 0.8 + t + 1.8 * a);
  float c = sin(length(q - uPonteiro) * 3.0 - t * 4.0) * exp(-1.6 * dot(q - uPonteiro, q - uPonteiro));
  return 0.62 * a + 0.34 * b + 0.2 * c;
}

// Estúdio refletido: duas softboxes brancas e um recorte azul
vec3 estudio(vec3 r) {
  float v = r.y * 0.5 + 0.5;
  float h = r.x * 0.5 + 0.5;
  float caixa = smoothstep(0.08, 0.0, abs(v - 0.74)) + 0.55 * smoothstep(0.05, 0.0, abs(h - 0.2 - 0.1 * v));
  float recorte = smoothstep(0.1, 0.0, abs(v - 0.3 - 0.14 * h));
  return vec3(0.015, 0.015, 0.022) + vec3(0.92, 0.93, 0.98) * caixa + TEMA_CLARO * 0.8 * recorte;
}

vec3 metal(vec2 p) {
  const float e = 0.012;
  float h = chapa(p);
  vec3 n = normalize(vec3(chapa(p - vec2(e, 0.0)) - h, chapa(p - vec2(0.0, e)) - h, e * 1.5));
  vec3 cor = estudio(reflect(vec3(0.0, 0.0, -1.0), n));
  float fresnel = pow(1.0 - n.z, 3.0);
  return cor * (0.35 + 0.65 * fresnel) + TEMA_CLARO * 0.16 * fresnel;
}

// Letreiro aceso por dentro: faixas de luz que atravessam na diagonal
vec3 luz(vec2 uv) {
  float d = uv.x * 2.2 + uv.y * 1.1;
  float faixa = sin(d * 7.0 - uTempo * 0.5 + 2.0 * sin(d * 2.1 + uTempo * 0.17));
  float fina = pow(0.5 + 0.5 * sin(d * 34.0 + 3.0 * faixa - uTempo * 0.3), 6.0);
  vec3 base = mix(vec3(0.09, 0.07, 0.36), TEMA * 1.25, 0.5 + 0.5 * faixa);
  return base + vec3(0.85, 0.85, 1.0) * fina;
}

// "In" de vidro líquido: dobra a chapa que passa atrás, com a borda acesa pela luz
vec3 vidro(vec2 uv, vec2 p) {
  vec2 dentro = vec2(0.0);
  float cheio = 0.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.7854;
    vec2 d = vec2(cos(a), sin(a));
    float perto = texture2D(uLetras, uv + d * uRaio * 0.5 / uRes).g;
    float longe = texture2D(uLetras, uv + d * uRaio / uRes).g;
    dentro += d * (perto + longe);
    cheio += perto + longe;
  }
  dentro /= 8.0;
  float aro = smoothstep(0.1, 0.5, 1.0 - cheio / 16.0);

  vec2 q = (p + dentro * 0.34) * 0.78;
  vec2 dispersao = dentro * 0.05;
  vec3 atras = vec3(metal(q + dispersao).r, metal(q).g, metal(q - dispersao).b);

  vec2 fora = -normalize(dentro + 1e-4);
  vec2 sol = normalize(vec2(-0.5, 0.8) + uPonteiro * 0.25);
  float luzDireta = aro * pow(max(dot(fora, sol), 0.0), 2.0);
  float rebote = aro * pow(max(dot(fora, -sol), 0.0), 3.0);
  return atras * 1.4 + vec3(0.14, 0.145, 0.18) + vec3(0.97, 0.97, 1.0) * (luzDireta + rebote * 0.5 + aro * 0.24);
}

void main() {
  float aspecto = uRes.x / uRes.y;
  vec2 p = (vUv - 0.5) * vec2(aspecto, 1.0) * 2.0;
  p.y += uRolagem * 0.5;

  // Centro escuro, para o texto ler bem: a chapa só cresce nas bordas
  float largura = min(aspecto, 1.0);
  float borda = smoothstep(0.5, 1.15, length(((vUv - 0.5) * 2.0) * vec2(1.0, 0.55 + 0.25 / largura)));
  vec3 cor = metal(p * 0.78) * borda + vec3(0.028, 0.03, 0.045) * (1.0 - borda);

  vec2 ae = vec2(1.6 / uRes.x, 0.0);
  // Vermelho guarda "Assaf.", aceso em azul; verde guarda "In", de vidro
  vec2 mascara = texture2D(uLetras, vUv).rg;
  float letra = mascara.r;
  float letraR = texture2D(uLetras, vUv + ae).r;
  float letraB = texture2D(uLetras, vUv - ae).r;
  cor = mix(cor, luz(vUv * vec2(aspecto, 1.0)), letra);
  if (mascara.g > 0.004) cor = mix(cor, vidro(vUv, p), mascara.g);
  cor += vec3(letraR - letra, 0.0, letraB - letra) * 0.3 * step(0.01, letraR + letraB);

  cor *= 1.0 - uRolagem * 0.75;
  gl_FragColor = vec4(pow(max(cor, 0.0), vec3(0.92)), 1.0);
}
`

// Desenha Assaf.In num canvas 2D no mesmo lugar do espaço reservado no HTML; o shader preenche as letras.
function desenharLetras(ctx2d, largura, altura, vaga, raiz) {
  const { canvas } = ctx2d
  canvas.width = Math.min(largura, 2048)
  canvas.height = Math.round((canvas.width * altura) / largura)
  const escala = canvas.width / largura
  const a = vaga.getBoundingClientRect()
  const b = raiz.getBoundingClientRect()
  const pesada = (px) => `800 expanded ${px}px Archivo`
  const media = (px) => `700 ${px}px Archivo`
  const tamanho = 100
  ctx2d.font = pesada(tamanho)
  const largAssaf = ctx2d.measureText('Assaf.').width
  ctx2d.font = media(tamanho)
  const largIn = ctx2d.measureText('In').width
  const fonte = Math.min((a.width / (largAssaf + largIn)) * tamanho, a.height * 1.28) * escala
  const inicio = (a.left - b.left + a.width / 2) * escala - ((largAssaf + largIn) * fonte) / tamanho / 2
  const y = (a.top - b.top + a.height * 0.53) * escala
  ctx2d.fillStyle = '#000'
  ctx2d.fillRect(0, 0, canvas.width, canvas.height)
  ctx2d.textAlign = 'left'
  ctx2d.textBaseline = 'middle'
  ctx2d.fillStyle = '#f00'
  ctx2d.font = pesada(fonte)
  ctx2d.fillText('Assaf.', inicio, y)
  ctx2d.fillStyle = '#0f0'
  ctx2d.font = media(fonte)
  ctx2d.fillText('In', inicio + (largAssaf * fonte) / tamanho, y)
  return fonte / escala
}

export function criarMetal({ canvas, vaga, raiz }) {
  const mascara = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  const textura = new THREE.CanvasTexture(mascara.canvas)
  const alvo = new THREE.Vector2()
  const uniforms = {
    uTempo: { value: 8 },
    uRolagem: { value: 0 },
    uRaio: { value: 10 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uPonteiro: { value: new THREE.Vector2() },
    uLetras: { value: textura },
  }

  const palco = criarPalco({
    canvas,
    fragmentShader: FRAGMENT,
    uniforms,
    aoRedimensionar(w, h) {
      uniforms.uRaio.value = desenharLetras(mascara, w, h, vaga, raiz) * 0.05
      textura.dispose() // o tamanho muda: a GPU precisa recriar a textura
      textura.needsUpdate = true
    },
    aCadaQuadro: () => uniforms.uPonteiro.value.lerp(alvo, 0.05),
  })

  const aoMover = (e) => {
    const { uRes } = uniforms
    alvo.set(((e.clientX / uRes.value.x) * 2 - 1) * (uRes.value.x / uRes.value.y) * 0.78, (1 - (e.clientY / uRes.value.y) * 2) * 0.78)
  }
  window.addEventListener('pointermove', aoMover, { passive: true })

  return {
    definirRolagem(v) {
      uniforms.uRolagem.value = v
      if (palco.reduzido) palco.desenhar()
    },
    destruir() {
      window.removeEventListener('pointermove', aoMover)
      textura.dispose()
      palco.destruir()
    },
  }
}
