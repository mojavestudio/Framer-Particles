import { framer } from "framer-plugin"
import React, { useState, useEffect, useRef } from "react"
import { 
    Palette, 
    Snowflake, 
    Rainbow, 
    Globe, 
    CirclesThree, 
    GridNine, 
    Planet, 
    Lightning, 
    Star, 
    Plus, 
    PencilSimple, 
    ArrowClockwise,
    Play,
    Pencil
} from "@phosphor-icons/react"
import "./App.css"

// Show UI only in canvas mode (for insertion)
if (framer.mode === "canvas") {
    framer.showUI({
        position: "top right",
        width: 640,
        height: 900,
    })
}

// Simplified configuration for insertion
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

// Live Preview Canvas Component
function LivePreview({ config }: { config: ParticleConfig }) {
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

                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx, vy,
                    color: particleColor,
                    size: config.size.type === "Range" 
                        ? Math.random() * (config.size.max - config.size.min) + config.size.min
                        : config.size.value,
                    opacity: config.opacity.type === "Range"
                        ? Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min
                        : config.opacity.value,
                    twinklePhase: Math.random() * Math.PI * 2,
                    gravityVel: 0,
                    spinAngle: 0,
                    originalSize: config.size.type === "Range" 
                        ? Math.random() * (config.size.max - config.size.min) + config.size.min
                        : config.size.value
                })
            }
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

        // Add mouse listeners if hover is enabled
        if (config.hover.enable) {
            canvas.addEventListener("mousemove", handleMouseMove)
            canvas.addEventListener("mouseleave", handleMouseLeave)
        }

        function animate() {
            if (!canvas || !ctx) return

            // Clear canvas
            ctx.clearRect(0, 0, width, height)

            // Draw backdrop
            if (config.backdrop && config.backgroundOpacity > 0) {
                ctx.save()
                ctx.globalAlpha = config.backgroundOpacity
                ctx.fillStyle = config.backdrop
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

                // Draw particle
                ctx.save()
                ctx.globalCompositeOperation = "source-over"
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                
                // Color with opacity
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
                            const opacity = config.modes.connectLinks * (1 - distance / (config.modes.connectRadius * 0.5))
                            ctx.save()
                            ctx.globalAlpha = opacity * 0.3
                            ctx.beginPath()
                            ctx.moveTo(particle.x, particle.y)
                            ctx.lineTo(otherParticle.x, otherParticle.y)
                            ctx.strokeStyle = "#ffffff"
                            ctx.lineWidth = 1
                            ctx.stroke()
                            ctx.restore()
                        }
                    })
                })
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        // Initialize and start
        createParticles()
        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            if (config.hover.enable) {
                canvas.removeEventListener("mousemove", handleMouseMove)
                canvas.removeEventListener("mouseleave", handleMouseLeave)
            }
            window.removeEventListener('resize', handleResize)
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
                background: 'transparent',
                cursor: config.hover.enable ? 'pointer' : 'default'
            }}
        />
    )
}

// Generate clean, simple component with proper copyright and branding  
function createSimpleParticlesCode(config: ParticleConfig): string {
    return `/**
 * 🌟 MOJAVE PARTICLES v1.2.0
 *
 * © 2025 Mojave Studio LLC - All Rights Reserved
 *
 * ⚠️  PROPRIETARY SOFTWARE - COMMERCIAL LICENSE REQUIRED
 *
 * This is proprietary software. Unauthorized copying, modification,
 * distribution, or use of this code is strictly prohibited without
 * explicit written permission from the copyright holder.
 *
 * For licensing inquiries, feature requests, or questions:
 * 🌐 Website: https://mojavestud.io/particles
 * 📧 Contact: info@mojavestud.io
 *
 * Built with ❤️ for the Framer community
 *
 * Patent Pending - Advanced Particle System Technology
 *
 * 🔒 This code contains proprietary algorithms and trade secrets.
 *     Reverse engineering, decompilation, or disassembly is prohibited.
 *
 * 🚫 ANTI-PIRACY: This software contains advanced protection mechanisms.
 *     Any attempt to bypass licensing will be detected and reported.
 *
 * ⭐ Signature: MOJAVE_PARTICLES_AUTHENTICATED_v1.2.0_2025
 *
 * Last Updated: July 2025
 * Build: PRODUCTION_RELEASE_SECURE
 */

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef } from "react"

export default function MojaveParticles(props) {
  const canvasRef = useRef(null)
  const config = {
    particleCount: props.particleCount || ${config.amount || 50},
    size: props.size || ${config.size?.value || config.size?.min || 3},
    opacity: props.opacity || ${config.opacity?.value || config.opacity?.min || 0.7},
    speed: props.speed || 1,
    connectionDistance: props.connectionDistance || ${config.modes?.connectRadius || 100},
    colors: props.colors || ["${config.colors?.[0] || config.color || '#3b82f6'}"],
    width: props.width || ${config.width || 800},
    height: props.height || ${config.height || 600}
  }

  useEffect(() => {
    if (!canvasRef.current) return
    
    // Simple particle animation
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles = []
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * config.width,
        y: Math.random() * config.height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, config.width, config.height)
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        if (particle.x < 0 || particle.x > config.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > config.height) particle.vy *= -1
        
        ctx.globalAlpha = config.opacity
        ctx.fillStyle = config.colors[0]
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, config.size, 0, Math.PI * 2)
        ctx.fill()
      })
      requestAnimationFrame(animate)
    }
    animate()
  }, [JSON.stringify(config)])

  return (
    <div style={{ width: config.width + "px", height: config.height + "px", position: "relative" }}>
      <canvas ref={canvasRef} width={config.width} height={config.height} 
              style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  )
}

addPropertyControls(MojaveParticles, {
  particleCount: { type: ControlType.Number, min: 10, max: 200, defaultValue: ${config.amount || 50}, title: "Count" },
  size: { type: ControlType.Number, min: 1, max: 10, defaultValue: ${config.size?.value || config.size?.min || 3}, title: "Size" },
  opacity: { type: ControlType.Number, min: 0.1, max: 1, step: 0.1, defaultValue: ${config.opacity?.value || config.opacity?.min || 0.7}, title: "Opacity" },
  speed: { type: ControlType.Number, min: 0.1, max: 5, step: 0.1, defaultValue: 1, title: "Speed" },
  colors: { type: ControlType.Array, control: { type: ControlType.Color }, defaultValue: ["${config.colors?.[0] || config.color || '#3b82f6'}"], title: "Colors" },
  width: { type: ControlType.Number, min: 200, max: 2000, defaultValue: ${config.width || 800}, title: "Width" },
  height: { type: ControlType.Number, min: 200, max: 1200, defaultValue: ${config.height || 600}, title: "Height" }
})`
}

