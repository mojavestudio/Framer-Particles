import React, { useRef, useEffect, useCallback } from 'react'

interface ParticleConfig {
    backdrop: string
    backgroundOpacity: number
    color: string
    colors: string[]
    amount: number
    size: { type: "Value" | "Range", value: number, min: number, max: number }
    opacity: { type: "Value" | "Range", value: number, min: number, max: number }
    radius: number
    width: number
    height: number
    border: {
        enable: boolean
        color: string
        width: number
    }
    glow: {
        enable: boolean
        intensity: number
        size: number
    }
    twinkle: {
        enable: boolean
        speed: number
        minOpacity: number
        maxOpacity: number
    }
    modes: {
        connect: number
        connectRadius: number
        connectLinks: number
        grab: number
        grabLinks: number
        bubble: number
        bubbleSize: number
        bubbleDuration: number
        repulse: number
        repulseDistance: number
        push: number
        remove: number
        trail: number
        trailDelay: number
    }
    move: {
        enable: boolean
        direction: string
        speed: number
        random: boolean
        straight: boolean
        out: string
        trail: boolean
        trailLength: number
        gravity: boolean
        gravityAcceleration: number
        spin: boolean
        spinSpeed: number
        attract: boolean
        attractDistance: number
        vibrate: boolean
        vibrateFrequency: number
    }
    click: {
        enable: boolean
        mode: string
    }
    hover: {
        enable: boolean
        mode: string
        parallax: boolean
        force: number
        smooth: number
    }
}

