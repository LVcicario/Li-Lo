'use client'

import { useEffect, useState } from 'react'
import { Preloader } from '@/components/Preloader'
import { CustomCursor } from '@/components/CustomCursor'

export function ClientProviders() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <Preloader />
      <CustomCursor />
    </>
  )
}