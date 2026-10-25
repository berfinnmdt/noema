import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface NoemaFieldProps {
  className?: string
  density?: number
  interactive?: boolean
}

interface FieldNode {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
}

/**
 * Arka plandaki "düşünce alanı": yavaş sürüklenen düğümler ve aralarındaki
 * ince bağlantılar. Canvas kullanıldığı için fazla DOM düğümü üretmez.
 */
export function NoemaField({ className = '', density = 1, interactive = true }: NoemaFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let width = 0
    let height = 0
    let nodes: FieldNode[] = []
    let frame = 0
    let disposed = false

    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 }

    const buildNodes = () => {
      const area = Math.max(1, width * height)
      const count = Math.max(12, Math.min(54, Math.round((area / 17000) * density)))

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: 0.7 + Math.random() * 1.7,
        alpha: 0.22 + Math.random() * 0.5,
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)

      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)

      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      buildNodes()
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)

      pointer.x += (pointer.targetX - pointer.x) * 0.05
      pointer.y += (pointer.targetY - pointer.y) * 0.05

      const offsetX = (pointer.x - 0.5) * 20
      const offsetY = (pointer.y - 0.5) * 20
      const linkDistance = Math.max(90, Math.min(150, width * 0.32))

      context.lineWidth = 0.6

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const first = nodes[i]
          const second = nodes[j]
          const dx = first.x - second.x
          const dy = first.y - second.y
          const distanceSquared = dx * dx + dy * dy

          if (distanceSquared > linkDistance * linkDistance) continue

          const ratio = 1 - Math.sqrt(distanceSquared) / linkDistance
          context.strokeStyle = `rgba(146, 108, 255, ${(0.18 * ratio).toFixed(3)})`
          context.beginPath()
          context.moveTo(first.x + offsetX, first.y + offsetY)
          context.lineTo(second.x + offsetX, second.y + offsetY)
          context.stroke()
        }
      }

      for (const node of nodes) {
        const x = node.x + offsetX
        const y = node.y + offsetY

        const glow = context.createRadialGradient(x, y, 0, x, y, node.radius * 6)
        glow.addColorStop(0, `rgba(186, 160, 255, ${node.alpha.toFixed(3)})`)
        glow.addColorStop(1, 'rgba(186, 160, 255, 0)')
        context.fillStyle = glow
        context.beginPath()
        context.arc(x, y, node.radius * 6, 0, Math.PI * 2)
        context.fill()

        context.fillStyle = `rgba(237, 235, 229, ${(node.alpha * 0.85).toFixed(3)})`
        context.beginPath()
        context.arc(x, y, node.radius * 0.55, 0, Math.PI * 2)
        context.fill()
      }
    }

    const step = () => {
      if (disposed) return

      if (!document.hidden) {
        for (const node of nodes) {
          node.x += node.vx
          node.y += node.vy

          if (node.x < -24) node.x = width + 24
          if (node.x > width + 24) node.x = -24
          if (node.y < -24) node.y = height + 24
          if (node.y > height + 24) node.y = -24
        }

        draw()
      }

      frame = window.requestAnimationFrame(step)
    }

    resize()

    const resizeObserver = new ResizeObserver(() => {
      resize()
      if (reducedMotion) draw()
    })
    resizeObserver.observe(canvas)

    const handlePointer = (event: PointerEvent) => {
      if (!interactive) return
      const rect = canvas.getBoundingClientRect()
      pointer.targetX = (event.clientX - rect.left) / Math.max(1, rect.width)
      pointer.targetY = (event.clientY - rect.top) / Math.max(1, rect.height)
    }

    if (interactive) {
      canvas.addEventListener('pointermove', handlePointer)
    }

    if (reducedMotion) {
      draw()
    } else {
      frame = window.requestAnimationFrame(step)
    }

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointermove', handlePointer)
    }
  }, [density, interactive, reducedMotion])

  return <canvas ref={canvasRef} className={`stage__canvas ${className}`.trim()} />
}
