import React, { useState, useEffect } from 'react'
import { framer } from "framer-plugin"
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
    Play,
    LinkSimple,
    CursorClick,
    Ruler,
    Drop
} from "@phosphor-icons/react"
import { EnhancedLivePreview } from "./EnhancedParticleRenderer"

// Custom clearable number input component
interface ClearableNumberInputProps {
    min: number
    max: number
    value: number
    onChange: (value: number) => void
    style?: React.CSSProperties
    step?: number
}

const ClearableNumberInput: React.FC<ClearableNumberInputProps> = ({ min, max, value, onChange, style, step }) => {
    const [inputValue, setInputValue] = useState<string>(value.toString())
    const [isFocused, setIsFocused] = useState(false)

    // Update local state when prop value changes (but not when focused)
    useEffect(() => {
        if (!isFocused) {
            setInputValue(value.toString())
        }
    }, [value, isFocused])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputValue(newValue)
        
        // Only update parent if it's a valid number
        if (newValue !== '' && !isNaN(Number(newValue))) {
            const numValue = parseFloat(newValue)
            const clampedValue = Math.max(min, Math.min(max, numValue))
            onChange(clampedValue)
        }
    }

    const handleBlur = () => {
        setIsFocused(false)
        // If empty or invalid, reset to the current prop value
        if (inputValue === '' || isNaN(Number(inputValue))) {
            setInputValue(value.toString())
        }
    }

    const handleFocus = () => {
        setIsFocused(true)
        // Clear the input if it's showing 0
        if (value === 0) {
            setInputValue('')
        }
    }

    return (
        <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={style}
        />
    )
}

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
    size: { type: "Value" | "Range" | "Small" | "Medium" | "Large" | "ExtraLarge", value: number, min: number, max: number }
    opacity: { type: "Value" | "Range" | "Fade" | "Normal" | "Full", value: number, min: number, max: number }
    radius: number
    width: number
    height: number
    shape: {
        type: "circle" | "square" | "triangle" | "star" | "hexagon" | "diamond" | "text" | "mixed"
        text: string
        iconName: string
        sides: number
        mixedTypes: ("circle" | "square" | "triangle" | "star" | "hexagon" | "diamond")[]
    }
    textBackground: boolean
    textPadding: number
    fill: {
        enable: boolean
        color: string
        opacity: number
    }
    border: {
        enable: boolean
        color: string
        width: number
        radius: number
        opacity: number
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
        reverseGravity: boolean
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

// Generate simple working component for Framer
function createEnhancedParticlesCode(config: ParticleConfig): string {
    return `/**
 * 🌟 MOJAVE PARTICLES v1.2.0
 *
 * © 2025 Mojave Studio - mojavestud.io
 * Custom Automated Web Design Experts
 * Built with ❤️ for the Framer community
 */

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef } from "react"

export default function MojaveParticles(props) {
  const canvasRef = useRef(null)
    const animationRef = useRef(null)
    const particlesRef = useRef([])
    
    // Configuration with defaults
    const {
        backdrop = "${config.backdrop}",
        backgroundOpacity = ${config.backgroundOpacity},
        color = "${config.color}",
        colors = ${JSON.stringify(config.colors)},
        amount = ${config.amount},
        size = ${JSON.stringify(config.size)},
        opacity = ${JSON.stringify(config.opacity)},
        move = ${JSON.stringify(config.move)},
        hover = ${JSON.stringify(config.hover)},
        click = ${JSON.stringify(config.click)},
        modes = ${JSON.stringify(config.modes)},
        twinkle = ${JSON.stringify(config.twinkle)},
        glow = ${JSON.stringify(config.glow)},
        border = ${JSON.stringify(config.border)},
        shape = ${JSON.stringify(config.shape)},
        radius = ${config.radius},
        width = ${config.width},
        height = ${config.height}
    } = props

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Use fixed size from configuration
        canvas.width = width
        canvas.height = height
        canvas.style.width = width + "px"
        canvas.style.height = height + "px"

        // Create simple particles
        function createParticles() {
            const particles = []
            const cols = colors && colors.length > 0 ? colors : [color]
            
            for (let i = 0; i < Math.min(amount, 50); i++) {
                const particleColor = cols[Math.floor(Math.random() * cols.length)]
                // Calculate particle size based on type
                let particleSize
                if (size.type === "Range") {
                    particleSize = Math.random() * (size.max - size.min) + size.min
                } else if (size.type === "Small") {
                    particleSize = Math.random() * (50 - 1) + 1
                } else if (size.type === "Medium") {
                    particleSize = Math.random() * (200 - 50) + 50
                } else if (size.type === "Large") {
                    particleSize = Math.random() * (500 - 200) + 200
                } else if (size.type === "ExtraLarge") {
                    particleSize = Math.random() * (1000 - 500) + 500
                } else {
                    particleSize = size.value
                }
                
                let vx = 0, vy = 0
                const speed = move.speed * 0.05
                
                switch (move.direction) {
                    case "top": vy = -speed; break
                    case "bottom": vy = speed; break
                    case "left": vx = -speed; break
                    case "right": vx = speed; break
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
                    size: particleSize,
                    opacity: (() => {
                        if (opacity.type === "Range") {
                            return Math.random() * (opacity.max - opacity.min) + opacity.min
                        } else if (opacity.type === "Fade") {
                            return Math.random() * (0.5 - 0.1) + 0.1
                        } else if (opacity.type === "Normal") {
                            return Math.random() * (1.0 - 0.5) + 0.5
                        } else if (opacity.type === "Full") {
                            return Math.random() * (1.0 - 0.8) + 0.8
                        } else {
                            return opacity.value
                        }
                    })(),
                    twinklePhase: Math.random() * Math.PI * 2
                })
            }
            particlesRef.current = particles
        }

        function animate() {
            // Clear canvas
            ctx.clearRect(0, 0, width, height)

            // Draw background
            if (backdrop && backgroundOpacity > 0) {
                ctx.save()
                ctx.globalAlpha = backgroundOpacity
                ctx.fillStyle = backdrop
                ctx.fillRect(0, 0, width, height)
                ctx.restore()
            }

            // Draw particles
            const particles = particlesRef.current
            particles.forEach((particle) => {
                // Update position
                if (move.enable) {
                    // Apply gravity if enabled
                    if (move.gravity) {
                        if (move.reverseGravity) {
                            particle.vy -= move.gravityAcceleration * 0.0005 // Reverse gravity
                        } else {
                            particle.vy += move.gravityAcceleration * 0.0005 // Normal gravity
                        }
                    }
                    
                    particle.x += particle.vx
                    particle.y += particle.vy

                    // Handle boundary behavior
                    if (move.out === "out") {
                        // Remove particles that exit the frame
                        if (particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height) {
                            particle.x = Math.random() * width
                            particle.y = -10 // Start from top
                        }
                    } else {
                        // Bounce off edges (default behavior)
                        if (particle.x <= 0 || particle.x >= width) particle.vx *= -1
                        if (particle.y <= 0 || particle.y >= height) particle.vy *= -1
                        particle.x = Math.max(0, Math.min(width, particle.x))
                        particle.y = Math.max(0, Math.min(height, particle.y))
                    }
                }

                // Calculate opacity with twinkle
                let currentOpacity = particle.opacity
                if (twinkle.enable) {
                    particle.twinklePhase += twinkle.speed * 0.05
                    const twinkleMultiplier = (Math.sin(particle.twinklePhase) + 1) / 2
                    currentOpacity = twinkle.minOpacity + (twinkle.maxOpacity - twinkle.minOpacity) * twinkleMultiplier
                }

                // Draw particle with glow if enabled
                ctx.save()
                
                // Add glow effect if enabled
                if (glow.enable) {
                    ctx.globalCompositeOperation = "source-over"
                    ctx.shadowBlur = glow.size * particle.size
                    ctx.shadowColor = particle.color
                    ctx.globalAlpha = glow.intensity
                    ctx.beginPath()
                    
                    // Draw glow with same shape as particle
                    switch (shape.type) {
                        case "circle":
                            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                            break
                        case "square":
                            ctx.rect(particle.x - particle.size, particle.y - particle.size, particle.size * 2, particle.size * 2)
                            break
                        case "triangle":
                            ctx.moveTo(particle.x, particle.y - particle.size)
                            ctx.lineTo(particle.x - particle.size, particle.y + particle.size)
                            ctx.lineTo(particle.x + particle.size, particle.y + particle.size)
                            ctx.closePath()
                            break
                        case "diamond":
                            ctx.moveTo(particle.x, particle.y - particle.size)
                            ctx.lineTo(particle.x + particle.size, particle.y)
                            ctx.lineTo(particle.x, particle.y + particle.size)
                            ctx.lineTo(particle.x - particle.size, particle.y)
                            ctx.closePath()
                            break
                        case "hexagon":
                            const sides = 6
                            const angleStep = (Math.PI * 2) / sides
                            ctx.moveTo(particle.x + particle.size * Math.cos(0), particle.y + particle.size * Math.sin(0))
                            for (let i = 1; i <= sides; i++) {
                                const angle = i * angleStep
                                ctx.lineTo(particle.x + particle.size * Math.cos(angle), particle.y + particle.size * Math.sin(angle))
                            }
                            break
                        case "star":
                            const spikes = 5
                            const outerRadius = particle.size
                            const innerRadius = particle.size * 0.5
                            ctx.moveTo(particle.x + outerRadius * Math.cos(0), particle.y + outerRadius * Math.sin(0))
                            for (let i = 0; i < spikes * 2; i++) {
                                const radius = i % 2 === 0 ? outerRadius : innerRadius
                                const angle = (i * Math.PI) / spikes
                                ctx.lineTo(particle.x + radius * Math.cos(angle), particle.y + radius * Math.sin(angle))
                            }
                            ctx.closePath()
                            break
                        default:
                            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                    }
                    
                    ctx.fillStyle = particle.color
                    ctx.fill()
                }
                
                // Main particle with shape-based rendering
                ctx.globalCompositeOperation = "source-over"
                ctx.shadowBlur = 0
                ctx.globalAlpha = currentOpacity
                
                // Simple color parsing
                let r, g, b
                if (particle.color.includes('#')) {
                    r = parseInt(particle.color.slice(1, 3), 16)
                    g = parseInt(particle.color.slice(3, 5), 16)
                    b = parseInt(particle.color.slice(5, 7), 16)
                    ctx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + currentOpacity + ")"
                } else {
                    ctx.fillStyle = particle.color
                }
                
                // Draw different shapes based on config
                ctx.beginPath()
                switch (shape.type) {
                    case "circle":
                        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                        break
                    case "square":
                        ctx.rect(particle.x - particle.size, particle.y - particle.size, particle.size * 2, particle.size * 2)
                        break
                    case "triangle":
                        ctx.moveTo(particle.x, particle.y - particle.size)
                        ctx.lineTo(particle.x - particle.size, particle.y + particle.size)
                        ctx.lineTo(particle.x + particle.size, particle.y + particle.size)
                        ctx.closePath()
                        break
                    case "diamond":
                        ctx.moveTo(particle.x, particle.y - particle.size)
                        ctx.lineTo(particle.x + particle.size, particle.y)
                        ctx.lineTo(particle.x, particle.y + particle.size)
                        ctx.lineTo(particle.x - particle.size, particle.y)
                        ctx.closePath()
                        break
                    case "hexagon":
                        const angle = Math.PI / 3
                        ctx.moveTo(particle.x + particle.size, particle.y)
                        for (let i = 1; i <= 6; i++) {
                            ctx.lineTo(particle.x + particle.size * Math.cos(angle * i), particle.y + particle.size * Math.sin(angle * i))
                        }
                        ctx.closePath()
                        break
                    case "star":
                        const spikes = 5
                        const outerRadius = particle.size
                        const innerRadius = particle.size * 0.4
                        let rot = Math.PI / 2 * 3
                        const step = Math.PI / spikes
                        ctx.moveTo(particle.x, particle.y - outerRadius)
                        for (let i = 0; i < spikes; i++) {
                            ctx.lineTo(particle.x + Math.cos(rot) * outerRadius, particle.y + Math.sin(rot) * outerRadius)
                            rot += step
                            ctx.lineTo(particle.x + Math.cos(rot) * innerRadius, particle.y + Math.sin(rot) * innerRadius)
                            rot += step
                        }
                        ctx.lineTo(particle.x, particle.y - outerRadius)
                        ctx.closePath()
                        break
                    default:
                        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                        break
                }
                
                // For text, we don't draw any background shape
                if (shape.type !== "text") {
                ctx.fill()
                }
                
                // Render text or emoji on top if needed
                if (shape.type === "text") {
                    ctx.save()
                    const displayText = shape.text
                    ctx.font = (particle.size * 1.2) + "px Arial"
                    ctx.textAlign = "center"
                    ctx.textBaseline = "middle"
                    
                    // Measure text for background/border
                    const textMetrics = ctx.measureText(displayText)
                    const textWidth = textMetrics.width
                    const textHeight = particle.size * 1.2
                    const padding = 4
                    
                    // FIXED: Use the same strict background logic as preview
                    // Only show backgrounds for multi-letter text with actual letters
                    const shouldShowBackground = false // Always false for generated components - no automatic backgrounds
                    
                    // Draw background ONLY if explicitly enabled in fill settings (will be added via property controls)
                    // This ensures clean floating text/emojis/icons by default
                    
                    // Draw border only if enabled - no automatic backgrounds
                    if (border.enable && border.width > 0) {
                        ctx.strokeStyle = border.color || (r !== undefined ? "rgba(" + r + ", " + g + ", " + b + ", " + currentOpacity + ")" : particle.color)
                        ctx.lineWidth = border.width
                        ctx.strokeRect(
                            particle.x - textWidth/2 - padding,
                            particle.y - textHeight/2 - padding,
                            textWidth + padding * 2,
                            textHeight + padding * 2
                        )
                    }
                    
                    // Draw the text/emoji
                    ctx.fillStyle = r !== undefined ? "rgba(" + r + ", " + g + ", " + b + ", " + currentOpacity + ")" : particle.color
                    ctx.fillText(displayText, particle.x, particle.y)
                    ctx.restore()
                }
                
                // Add border if enabled (for non-text shapes)
                if (shape.type !== "text" && border.enable && border.width > 0) {
                    ctx.globalAlpha = currentOpacity
                    ctx.strokeStyle = border.color || particle.color
                    ctx.lineWidth = border.width
                    ctx.stroke()
                }
                
                ctx.restore()
            })

            // Draw connections between particles
            if (modes.connect > 0 && modes.connectRadius > 0) {
                const maxConnections = Math.floor(modes.connectLinks * particles.length)
                let connections = 0
                
                for (let i = 0; i < particles.length && connections < maxConnections; i++) {
                    const particle = particles[i]
                    
                    for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
                        const otherParticle = particles[j]
                        const distance = Math.sqrt(
                            Math.pow(particle.x - otherParticle.x, 2) + 
                            Math.pow(particle.y - otherParticle.y, 2)
                        )
                        
                        if (distance < modes.connectRadius) {
                            ctx.save()
                            ctx.strokeStyle = \`rgba(255, 255, 255, \${0.6 * (1 - distance / modes.connectRadius)})\`
                            ctx.lineWidth = 3
                            ctx.beginPath()
                            ctx.moveTo(particle.x, particle.y)
                            ctx.lineTo(otherParticle.x, otherParticle.y)
                            ctx.stroke()
                            ctx.restore()
                            connections++
                        }
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        createParticles()
        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            }
    }, [amount, color, colors, move, hover, click, modes, twinkle, glow, border, backdrop, backgroundOpacity, size, opacity, radius, width, height])

    return (
        <div style={{
            width: width + "px",
            height: height + "px",
                position: "relative",
                overflow: "hidden",
            borderRadius: radius + "px"
        }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    background: "transparent",
                    display: "block"
                }}
            />
        </div>
    )
}

// Add comprehensive property controls matching the original component
addPropertyControls(MojaveParticles, {
    backdrop: { 
        type: ControlType.Color, 
        title: "Background",
        defaultValue: "${config.backdrop}"
    },
    backgroundOpacity: {
        type: ControlType.Number,
        title: "Background Opacity",
        min: 0, max: 1, step: 0.1,
        defaultValue: ${config.backgroundOpacity}
    },
    color: { 
        type: ControlType.Color, 
        title: "Color",
        defaultValue: "${config.color}"
    },
    colors: {
        type: ControlType.Array,
        title: "Colors",
        control: { type: ControlType.Color }
    },
    amount: {
        type: ControlType.Number,
        title: "Amount",
        min: 0, max: 300,
        defaultValue: ${config.amount}
    },
    size: {
        type: ControlType.Object,
        title: "Size",
        controls: {
            type: {
                type: ControlType.Enum,
                options: ["Value", "Range", "Small", "Medium", "Large", "ExtraLarge"],
                defaultValue: "${config.size.type}"
            },
            value: {
                type: ControlType.Number,
                defaultValue: ${config.size.value},
                hidden: (size) => size.type === "Range"
            },
            min: {
                type: ControlType.Number,
                defaultValue: ${config.size.min},
                hidden: (size) => size.type !== "Range"
            },
            max: {
                type: ControlType.Number,
                defaultValue: ${config.size.max},
                hidden: (size) => size.type !== "Range"
            }
        }
    },
    opacity: {
        type: ControlType.Object,
        title: "Opacity",
        controls: {
            type: {
                type: ControlType.Enum,
                options: ["Value", "Range", "Fade", "Normal", "Full"],
                defaultValue: "${config.opacity.type}"
            },
            value: {
                type: ControlType.Number,
                defaultValue: ${config.opacity.value},
                hidden: (opacity) => opacity.type !== "Value"
            },
            min: {
                type: ControlType.Number,
                defaultValue: ${config.opacity.min},
                hidden: (opacity) => opacity.type !== "Range"
            },
            max: {
                type: ControlType.Number,
                defaultValue: ${config.opacity.max},
                hidden: (opacity) => opacity.type !== "Range"
            }
        }
    },
    shape: {
        type: ControlType.Object,
        title: "Shape",
        controls: {
            type: {
                type: ControlType.Enum,
                title: "Type",
                options: ["circle", "square", "triangle", "diamond", "hexagon", "star", "text"],
                defaultValue: "${config.shape.type}"
            },
            text: {
                type: ControlType.String,
                title: "Text/Emoji",
                defaultValue: "${config.shape.text}",
                hidden: (shape) => shape.type !== "text"
            }
        }
    },
    twinkle: {
        type: ControlType.Object,
        title: "Twinkle",
        controls: {
            enable: {
                type: ControlType.Boolean,
                title: "Enable Twinkle",
                defaultValue: ${config.twinkle.enable}
            },
            speed: {
                type: ControlType.Number,
                title: "Speed",
                defaultValue: ${config.twinkle.speed},
                min: 0.1, max: 5, step: 0.1,
                hidden: (twinkle) => !twinkle.enable
            },
            minOpacity: {
                type: ControlType.Number,
                title: "Min Opacity",
                defaultValue: ${config.twinkle.minOpacity},
                min: 0, max: 1, step: 0.1,
                hidden: (twinkle) => !twinkle.enable
            },
            maxOpacity: {
                type: ControlType.Number,
                title: "Max Opacity",
                defaultValue: ${config.twinkle.maxOpacity},
                min: 0, max: 1, step: 0.1,
                hidden: (twinkle) => !twinkle.enable
            }
        }
    },
    modes: {
        type: ControlType.Object,
        title: "Modes",
        controls: {
            connect: {
                type: ControlType.Number,
                defaultValue: ${config.modes.connect},
                title: "Connect"
            },
            connectRadius: {
                type: ControlType.Number,
                defaultValue: ${config.modes.connectRadius},
                title: "Connect Radius"
            },
            connectLinks: {
                type: ControlType.Number,
                defaultValue: ${config.modes.connectLinks},
                title: "Connect Links",
                min: 0, max: 1, step: 0.1
            },
            grab: {
                type: ControlType.Number,
                defaultValue: ${config.modes.grab},
                title: "Grab"
            },
            grabLinks: {
                type: ControlType.Number,
                defaultValue: ${config.modes.grabLinks},
                title: "Grab Links",
                min: 0, max: 1, step: 0.1
            },
            bubble: {
                type: ControlType.Number,
                defaultValue: ${config.modes.bubble},
                title: "Bubble"
            },
            bubbleSize: {
                type: ControlType.Number,
                defaultValue: ${config.modes.bubbleSize},
                title: "Bubble Size"
            },
            bubbleDuration: {
                type: ControlType.Number,
                defaultValue: ${config.modes.bubbleDuration},
                title: "Bubble Duration",
                min: 0, max: 5, step: 0.1
            },
            repulse: {
                type: ControlType.Number,
                defaultValue: ${config.modes.repulse},
                title: "Repulse"
            },
            repulseDistance: {
                type: ControlType.Number,
                defaultValue: ${config.modes.repulseDistance},
                title: "Repulse Distance",
                min: 0, max: 5, step: 0.1
            },
            push: {
                type: ControlType.Number,
                defaultValue: ${config.modes.push},
                title: "Push"
            },
            remove: {
                type: ControlType.Number,
                defaultValue: ${config.modes.remove},
                title: "Remove"
            },
            trail: {
                type: ControlType.Number,
                defaultValue: ${config.modes.trail},
                title: "Trail"
            },
            trailDelay: {
                type: ControlType.Number,
                defaultValue: ${config.modes.trailDelay},
                title: "Trail Delay",
                min: 0, max: 1, step: 0.001
            }
        }
    },
    move: {
        type: ControlType.Object,
        title: "Move",
        controls: {
            enable: {
                type: ControlType.Boolean,
                defaultValue: ${config.move.enable}
            },
            direction: {
                type: ControlType.Enum,
                options: ["none", "top", "right", "bottom", "left", "top-right", "top-left", "bottom-right", "bottom-left", "random", "outside", "inside"],
                defaultValue: "${config.move.direction}",
                hidden: (move) => !move.enable
            },
            speed: {
                type: ControlType.Number,
                defaultValue: ${config.move.speed},
                min: 0, max: 50, step: 0.1,
                hidden: (move) => !move.enable
            },
            random: {
                type: ControlType.Boolean,
                defaultValue: ${config.move.random},
                hidden: (move) => !move.enable
            },
            straight: {
                type: ControlType.Boolean,
                defaultValue: ${config.move.straight},
                hidden: (move) => !move.enable
            },
            out: {
                type: ControlType.Enum,
                title: "Out Mode",
                options: ["none", "split", "bounce", "destroy", "out", "bounce-horizontal", "bounce-vertical"],
                defaultValue: "${config.move.out}",
                hidden: (move) => !move.enable
            },
            trail: {
                type: ControlType.Boolean,
                defaultValue: ${config.move.trail},
                title: "Trail",
                hidden: (move) => !move.enable
            },
            trailLength: {
                type: ControlType.Number,
                defaultValue: ${config.move.trailLength},
                min: 1, max: 50,
                hidden: (move) => !move.trail || !move.enable
            },
            gravity: {
                type: ControlType.Boolean,
                defaultValue: ${config.move.gravity},
                title: "Gravity",
                hidden: (move) => !move.enable
            },
            gravityAcceleration: {
                type: ControlType.Number,
                defaultValue: ${config.move.gravityAcceleration},
                min: 0, max: 50, step: 0.1,
                title: "Gravity Force",
                hidden: (move) => !move.gravity || !move.enable
            },
            spin: {
                type: ControlType.Boolean,
                defaultValue: ${config.move.spin},
                title: "Spin",
                hidden: (move) => !move.enable
            },
            spinSpeed: {
                type: ControlType.Number,
                defaultValue: ${config.move.spinSpeed},
                min: 0, max: 10, step: 0.1,
                title: "Spin Speed",
                hidden: (move) => !move.spin || !move.enable
            },
            attract: {
                type: ControlType.Boolean,
                defaultValue: ${config.move.attract},
                title: "Attract",
                hidden: (move) => !move.enable
            },
            attractDistance: {
                type: ControlType.Number,
                defaultValue: ${config.move.attractDistance},
                min: 50, max: 500,
                title: "Attract Distance",
                hidden: (move) => !move.attract || !move.enable
            },
            vibrate: {
                type: ControlType.Boolean,
                defaultValue: ${config.move.vibrate},
                title: "Vibrate",
                hidden: (move) => !move.enable
            },
            vibrateFrequency: {
                type: ControlType.Number,
                defaultValue: ${config.move.vibrateFrequency},
                min: 1, max: 100, step: 1,
                title: "Vibrate Frequency",
                hidden: (move) => !move.vibrate || !move.enable
            }
        }
    },
    click: {
        type: ControlType.Object,
        title: "Click",
        controls: {
            enable: {
                type: ControlType.Boolean,
                defaultValue: ${config.click.enable}
            },
            mode: {
                type: ControlType.Enum,
                options: ["attract", "bubble", "push", "remove", "repulse", "pause", "trail"],
                defaultValue: "${config.click.mode}",
                hidden: (click) => !click.enable
            }
        }
    },
    hover: {
        type: ControlType.Object,
        title: "Hover",
        controls: {
            enable: {
                type: ControlType.Boolean,
                defaultValue: ${config.hover.enable}
            },
            mode: {
                type: ControlType.Enum,
                options: ["none", "grab", "bubble", "repulse", "attract", "connect", "trail", "light"],
                defaultValue: "${config.hover.mode}",
                hidden: (hover) => !hover.enable
            },
            parallax: {
                type: ControlType.Boolean,
                defaultValue: ${config.hover.parallax},
                title: "Parallax",
                hidden: (hover) => !hover.enable
            },
            force: {
                type: ControlType.Number,
                defaultValue: ${config.hover.force},
                title: "Force",
                hidden: (hover) => !hover.enable
            },
            smooth: {
                type: ControlType.Number,
                defaultValue: ${config.hover.smooth},
                title: "Smooth",
                hidden: (hover) => !hover.enable
            }
        }
    },
    glow: {
        type: ControlType.Object,
        title: "Glow",
        controls: {
            enable: {
                type: ControlType.Boolean,
                title: "Enable Glow",
                defaultValue: ${config.glow.enable}
            },
            intensity: {
                type: ControlType.Number,
                title: "Intensity",
                min: 0, max: 1, step: 0.1,
                defaultValue: ${config.glow.intensity},
                hidden: (glow) => !glow.enable
            },
            size: {
                type: ControlType.Number,
                title: "Size",
                min: 0.5, max: 5, step: 0.1,
                defaultValue: ${config.glow.size},
                hidden: (glow) => !glow.enable
            }
        }
    },
    border: {
        type: ControlType.Object,
        title: "Border",
        controls: {
            enable: {
                type: ControlType.Boolean,
                title: "Enable Border",
                defaultValue: ${config.border.enable}
            },
            color: {
                type: ControlType.Color,
                title: "Color",
                defaultValue: "${config.border.color}",
                hidden: (border) => !border.enable
            },
            width: {
                type: ControlType.Number,
                title: "Width",
                min: 0.1, max: 5, step: 0.1,
                defaultValue: ${config.border.width},
                hidden: (border) => !border.enable
            }
        }
    },
    radius: {
        type: ControlType.Number,
        defaultValue: ${config.radius}
    },
    width: {
        type: ControlType.Number,
        title: "Width",
        min: 200, max: 1600,
        defaultValue: ${config.width}
    },
    height: {
        type: ControlType.Number,
        title: "Height",
        min: 200, max: 1200,
        defaultValue: ${config.height}
    }
})`;
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

    // Handle loading screen - now controlled by user interaction with smooth transition
    const handleContinueToParticles = () => {
        setIsTransitioning(true)
        setTimeout(() => {
            setShowLoadingScreen(false)
            setIsTransitioning(false)
        }, 100) // 100ms transition - immediate response
    }

    const handleVisitWebsite = () => {
        window.open('https://mojavestud.io', '_blank')
    }

    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [showLoadingScreen, setShowLoadingScreen] = useState(true)
    const [isTransitioning, setIsTransitioning] = useState(false)
    // Removed edit mode - plugin is now insertion-only
    const [, setIsDarkMode] = useState(false)
    
    // Default configuration
    const [particleConfig, setParticleConfig] = useState<ParticleConfig>({
        backdrop: "#141414",
        backgroundOpacity: 1,
        color: "#ffffff",
        colors: [],
        amount: 50,
        size: { type: "Range", value: 12, min: 8, max: 16 },
        opacity: { type: "Range", value: 0.9, min: 0.7, max: 1 },
        radius: 0,
        width: 800,
        height: 600,
        shape: {
            type: "circle",
            text: "✨",
            iconName: "Star",
            sides: 6,
            mixedTypes: ["circle" as const, "square" as const, "triangle" as const]
        },
        textBackground: false,
        textPadding: 4,
        fill: {
            enable: false,
            color: "#000000",
            opacity: 0.7
        },
        border: {
            enable: false,
            color: "#ffffff",
            width: 2.5,
            radius: 0,
            opacity: 1.0
        },
        glow: {
            enable: false,
            intensity: 0.2,
            size: 1.5
        },
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
            direction: "random",
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
        blackHole: {
            backdrop: "#000000", backgroundOpacity: 1, color: "#ffffff", colors: [], amount: 50,
            size: { type: "Range" as const, value: 3, min: 2, max: 4 },
            opacity: { type: "Range" as const, value: 0.7, min: 0.5, max: 1 },
            radius: 0, width: 800, height: 600, shape: { type: "circle" as const, text: "✨", iconName: "", sides: 6, mixedTypes: ["circle" as const, "square" as const, "triangle" as const] }, textBackground: false, textPadding: 4, fill: { enable: false, color: "#000000", opacity: 0.7 }, border: { enable: false, color: "#ffffff", width: 2.5, radius: 0, opacity: 1 }, glow: { enable: false, intensity: 0.15, size: 1.8 }, twinkle: { enable: false, speed: 1, minOpacity: 0.1, maxOpacity: 1 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "none", speed: 1.5, random: false, straight: false, out: "out", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, reverseGravity: false, spin: false, spinSpeed: 2, attract: false, attractDistance: 200, vibrate: false, vibrateFrequency: 50 },
            click: { enable: false, mode: "push" },
            hover: { enable: true, mode: "grab", parallax: false, force: 50, smooth: 10 }
        },
        snow: {
            backdrop: "#0d1b2a", backgroundOpacity: 1, color: "#ffffff", colors: ["#ffffff", "#f8f9fa", "#e9ecef"], amount: 100,
            size: { type: "Range" as const, value: 4, min: 2, max: 8 },
            opacity: { type: "Range" as const, value: 0.8, min: 0.6, max: 1 },
            radius: 0, width: 800, height: 600, shape: { type: "circle" as const, text: "●", iconName: "", sides: 6, mixedTypes: ["circle" as const, "square" as const, "triangle" as const] }, textBackground: false, textPadding: 4, fill: { enable: false, color: "#000000", opacity: 0.7 }, border: { enable: false, color: "#ffffff", width: 2.5, radius: 0, opacity: 1 }, glow: { enable: false, intensity: 0.15, size: 1.8 }, twinkle: { enable: true, speed: 0.2, minOpacity: 0.3, maxOpacity: 0.8 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 0, grabLinks: 1, bubble: 0, bubbleSize: 40, bubbleDuration: 2, repulse: 0, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "bottom", speed: 1.0, random: true, straight: false, out: "out", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, reverseGravity: false, spin: false, spinSpeed: 2, attract: false, attractDistance: 200, vibrate: false, vibrateFrequency: 8 },
            click: { enable: false, mode: "push" },
            hover: { enable: false, mode: "grab", parallax: false, force: 15, smooth: 20 }
        },
        rainbow: {
            backdrop: "#000000", backgroundOpacity: 1, color: "#ffffff", colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#fd79a8", "#a29bfe", "#ff7675"], amount: 60,
            size: { type: "Range" as const, value: 3, min: 2, max: 6 },
            opacity: { type: "Range" as const, value: 0.7, min: 0.5, max: 0.9 },
            radius: 0, width: 800, height: 600, shape: { type: "star" as const, text: "★", iconName: "", sides: 5, mixedTypes: ["circle" as const, "square" as const, "triangle" as const] }, textBackground: false, textPadding: 4, fill: { enable: false, color: "#000000", opacity: 0.7 }, border: { enable: false, color: "#ffffff", width: 2.5, radius: 0, opacity: 1 }, glow: { enable: false, intensity: 0.15, size: 1.8 }, twinkle: { enable: true, speed: 2, minOpacity: 0.3, maxOpacity: 1 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 6, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "none", speed: 2, random: true, straight: false, out: "out", trail: true, trailLength: 8, gravity: false, gravityAcceleration: 9.81, reverseGravity: false, spin: true, spinSpeed: 1, attract: false, attractDistance: 200, vibrate: false, vibrateFrequency: 50 },
            click: { enable: false, mode: "push" },
            hover: { enable: true, mode: "bubble", parallax: false, force: 60, smooth: 10 }
        },
        network: {
            backdrop: "#0a0a0a", backgroundOpacity: 1, color: "#4fc3f7", colors: ["#4fc3f7", "#29b6f6", "#03a9f4", "#039be5", "#0288d1"], amount: 35,
            size: { type: "Range" as const, value: 4, min: 2, max: 8 },
            opacity: { type: "Range" as const, value: 0.9, min: 0.7, max: 1 },
            radius: 0, width: 800, height: 600, shape: { type: "circle" as const, text: "●", iconName: "", sides: 6, mixedTypes: ["circle" as const, "square" as const, "triangle" as const] }, textBackground: false, textPadding: 4, fill: { enable: true, color: "#4fc3f7", opacity: 0.4 }, border: { enable: true, color: "#4fc3f7", width: 1, radius: 0, opacity: 0.6 }, glow: { enable: true, intensity: 0.4, size: 2 }, twinkle: { enable: false, speed: 1, minOpacity: 0.1, maxOpacity: 1 },
            modes: { connect: 250, connectRadius: 180, connectLinks: 0.9, grab: 120, grabLinks: 1, bubble: 0, bubbleSize: 40, bubbleDuration: 2, repulse: 0, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "none", speed: 0.3, random: true, straight: false, out: "bounce", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, reverseGravity: false, spin: false, spinSpeed: 2, attract: false, attractDistance: 300, vibrate: false, vibrateFrequency: 50 },
            click: { enable: false, mode: "push" },
            hover: { enable: true, mode: "grab", parallax: false, force: 30, smooth: 20 }
        },
        bubbles: {
            backdrop: "#001a33", backgroundOpacity: 1, color: "#66ccff", colors: ["#66ccff", "#99ddff", "#ccf0ff", "#ffffff"], amount: 15,
            size: { type: "Range" as const, value: 12, min: 8, max: 35 },
            opacity: { type: "Range" as const, value: 0.3, min: 0.1, max: 0.5 },
            radius: 0, width: 800, height: 600, shape: { type: "text" as const, text: "○", iconName: "", sides: 6, mixedTypes: ["circle" as const, "square" as const, "triangle" as const] }, textBackground: false, textPadding: 4, fill: { enable: false, color: "#000000", opacity: 0.7 }, border: { enable: false, color: "#ffffff", width: 2.5, radius: 0, opacity: 1 }, glow: { enable: false, intensity: 0.15, size: 1.8 }, twinkle: { enable: true, speed: 0.8, minOpacity: 0.1, maxOpacity: 0.6 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 200, grabLinks: 1, bubble: 500, bubbleSize: 80, bubbleDuration: 2, repulse: 300, repulseDistance: 0.6, push: 3, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "top", speed: 0.8, random: true, straight: false, out: "out", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, reverseGravity: false, spin: false, spinSpeed: 2, attract: false, attractDistance: 200, vibrate: true, vibrateFrequency: 30 },
            click: { enable: false, mode: "bubble" },
            hover: { enable: true, mode: "bubble", parallax: false, force: 80, smooth: 20 }
        },
        lazer: {
            backdrop: "#0a0a0a", backgroundOpacity: 1, color: "#ff0000", colors: ["#ff0000", "#ff4444", "#ff6666", "#ff8888", "#ffaaaa", "#ffcccc"], amount: 45,
            size: { type: "Range" as const, value: 25, min: 15, max: 60 },
            opacity: { type: "Range" as const, value: 0.7, min: 0.2, max: 0.9 },
            radius: 0, width: 800, height: 600, shape: { type: "circle" as const, text: "●", iconName: "", sides: 6, mixedTypes: ["circle" as const, "square" as const, "triangle" as const] }, textBackground: false, textPadding: 4, fill: { enable: true, color: "#ff0000", opacity: 0.3 }, border: { enable: false, color: "#ff6666", width: 2, radius: 0, opacity: 0.6 }, glow: { enable: true, intensity: 0.4, size: 2.5 }, twinkle: { enable: true, speed: 2, minOpacity: 0.3, maxOpacity: 1 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "random", speed: 1.5, random: true, straight: false, out: "bounce", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, reverseGravity: false, spin: true, spinSpeed: 0.3, attract: false, attractDistance: 200, vibrate: true, vibrateFrequency: 20 },
            click: { enable: false, mode: "push" },
            hover: { enable: true, mode: "bubble", parallax: false, force: 60, smooth: 8 }
        },
        galaxy: {
            backdrop: "#0a0a1a", backgroundOpacity: 1, color: "#ffffff", colors: ["#ffffff", "#cce7ff", "#a8c8ec", "#8bb3d3", "#7c9fd9", "#e6f3ff"], amount: 80,
            size: { type: "Range" as const, value: 1.5, min: 1, max: 3 },
            opacity: { type: "Range" as const, value: 0.8, min: 0.4, max: 1 },
            radius: 0, width: 800, height: 600, shape: { type: "diamond" as const, text: "◆", iconName: "", sides: 4, mixedTypes: ["circle" as const, "square" as const, "triangle" as const] }, textBackground: false, textPadding: 4, fill: { enable: false, color: "#000000", opacity: 0.7 }, border: { enable: false, color: "#ffffff", width: 2.5, radius: 0, opacity: 1 }, glow: { enable: false, intensity: 0.15, size: 1.8 }, twinkle: { enable: true, speed: 0.8, minOpacity: 0.3, maxOpacity: 1 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "none", speed: 0.3, random: false, straight: false, out: "out", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, reverseGravity: false, spin: true, spinSpeed: 0.2, attract: false, attractDistance: 300, vibrate: false, vibrateFrequency: 50 },
            click: { enable: false, mode: "push" },
            hover: { enable: true, mode: "repulse", parallax: false, force: 80, smooth: 10 }
        },
        neon: {
            backdrop: "#0a0a0a", backgroundOpacity: 1, color: "#ff00ff", colors: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080"], amount: 35,
            size: { type: "Range" as const, value: 5, min: 3, max: 12 },
            opacity: { type: "Value" as const, value: 0.9, min: 0.1, max: 1 },
            radius: 0, width: 800, height: 600, shape: { type: "square" as const, text: "■", iconName: "", sides: 4, mixedTypes: ["circle" as const, "square" as const, "triangle" as const] }, textBackground: false, textPadding: 4, fill: { enable: false, color: "#000000", opacity: 0.7 }, border: { enable: false, color: "#ffffff", width: 2.5, radius: 0, opacity: 1 }, glow: { enable: true, intensity: 0.4, size: 2.5 }, twinkle: { enable: true, speed: 2.5, minOpacity: 0.4, maxOpacity: 1 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "none", speed: 1.5, random: true, straight: false, out: "bounce", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, reverseGravity: false, spin: false, spinSpeed: 2, attract: false, attractDistance: 200, vibrate: true, vibrateFrequency: 80 },
            click: { enable: false, mode: "push" },
            hover: { enable: true, mode: "bubble", parallax: false, force: 80, smooth: 8 }
        },
        bordered: {
            backdrop: "#1a1a1a", backgroundOpacity: 1, color: "#ffffff", colors: ["#ffffff", "#e0e0e0", "#c0c0c0"], amount: 40,
            size: { type: "Range" as const, value: 4, min: 3, max: 6 },
            opacity: { type: "Range" as const, value: 0.8, min: 0.6, max: 1 },
            radius: 0, width: 800, height: 600, shape: { type: "text" as const, text: "○", iconName: "", sides: 6, mixedTypes: ["circle" as const, "square" as const, "triangle" as const] }, textBackground: false, textPadding: 4, fill: { enable: false, color: "#000000", opacity: 0.7 }, border: { enable: true, color: "#ffffff", width: 4.0 }, glow: { enable: false, intensity: 0.15, size: 1.8 }, twinkle: { enable: false, speed: 1, minOpacity: 0.1, maxOpacity: 1 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 140, grabLinks: 1, bubble: 400, bubbleSize: 40, bubbleDuration: 2, repulse: 200, repulseDistance: 0.4, push: 4, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "random", speed: 1.5, random: false, straight: false, out: "out", trail: false, trailLength: 10, gravity: false, gravityAcceleration: 9.81, reverseGravity: false, spin: false, spinSpeed: 2, attract: false, attractDistance: 200, vibrate: false, vibrateFrequency: 50 },
            click: { enable: false, mode: "push" },
            hover: { enable: true, mode: "grab", parallax: false, force: 60, smooth: 10 }
        },
        lavaLamp: {
            backdrop: "#1a0f0f", backgroundOpacity: 1, color: "#ff6b35", colors: ["#ff6b35", "#ff8c42", "#ffa726", "#ff7043", "#ff5722", "#e64a19"], amount: 25,
            size: { type: "Range" as const, value: 20, min: 8, max: 50 },
            opacity: { type: "Range" as const, value: 0.6, min: 0.3, max: 0.8 },
            radius: 0, width: 800, height: 600, shape: { type: "circle" as const, text: "●", iconName: "", sides: 6, mixedTypes: ["circle" as const, "square" as const, "triangle" as const] }, textBackground: false, textPadding: 4, fill: { enable: true, color: "#ff6b35", opacity: 0.4 }, border: { enable: false, color: "#ffffff", width: 2.5, radius: 0, opacity: 1 }, glow: { enable: true, intensity: 0.3, size: 2 }, twinkle: { enable: true, speed: 0.5, minOpacity: 0.2, maxOpacity: 0.8 },
            modes: { connect: 0, connectRadius: 0, connectLinks: 1, grab: 200, grabLinks: 1, bubble: 800, bubbleSize: 120, bubbleDuration: 4, repulse: 300, repulseDistance: 0.8, push: 3, remove: 2, trail: 1, trailDelay: 0.005 },
            move: { enable: true, direction: "top", speed: 0.6, random: true, straight: false, out: "bounce", trail: false, trailLength: 10, gravity: true, gravityAcceleration: 9.81, reverseGravity: true, spin: true, spinSpeed: 0.8, attract: false, attractDistance: 250, vibrate: true, vibrateFrequency: 15 },
            click: { enable: false, mode: "bubble" },
            hover: { enable: true, mode: "bubble", parallax: false, force: 100, smooth: 25 }
        }
    }

    // Removed edit mode functions - plugin is now insertion-only

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

    // Removed edit mode auto-loading

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

            const codeFile = await framer.createCodeFile("MojaveParticles.tsx", createEnhancedParticlesCode(particleConfig))
            
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
            setMessage(`Error: ${errorMessage}`)
        }

        setIsLoading(false)
    }

    // Loading Screen Component
    const LoadingScreen = () => (
            <div style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgb(26, 26, 46) 0%, rgb(22, 33, 62) 50%, rgb(15, 52, 96) 100%)',
                        display: 'flex',
            flexDirection: 'column',
                        alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            color: 'white',
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            {/* Animated particles background */}
                        <div style={{
                            position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: [
                    'radial-gradient(2px 2px at 20px 30px, rgb(255,255,255), transparent)',
                    'radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.5), transparent)',
                    'radial-gradient(1px 1px at 90px 40px, rgb(255,255,255), transparent)',
                    'radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.3), transparent)',
                    'radial-gradient(2px 2px at 160px 30px, rgb(255,255,255), transparent)'
                ].join(', '),
                backgroundRepeat: 'repeat',
                backgroundSize: '200px 100px',
                animation: 'sparkle 4s linear infinite',
                opacity: 0.3
            }} />
            
            {/* Main content */}
            <div style={{ textAlign: 'center', zIndex: 1, maxWidth: '400px', padding: '20px' }}>
                {/* Large Planet icon above title */}
                        <div style={{
                    marginBottom: '20px',
                            display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Planet size={64} color="rgb(78, 205, 196)" />
                        </div>
                        
                        <div style={{
                    fontSize: '42px',
                            fontWeight: 'bold',
                    marginBottom: '10px',
                    background: 'linear-gradient(45deg, rgb(255, 107, 107), rgb(78, 205, 196), rgb(69, 183, 209))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'pulse 2s ease-in-out infinite'
                }}>
                    Welcome to Mojave Particles
                        </div>
                
                <div style={{
                    fontSize: '16px',
                    marginBottom: '40px',
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: '1.4'
                }}>
                    Create stunning, interactive particle effects for your Framer projects with professional-grade customization and real-time preview.
                </div>

                {/* Action buttons */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    width: '100%',
                    maxWidth: '320px',
                    margin: '0 auto'
                }}>
                            <button
                        onClick={handleContinueToParticles}
                        disabled={isTransitioning}
                                style={{
                            padding: '16px 24px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            background: isTransitioning 
                                ? 'linear-gradient(135deg, rgb(78, 205, 196) 0%, rgb(69, 183, 209) 100%)' 
                                : 'linear-gradient(135deg, rgb(78, 205, 196) 0%, rgb(69, 183, 209) 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isTransitioning ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)',
                            opacity: isTransitioning ? 0.7 : 1,
                            display: 'flex',
                                    alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '80px'
                        }}
                        onMouseEnter={(e) => {
                            if (!isTransitioning) {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(78, 205, 196, 0.4)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isTransitioning) {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(78, 205, 196, 0.3)'
                            }
                        }}
                    >
                        {isTransitioning ? 'Loading...' : 'Insert Particles'}
                            </button>
                    
                    <button
                        onClick={handleVisitWebsite}
                                        style={{
                            padding: '16px 24px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)',
                                            display: 'flex',
                            flexDirection: 'column',
                                            alignItems: 'center',
                            gap: '6px',
                            minHeight: '80px',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}>
                            <Planet size={20} />
                            Custom Web Solutions
                                    </div>
                        <div style={{
                            fontSize: '13px',
                            fontWeight: 'normal',
                            opacity: 0.8
                        }}>
                            mojavestud.io
                            </div>
                    </button>
                    </div>
                
                {/* Copyright info at bottom */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: '1.3',
                    textAlign: 'center'
                }}>
                    © Mojave Studio 2025 - mojavestud.io<br/>
                    Custom Automated Web Design Experts
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes sparkle {
                        from { transform: translateX(0); }
                        to { transform: translateX(200px); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.7; }
                    }
                `
            }} />
        </div>
    )

    return (
        <main style={{ 
            background: 'var(--background)', 
            height: '100vh', 
            overflow: 'auto',
            color: 'var(--text)'
        }}>
            {showLoadingScreen && <LoadingScreen />}
            <div style={{ 
                padding: '40px 20px 20px 20px', 
                width: '100%', 
                maxWidth: '600px',
                margin: '0 auto',
                opacity: showLoadingScreen ? 0 : 1,
                transform: showLoadingScreen ? 'translateY(20px)' : 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {/* Enhanced Live Preview */}
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
                    pointerEvents: 'auto'
                }}>
                    <EnhancedLivePreview config={particleConfig} />
                </div>

                {/* Awesome Presets */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '12px', display: 'block' }}>
                        <Palette size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        Quick Presets
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button
                            onClick={() => setParticleConfig(presets.blackHole)}
                            style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                background: '#000000',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            <Star size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Black Hole
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
                                background: 'linear-gradient(135deg, #0a0a0a 0%, #4fc3f7 50%, #29b6f6 100%)',
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
                            onClick={() => setParticleConfig(presets.lazer)}
                            style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                background: 'linear-gradient(135deg, #000000 0%, #ff0000 50%, #ff4444 100%)',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            <GridNine size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Lazer
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
                        <button
                            onClick={() => setParticleConfig(presets.lavaLamp)}
                            style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 30%, #ffa726 60%, #ff5722 100%)',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            <Drop size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Lava Lamp
                        </button>
                    </div>
                </div>

                {/* Canvas Settings */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)' }}>Canvas Settings</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Background Color
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

                </div>

                {/* Particle Appearance */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)' }}>Particle Appearance</h3>
                    
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
                            Primary Color
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
                                Color Palette ({particleConfig.colors.length} colors)
                            </label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
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
                                                width: '35px', 
                                                height: '35px', 
                                                border: '1px solid var(--border)', 
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }}
                                            title={`Color ${index + 1}: ${color}`}
                                        />
                                        {particleConfig.colors.length > 1 && (
                                            <button
                                                onClick={() => {
                                                    const newColors = particleConfig.colors.filter((_, i) => i !== index)
                                                    updateConfig('colors', newColors)
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-6px',
                                                    right: '-6px',
                                                    width: '18px',
                                                    height: '18px',
                                                    background: '#ff4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    fontSize: '10px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold'
                                                }}
                                                title="Remove this color"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        // Generate a random color for variety
                                        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
                                        const newColors = [...particleConfig.colors, randomColor]
                                        updateConfig('colors', newColors)
                                    }}
                                    style={{
                                        width: '35px',
                                        height: '35px',
                                        border: '2px dashed var(--border)',
                                        borderRadius: '6px',
                                        background: 'transparent',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        fontWeight: 'bold'
                                    }}
                                    title="Add new color"
                                >
                                    +
                                </button>
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Click + to add colors, × to remove colors
                            </div>
                        </div>
                    )}

                    {/* Shape Controls */}
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                            Particle Shape
                        </label>
                        <select
                            value={particleConfig.shape.type}
                            onChange={(e) => updateConfig('shape.type', e.target.value)}
                            style={{ width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}
                        >
                            <option value="circle">Circle</option>
                            <option value="square">Square</option>
                            <option value="triangle">Triangle</option>
                            <option value="diamond">Diamond</option>
                            <option value="hexagon">Hexagon</option>
                            <option value="star">Star</option>
                            <option value="text">Text/Emoji</option>
                            <option value="mixed">Mixed Shapes</option>
                        </select>
                    </div>

                    {/* Mixed Shape Selection */}
                    {particleConfig.shape.type === 'mixed' && (
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                Select Shapes to Mix:
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                                {(['circle', 'square', 'triangle', 'star', 'hexagon', 'diamond'] as const).map(shapeType => (
                                    <label key={shapeType} style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        fontSize: '10px', 
                                        cursor: 'pointer',
                                        padding: '4px',
                                        backgroundColor: particleConfig.shape.mixedTypes.includes(shapeType) ? 'var(--accent)' : 'var(--divider)',
                                        borderRadius: '4px',
                                        transition: 'background-color 0.2s'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={particleConfig.shape.mixedTypes.includes(shapeType)}
                                            onChange={(e) => {
                                                const newMixedTypes = e.target.checked
                                                    ? [...particleConfig.shape.mixedTypes, shapeType]
                                                    : particleConfig.shape.mixedTypes.filter(t => t !== shapeType)
                                                updateConfig('shape.mixedTypes', newMixedTypes)
                                            }}
                                            style={{ marginRight: '4px', width: '12px', height: '12px' }}
                                        />
                                        {shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Text/Emoji Input */}
                    {particleConfig.shape.type === "text" && (
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                Text/Emoji Content
                            </label>
                            <input
                                type="text"
                                value={particleConfig.shape.text}
                                onChange={(e) => updateConfig('shape.text', e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    padding: '6px', 
                                    border: '1px solid var(--border)', 
                                    borderRadius: '4px', 
                                    fontSize: '11px',
                                    background: 'var(--background)',
                                    color: 'var(--text)'
                                }}
                                placeholder="Enter text or emoji (e.g., Hello, 🌟, ⭐)"
                            />
                        </div>
                    )}

                    {/* Opacity Controls */}
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
                            <option value="Fade">Fade (0.1-0.5)</option>
                            <option value="Normal">Normal (0.5-1.0)</option>
                            <option value="Full">Full (0.8-1.0)</option>
                        </select>
                    </div>

                    {particleConfig.opacity.type === "Value" ? (
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                Opacity: {particleConfig.opacity.value}
                            </label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={particleConfig.opacity.value}
                                    onChange={(e) => updateConfig('opacity.value', parseFloat(e.target.value))}
                                    style={{ flex: 1 }}
                                />
                                <ClearableNumberInput
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    value={particleConfig.opacity.value}
                                    onChange={(value) => updateConfig('opacity.value', value)}
                                    style={{ 
                                        width: '60px', 
                                        padding: '4px', 
                                        border: '1px solid var(--border)', 
                                        borderRadius: '4px', 
                                        fontSize: '11px' 
                                    }}
                                />
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Range: 0-1 (0 = invisible, 1 = fully visible)
                            </div>
                        </div>
                    ) : particleConfig.opacity.type === "Range" ? (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Opacity Min: {particleConfig.opacity.min}
                                </label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={particleConfig.opacity.min}
                                        onChange={(e) => updateConfig('opacity.min', parseFloat(e.target.value))}
                                        style={{ flex: 1 }}
                                    />
                                    <ClearableNumberInput
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={particleConfig.opacity.min}
                                        onChange={(value) => updateConfig('opacity.min', value)}
                                        style={{ 
                                            width: '60px', 
                                            padding: '4px', 
                                            border: '1px solid var(--border)', 
                                            borderRadius: '4px', 
                                            fontSize: '11px' 
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Opacity Max: {particleConfig.opacity.max}
                                </label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={particleConfig.opacity.max}
                                        onChange={(e) => updateConfig('opacity.max', parseFloat(e.target.value))}
                                        style={{ flex: 1 }}
                                    />
                                    <ClearableNumberInput
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={particleConfig.opacity.max}
                                        onChange={(value) => updateConfig('opacity.max', value)}
                                        style={{ 
                                            width: '60px', 
                                            padding: '4px', 
                                            border: '1px solid var(--border)', 
                                            borderRadius: '4px', 
                                            fontSize: '11px' 
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        // Preset opacity ranges
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                {particleConfig.opacity.type === "Fade" && "Opacity Range: 0.1-0.5 (subtle fade effect)"}
                                {particleConfig.opacity.type === "Normal" && "Opacity Range: 0.5-1.0 (standard visibility)"}
                                {particleConfig.opacity.type === "Full" && "Opacity Range: 0.8-1.0 (high visibility)"}
                            </div>
                            <div style={{ 
                                padding: '8px', 
                                background: 'var(--accent)', 
                                borderRadius: '4px', 
                                fontSize: '10px', 
                                color: 'var(--text)' 
                            }}>
                                Using preset range for consistent effect
                            </div>
                        </div>
                    )}

                </div>

                {/* Particle Properties */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)' }}>Particle Properties</h3>
                    
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
                            <option value="Small">Small (1-50px)</option>
                            <option value="Medium">Medium (50-200px)</option>
                            <option value="Large">Large (200-500px)</option>
                            <option value="ExtraLarge">Extra Large (500-1000px)</option>
                        </select>
                    </div>

                    {particleConfig.size.type === "Value" ? (
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                Size: {particleConfig.size.value}px
                            </label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    type="range"
                                    min="0"
                                    max="500"
                                    value={Math.min(particleConfig.size.value, 500)}
                                    onChange={(e) => updateConfig('size.value', parseInt(e.target.value))}
                                    style={{ flex: 1 }}
                                />
                                <ClearableNumberInput
                                    min={0}
                                    max={2000}
                                    value={particleConfig.size.value}
                                    onChange={(value) => updateConfig('size.value', value)}
                                    style={{ 
                                        width: '60px', 
                                        padding: '4px', 
                                        border: '1px solid var(--border)', 
                                        borderRadius: '4px', 
                                        fontSize: '11px' 
                                    }}
                                />
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Range: 0-2000px (slider: 0-500px)
                            </div>
                        </div>
                    ) : particleConfig.size.type === "Range" ? (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Size Min: {particleConfig.size.min}px
                                </label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        value={Math.min(particleConfig.size.min, 500)}
                                        onChange={(e) => updateConfig('size.min', parseInt(e.target.value))}
                                        style={{ flex: 1 }}
                                    />
                                    <ClearableNumberInput
                                        min={0}
                                        max={2000}
                                        value={particleConfig.size.min}
                                        onChange={(value) => updateConfig('size.min', value)}
                                        style={{ 
                                            width: '60px', 
                                            padding: '4px', 
                                            border: '1px solid var(--border)', 
                                            borderRadius: '4px', 
                                            fontSize: '11px' 
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Size Max: {particleConfig.size.max}px
                                </label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        value={Math.min(particleConfig.size.max, 500)}
                                        onChange={(e) => updateConfig('size.max', parseInt(e.target.value))}
                                        style={{ flex: 1 }}
                                    />
                                    <ClearableNumberInput
                                        min={0}
                                        max={2000}
                                        value={particleConfig.size.max}
                                        onChange={(value) => updateConfig('size.max', value)}
                                        style={{ 
                                            width: '60px', 
                                            padding: '4px', 
                                            border: '1px solid var(--border)', 
                                            borderRadius: '4px', 
                                            fontSize: '11px' 
                                        }}
                                    />
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                    Max 2000px each (slider: up to 500px)
                                </div>
                            </div>
                        </>
                    ) : (
                        // Preset ranges
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                {particleConfig.size.type === "Small" && "Size Range: 1-50px"}
                                {particleConfig.size.type === "Medium" && "Size Range: 50-200px"}
                                {particleConfig.size.type === "Large" && "Size Range: 200-500px"}
                                {particleConfig.size.type === "ExtraLarge" && "Size Range: 500-1000px"}
                            </div>
                            <div style={{ 
                                padding: '8px', 
                                background: 'var(--accent)', 
                                borderRadius: '4px', 
                                fontSize: '10px', 
                                color: 'var(--text)' 
                            }}>
                                Using preset range for better performance
                            </div>
                        </div>
                    )}



                    {/* Fill Controls */}
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={particleConfig.fill.enable}
                                onChange={(e) => updateConfig('fill.enable', e.target.checked)}
                            />
                            Enable Fill Background
                        </label>
                    </div>

                    {particleConfig.fill.enable && (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Fill Color
                                </label>
                                <input
                                    type="color"
                                    value={particleConfig.fill.color}
                                    onChange={(e) => updateConfig('fill.color', e.target.value)}
                                    style={{ width: '100%', height: '32px', border: 'none', borderRadius: '4px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Fill Opacity: {particleConfig.fill.opacity}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={particleConfig.fill.opacity}
                                    onChange={(e) => updateConfig('fill.opacity', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </>
                    )}

                    {/* Border Controls */}
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={particleConfig.border.enable}
                                onChange={(e) => updateConfig('border.enable', e.target.checked)}
                            />
                            Enable Border
                        </label>
                    </div>

                    {particleConfig.border.enable && (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Border Color (white = match particle color)
                                </label>
                                <input
                                    type="color"
                                    value={particleConfig.border.color}
                                    onChange={(e) => updateConfig('border.color', e.target.value)}
                                    style={{ width: '100%', height: '30px', border: '1px solid var(--border)', borderRadius: '4px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Border Width: {particleConfig.border.width}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="15"
                                    step="0.1"
                                    value={particleConfig.border.width}
                                    onChange={(e) => updateConfig('border.width', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Border Radius: {particleConfig.border.radius}px
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    step="0.5"
                                    value={particleConfig.border.radius}
                                    onChange={(e) => updateConfig('border.radius', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Border Opacity: {particleConfig.border.opacity}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={particleConfig.border.opacity}
                                    onChange={(e) => updateConfig('border.opacity', parseFloat(e.target.value))}
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
                                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={particleConfig.move.reverseGravity}
                                            onChange={(e) => updateConfig('move.reverseGravity', e.target.checked)}
                                        />
                                        Reverse Gravity
                                    </label>
                                </div>
                            )}

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

                {/* Particle Connections */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LinkSimple size={16} />
                        Particle Connections
                    </h3>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Draw lines between nearby particles to create network effects
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={particleConfig.modes.connectRadius > 0}
                                onChange={(e) => updateConfig('modes.connectRadius', e.target.checked ? 100 : 0)}
                            />
                            Enable Connection Lines
                        </label>
                    </div>

                    {particleConfig.modes.connectRadius > 0 && (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Max Distance: {particleConfig.modes.connectRadius}px
                                </label>
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    How far apart particles can be and still connect
                                </div>
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
                                    Line Opacity: {particleConfig.modes.connectLinks}
                                </label>
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    How visible the connection lines are
                                </div>
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
                </div>

                {/* Mouse Interactions */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CursorClick size={16} />
                        Mouse Interactions
                    </h3>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        How particles react when you hover or click on them
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
                                    Hover Effect Type
                                </label>
                                <select
                                    value={particleConfig.hover.mode}
                                    onChange={(e) => updateConfig('hover.mode', e.target.value)}
                                    style={{ width: '100%', padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}
                                >
                                    <option value="none">None - No effect</option>
                                    <option value="grab">Grab - Pull particles toward cursor</option>
                                    <option value="bubble">Bubble - Grow particles when hovering</option>
                                    <option value="repulse">Repulse - Push particles away from cursor</option>
                                    <option value="attract">Attract - Draw particles to cursor</option>
                                    <option value="connect">Connect - Connect particles to cursor</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Effect Strength: {particleConfig.hover.force}
                                </label>
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    How strong the hover effect is
                                </div>
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
                                    Smoothness: {particleConfig.hover.smooth}
                                </label>
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    How smoothly particles respond to hover (higher = slower)
                                </div>
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
                                    Parallax Effect (3D depth simulation)
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
                </div>

                {/* Interaction Distances */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Ruler size={16} />
                        Interaction Distances
                    </h3>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Fine-tune the ranges and strengths of different particle effects
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Grab Range: {particleConfig.modes.grab}px
                        </label>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Distance for "grab" hover effect
                        </div>
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
                            Bubble Range: {particleConfig.modes.bubble}px
                        </label>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Distance for "bubble" hover effect
                        </div>
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
                            Bubble Growth: {particleConfig.modes.bubbleSize}x
                        </label>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            How much particles grow when bubbled
                        </div>
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
                            Repulse Range: {particleConfig.modes.repulse}px
                        </label>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Distance for "repulse" hover effect
                        </div>
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
                            Repulse Strength: {particleConfig.modes.repulseDistance}x
                        </label>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            How strongly particles are pushed away
                        </div>
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

                {/* Glow & Twinkle Effect Settings */}
                <div style={{ marginBottom: '20px', background: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)' }}>Glow & Twinkle Effects</h3>
                    
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={particleConfig.glow.enable}
                                onChange={(e) => updateConfig('glow.enable', e.target.checked)}
                            />
                            Enable Glow
                        </label>
                    </div>

                    {particleConfig.glow.enable && (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Glow Intensity: {particleConfig.glow.intensity}
                                </label>
                                <input
                                    type="range"
                                    min="0.05"
                                    max="0.5"
                                    step="0.05"
                                    value={particleConfig.glow.intensity}
                                    onChange={(e) => updateConfig('glow.intensity', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                    Glow Size: {particleConfig.glow.size}x
                                </label>
                                <input
                                    type="range"
                                    min="1.2"
                                    max="3"
                                    step="0.1"
                                    value={particleConfig.glow.size}
                                    onChange={(e) => updateConfig('glow.size', parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ marginTop: '16px', marginBottom: '12px' }}>
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
                                    min="0"
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
                                    min="0"
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

                {/* Add Particles Button */}
                <button
                    onClick={handleAddParticles}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '15px',
                        marginBottom: '12px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        background: '#007aff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? (
                        "Adding Particles..."
                    ) : (
                            <>
                                <Play size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Add Particles
                            </>
                    )}
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
                    Choose presets, customize settings, then add to canvas<br/>
                    <strong>Sidebar:</strong> Select any particle component for full customization controls
                </div>

                {/* Copyright Footer */}
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px 0 10px 0', 
                    borderTop: '1px solid var(--border)',
                    marginTop: '20px',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    lineHeight: '1.3'
                }}>
                    © Mojave Studio 2025 - mojavestud.io<br/>
                    Custom Automated Web Design Experts
                </div>
            </div>
        </main>
    )
}