// Simple, working Live Preview Component
export function EnhancedLivePreview({ config }: { config: ParticleConfig }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const particlesRef = useRef<Array<{
        x: number
        y: number
        vx: number
        vy: number
        color: string
        size: number
        opacity: number
        twinklePhase: number
        gravityVel: number
        spinAngle: number
        originalSize: number
    }>>([])
    const mouseRef = useRef<{ x: number; y: number; isHovering: boolean }>({
        x: -1, y: -1, isHovering: false
    })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: false,
            colorSpace: "srgb",
            willReadFrequently: false
        })
        if (!ctx) return

        // Get device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1
        
        // Set canvas size dynamically
        const container = canvas.parentElement
        const width = container ? container.clientWidth - 16 : 300 // Account for padding
        const height = 200
        
        // Set the actual canvas size (internal resolution) - higher resolution for crisp particles
        canvas.width = width * dpr
        canvas.height = height * dpr
        
        // Scale the canvas back down using CSS
        canvas.style.width = width + "px"
        canvas.style.height = height + "px"
        
        // Scale the context to match the device pixel ratio
        ctx.scale(dpr, dpr)
        
        // Set additional context properties for smooth rendering
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.globalCompositeOperation = "source-over"

        // Resize handler to make canvas responsive
        const handleResize = () => {
            const newWidth = container ? container.clientWidth - 16 : 300
            const currentWidth = canvas.width / dpr
            if (Math.abs(currentWidth - newWidth) > 1) {
                // Set the actual canvas size (internal resolution)
                canvas.width = newWidth * dpr
                canvas.height = height * dpr
                
                // Scale the canvas back down using CSS
                canvas.style.width = newWidth + "px"
                canvas.style.height = height + "px"
                
                // Reset the context scale
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
                
                createParticles() // Recreate particles for new dimensions
            }
        }

        // Add resize listener
        window.addEventListener('resize', handleResize)

        // Create particles based on config
        function createParticles() {
            // Creating particles with the current configuration
            
            const particles: Array<{
                x: number
                y: number
                vx: number
                vy: number
                color: string
                size: number
                opacity: number
                twinklePhase: number
                gravityVel: number
                spinAngle: number
                originalSize: number
            }> = []
            const amount = Math.min(config.amount, 30) // Limit for preview
            const cols = config.colors.length > 0 ? config.colors : [config.color]
            
            // Using color array for particle creation
            
            for (let i = 0; i < amount; i++) {
                const particleColor = cols[Math.floor(Math.random() * cols.length)]
                
                let vx = 0, vy = 0
                const speed = config.move.speed * 0.05 // Slower for preview
                
                switch (config.move.direction) {
                    case "top": vy = -speed; break
                    case "bottom": vy = speed; break
                    case "left": vx = -speed; break
                    case "right": vx = speed; break
                    case "random":
                    default:
                        vx = (Math.random() - 0.5) * speed
                        vy = (Math.random() - 0.5) * speed
                        break
                }

                const particleSize = config.size.type === "Range" 
                    ? Math.random() * (config.size.max - config.size.min) + config.size.min
                    : config.size.value

                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx, vy,
                    color: particleColor,
                    size: particleSize,
                    opacity: config.opacity.type === "Range"
                        ? Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min
                        : config.opacity.value,
                    twinklePhase: Math.random() * Math.PI * 2,
                    gravityVel: 0,
                    spinAngle: 0,
                    originalSize: particleSize
                })
            }
            
            // Particles created successfully
            particlesRef.current = particles
        }

        // Mouse event handlers
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                isHovering: true,
            }
        }

        const handleMouseLeave = () => {
            mouseRef.current.isHovering = false
        }

        // Add mouse listeners for live preview interactions
        canvas.addEventListener("mousemove", handleMouseMove)
        canvas.addEventListener("mouseleave", handleMouseLeave)

        function animate() {
            if (!canvas || !ctx) return

            // Clear canvas
            ctx.clearRect(0, 0, width, height)

            // Draw backdrop with proper Framer Color handling
            if (config.backdrop && config.backgroundOpacity > 0) {
                ctx.save()
                ctx.globalAlpha = config.backgroundOpacity
                
                // Handle Framer Color objects
                if (typeof config.backdrop === "object" && (config.backdrop as any).r !== undefined) {
                    const color = config.backdrop as any
                    ctx.fillStyle = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, 1)`
                } else {
                    ctx.fillStyle = config.backdrop as string
                }
                
                ctx.fillRect(0, 0, width, height)
                ctx.restore()
            }

            const particles = particlesRef.current

            particles.forEach((particle) => {
                // Reset size for bubble effect
                particle.size = particle.originalSize

                // Movement updates
                if (config.move.enable) {
                    // Gravity
                    if (config.move.gravity) {
                        particle.gravityVel += config.move.gravityAcceleration * 0.0005
                        particle.vy += particle.gravityVel
                    }

                    // Spin
                    if (config.move.spin) {
                        particle.spinAngle += config.move.spinSpeed * 0.01
                    }

                    // Update position
                    particle.x += particle.vx
                    particle.y += particle.vy

                    // Boundary handling
                    if (particle.x <= 0 || particle.x >= width) particle.vx *= -1
                    if (particle.y <= 0 || particle.y >= height) particle.vy *= -1
                    particle.x = Math.max(0, Math.min(width, particle.x))
                    particle.y = Math.max(0, Math.min(height, particle.y))
                }

                // Hover interactions
                if (config.hover.enable && mouseRef.current.isHovering) {
                    const dx = mouseRef.current.x - particle.x
                    const dy = mouseRef.current.y - particle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    switch (config.hover.mode) {
                        case "repulse":
                            if (distance < config.modes.repulse * 0.5) { // Scale for preview
                                const force = (config.modes.repulse * 0.5 - distance) / (config.modes.repulse * 0.5) * config.modes.repulseDistance * 2
                                particle.x -= (dx / distance) * force
                                particle.y -= (dy / distance) * force
                            }
                            break
                        case "grab":
                            if (distance < config.modes.grab * 0.5) {
                                const force = (config.modes.grab * 0.5 - distance) / (config.modes.grab * 0.5) * config.hover.force * 0.02
                                particle.x += (dx / distance) * force
                                particle.y += (dy / distance) * force
                            }
                            break
                        case "bubble":
                            if (distance < config.modes.bubble * 0.3) {
                                const scale = 1 + (config.modes.bubble * 0.3 - distance) / (config.modes.bubble * 0.3)
                                particle.size = particle.originalSize * scale
                            }
                            break
                        case "attract":
                            if (distance < config.move.attractDistance * 0.5) {
                                const force = config.hover.force * 0.01
                                particle.x += (dx / distance) * force
                                particle.y += (dy / distance) * force
                            }
                            break
                    }
                }

                // Calculate current opacity with twinkle
                let currentOpacity = particle.opacity
                if (config.twinkle.enable) {
                    particle.twinklePhase += config.twinkle.speed * 0.05
                    const twinkleMultiplier = (Math.sin(particle.twinklePhase) + 1) / 2
                    currentOpacity = config.twinkle.minOpacity + (config.twinkle.maxOpacity - config.twinkle.minOpacity) * twinkleMultiplier
                }

                // Draw particle with glow effect if enabled
                ctx.save()
                
                // Add glow effect if enabled
                if (config.glow.enable) {
                    ctx.globalCompositeOperation = "source-over"
                    ctx.shadowBlur = config.glow.size * particle.size
                    ctx.shadowColor = particle.color
                    ctx.globalAlpha = config.glow.intensity
                    ctx.beginPath()
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                    ctx.fillStyle = particle.color
                    ctx.fill()
                }
                
                // Main particle
                ctx.globalCompositeOperation = "source-over"
                ctx.shadowBlur = 0
                ctx.globalAlpha = currentOpacity
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                
                // Color with opacity - simple hex parsing
                if (particle.color.includes('#')) {
                    const r = parseInt(particle.color.slice(1, 3), 16)
                    const g = parseInt(particle.color.slice(3, 5), 16)
                    const b = parseInt(particle.color.slice(5, 7), 16)
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`
                } else {
                    ctx.fillStyle = particle.color
                }
                
                ctx.fill()
                ctx.restore()
            })

            // Draw connections
            if (config.modes.connectRadius > 0) {
                particles.forEach((particle, i) => {
                    particles.slice(i + 1).forEach(otherParticle => {
                        const dx = particle.x - otherParticle.x
                        const dy = particle.y - otherParticle.y
                        const distance = Math.sqrt(dx * dx + dy * dy)
                        
                        if (distance < config.modes.connectRadius * 0.5) { // Scale for preview
                            ctx.save()
                            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / (config.modes.connectRadius * 0.5))})`
                            ctx.lineWidth = 1
                            ctx.beginPath()
                            ctx.moveTo(particle.x, particle.y)
                            ctx.lineTo(otherParticle.x, otherParticle.y)
                            ctx.stroke()
                            ctx.restore()
                        }
                    })
                })
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        createParticles()
        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            window.removeEventListener('resize', handleResize)
            canvas.removeEventListener("mousemove", handleMouseMove)
            canvas.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [config])

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100%',
                height: '200px',
                border: 'none',
                borderRadius: '6px',
                background: 'transparent'
            }}
        />
    )
} 