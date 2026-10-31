import * as THREE from 'three'

const VERTEX = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }'

// Plano em tela cheia que só desenha enquanto está visível. Lança erro se não houver WebGL.
export function criarPalco({ canvas, fragmentShader, uniforms, aoRedimensionar, aCadaQuadro }) {
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

  const material = new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader, uniforms })
  const cena = new THREE.Scene()
  cena.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))
  const camera = new THREE.Camera()

  let visivel = false
  let quadro = 0
  const relogio = new THREE.Timer()

  const desenhar = () => {
    relogio.update()
    if (!reduzido) uniforms.uTempo.value = relogio.getElapsed()
    aCadaQuadro?.()
    renderer.render(cena, camera)
  }
  const laco = () => {
    desenhar()
    quadro = visivel && !document.hidden ? requestAnimationFrame(laco) : 0
  }
  const iniciar = () => {
    if (!reduzido && !quadro) quadro = requestAnimationFrame(laco)
  }

  const medir = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    uniforms.uRes.value.set(w, h)
    aoRedimensionar?.(w, h)
    desenhar()
  }
  const redimensionamento = new ResizeObserver(medir)
  redimensionamento.observe(canvas)

  const presenca = new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting
    iniciar()
  })
  presenca.observe(canvas)
  document.addEventListener('visibilitychange', iniciar)

  return {
    desenhar,
    reduzido,
    destruir() {
      cancelAnimationFrame(quadro)
      redimensionamento.disconnect()
      presenca.disconnect()
      document.removeEventListener('visibilitychange', iniciar)
      material.dispose()
      renderer.dispose()
    },
  }
}
