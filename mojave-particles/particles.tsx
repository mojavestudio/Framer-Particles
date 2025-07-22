// Mojave Particles component - Simplified version
// This component uses pure canvas rendering for maximum compatibility.

// @ts-ignore
import { addPropertyControls, ControlType, Color, RenderTarget } from "framer"

// Import React hooks directly - Framer handles React import automatically
import React, { useState, useEffect, useRef } from "react"

export default function MojaveParticles({
    amount,
    size,
    opacity,
    move,
    color,
    colors,
    backdrop,
    radius,
    hover,
    modes,
    twinkle = { enable: false, speed: 1, minOpacity: 0.1, maxOpacity: 1 },
    backgroundOpacity = 1,
}: any) {
    const [isMounted, setIsMounted] = useState(false)

    // Canvas ref for rendering
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const particlesRef = useRef<any[]>([])
    const startTimeRef = useRef<number | null>(null)
    const mouseRef = useRef<{ x: number, y: number, isHovering: boolean }>({ x: -1, y: -1, isHovering: false })

    // Initialize component
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Main canvas effect
    useEffect(() => {
        if (!isMounted) return
        
        // Always use Canvas mode for v3 compatibility
        const shouldUseCanvas = true
        
        if (!shouldUseCanvas) return
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        if (!canvas) return
        
        const ctx = canvas.getContext('2d', { alpha: true })
        if (!ctx) return
        
        // Convert colors to hex strings like the original - handle design tokens
        function makeHex(colorInput: any): string {
            if (!colorInput) return "#ffffff"
            
            try {
                // Handle Framer Design Tokens (CSS custom properties)
                if (typeof colorInput === 'string' && colorInput.startsWith('var(--token-')) {
                    // Extract RGB values from the CSS custom property
                    const match = colorInput.match(/var\(--token-[^,]+,\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)\)/)
                    if (match) {
                        const [, r, g, b] = match
                        return `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`
                    }
                }
                
                // Handle Framer Color objects
                if (colorInput && typeof colorInput === 'object') {
                    return Color.toHexString(colorInput)
                }
                
                // Handle hex strings
                if (typeof colorInput === 'string' && colorInput.startsWith('#')) {
                    return colorInput
                }
                
                // Fallback
                return Color.toHexString(Color(colorInput))
            } catch (error) {
                return "#ffffff"
            }
        }

        function hexToRgba(hex: string, alpha: number = 1): string {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            if (!result) return `rgba(255, 255, 255, ${alpha})`
            
            const r = parseInt(result[1], 16)
            const g = parseInt(result[2], 16)
            const b = parseInt(result[3], 16)
            
            return `rgba(${r}, ${g}, ${b}, ${alpha})`
        }

        // Convert colors array
        const cols = colors && colors.length > 0 
            ? colors.map((c: any) => makeHex(c))
            : [makeHex(color)]

        // Create particles
        function createParticles() {
            // @ts-ignore
            const canvasWidth = canvas.logicalWidth || 800
            // @ts-ignore
            const canvasHeight = canvas.logicalHeight || 600
                
            const particles: any[] = []
            for (let i = 0; i < amount; i++) {
                const particleColor = cols[Math.floor(Math.random() * cols.length)]
                
                particles.push({
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                    vx: (Math.random() - 0.5) * move.speed * 0.1,
                    vy: (Math.random() - 0.5) * move.speed * 0.1,
                    color: particleColor,
                    size: size.type === "Range" 
                        ? Math.random() * (size.max - size.min) + size.min
                        : size.value,
                    opacity: opacity.type === "Range"
                        ? Math.random() * (opacity.max - opacity.min) + opacity.min
                        : opacity.value,
                    // Add twinkle properties
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
            
            const rect = container.getBoundingClientRect()
            const containerWidth = rect.width || container.offsetWidth || container.clientWidth
            const containerHeight = rect.height || container.offsetHeight || container.clientHeight
            
            // Ensure we have valid dimensions
            if (containerWidth <= 0 || containerHeight <= 0) {
                // If dimensions are still not available, try again soon
                requestAnimationFrame(() => {
                    setTimeout(resizeCanvas, 10)
                })
                return
            }
            
            // Get device pixel ratio for crisp rendering
            const dpr = window.devicePixelRatio || 1
            
            // Set the actual canvas size (internal resolution)
            canvas.width = containerWidth * dpr
            canvas.height = containerHeight * dpr
            
            // Scale the canvas back down using CSS
            canvas.style.width = containerWidth + 'px'
            canvas.style.height = containerHeight + 'px'
            
            // Scale the drawing context to match device pixel ratio
            ctx.scale(dpr, dpr)
            
            // Store the logical dimensions for particle calculations
            // @ts-ignore
            canvas.logicalWidth = containerWidth
            // @ts-ignore
            canvas.logicalHeight = containerHeight
            
            // Initialize particles immediately after canvas is sized
            if (particlesRef.current.length === 0) {
                createParticles()
            }
        }
        
        // More aggressive initialization approach
        const initCanvas = () => {
            // Try immediately
            resizeCanvas()
            
            // Also try after a short delay
            setTimeout(resizeCanvas, 1)
            setTimeout(resizeCanvas, 10)
            setTimeout(resizeCanvas, 50)
        }
        
        // Initialize right away and also when the next frame is ready
        initCanvas()
        requestAnimationFrame(initCanvas)
        
        window.addEventListener('resize', resizeCanvas)

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
            canvas.addEventListener('mousemove', handleMouseMove)
            canvas.addEventListener('mouseleave', handleMouseLeave)
        }

        // Draw static particles (no animation)
        const drawStaticParticles = () => {
            const particles = particlesRef.current
            if (particles && particles.length > 0) {
                // Clear canvas first
                // @ts-ignore
                const width = canvas.logicalWidth || 800
                // @ts-ignore
                const height = canvas.logicalHeight || 600
                ctx.clearRect(0, 0, width, height)
                
                // Draw backdrop
                if (backdrop && backgroundOpacity > 0) {
                    ctx.fillStyle = backdrop || "#141414"
                    ctx.fillRect(0, 0, width, height)
                }
                
                particles.forEach(particle => {
                    const particleOpacity = particle.opacity
                    const colorWithOpacity = hexToRgba(particle.color, particleOpacity)
                    
                    ctx.beginPath()
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                    ctx.fillStyle = colorWithOpacity
                    ctx.fill()
                })
            }
        }

        // Animation loop
        const animate = () => {
            const particles = particlesRef.current
            if (!particles || particles.length === 0) {
                return
            }

            const currentTime = Date.now()
            
            // Handle time limit and looping
            if (move.timeLimit > 0) {
                if (!startTimeRef.current) {
                    startTimeRef.current = currentTime
                }
                
                const elapsedTime = currentTime - startTimeRef.current
                
                if (elapsedTime >= move.timeLimit * 1000) {
                    if (move.loopAnimation) {
                        // Reset timer for perfect loop
                        startTimeRef.current = currentTime
                        // Smoothly reset particles to initial positions for perfect loop
                        // Instead of recreating particles, just reset their positions
                        // @ts-ignore
                        const width = canvas.logicalWidth || canvas.width
                        // @ts-ignore
                        const height = canvas.logicalHeight || canvas.height
                        
                        particlesRef.current.forEach(particle => {
                            // Reset to random positions
                            particle.x = Math.random() * width
                            particle.y = Math.random() * height
                            // Reset velocities
                            particle.vx = (Math.random() - 0.5) * move.speed * 0.1
                            particle.vy = (Math.random() - 0.5) * move.speed * 0.1
                        })
                    } else {
                        // Stop animation
                        if (animationRef.current) {
                            cancelAnimationFrame(animationRef.current)
                            animationRef.current = null
                        }
                        return // Stop the animation loop
                    }
                }
            }

            // @ts-ignore
            const width = canvas.logicalWidth || canvas.width
            // @ts-ignore
            const height = canvas.logicalHeight || canvas.height

            // Clear the entire canvas to prevent trails
            ctx.clearRect(0, 0, width, height)

            // Draw backdrop
            if (backdrop && backgroundOpacity > 0) {
                const backdropColor = makeHex(backdrop)
                ctx.fillStyle = backdropColor
                ctx.fillRect(0, 0, width, height)
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
                    const twinkleMultiplier = (Math.sin(particle.twinklePhase) + 1) / 2 // 0 to 1
                    currentOpacity = twinkle.minOpacity + (twinkle.maxOpacity - twinkle.minOpacity) * twinkleMultiplier
                }

                // Draw particle
                const colorWithOpacity = hexToRgba(particle.color, currentOpacity)
                
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = colorWithOpacity
                ctx.fill()
            })

            // Continue animation
            animationRef.current = requestAnimationFrame(animate)
        }

        // Reset any existing animation
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = null
        }
        
        // Reset timer
        startTimeRef.current = null
        
        // Always animate since we're using canvas mode
        const shouldAnimate = true
        
        if (shouldAnimate) {
            // Start animation loop
            animate()
        } else {
            // Draw static particles once
            drawStaticParticles()
        }

        // Cleanup
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            window.removeEventListener('resize', resizeCanvas)
            if (hover.enable) {
                canvas.removeEventListener('mousemove', handleMouseMove)
                canvas.removeEventListener('mouseleave', handleMouseLeave)
            }
        }
    }, [isMounted, amount, backdrop, color, colors])

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: backgroundOpacity === 0 ? 'transparent' : backdrop,
                borderRadius: radius,
                position: "relative",
                overflow: "hidden",
                minHeight: "200px",
                border: "0",
                outline: "0",
                margin: 0,
                padding: 0,
                boxSizing: "border-box",
                boxShadow: "none",
                transform: "translateZ(0)", // Force hardware acceleration
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
                    transform: "translateZ(0)", // Force hardware acceleration
                    WebkitTransform: "translateZ(0)",
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
        connectRadius: 60,
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
        trailDelay: 0.005,
    },
    move: {
        enable: true,
        direction: "none",
        speed: 2,
        timeLimit: 0, // 0 = infinite
        loopAnimation: true,
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
        vibrateFrequency: 50,
    },
    click: { enable: true, mode: "push" },
    hover: {
        enable: true,
        mode: "grab",
        parallax: false,
        force: 60,
        smooth: 10,
    },
    radius: 0,
    id: "tsparticles",
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
            enable: { type: ControlType.Boolean, title: "Enable Twinkle", defaultValue: false },
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
            timeLimit: {
                type: ControlType.Number,
                min: 0,
                max: 60,
                step: 1,
                defaultValue: 0,
                title: "Time Limit (seconds, 0 = infinite)",
                hidden: (move) => !move.enable,
            },
            loopAnimation: {
                type: ControlType.Boolean,
                defaultValue: true,
                title: "Loop Animation",
                hidden: (move) => !move.enable || !move.timeLimit,
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
})