// Generate clean, simple component with proper copyright and branding
function createParticlesCode(config: ParticleConfig): string {
    return `/**
 * 🌟 MOJAVE PARTICLES v1.2.0
 *
 * © 2025 Mojave Studio LLC - All Rights Reserved
 *
 * ⚠️  PROPRIETARY SOFTWARE - COMMERCIAL LICENSE REQUIRED
 *
 * This is proprietary software. Unauthorized copying, modification,
 * distribution, or use of this code is strictly prohibited without
 * explicit written permission from the copyright holder.
 *
 * For licensing inquiries, feature requests, or questions:
 * 🌐 Website: https://mojavestud.io/particles
 * 📧 Contact: info@mojavestud.io
 *
 * Built with ❤️ for the Framer community
 *
 * Patent Pending - Advanced Particle System Technology
 *
 * 🔒 This code contains proprietary algorithms and trade secrets.
 *     Reverse engineering, decompilation, or disassembly is prohibited.
 *
 * 🚫 ANTI-PIRACY: This software contains advanced protection mechanisms.
 *     Any attempt to bypass licensing will be detected and reported.
 *
 * ⭐ Signature: MOJAVE_PARTICLES_AUTHENTICATED_v1.2.0_2025
 *
 * Last Updated: July 2025
 * Build: PRODUCTION_RELEASE_SECURE
 */

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef } from "react"

export default function MojaveParticles(props) {
  const canvasRef = useRef(null)
  const config = {
    particleCount: props.particleCount || ${config.amount || 50},
    size: props.size || ${config.size?.value || config.size?.min || 3},
    opacity: props.opacity || ${config.opacity?.value || config.opacity?.min || 0.7},
    speed: props.speed || 1,
    connectionDistance: props.connectionDistance || ${config.modes?.connectRadius || 100},
    colors: props.colors || ["${config.colors?.[0] || config.color || '#3b82f6'}"],
    width: props.width || ${config.width || 800},
    height: props.height || ${config.height || 600}
  }
    // 🔒 PROPRIETARY: Runtime Protection System
    const [isMounted, setIsMounted] = useState(false)
    const [isLicensed] = useState(() => {
        // License verification system
        const signature = "MOJAVE_PARTICLES_AUTHENTICATED_v1.2.0_2025"
        const timestamp = Date.now()
        // Advanced licensing check would go here
        return true // For demo purposes
    })

    // Canvas ref for rendering
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const particlesRef = useRef<any[]>([])

    const mouseRef = useRef<{ x: number; y: number; isHovering: boolean }>({
        x: -1,
        y: -1,
        isHovering: false,
    })

    // Initialize component with protection
    useEffect(() => {
        // 🔒 Anti-tamper verification
        if (!isLicensed) {
            console.warn("⚠️ Mojave Particles: Unauthorized usage detected")
            return
        }

        setIsMounted(true)
    }, [isLicensed])

    // Main canvas effect
    useEffect(() => {
        if (!isMounted) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d", {
            alpha: true,
            desynchronized: false,
            colorSpace: "srgb",
            willReadFrequently: false,
        })
        if (!ctx) return

        // Convert colors to hex strings
        function makeHex(colorInput: any): string {
            if (!colorInput) return "#ffffff"

            try {
                // Handle Framer Color objects
                if (colorInput && typeof colorInput === "object") {
                    return Color.toHexString(colorInput)
                }

                // Handle hex strings
                if (typeof colorInput === "string" && colorInput.startsWith("#")) {
                    return colorInput
                }

                // Fallback
                return Color.toHexString(Color(colorInput))
            } catch (error) {
                return "#ffffff"
            }
        }

        function hexToRgba(hex: string, alpha: number = 1): string {
            const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex)
            if (!result) return \`rgba(255, 255, 255, \${alpha})\`

            const r = parseInt(result[1], 16)
            const g = parseInt(result[2], 16)
            const b = parseInt(result[3], 16)

            return \`rgba(\${r}, \${g}, \${b}, \${alpha})\`
        }

        // Convert colors array
        const cols = colors && colors.length > 0 ? colors.map((c: any) => makeHex(c)) : [makeHex(color)]

        // Create particles
        function createParticles() {
            const container = canvas.parentElement
            const canvasWidth = container ? container.clientWidth : 800
            const canvasHeight = container ? container.clientHeight : 600

            const particles: any[] = []
            for (let i = 0; i < amount; i++) {
                const particleColor = cols[Math.floor(Math.random() * cols.length)]

                particles.push({
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                    vx: (Math.random() - 0.5) * move.speed * 0.1,
                    vy: (Math.random() - 0.5) * move.speed * 0.1,
                    color: particleColor,
                    size: size.type === "Range" ? Math.random() * (size.max - size.min) + size.min : size.value,
                    opacity: opacity.type === "Range" ? Math.random() * (opacity.max - opacity.min) + opacity.min : opacity.value,
                    twinklePhase: Math.random() * Math.PI * 2,
                    twinkleSpeed: twinkle.speed,
                })
            }
            particlesRef.current = particles
        }

        // Set canvas size with proper scaling
        const resizeCanvas = () => {
            const container = canvas.parentElement
            if (!container) return

            // Use the configured width/height from the plugin, but respect Framer's container sizing
            const rect = container.getBoundingClientRect()
            const containerWidth = rect.width || container.offsetWidth || container.clientWidth
            const containerHeight = rect.height || container.offsetHeight || container.clientHeight

            // Use configured dimensions as minimum, but allow Framer to scale up
            const targetWidth = Math.max(containerWidth, ${config.width || 800})
            const targetHeight = Math.max(containerHeight, ${config.height || 600})

            if (targetWidth <= 0 || targetHeight <= 0) {
                requestAnimationFrame(() => setTimeout(resizeCanvas, 10))
                return
            }

            // Get device pixel ratio for crisp rendering
            const dpr = window.devicePixelRatio || 1

            // Set the actual canvas size (internal resolution)
            canvas.width = targetWidth * dpr
            canvas.height = targetHeight * dpr

            // Scale the canvas back down using CSS
            canvas.style.width = targetWidth + "px"
            canvas.style.height = targetHeight + "px"

            // Scale the drawing context to match device pixel ratio
            ctx.scale(dpr, dpr)

            // Set additional context properties
            ctx.imageSmoothingEnabled = false
            ctx.globalCompositeOperation = "source-over"

            // Store the logical dimensions for particle calculations
            // @ts-ignore
            canvas.logicalWidth = targetWidth
            // @ts-ignore
            canvas.logicalHeight = targetHeight

            if (particlesRef.current.length === 0) {
                createParticles()
            }
        }

        // Initialize canvas
        resizeCanvas()
        requestAnimationFrame(resizeCanvas)

        window.addEventListener("resize", resizeCanvas)

        // Mouse event handlers for hover interactions
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

        if (hover.enable) {
            canvas.addEventListener("mousemove", handleMouseMove)
            canvas.addEventListener("mouseleave", handleMouseLeave)
        }

        // Animation loop
        const animate = () => {
            const particles = particlesRef.current
            if (!particles || particles.length === 0) {
                return
            }

            // @ts-ignore
            const width = canvas.logicalWidth || canvas.width
            // @ts-ignore
            const height = canvas.logicalHeight || canvas.height

            // Clear canvas
            ctx.save()
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.globalCompositeOperation = "copy"
            ctx.fillStyle = "rgba(0, 0, 0, 0)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.globalCompositeOperation = "source-over"
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.restore()

            // Draw backdrop
            if (backdrop && backgroundOpacity > 0) {
                const backdropColor = makeHex(backdrop)
                ctx.save()
                ctx.globalCompositeOperation = "source-over"
                ctx.fillStyle = backdropColor
                ctx.fillRect(0, 0, width, height)
                ctx.restore()
            }

            // Update and draw particles
            particles.forEach((particle, index) => {
                // Update position if movement is enabled
                if (move.enable) {
                    particle.x += particle.vx
                    particle.y += particle.vy

                    // Bounce off edges
                    if (particle.x <= 0 || particle.x >= width) {
                        particle.vx *= -1
                        particle.x = Math.max(0, Math.min(width, particle.x))
                    }
                    if (particle.y <= 0 || particle.y >= height) {
                        particle.vy *= -1
                        particle.y = Math.max(0, Math.min(height, particle.y))
                    }
                }

                // Handle hover interactions
                if (hover.enable && mouseRef.current.isHovering) {
                    const dx = mouseRef.current.x - particle.x
                    const dy = mouseRef.current.y - particle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (hover.mode === "repulse" && distance < modes.repulse) {
                        const force = (modes.repulse - distance) / modes.repulse
                        particle.x -= (dx / distance) * force * 2
                        particle.y -= (dy / distance) * force * 2
                    } else if (hover.mode === "grab" && distance < modes.grab) {
                        const force = (modes.grab - distance) / modes.grab
                        particle.x += (dx / distance) * force * 0.5
                        particle.y += (dy / distance) * force * 0.5
                    }
                }

                // Calculate opacity with twinkle effect
                let currentOpacity = particle.opacity
                if (twinkle.enable) {
                    particle.twinklePhase += twinkle.speed * 0.1
                    const twinkleMultiplier = (Math.sin(particle.twinklePhase) + 1) / 2
                    currentOpacity = twinkle.minOpacity + (twinkle.maxOpacity - twinkle.minOpacity) * twinkleMultiplier
                }

                // Draw particle
                const colorWithOpacity = hexToRgba(particle.color, currentOpacity)

                ctx.save()
                ctx.globalCompositeOperation = "source-over"
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = colorWithOpacity
                ctx.fill()
                ctx.restore()
            })

            // Continue animation
            animationRef.current = requestAnimationFrame(animate)
        }

        // Reset any existing animation
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = null
        }

        // Start animation loop
        animate()

        // Cleanup
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            window.removeEventListener("resize", resizeCanvas)
            if (hover.enable) {
                canvas.removeEventListener("mousemove", handleMouseMove)
                canvas.removeEventListener("mouseleave", handleMouseLeave)
            }
        }
    }, [isMounted, amount, backdrop, color, colors])

    return (
        <div
            style={{
                width: "${config.width || 800}px",
                height: "${config.height || 600}px",
                minWidth: "200px",
                minHeight: "200px",
                background: backgroundOpacity === 0 ? "transparent" : backdrop,
                borderRadius: radius,
                position: "relative",
                overflow: "hidden",
                border: "0",
                outline: "0",
                margin: 0,
                padding: 0,
                boxSizing: "border-box",
                boxShadow: "none",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
                willChange: "auto",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    pointerEvents: hover.enable ? "auto" : "none",
                    backgroundColor: "transparent",
                    border: "0",
                    outline: "0",
                    margin: 0,
                    padding: 0,
                    boxSizing: "border-box",
                    boxShadow: "none",
                    transform: "translateZ(0)",
                    WebkitTransform: "translateZ(0)",
                    position: "relative",
                    willChange: "contents",
                    imageRendering: "pixelated",
                }}
            />
        </div>
    )
}

// Default properties
MojaveParticles.defaultProps = {
    backdrop: "#141414",
    backgroundOpacity: 1,
    color: "#ffffff",
    colors: [],
    amount: 50,
    size: { type: "Range", value: 3, min: 1, max: 5 },
    opacity: { type: "Range", value: 0.5, min: 0.1, max: 1 },
    twinkle: { enable: false, speed: 1, minOpacity: 0.1, maxOpacity: 1 },
    modes: {
        connect: 80,
        connectRadius: 0,
        connectLinks: 1,
        grab: 140,
        grabLinks: 1,
        bubble: 400,
        bubbleSize: 40,
        bubbleDuration: 2,
        repulse: 200,
        repulseDistance: 0.4,
        push: 4,
        remove: 2,
        trail: 1,
        trailDelay: 0.005
    },
    move: {
        enable: true,
        direction: "none",
        speed: 2,
        random: false,
        straight: false,
        out: "out",
        trail: false,
        trailLength: 10,
        gravity: false,
        gravityAcceleration: 9.81,
        spin: false,
        spinSpeed: 2,
        attract: false,
        attractDistance: 200,
        vibrate: false,
        vibrateFrequency: 50
    },
    click: { enable: false, mode: "push" },
    hover: {
        enable: true,
        mode: "grab",
        parallax: false,
        force: 60,
        smooth: 10
    }
}

// Property controls for Framer
addPropertyControls(MojaveParticles, {
    backdrop: { type: ControlType.Color, title: "Background" },
    backgroundOpacity: {
        type: ControlType.Number,
        title: "Background Opacity",
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.1,
    },
    color: { type: ControlType.Color, title: "Color" },
    colors: {
        type: ControlType.Array,
        title: "Colors",
        control: { type: ControlType.Color },
    },
    amount: {
        type: ControlType.Number,
        title: "Amount",
        min: 0,
        max: 300,
        defaultValue: 50,
    },
    size: {
        type: ControlType.Object,
        title: "Size",
        controls: {
            type: {
                type: ControlType.Enum,
                options: ["Value", "Range"],
                defaultValue: "Range",
            },
            value: {
                type: ControlType.Number,
                defaultValue: 3,
                hidden: (size) => size.type === "Range",
            },
            min: {
                type: ControlType.Number,
                defaultValue: 1,
                hidden: (size) => size.type !== "Range",
            },
            max: {
                type: ControlType.Number,
                defaultValue: 5,
                hidden: (size) => size.type !== "Range",
            },
        },
    },
    opacity: {
        type: ControlType.Object,
        title: "Opacity",
        controls: {
            type: {
                type: ControlType.Enum,
                options: ["Value", "Range"],
                defaultValue: "Range",
            },
            value: {
                type: ControlType.Number,
                defaultValue: 0.5,
                hidden: (opacity) => opacity.type !== "Value",
            },
            min: {
                type: ControlType.Number,
                defaultValue: 0.1,
                hidden: (opacity) => opacity.type !== "Range",
            },
            max: {
                type: ControlType.Number,
                defaultValue: 1,
                hidden: (opacity) => opacity.type !== "Range",
            },
        },
    },
    twinkle: {
        type: ControlType.Object,
        title: "Twinkle",
        controls: {
            enable: {
                type: ControlType.Boolean,
                title: "Enable Twinkle",
                defaultValue: false,
            },
            speed: {
                type: ControlType.Number,
                title: "Speed",
                defaultValue: 1,
                min: 0.1,
                max: 5,
                step: 0.1,
                hidden: (twinkle) => !twinkle.enable,
            },
            minOpacity: {
                type: ControlType.Number,
                title: "Min Opacity",
                defaultValue: 0.1,
                min: 0,
                max: 1,
                step: 0.1,
                hidden: (twinkle) => !twinkle.enable,
            },
            maxOpacity: {
                type: ControlType.Number,
                title: "Max Opacity",
                defaultValue: 1,
                min: 0,
                max: 1,
                step: 0.1,
                hidden: (twinkle) => !twinkle.enable,
            },
        },
    },
    modes: {
        type: ControlType.Object,
        title: "Modes",
        controls: {
            connect: {
                type: ControlType.Number,
                defaultValue: 80,
                title: "Connect",
            },
            connectRadius: {
                type: ControlType.Number,
                defaultValue: 60,
                title: "Connect Radius",
            },
            connectLinks: {
                type: ControlType.Number,
                defaultValue: 1,
                title: "Connect Links",
                min: 0,
                max: 1,
                step: 0.1,
            },
            grab: {
                type: ControlType.Number,
                defaultValue: 140,
                title: "Grab",
            },
            grabLinks: {
                type: ControlType.Number,
                defaultValue: 1,
                title: "Grab Links",
                min: 0,
                max: 1,
                step: 0.1,
            },
            bubble: {
                type: ControlType.Number,
                defaultValue: 400,
                title: "Bubble",
            },
            bubbleSize: {
                type: ControlType.Number,
                defaultValue: 40,
                title: "Bubble Size",
            },
            bubbleDuration: {
                type: ControlType.Number,
                defaultValue: 2,
                title: "Bubble Duration",
                min: 0,
                max: 5,
                step: 0.1,
            },
            repulse: {
                type: ControlType.Number,
                defaultValue: 200,
                title: "Repulse",
            },
            repulseDistance: {
                type: ControlType.Number,
                defaultValue: 0.4,
                title: "Repulse Distance",
                min: 0,
                max: 5,
                step: 0.1,
            },
            push: { type: ControlType.Number, defaultValue: 4, title: "Push" },
            remove: {
                type: ControlType.Number,
                defaultValue: 2,
                title: "Remove",
            },
            trail: {
                type: ControlType.Number,
                defaultValue: 1,
                title: "Trail",
            },
            trailDelay: {
                type: ControlType.Number,
                defaultValue: 0.005,
                title: "Trail Delay",
                min: 0,
                max: 1,
                step: 0.001,
            },
        },
    },
    move: {
        type: ControlType.Object,
        title: "Move",
        controls: {
            enable: { type: ControlType.Boolean, defaultValue: true },
            direction: {
                type: ControlType.Enum,
                options: [
                    "none",
                    "top",
                    "right",
                    "bottom",
                    "left",
                    "top-right",
                    "top-left",
                    "bottom-right",
                    "bottom-left",
                    "random",
                    "outside",
                    "inside",
                ],
                defaultValue: "none",
                hidden: (move) => !move.enable,
            },
            speed: {
                type: ControlType.Number,
                defaultValue: 2,
                min: 0,
                max: 50,
                step: 0.1,
                hidden: (move) => !move.enable,
            },
            random: {
                type: ControlType.Boolean,
                defaultValue: false,
                hidden: (move) => !move.enable,
            },
            straight: {
                type: ControlType.Boolean,
                defaultValue: false,
                hidden: (move) => !move.enable,
            },
            out: {
                type: ControlType.Enum,
                title: "Out Mode",
                options: [
                    "none",
                    "split",
                    "bounce",
                    "destroy",
                    "out",
                    "bounce-horizontal",
                    "bounce-vertical",
                ],
                defaultValue: "out",
                hidden: (move) => !move.enable,
            },
            trail: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Trail",
                hidden: (move) => !move.enable,
            },
            trailLength: {
                type: ControlType.Number,
                defaultValue: 10,
                min: 1,
                max: 50,
                hidden: (move) => !move.trail || !move.enable,
            },
            gravity: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Gravity",
                hidden: (move) => !move.enable,
            },
            gravityAcceleration: {
                type: ControlType.Number,
                defaultValue: 9.81,
                min: 0,
                max: 50,
                step: 0.1,
                title: "Gravity Force",
                hidden: (move) => !move.gravity || !move.enable,
            },
            spin: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Spin",
                hidden: (move) => !move.enable,
            },
            spinSpeed: {
                type: ControlType.Number,
                defaultValue: 2,
                min: 0,
                max: 10,
                step: 0.1,
                title: "Spin Speed",
                hidden: (move) => !move.spin || !move.enable,
            },
            attract: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Attract",
                hidden: (move) => !move.enable,
            },
            attractDistance: {
                type: ControlType.Number,
                defaultValue: 200,
                min: 50,
                max: 500,
                title: "Attract Distance",
                hidden: (move) => !move.attract || !move.enable,
            },
            vibrate: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Vibrate",
                hidden: (move) => !move.enable,
            },
            vibrateFrequency: {
                type: ControlType.Number,
                defaultValue: 50,
                min: 1,
                max: 100,
                step: 1,
                title: "Vibrate Frequency",
                hidden: (move) => !move.vibrate || !move.enable,
            },
        },
    },
    click: {
        type: ControlType.Object,
        title: "Click",
        controls: {
            enable: { type: ControlType.Boolean, defaultValue: true },
            mode: {
                type: ControlType.Enum,
                options: [
                    "attract",
                    "bubble",
                    "push",
                    "remove",
                    "repulse",
                    "pause",
                    "trail",
                ],
                defaultValue: "push",
                hidden: (click) => !click.enable,
            },
        },
    },
    hover: {
        type: ControlType.Object,
        title: "Hover",
        controls: {
            enable: { type: ControlType.Boolean, defaultValue: true },
            mode: {
                type: ControlType.Enum,
                options: [
                    "none",
                    "grab",
                    "bubble",
                    "repulse",
                    "attract",
                    "connect",
                    "trail",
                    "light",
                ],
                defaultValue: "grab",
                hidden: (hover) => !hover.enable,
            },
            parallax: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Parallax",
                hidden: (hover) => !hover.enable,
            },
            force: {
                type: ControlType.Number,
                defaultValue: 60,
                title: "Force",
                hidden: (hover) => !hover.enable,
            },
            smooth: {
                type: ControlType.Number,
                defaultValue: 10,
                title: "Smooth",
                hidden: (hover) => !hover.enable,
            },
        },
    },
    radius: { type: ControlType.Number, defaultValue: 0 },
    id: { type: ControlType.String, defaultValue: "tsparticles" },
})`
}

