'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  let mx = 0, my = 0, fx = 0, fy = 0

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px'
        dotRef.current.style.top = my + 'px'
      }
    }

    let raf: number
    const follow = () => {
      fx += (mx - fx) * 0.12
      fy += (my - fy) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = fx + 'px'
        ringRef.current.style.top = fy + 'px'
      }
      raf = requestAnimationFrame(follow)
    }
    follow()

    const onEnter = () => ringRef.current?.classList.add('hovered')
    const onLeave = () => ringRef.current?.classList.remove('hovered')

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}