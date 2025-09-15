'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    setMounted(true)

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    const checkPointer = () => {
      const hoveredElement = document.querySelector(':hover')
      const isClickable = hoveredElement?.tagName === 'A' ||
                         hoveredElement?.tagName === 'BUTTON' ||
                         hoveredElement?.closest('a') !== null ||
                         hoveredElement?.closest('button') !== null ||
                         window.getComputedStyle(hoveredElement || document.body).cursor === 'pointer'

      setIsPointer(isClickable)
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', checkPointer)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', checkPointer)
    }
  }, [cursorX, cursorY])

  if (!mounted) return null

  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: isPointer ? 1.5 : 1,
            backgroundColor: isPointer ? '#ff0000' : '#ffffff',
          }}
          transition={{ duration: 0.2 }}
          className="w-full h-full rounded-full"
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9998] hidden lg:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          animate={{
            scale: isPointer ? 2 : 1.5,
          }}
          transition={{ duration: 0.2 }}
          className="w-full h-full rounded-full border-2 border-white/20"
        />
      </motion.div>
    </>
  )
}