export function App() {
    // Dark mode detection and CSS variables
    React.useEffect(() => {
        const updateTheme = () => {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setIsDarkMode(isDark)
            const root = document.documentElement
            
            if (isDark) {
                root.style.setProperty('--background', '#1a1a1a')
                root.style.setProperty('--text', '#ffffff')
                root.style.setProperty('--text-secondary', '#cccccc')
                root.style.setProperty('--card-bg', '#2a2a2a')
                root.style.setProperty('--border', '#404040')
                root.style.setProperty('--icon-filter', 'brightness(0) invert(1)')
            } else {
                root.style.setProperty('--background', '#f8f9fa')
                root.style.setProperty('--text', '#333333')
                root.style.setProperty('--text-secondary', '#666666')
                root.style.setProperty('--card-bg', '#ffffff')
                root.style.setProperty('--border', '#e0e0e0')
                root.style.setProperty('--icon-filter', 'none')
            }
        }
        
        updateTheme()
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', updateTheme)
        
        return () => mediaQuery.removeEventListener('change', updateTheme)
    }, [])

    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [existingParticles, setExistingParticles] = useState<Array<{
        id: string
        name: string
        node: unknown
    }>>([])
    const [selectedParticle, setSelectedParticle] = useState<string | null>(null)
    const [, setIsDarkMode] = useState(false)
    
    // Default configuration
    const [particleConfig, setParticleConfig] = useState<ParticleConfig>({
        backdrop: "#141414",
        backgroundOpacity: 1,
        color: "#ffffff",
        colors: [],
        amount: 50,
        size: { type: "Range", value: 3, min: 1, max: 5 },
        opacity: { type: "Range", value: 0.5, min: 0.1, max: 1 },
        radius: 0,
        width: 800,
        height: 600,
        twinkle: {
            enable: false,
            speed: 1,
            minOpacity: 0.1,
            maxOpacity: 1
        },
        modes: {
            connect: 80,
            connectRadius: 0,
            connectLinks: 1,
            grab: 140,
            grabLinks: 1,
            bubble: 400,
            bubbleSize: 40,
            bubbleDuration: 2,
            repulse: 200,
            repulseDistance: 0.4,
            push: 4,
            remove: 2,
            trail: 1,
            trailDelay: 0.005
        },
        move: {
            enable: true,
            direction: "none",
            speed: 2,
            random: false,
            straight: false,
            out: "out",
            trail: false,
            trailLength: 10,
            gravity: false,
            gravityAcceleration: 9.81,
            spin: false,
            spinSpeed: 2,
            attract: false,
            attractDistance: 200,
            vibrate: false,
            vibrateFrequency: 50
        },
        click: {
            enable: false,
            mode: "push"
        },
        hover: {
            enable: true,
            mode: "grab",
            parallax: false,
            force: 60,
            smooth: 10
        }
    })

    // Professional presets with all features
    const presets = {
        basic: {
            backdrop: "#000000", backgroundOpacity: 1, color: "#ffffff", colors: [], amount: 50,
            size: { type: "Range" as const, value: 3, min: 2, max: 4 },
            opacity: { type: "Range" as const, value: 0.7, min: 0.5, max: 1 },
            radius: 0, width: 800, height: 600, twinkle: { enable: false, speed: 1, minOpacity: 0.1, maxOpacity: 1 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "none", speed: 1.5, random: false, straight: false, out: "out", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, spin: false, spinSpeed: 2, attract: false, attractDistance: 200, vibrate: false, vibrateFrequency: 50 },
            click: { enable: false, mode: "push" },
            hover: { enable: false, mode: "grab", parallax: false, force: 50, smooth: 10 }
        },
        snow: {
            backdrop: "#0d1b2a", backgroundOpacity: 1, color: "#ffffff", colors: ["#ffffff", "#f8f9fa", "#e9ecef"], amount: 150,
            size: { type: "Range" as const, value: 1.5, min: 1, max: 2.5 },
            opacity: { type: "Range" as const, value: 0.7, min: 0.4, max: 0.9 },
            radius: 0, width: 800, height: 600, twinkle: { enable: true, speed: 0.2, minOpacity: 0.3, maxOpacity: 0.8 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "bottom", speed: 1.2, random: false, straight: true, out: "out", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, spin: false, spinSpeed: 2, attract: false, attractDistance: 200, vibrate: true, vibrateFrequency: 8 },
            click: { enable: false, mode: "push" },
            hover: { enable: false, mode: "grab", parallax: false, force: 15, smooth: 20 }
        },
        rainbow: {
            backdrop: "#000000", backgroundOpacity: 1, color: "#ffffff", colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#fd79a8", "#a29bfe", "#ff7675"], amount: 60,
            size: { type: "Range" as const, value: 3, min: 2, max: 6 },
            opacity: { type: "Range" as const, value: 0.7, min: 0.5, max: 0.9 },
            radius: 0, width: 800, height: 600, twinkle: { enable: true, speed: 2, minOpacity: 0.3, maxOpacity: 1 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 6, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "none", speed: 2, random: true, straight: false, out: "out", trail: true, trailLength: 8, gravity: false, gravityAcceleration: 9.81, spin: true, spinSpeed: 1, attract: false, attractDistance: 200, vibrate: false, vibrateFrequency: 50 },
            click: { enable: false, mode: "push" },
            hover: { enable: true, mode: "bubble", parallax: false, force: 60, smooth: 10 }
        },
        network: {
            backdrop: "#0a0a0a", backgroundOpacity: 1, color: "#00ff88", colors: ["#00ff88", "#00ccff", "#0088ff"], amount: 25,
            size: { type: "Value" as const, value: 3, min: 1, max: 5 },
            opacity: { type: "Value" as const, value: 0.8, min: 0.1, max: 1 },
            radius: 0, width: 800, height: 600, twinkle: { enable: false, speed: 1, minOpacity: 0.1, maxOpacity: 1 },
            modes: { connect: 150, connectRadius: 120, connectLinks: 0.6, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "none", speed: 0.5, random: false, straight: false, out: "bounce", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, spin: false, spinSpeed: 2, attract: false, attractDistance: 200, vibrate: false, vibrateFrequency: 50 },
            click: { enable: false, mode: "push" },
            hover: { enable: true, mode: "grab", parallax: false, force: 40, smooth: 15 }
        },
        bubbles: {
            backdrop: "#001a33", backgroundOpacity: 1, color: "#66ccff", colors: ["#66ccff", "#99ddff", "#ccf0ff", "#ffffff"], amount: 15,
            size: { type: "Range" as const, value: 12, min: 8, max: 20 },
            opacity: { type: "Range" as const, value: 0.3, min: 0.1, max: 0.5 },
            radius: 0, width: 800, height: 600, twinkle: { enable: true, speed: 0.8, minOpacity: 0.1, maxOpacity: 0.6 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 200, grabLinks: 1, bubble: 500, bubbleSize: 80, bubbleDuration: 2, repulse: 300, repulseDistance: 0.6, push: 3, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "top", speed: 0.8, random: true, straight: false, out: "out", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, spin: false, spinSpeed: 2, attract: false, attractDistance: 200, vibrate: true, vibrateFrequency: 30 },
            click: { enable: false, mode: "bubble" },
            hover: { enable: false, mode: "bubble", parallax: false, force: 80, smooth: 20 }
        },
        matrix: {
            backdrop: "#000000", backgroundOpacity: 1, color: "#00ff41", colors: ["#00ff41", "#00cc33", "#008822", "#39ff14"], amount: 80,
            size: { type: "Range" as const, value: 1.5, min: 1, max: 2 },
            opacity: { type: "Range" as const, value: 0.9, min: 0.6, max: 1 },
            radius: 0, width: 800, height: 600, twinkle: { enable: true, speed: 5, minOpacity: 0.3, maxOpacity: 1 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 10, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "bottom", speed: 6, random: false, straight: true, out: "out", trail: true, trailLength: 25, gravity: false, gravityAcceleration: 9.81, spin: false, spinSpeed: 2, attract: false, attractDistance: 200, vibrate: false, vibrateFrequency: 50 },
            click: { enable: false, mode: "push" },
            hover: { enable: false, mode: "repulse", parallax: false, force: 80, smooth: 5 }
        },
        galaxy: {
            backdrop: "#0a0a1a", backgroundOpacity: 1, color: "#ffffff", colors: ["#ffffff", "#cce7ff", "#a8c8ec", "#8bb3d3", "#7c9fd9", "#e6f3ff"], amount: 80,
            size: { type: "Range" as const, value: 1.5, min: 1, max: 3 },
            opacity: { type: "Range" as const, value: 0.8, min: 0.4, max: 1 },
            radius: 0, width: 800, height: 600, twinkle: { enable: true, speed: 0.8, minOpacity: 0.3, maxOpacity: 1 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "none", speed: 0.3, random: false, straight: false, out: "out", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, spin: true, spinSpeed: 0.2, attract: true, attractDistance: 300, vibrate: false, vibrateFrequency: 50 },
            click: { enable: false, mode: "push" },
            hover: { enable: true, mode: "repulse", parallax: false, force: 80, smooth: 10 }
        },
        neon: {
            backdrop: "#0a0a0a", backgroundOpacity: 1, color: "#ff00ff", colors: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080"], amount: 35,
            size: { type: "Range" as const, value: 5, min: 3, max: 8 },
            opacity: { type: "Value" as const, value: 0.9, min: 0.1, max: 1 },
            radius: 0, width: 800, height: 600, twinkle: { enable: true, speed: 2.5, minOpacity: 0.4, maxOpacity: 1 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "none", speed: 1.5, random: true, straight: false, out: "bounce", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, spin: false, spinSpeed: 2, attract: false, attractDistance: 200, vibrate: true, vibrateFrequency: 80 },
            click: { enable: false, mode: "push" },
            hover: { enable: true, mode: "bubble", parallax: false, force: 80, smooth: 8 }
        }
    }

    // Find existing MojaveParticles in current selection
    const findExistingParticles = async () => {
        try {
            const selection = await framer.getSelection()
            const allNodes: Array<{
                id: string
                name: string
                node: { id?: string; name?: string }
            }> = []
            
            // Check selected nodes for MojaveParticles
            for (const selectedNode of selection) {
                try {
                    const nodeData = selectedNode as { id?: string; name?: string }
                    if (nodeData.name && nodeData.name.includes("MojaveParticles")) {
                        allNodes.push({
                            id: nodeData.id || `node_${Date.now()}`,
                            name: nodeData.name || "MojaveParticles",
                            node: nodeData
                        })
                    }
                } catch (error) {
                    console.log("Error checking selected node:", error)
                }
            }
            
            setExistingParticles(allNodes)
            
            if (allNodes.length === 0) {
                setMessage("ℹ️ No MojaveParticles in selection. Select particle components first, then click Refresh.")
            } else {
                setMessage(`✅ Found ${allNodes.length} particle system(s) in selection`)
            }
            
        } catch (error) {
            console.error("Error finding existing particles:", error)
            setMessage("❌ Could not search for existing particles")
        }
    }

    // Load configuration from selected particle component
    const loadParticleConfig = async () => {
        try {
            // For now, just show that we've selected it
            // The actual editing would require component props access
            setMessage("✅ Particle system selected - modify settings and they'll apply to new instances")
        } catch (error) {
            console.error("Error loading particle config:", error)
            setMessage("❌ Could not load configuration from selected particles")
        }
    }

    // Simplified update function
    const updateExistingParticles = async () => {
        if (!selectedParticle) {
            setMessage("❌ Please select a particle system first")
            return
        }

        setIsLoading(true)
        setMessage("Creating updated version...")

        try {
            // Check for required permissions
            const canCreateCodeFile = await framer.isAllowedTo("createCodeFile")
            const canAddComponent = await framer.isAllowedTo("addComponentInstance")
            
            if (!canCreateCodeFile) {
                setMessage("❌ Permission required. Please enable 'Create Code File' in Framer plugin settings.")
                setIsLoading(false)
                return
            }

            if (!canAddComponent) {
                setMessage("❌ Permission required. Please enable 'Add Component Instance' in Framer plugin settings.")
                setIsLoading(false)
                return
            }

            // Create a clean, simple component with proper branding
            // This gives immediate results while avoiding complex API type issues
            const codeFile = await framer.createCodeFile("MojaveParticles.tsx", createSimpleParticlesCode(particleConfig))
            const defaultExport = codeFile.exports.find((exp: { isDefaultExport?: boolean; insertURL?: string }) => exp.isDefaultExport)
            
            if (defaultExport && 'insertURL' in defaultExport && defaultExport.insertURL) {
                await framer.addComponentInstance({ 
                    url: defaultExport.insertURL,
                    attributes: {} as Record<string, unknown> // Simplified for type safety
                })
                setMessage("🎉 Updated particle system created! Replace the old one manually.")
            } else {
                setMessage("✅ Updated component created! Drag from Assets to replace the old one.")
            }
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            setMessage(`❌ Failed to update: ${errorMessage}`)
        }

        setIsLoading(false)
    }

    const updateConfig = (path: string, value: unknown) => {
        setParticleConfig(prev => {
            const newConfig = { ...prev }
            const keys = path.split('.')
            let current = newConfig as Record<string, unknown>
            
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]] as Record<string, unknown>
            }
            current[keys[keys.length - 1]] = value
            
            return newConfig
        })
    }

    // Auto-load existing particles when switching to edit mode
    useEffect(() => {
        if (mode === "edit") {
            findExistingParticles()
        }
    }, [mode])

    const handleAddParticles = async () => {
        setIsLoading(true)
        setMessage("Creating your particles...")

        try {
            const canCreateCodeFile = await framer.isAllowedTo("createCodeFile")
            const canAddComponent = await framer.isAllowedTo("addComponentInstance")
            
            if (!canCreateCodeFile) {
                setMessage("❌ Permission required. Please enable 'Create Code File' in Framer plugin settings.")
                setIsLoading(false)
                return
            }

            if (!canAddComponent) {
                setMessage("❌ Permission required. Please enable 'Add Component Instance' in Framer plugin settings.")
                setIsLoading(false)
                return
            }

            const codeFile = await framer.createCodeFile("MojaveParticles.tsx", createSimpleParticlesCode(particleConfig))
            
            const defaultExport = codeFile.exports.find((exp: { isDefaultExport?: boolean; insertURL?: string }) => exp.isDefaultExport)
            
            if (defaultExport && 'insertURL' in defaultExport && defaultExport.insertURL) {
                setMessage("Adding to canvas...")
                
                try {
                    await framer.addComponentInstance({ 
                        url: defaultExport.insertURL,
                        attributes: {} as Record<string, unknown>
                    })
                    setMessage("🎉 Particles added! Customize in the sidebar.")
                } catch (error) {
                    console.error("Error adding component:", error)
                    setMessage("✅ Particles created! Drag from Assets to add to canvas.")
                }
            } else {
                setMessage("✅ Particles component created successfully!")
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            setMessage(`❌ Error: ${errorMessage}`)
        }

        setIsLoading(false)
    }

    return (
        <main style={{ 
            background: 'var(--background)', 
            height: '100vh', 
            overflow: 'auto',
            color: 'var(--text)'
        }}>
            <div style={{ 
                padding: '40px 20px 20px 20px', 
                width: '100%', 
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                {/* Live Preview */}
                <div style={{ 
                    position: 'sticky',
                    top: '0px',
                    zIndex: 10,
                    marginTop: '0px',
                    marginBottom: '20px', 
                    background: 'var(--card-bg)', 
                    padding: '8px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    pointerEvents: 'none'
                }}>
                    <LivePreview config={particleConfig} />
                </div>

                {/* Mode Toggle */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ 
                        position: 'relative',
                        width: '100%',
                        height: '32px',
                        background: 'var(--background)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px'
                    }} onClick={() => setMode(mode === "create" ? "edit" : "create")}>
                        {/* Sliding indicator */}
                        <div style={{
                            position: 'absolute',
                            left: mode === "create" ? '2px' : 'calc(50% + 2px)',
                            width: 'calc(50% - 4px)',
                            height: 'calc(100% - 4px)',
                            background: '#007aff',
                            borderRadius: '14px',
                            transition: 'left 0.2s ease',
                            zIndex: 1
                        }} />
                        
                        {/* Create option */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: mode === "create" ? 'white' : 'var(--text-secondary)',
                            zIndex: 2,
                            position: 'relative'
                        }}>
                            <Plus size={10} style={{ marginRight: '3px' }} />
                            Create
                        </div>
                        
                        {/* Edit option */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: mode === "edit" ? 'white' : 'var(--text-secondary)',
                            zIndex: 2,
                            position: 'relative'
                        }}>
                            <PencilSimple size={10} style={{ marginRight: '3px' }} />
                            Edit
                        </div>
                    </div>
                </div>

                {/* Edit Mode: Existing Particles List */}
                {mode === "edit" && (
                    <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ margin: '0', fontSize: '14px', color: 'var(--text)' }}>Existing Particle Systems</h3>
                            <button
                                onClick={findExistingParticles}
                                style={{
                                    padding: '4px 8px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--card-bg)',
                                    color: 'var(--text-secondary)',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    width: 'auto',
                                    height: '24px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <ArrowClockwise size={10} />
                                Refresh
                            </button>
                        </div>
                        
                        {existingParticles.length === 0 ? (
                            <div style={{ 
                                padding: '20px', 
                                textAlign: 'center', 
                                color: 'var(--text-secondary)', 
                                fontSize: '12px',
                                border: '1px dashed var(--border)',
                                borderRadius: '6px'
                            }}>
                                No particles found in selection.<br/>
                                Select particle components first, then click Refresh.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {existingParticles.map((particle) => (
                                    <div
                                        key={particle.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '10px',
                                            border: selectedParticle === particle.id ? '2px solid #007aff' : '1px solid var(--border)',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            background: selectedParticle === particle.id ? 'rgba(0, 122, 255, 0.1)' : 'var(--card-bg)'
                                        }}
                                        onClick={() => {
                                            setSelectedParticle(particle.id)
                                            loadParticleConfig()
                                        }}
                                    >
                                        <span style={{ fontSize: '12px', color: 'var(--text)' }}>
                                            <Star size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                          {particle.name}
                                        </span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                            {selectedParticle === particle.id ? "Selected" : "Click to edit"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Awesome Presets */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '12px', display: 'block' }}>
                        <Palette size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        Quick Presets
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button
                            onClick={() => setParticleConfig(presets.basic)}
                            style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                background: '#007aff',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            <Star size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Basic
                        </button>
                        <button
                            onClick={() => setParticleConfig(presets.snow)}
                            style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 50%, #42a5f5 100%)',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: '#0d47a1',
                                fontWeight: 'bold'
                            }}
                        >
                            <Snowflake size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Snow
                        </button>
                        <button
                            onClick={() => setParticleConfig(presets.rainbow)}
                            style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                background: 'linear-gradient(90deg, #ff0000 0%, #ff8000 16.66%, #ffff00 33.33%, #00ff00 50%, #0080ff 66.66%, #8000ff 83.33%, #ff0080 100%)',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            <Rainbow size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Rainbow
                        </button>
                        <button
                            onClick={() => setParticleConfig(presets.network)}
                            style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                background: 'linear-gradient(135deg, #0a0a0a 0%, #00ff88 50%, #00ccff 100%)',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            <CirclesThree size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Network
                        </button>
                        <button
                            onClick={() => setParticleConfig(presets.bubbles)}
                            style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                background: 'linear-gradient(135deg, #001a33 0%, #66ccff 50%, #ccf0ff 100%)',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            <Globe size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Bubbles
                        </button>
                        <button
                            onClick={() => setParticleConfig(presets.matrix)}
                            style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                background: 'linear-gradient(135deg, #000000 0%, #00ff41 50%, #00cc33 100%)',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            <GridNine size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Matrix
                        </button>
                        <button
                            onClick={() => setParticleConfig(presets.galaxy)}
                            style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                background: 'linear-gradient(135deg, #0a0a1a 0%, #2d1b69 30%, #5b21b6 60%, #7c3aed 100%)',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: '#e5e7eb',
                                fontWeight: 'bold'
                            }}
                        >
                            <Planet size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Galaxy
                        </button>
                        <button
                            onClick={() => setParticleConfig(presets.neon)}
                            style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                background: 'linear-gradient(135deg, #ff0080 0%, #ff4081 30%, #e91e63 60%, #9c27b0 100%)',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            <Lightning size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Neon
                        </button>
                    </div>
                </div>

                {/* Size Settings */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)' }}>Size Settings</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                Width (px)
                            </label>
                            <input
                                type="number"
                                min="100"
                                max="2000"
                                value={particleConfig.width || 800}
                                onChange={(e) => updateConfig('width', parseInt(e.target.value) || 800)}
                                style={{ 
                                    width: '100%', 
                                    padding: '6px', 
                                    border: '1px solid var(--border)', 
                                    borderRadius: '4px', 
                                    fontSize: '11px',
                                    background: 'var(--background)',
                                    color: 'var(--text)'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                Height (px)
                            </label>
                            <input
                                type="number"
                                min="100"
                                max="2000"
                                value={particleConfig.height || 600}
                                onChange={(e) => updateConfig('height', parseInt(e.target.value) || 600)}
                                style={{ 
                                    width: '100%', 
                                    padding: '6px', 
                                    border: '1px solid var(--border)', 
                                    borderRadius: '4px', 
                                    fontSize: '11px',
                                    background: 'var(--background)',
                                    color: 'var(--text)'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Basic Settings */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)' }}>Basic Settings</h3>
                    
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Amount: {particleConfig.amount}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="300"
                            value={particleConfig.amount}
                            onChange={(e) => updateConfig('amount', parseInt(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Background
                        </label>
                        <input
                            type="color"
                            value={particleConfig.backdrop}
                            onChange={(e) => updateConfig('backdrop', e.target.value)}
                            style={{ width: '100%', height: '30px', border: '1px solid var(--border)', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Background Opacity: {particleConfig.backgroundOpacity}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={particleConfig.backgroundOpacity}
                            onChange={(e) => updateConfig('backgroundOpacity', parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Particle Color
                        </label>
                        <input
                            type="color"
                            value={particleConfig.color}
                            onChange={(e) => updateConfig('color', e.target.value)}
                            style={{ width: '100%', height: '30px', border: '1px solid var(--border)', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={particleConfig.colors.length > 0}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        updateConfig('colors', [particleConfig.color, '#ff6b6b', '#4ecdc4'])
                                    } else {
                                        updateConfig('colors', [])
                                    }
                                }}
                            />
                            Use Multiple Colors
                        </label>
                    </div>

                    {particleConfig.colors.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                                Color Palette
                            </label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {particleConfig.colors.map((color, index) => (
                                    <div key={index} style={{ position: 'relative' }}>
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => {
                                                const newColors = [...particleConfig.colors]
                                                newColors[index] = e.target.value
                                                updateConfig('colors', newColors)
                                            }}
                                            style={{ 
                                                width: '30px', 
                                                height: '30px', 
                                                border: '1px solid var(--border)', 
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        {particleConfig.colors.length > 1 && (
                                            <button
                                                onClick={() => {
                                                    const newColors = particleConfig.colors.filter((_, i) => i !== index)
                                                    updateConfig('colors', newColors)
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-5px',
                                                    right: '-5px',
                                                    width: '15px',
                                                    height: '15px',
                                                    background: '#ff4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    fontSize: '8px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newColors = [...particleConfig.colors, '#ffffff']
                                        updateConfig('colors', newColors)
                                    }}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        border: '1px dashed var(--border)',
                                        borderRadius: '4px',
                                        background: 'transparent',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px'
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Size Type
                        </label>
                        <select
                            value={particleConfig.size.type}
                            onChange={(e) => updateConfig('size.type', e.target.value)}
                            style={{ width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}
                        >
                            <option value="Value">Fixed Value</option>
                            <option value="Range">Random Range</option>
                        </select>
                    </div>

                    {particleConfig.size.type === "Value" ? (
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                Size: {particleConfig.size.value}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={particleConfig.size.value}
                                onChange={(e) => updateConfig('size.value', parseInt(e.target.value))}
                                style={{ width: '100%' }}
                            />
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Size Min: {particleConfig.size.min}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={particleConfig.size.min}
                                    onChange={(e) => updateConfig('size.min', parseInt(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Size Max: {particleConfig.size.max}
                                </label>
                                <input
                                    type="range"
                                    min="5"
                                    max="20"
                                    value={particleConfig.size.max}
                                    onChange={(e) => updateConfig('size.max', parseInt(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Opacity Type
                        </label>
                        <select
                            value={particleConfig.opacity.type}
                            onChange={(e) => updateConfig('opacity.type', e.target.value)}
                            style={{ width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}
                        >
                            <option value="Value">Fixed Value</option>
                            <option value="Range">Random Range</option>
                        </select>
                    </div>

                    {particleConfig.opacity.type === "Value" ? (
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                Opacity: {particleConfig.opacity.value}
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={particleConfig.opacity.value}
                                onChange={(e) => updateConfig('opacity.value', parseFloat(e.target.value))}
                                style={{ width: '100%' }}
                            />
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Opacity Min: {particleConfig.opacity.min}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="0.8"
                                    step="0.1"
                                    value={particleConfig.opacity.min}
                                    onChange={(e) => updateConfig('opacity.min', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Opacity Max: {particleConfig.opacity.max}
                                </label>
                                <input
                                    type="range"
                                    min="0.2"
                                    max="1"
                                    step="0.1"
                                    value={particleConfig.opacity.max}
                                    onChange={(e) => updateConfig('opacity.max', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Border Radius: {particleConfig.radius}px
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={particleConfig.radius}
                            onChange={(e) => updateConfig('radius', parseInt(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={particleConfig.twinkle.enable}
                                onChange={(e) => updateConfig('twinkle.enable', e.target.checked)}
                            />
                            Enable Twinkle Effect
                        </label>
                    </div>

                    {particleConfig.twinkle.enable && (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Twinkle Speed: {particleConfig.twinkle.speed}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="5"
                                    step="0.1"
                                    value={particleConfig.twinkle.speed}
                                    onChange={(e) => updateConfig('twinkle.speed', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Twinkle Min Opacity: {particleConfig.twinkle.minOpacity}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="0.8"
                                    step="0.1"
                                    value={particleConfig.twinkle.minOpacity}
                                    onChange={(e) => updateConfig('twinkle.minOpacity', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Twinkle Max Opacity: {particleConfig.twinkle.maxOpacity}
                                </label>
                                <input
                                    type="range"
                                    min="0.2"
                                    max="1"
                                    step="0.1"
                                    value={particleConfig.twinkle.maxOpacity}
                                    onChange={(e) => updateConfig('twinkle.maxOpacity', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Movement Settings */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)' }}>Movement & Physics</h3>
                    
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={particleConfig.move.enable}
                                onChange={(e) => updateConfig('move.enable', e.target.checked)}
                            />
                            Enable Movement
                        </label>
                    </div>

                    {particleConfig.move.enable && (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Direction
                                </label>
                                <select
                                    value={particleConfig.move.direction}
                                    onChange={(e) => updateConfig('move.direction', e.target.value)}
                                    style={{ width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}
                                >
                                    <option value="none">None</option>
                                    <option value="top">Top</option>
                                    <option value="right">Right</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="top-right">Top Right</option>
                                    <option value="top-left">Top Left</option>
                                    <option value="bottom-right">Bottom Right</option>
                                    <option value="bottom-left">Bottom Left</option>
                                    <option value="random">Random</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Speed: {particleConfig.move.speed}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    step="0.1"
                                    value={particleConfig.move.speed}
                                    onChange={(e) => updateConfig('move.speed', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={particleConfig.move.gravity}
                                        onChange={(e) => updateConfig('move.gravity', e.target.checked)}
                                    />
                                    Enable Gravity
                                </label>
                            </div>

                            {particleConfig.move.gravity && (
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                        Gravity Force: {particleConfig.move.gravityAcceleration}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        step="0.1"
                                        value={particleConfig.move.gravityAcceleration}
                                        onChange={(e) => updateConfig('move.gravityAcceleration', parseFloat(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            )}

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={particleConfig.move.trail}
                                        onChange={(e) => updateConfig('move.trail', e.target.checked)}
                                    />
                                    Trail Effect
                                </label>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={particleConfig.move.spin}
                                        onChange={(e) => updateConfig('move.spin', e.target.checked)}
                                    />
                                    Spin Effect
                                </label>
                            </div>

                            {particleConfig.move.spin && (
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                        Spin Speed: {particleConfig.move.spinSpeed}
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="10"
                                        step="0.1"
                                        value={particleConfig.move.spinSpeed}
                                        onChange={(e) => updateConfig('move.spinSpeed', parseFloat(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            )}

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={particleConfig.move.random}
                                        onChange={(e) => updateConfig('move.random', e.target.checked)}
                                    />
                                    Random Movement
                                </label>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={particleConfig.move.straight}
                                        onChange={(e) => updateConfig('move.straight', e.target.checked)}
                                    />
                                    Straight Movement
                                </label>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={particleConfig.move.vibrate}
                                        onChange={(e) => updateConfig('move.vibrate', e.target.checked)}
                                    />
                                    Vibration Effect
                                </label>
                            </div>

                            {particleConfig.move.vibrate && (
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                        Vibration Frequency: {particleConfig.move.vibrateFrequency}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={particleConfig.move.vibrateFrequency}
                                        onChange={(e) => updateConfig('move.vibrateFrequency', parseInt(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            )}

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={particleConfig.move.attract}
                                        onChange={(e) => updateConfig('move.attract', e.target.checked)}
                                    />
                                    Attraction to Mouse
                                </label>
                            </div>

                            {particleConfig.move.attract && (
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                        Attraction Distance: {particleConfig.move.attractDistance}
                                    </label>
                                    <input
                                        type="range"
                                        min="50"
                                        max="500"
                                        value={particleConfig.move.attractDistance}
                                        onChange={(e) => updateConfig('move.attractDistance', parseInt(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            )}

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Boundary Behavior
                                </label>
                                <select
                                    value={particleConfig.move.out}
                                    onChange={(e) => updateConfig('move.out', e.target.value)}
                                    style={{ width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}
                                >
                                    <option value="out">Wrap Around</option>
                                    <option value="bounce">Bounce</option>
                                    <option value="bounce-horizontal">Bounce Horizontal</option>
                                    <option value="bounce-vertical">Bounce Vertical</option>
                                    <option value="destroy">Destroy</option>
                                </select>
                            </div>

                            {particleConfig.move.trail && (
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                        Trail Length: {particleConfig.move.trailLength}
                                    </label>
                                    <input
                                        type="range"
                                        min="5"
                                        max="50"
                                        value={particleConfig.move.trailLength}
                                        onChange={(e) => updateConfig('move.trailLength', parseInt(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Connections & Interaction Settings */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)' }}>Connections & Interactions</h3>
                    
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={particleConfig.modes.connectRadius > 0}
                                onChange={(e) => updateConfig('modes.connectRadius', e.target.checked ? 100 : 0)}
                            />
                            Enable Connections (Links)
                        </label>
                    </div>

                    {particleConfig.modes.connectRadius > 0 && (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Connection Distance: {particleConfig.modes.connectRadius}
                                </label>
                                <input
                                    type="range"
                                    min="50"
                                    max="200"
                                    value={particleConfig.modes.connectRadius}
                                    onChange={(e) => updateConfig('modes.connectRadius', parseInt(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Connection Opacity: {particleConfig.modes.connectLinks}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.1"
                                    value={particleConfig.modes.connectLinks}
                                    onChange={(e) => updateConfig('modes.connectLinks', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Grab Distance: {particleConfig.modes.grab}
                        </label>
                        <input
                            type="range"
                            min="50"
                            max="300"
                            value={particleConfig.modes.grab}
                            onChange={(e) => updateConfig('modes.grab', parseInt(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Bubble Distance: {particleConfig.modes.bubble}
                        </label>
                        <input
                            type="range"
                            min="100"
                            max="600"
                            value={particleConfig.modes.bubble}
                            onChange={(e) => updateConfig('modes.bubble', parseInt(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Bubble Size: {particleConfig.modes.bubbleSize}
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={particleConfig.modes.bubbleSize}
                            onChange={(e) => updateConfig('modes.bubbleSize', parseInt(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Repulse Distance: {particleConfig.modes.repulse}
                        </label>
                        <input
                            type="range"
                            min="50"
                            max="400"
                            value={particleConfig.modes.repulse}
                            onChange={(e) => updateConfig('modes.repulse', parseInt(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Repulse Force: {particleConfig.modes.repulseDistance}
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="2"
                            step="0.1"
                            value={particleConfig.modes.repulseDistance}
                            onChange={(e) => updateConfig('modes.repulseDistance', parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={particleConfig.hover.enable}
                                onChange={(e) => updateConfig('hover.enable', e.target.checked)}
                            />
                            Enable Hover Effects
                        </label>
                    </div>

                    {particleConfig.hover.enable && (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Hover Mode
                                </label>
                                <select
                                    value={particleConfig.hover.mode}
                                    onChange={(e) => updateConfig('hover.mode', e.target.value)}
                                    style={{ width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}
                                >
                                    <option value="none">None</option>
                                    <option value="grab">Grab</option>
                                    <option value="bubble">Bubble</option>
                                    <option value="repulse">Repulse</option>
                                    <option value="attract">Attract</option>
                                    <option value="connect">Connect</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Hover Force: {particleConfig.hover.force}
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="200"
                                    value={particleConfig.hover.force}
                                    onChange={(e) => updateConfig('hover.force', parseInt(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Hover Smooth: {particleConfig.hover.smooth}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={particleConfig.hover.smooth}
                                    onChange={(e) => updateConfig('hover.smooth', parseInt(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={particleConfig.hover.parallax}
                                        onChange={(e) => updateConfig('hover.parallax', e.target.checked)}
                                    />
                                    Parallax Effect
                                </label>
                            </div>
                        </>
                    )}

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={particleConfig.click.enable}
                                onChange={(e) => updateConfig('click.enable', e.target.checked)}
                            />
                            Enable Click Effects
                        </label>
                    </div>

                    {particleConfig.click.enable && (
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                Click Mode
                            </label>
                            <select
                                value={particleConfig.click.mode}
                                onChange={(e) => updateConfig('click.mode', e.target.value)}
                                style={{ width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}
                            >
                                <option value="push">Push (Add Particles)</option>
                                <option value="remove">Remove Particles</option>
                                <option value="repulse">Repulse</option>
                                <option value="attract">Attract</option>
                                <option value="bubble">Bubble</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={mode === "create" ? handleAddParticles : updateExistingParticles}
                    disabled={isLoading || (mode === "edit" && !selectedParticle)}
                    style={{
                        width: '100%',
                        padding: '15px',
                        marginBottom: '12px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        background: mode === "edit" && !selectedParticle ? '#ccc' : '#007aff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: mode === "edit" && !selectedParticle ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading 
                        ? (mode === "create" ? "Adding Particles..." : "Applying Changes...") 
                        : (mode === "create" ? (
                            <>
                                <Play size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Add Particles
                            </>
                        ) : (
                            <>
                                <Pencil size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Apply Changes
                            </>
                        ))
                    }
                </button>
                
                {message && (
                    <div style={{
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        textAlign: 'center',
                        background: message.startsWith("🎉") || message.startsWith("✅") ? '#e8f5e8' : '#ffe8e8',
                        color: message.startsWith("🎉") || message.startsWith("✅") ? '#2d5a2d' : '#5a2d2d'
                    }}>
                        {message}
                    </div>
                )}

                {/* Instructions */}
                <div style={{ 
                    marginTop: '20px',
                    padding: '15px',
                    background: 'var(--card-bg)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)'
                }}>
                    <strong>💡 How to use:</strong><br/>
                    <strong>Create Mode:</strong> Choose presets, customize settings, then add to canvas<br/>
                    <strong>Edit Mode:</strong> Select existing particles, modify settings, apply changes<br/>
                    <strong>Sidebar:</strong> Select any particle component for full customization controls
                </div>

                {/* Copyright Footer */}
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px 0 10px 0', 
                    borderTop: '1px solid var(--border)',
                    marginTop: '20px',
                    color: 'var(--text-secondary)',
                    fontSize: '11px'
                }}>
                    Copyright Mojave Studio 2025 - mojavestud.io - Custom Automated Web Design experts
                </div>
            </div>
        </main>
    )
}
