"use client"

import { useEffect, useRef } from "react"
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl"

const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, "")
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("")
  const int = Number.parseInt(hex, 16)
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
}

const vertex = `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  uniform mat4 modelMatrix, viewMatrix, projectionMatrix;
  uniform float uTime, uSpread, uBaseSize, uSizeRandomness;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vRandom = random;
    vColor = color;
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.2, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.2, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.2, random.z);
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`

const fragment = `
  precision highp float;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) discard;
      gl_FragColor = vec4(vColor, 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.7;
      gl_FragColor = vec4(vColor, circle);
    }
  }
`

interface ParticlesProps {
  particleCount?: number
  particleSpread?: number
  speed?: number
  particleColors?: string[]
  moveParticlesOnHover?: boolean
  alphaParticles?: boolean
  particleBaseSize?: number
  sizeRandomness?: number
  cameraDistance?: number
  disableRotation?: boolean
  className?: string
}

export default function Particles({
  particleCount = 20,
  particleSpread = 10,
  speed = 0.02,
  particleColors = ["#0f3461", "#e9445f", "#f9c54e", "#15203c"],
  moveParticlesOnHover = false,
  alphaParticles = true,
  particleBaseSize = 70,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  className,
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new Renderer({ depth: false, alpha: true })
    const gl = renderer.gl
    container.appendChild(gl.canvas)
    gl.clearColor(0, 0, 0, 0)

    const camera = new Camera(gl, { fov: 15 })
    camera.position.set(0, 0, cameraDistance)

    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
    }

    window.addEventListener("resize", resize)
    resize()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 0.2 - 0.1
      const y = -(((e.clientY - rect.top) / rect.height) * 0.2 - 0.1)
      mouseRef.current = { x, y }
    }

    if (moveParticlesOnHover) container.addEventListener("mousemove", handleMouseMove)

    const count = particleCount
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count * 4)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      let x, y, z, len
      do {
        x = Math.random() * 2 - 1
        y = Math.random() * 2 - 1
        z = Math.random() * 2 - 1
        len = x * x + y * y + z * z
      } while (len > 1 || len === 0)
      const r = Math.cbrt(Math.random())
      positions.set([x * r, y * r, z * r], i * 3)
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4)
      const col = hexToRgb(particleColors[Math.floor(Math.random() * particleColors.length)])
      colors.set(col, i * 3)
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    })

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    })

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program })

    let animationFrameId = 0
    let lastTime = performance.now()
    let elapsed = 0

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update)
      const delta = t - lastTime
      lastTime = t
      elapsed += delta * speed
      program.uniforms.uTime.value = elapsed * 0.001

      if (moveParticlesOnHover) {
        particles.position.x = -mouseRef.current.x * 0.2
        particles.position.y = -mouseRef.current.y * 0.2
      } else {
        particles.position.x = 0
        particles.position.y = 0
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.00005) * 0.02
        particles.rotation.y = Math.cos(elapsed * 0.0001) * 0.03
      }

      renderer.render({ scene: particles, camera })
    }

    animationFrameId = requestAnimationFrame(update)

    return () => {
      window.removeEventListener("resize", resize)
      if (moveParticlesOnHover) container.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas)
    }
  }, [
    particleCount,
    particleSpread,
    speed,
    particleColors,
    moveParticlesOnHover,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
  ])

  return (
    <div
      ref={containerRef}
      className={`particles-container ${className || ""}`}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  )
}
