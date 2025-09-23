'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, RotateCcw, Maximize2 } from 'lucide-react'

interface Product360ViewerProps {
  images: string[]
  productName: string
  className?: string
}

export default function Product360Viewer({ images, productName, className = '' }: Product360ViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isRotating, setIsRotating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [rotationSpeed, setRotationSpeed] = useState(200) // ms between frames

  const containerRef = useRef<HTMLDivElement>(null)
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])

  // Preload all images for smooth rotation
  useEffect(() => {
    if (images.length > 1) {
      images.forEach((src, index) => {
        const img = new Image()
        img.src = src
        imageRefs.current[index] = img
      })
    }
  }, [images])

  // Auto-rotation functionality
  const startRotation = useCallback(() => {
    if (images.length <= 1) return

    setIsRotating(true)
    rotationIntervalRef.current = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length)
    }, rotationSpeed)
  }, [images.length, rotationSpeed])

  const stopRotation = useCallback(() => {
    setIsRotating(false)
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current)
      rotationIntervalRef.current = null
    }
  }, [])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current)
      }
    }
  }, [])

  // Handle mouse/touch drag for manual rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (images.length <= 1) return
    setIsDragging(true)
    setDragStartX(e.clientX)
    stopRotation()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || images.length <= 1) return

    const dragDistance = e.clientX - dragStartX
    const sensitivity = 10 // pixels per image change
    const imageChange = Math.floor(Math.abs(dragDistance) / sensitivity)

    if (imageChange > 0) {
      const direction = dragDistance > 0 ? 1 : -1
      const newIndex = (currentImageIndex + direction * imageChange + images.length) % images.length
      setCurrentImageIndex(newIndex)
      setDragStartX(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (images.length <= 1) return
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
    stopRotation()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || images.length <= 1) return

    const dragDistance = e.touches[0].clientX - dragStartX
    const sensitivity = 15
    const imageChange = Math.floor(Math.abs(dragDistance) / sensitivity)

    if (imageChange > 0) {
      const direction = dragDistance > 0 ? 1 : -1
      const newIndex = (currentImageIndex + direction * imageChange + images.length) % images.length
      setCurrentImageIndex(newIndex)
      setDragStartX(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Navigation functions
  const goToPrevious = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
    stopRotation()
  }

  const goToNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length)
    stopRotation()
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return

      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case ' ':
          e.preventDefault()
          isRotating ? stopRotation() : startRotation()
          break
        case 'Escape':
          if (isFullscreen) setIsFullscreen(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRotating, isFullscreen, images.length, goToPrevious, goToNext, startRotation, stopRotation])

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-900 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-gray-400 font-mono">NO IMAGES AVAILABLE</p>
      </div>
    )
  }

  const Viewer = () => (
    <div
      ref={containerRef}
      className={`relative group cursor-pointer select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Image Display */}
      <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt={`${productName} - View ${currentImageIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-150"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Loading overlay for rotation */}
        {isRotating && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="text-white font-mono text-sm bg-black bg-opacity-60 px-3 py-1 rounded">
              ROTATING...
            </div>
          </div>
        )}

        {/* Drag hint */}
        {images.length > 1 && !isDragging && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute top-4 left-4 text-white font-mono text-xs bg-black bg-opacity-60 px-2 py-1 rounded">
              DRAG TO ROTATE • {images.length} VIEWS
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {images.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Rotation Control */}
            <button
              onClick={isRotating ? stopRotation : startRotation}
              className={`px-3 py-1 rounded font-mono text-xs transition-colors ${
                isRotating
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-white hover:bg-gray-200 text-black'
              }`}
            >
              <RotateCcw className="w-3 h-3 inline mr-1" />
              {isRotating ? 'STOP' : '360°'}
            </button>

            {/* Fullscreen Control */}
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded font-mono text-xs"
            >
              <Maximize2 className="w-3 h-3 inline mr-1" />
              FULL
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            {currentImageIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )

  // Fullscreen Modal
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="w-full h-full max-w-4xl max-h-4xl relative">
          <Viewer />
        </div>
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold"
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      <Viewer />
    </div>
  )
}