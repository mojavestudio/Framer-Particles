// Mojave Particles component - Fixed version
// This component leverages @tsparticles/react to provide extensive customization.

// @ts-ignore
import { addPropertyControls, ControlType, Color, RenderTarget } from "framer"

// Debug logs removed - cache bust v1.1
// Handle React import conflicts with Spline or other embedded viewers
let React: any, useCallback: any, useEffect: any, useRef: any, useState: any
try {
    // @ts-ignore
    const reactModule = require("react")
    React = reactModule
    useCallback = reactModule.useCallback
    useEffect = reactModule.useEffect
    useRef = reactModule.useRef
    useState = reactModule.useState
} catch (e) {
    // Fallback to global React for Spline mode
    // @ts-ignore
    React = window.React
    // @ts-ignore
    useCallback = window.React?.useCallback
    // @ts-ignore
    useEffect = window.React?.useEffect
    // @ts-ignore
    useRef = window.React?.useRef
    // @ts-ignore
    useState = window.React?.useState
}

// Conditional import to avoid Three.js conflicts
let Particles, loadFull
if (typeof window !== 'undefined') {
    try {
        // @ts-ignore
        const tsparticles = require("@tsparticles/react")
        // @ts-ignore
        const tsparticlesEngine = require("@tsparticles/engine")
        Particles = tsparticles.Particles
        loadFull = tsparticlesEngine.loadFull
    } catch (e) {
        // Fallback to global if require fails
        // @ts-ignore
        Particles = window.reactTsparticles?.Particles
        // @ts-ignore
        loadFull = window.tsparticles?.loadFull
    }
}

export default function MojaveParticles({
    splineMode,
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
    fps,
    density = { enable: true, area: 800, factor: 1000 },
    shape = { type: "circle" },
    links = { enable: false, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
    collisions = { enable: false },
    rotate = { value: 0, random: false, direction: "clockwise", animation: { enable: false, speed: 0, sync: false } },
}: any) {
    const [tsParticlesAvailable, setTsParticlesAvailable] = useState(false)
    const [error, setError] = useState(null)
    const [isMounted, setIsMounted] = useState(false)

    // Canvas ref for Spline mode
    const canvasRef = useRef(null)
    const animationRef = useRef(null)
    const particlesRef = useRef([])
    const startTimeRef = useRef(null)
    // const previewTimerRef = useRef(null) // Currently unused
    const mouseRef = useRef({ x: -1, y: -1, isHovering: false })

    // Detect environment
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    // const isPreview = RenderTarget.current() === RenderTarget.preview // Currently unused
    // const isPublished = RenderTarget.current() !== RenderTarget.canvas && RenderTarget.current() !== RenderTarget.preview // Currently unused

    // Check tsParticles availability
    useEffect(() => {
        setIsMounted(true)
        
        // Environment check debug removed to prevent console spam
        
        if (!splineMode && Particles && loadFull) {
            setTsParticlesAvailable(true)
            setError(null)
            // console.log("tsParticles is available - hover interactions will work")
        } else if (!splineMode) {
            setTsParticlesAvailable(false)
            setError("tsParticles not available - switching to Canvas Mode (hover interactions disabled)")
            // console.warn("tsParticles not available:", { Particles: !!Particles, loadFull: !!loadFull })
        }
    }, [splineMode])

    // Callback to initialize the tsParticles engine
    const init = useCallback(async (engine: any) => {
        try {
            if (loadFull) {
                await loadFull(engine)
            } else {
                throw new Error("loadFull not available")
            }
        } catch (error) {
            console.error("Failed to load particles engine:", error)
            setError("Failed to load particles engine")
            setTsParticlesAvailable(false)
        }
    }, [])

    // Convert colors to hex strings like the original - handle design tokens
    const makeHex = (property: any): string => {
        try {
            // If it's already a hex string, return it
            if (typeof property === 'string' && property.startsWith('#')) {
                return property
            }
            
            // If it's a CSS custom property (design token), extract the fallback value
            if (typeof property === 'string' && property.includes('var(')) {
                // Extract the fallback value from var(--token, fallback)
                // Handle both simple and complex fallback values
                const match = property.match(/var\([^,]+,\s*([^)]+)\)/)
                if (match) {
                    const extracted = match[1].trim()
                    property = extracted
                }
            }
            
            // Use Framer's Color conversion
            const result = Color.toHexString(Color(property))
            return result
        } catch (error) {
            console.warn("Color conversion failed:", error)
            // Fallback to white if conversion fails
            return '#ffffff'
        }
    }
    
    // Handle multiple colors for particles - match original logic exactly
    const hasMultipleColors = colors.length > 0
    const cols = hasMultipleColors ? colors.map((color: any) => makeHex(color)) : makeHex(color)
    
    // Convert any Framer color format to RGBA string for canvas mode
    const convertToCanvasColor = (color: any, alpha: number = 1): string => {
        if (!color) return `rgba(255, 255, 255, ${alpha})`
        
        try {
            // Use the same approach as the original: convert to hex first
            const hexColor = makeHex(color)
            return hexToRgba(hexColor, alpha)
        } catch (error) {
            console.warn("Failed to convert color:", color, error)
            return `rgba(255, 255, 255, ${alpha})`
        }
    }
    
    // Fallback hex to RGBA converter (for edge cases)
    const hexToRgba = (hex: string, alpha: number = 1): string => {
        if (!hex) return `rgba(255, 255, 255, ${alpha})`
        
        // Remove # if present
        hex = hex.replace('#', '')
        
        // Handle 3-digit hex codes
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('')
        }
        
        if (hex.length !== 6) return `rgba(255, 255, 255, ${alpha})`
        
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    
    // Get random color from the processed colors array for canvas mode
    const getRandomCanvasColor = (): string => {
        return hasMultipleColors 
            ? cols[Math.floor(Math.random() * cols.length)]
            : cols as string
    }



    // Canvas Animation (Spline Mode or Fallback)
    useEffect(() => {
        if (!isMounted) return
        
        // Use Canvas mode if Spline mode is ON or if tsParticles is not available
        const shouldUseCanvas = splineMode || !tsParticlesAvailable || error
        
        if (!shouldUseCanvas) return // Use tsParticles if available
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        if (!canvas) return
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        // Set canvas size with proper scaling
        const resizeCanvas = () => {
            const container = canvas.parentElement
            if (!container) return
            
            const rect = container.getBoundingClientRect()
            const containerWidth = rect.width || 800
            const containerHeight = rect.height || 600
            
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
            canvas.logicalWidth = containerWidth
            canvas.logicalHeight = containerHeight
        }
        
        // Initial resize with delay to ensure container is ready
        setTimeout(resizeCanvas, 100)
        window.addEventListener('resize', resizeCanvas)

        // Mouse event handlers for hover interactions
        const handleMouseMove = (event: MouseEvent) => {
            if (!hover.enable) return
            
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
                isHovering: true
            }
        }

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1, y: -1, isHovering: false }
        }

        if (hover.enable) {
            canvas.addEventListener('mousemove', handleMouseMove as EventListener)
            canvas.addEventListener('mouseleave', handleMouseLeave)
        }

        // Create particles
        const createParticles = () => {
            const canvasWidth = canvas.logicalWidth || 800
            const canvasHeight = canvas.logicalHeight || 600
            
            const particles: any[] = []
            for (let i = 0; i < amount; i++) {
                particles.push({
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                    vx: move.enable ? (Math.random() - 0.5) * (move.speed || 2) * 0.1 : 0,
                    vy: move.enable ? (Math.random() - 0.5) * (move.speed || 2) * 0.1 : 0,
                    size: size.type === "Range" 
                        ? Math.random() * (size.max - size.min) + size.min
                        : size.value,
                    color: getRandomCanvasColor(), // Assign a random hex color to each particle
                    opacity: opacity.type === "Range" 
                        ? Math.random() * (opacity.max - opacity.min) + opacity.min
                        : opacity.value, // Assign fixed opacity to prevent flickering
                    originalSize: size.type === "Range" 
                        ? Math.random() * (size.max - size.min) + size.min
                        : size.value, // Store original size for hover effect
                })
            }
            
            particlesRef.current = particles
        }

        // Draw static particles (no animation)
        const drawStaticParticles = () => {
            const particles = particlesRef.current
            if (particles && particles.length > 0) {
                ctx.fillStyle = backdrop || "#141414"
                ctx.fillRect(0, 0, canvas.logicalWidth || 800, canvas.logicalHeight || 600)
                
                particles.forEach(particle => {
                    // Draw connection lines first (behind particle)
                    if (particle.grabConnection) {
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(particle.grabConnection.x, particle.grabConnection.y)
                        ctx.strokeStyle = hexToRgba(particle.color, particle.grabConnection.opacity)
                        ctx.lineWidth = 1
                        ctx.stroke()
                    }
                    
                    if (particle.connectConnection) {
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(particle.connectConnection.x, particle.connectConnection.y)
                        ctx.strokeStyle = hexToRgba(particle.color, particle.connectConnection.opacity)
                        ctx.lineWidth = 2
                        ctx.stroke()
                    }
                    
                    // Draw trail points
                    if (particle.trailPoints && particle.trailPoints.length > 0) {
                        particle.trailPoints.forEach(point => {
                                                            if (point.life > 0) {
                                    ctx.beginPath()
                                    ctx.arc(point.x, point.y, particle.size * 0.5, 0, Math.PI * 2)
                                    ctx.fillStyle = hexToRgba(particle.color, point.life * 0.3)
                                    ctx.fill()
                                }
                        })
                    }
                    
                    // Draw particle with hover size
                    const renderSize = particle.hoverSize || particle.size
                    ctx.beginPath()
                    ctx.arc(particle.x, particle.y, Math.max(2, renderSize), 0, Math.PI * 2)
                    
                    // Use particle's pre-assigned opacity to prevent flickering
                    const particleOpacity = particle.opacity
                    
                    // Convert hex color to RGBA with opacity (particle.color is already hex)
                    const colorWithOpacity = hexToRgba(particle.color, particleOpacity)
                    ctx.fillStyle = colorWithOpacity
                    ctx.fill()
                    
                    // Only add subtle stroke if opacity is very low, otherwise skip stroke
                    if (particleOpacity < 0.5) {
                        const strokeOpacity = Math.min(particleOpacity + 0.1, 0.3)
                        const strokeColor = hexToRgba(particle.color, strokeOpacity)
                        ctx.strokeStyle = strokeColor
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                })
            }
        }

        // Animation loop for dynamic particles
        const animate = () => {
            try {
                if (!canvas || !ctx) return

                const currentTime = Date.now()
                
                // Initialize start time if not set
                if (!startTimeRef.current) {
                    startTimeRef.current = currentTime
                }

                const elapsedTime = currentTime - startTimeRef.current

                // Handle time limit
                if (move.timeLimit && move.timeLimit > 0) {
                    if (move.loopAnimation) {
                        // Perfect loop - reset when time limit reached
                        if (elapsedTime >= move.timeLimit * 1000) {
                            startTimeRef.current = currentTime
                            // Smoothly reset particles to initial positions for perfect loop
                            // Instead of recreating particles, just reset their positions
                            const width = canvas.logicalWidth || canvas.width
                            const height = canvas.logicalHeight || canvas.height
                            
                            particlesRef.current.forEach(particle => {
                                // Reset to random positions
                                particle.x = Math.random() * width
                                particle.y = Math.random() * height
                                
                                // Reset velocities if movement is enabled
                                if (move.enable) {
                                    const speed = move.speed * 0.1
                                    particle.vx = (Math.random() - 0.5) * speed
                                    particle.vy = (Math.random() - 0.5) * speed
                                    
                                    if (move.direction === "top") {
                                        particle.vy = -Math.abs(particle.vy)
                                    } else if (move.direction === "bottom") {
                                        particle.vy = Math.abs(particle.vy)
                                    } else if (move.direction === "left") {
                                        particle.vx = -Math.abs(particle.vx)
                                    } else if (move.direction === "right") {
                                        particle.vx = Math.abs(particle.vx)
                                    }
                                }
                            })
                        }
                    } else {
                        // Stop animation after time limit - just return without continuing
                        if (elapsedTime >= move.timeLimit * 1000) {
                            return // Stop the animation loop
                        }
                    }
                }

                const width = canvas.logicalWidth || canvas.width
                const height = canvas.logicalHeight || canvas.height

                // Clear the entire canvas to prevent trails
                ctx.clearRect(0, 0, width, height)

                // Draw backdrop if specified
                if (backdrop) {
                    const backdropColor = makeHex(backdrop)
                    ctx.fillStyle = backdropColor
                    ctx.fillRect(0, 0, width, height)
                }

                // Update and draw particles
                particlesRef.current.forEach((particle, index) => {
                    // Update position if movement is enabled
                    if (move.enable) {
                        particle.x += particle.vx
                        particle.y += particle.vy

                        // Bounce off boundaries
                        if (particle.x <= 0 || particle.x >= width) {
                            particle.vx = -particle.vx
                            particle.x = Math.max(0, Math.min(width, particle.x))
                        }
                        if (particle.y <= 0 || particle.y >= height) {
                            particle.vy = -particle.vy
                            particle.y = Math.max(0, Math.min(height, particle.y))
                        }
                    }

                    // Handle hover interactions
                    const mouse = mouseRef.current
                    if (hover.enable && mouse.isHovering && mouse.x >= 0 && mouse.y >= 0) {
                        const dx = particle.x - mouse.x
                        const dy = particle.y - mouse.y
                        const distance = Math.sqrt(dx * dx + dy * dy)

                        if (distance < hover.distance) {
                            const force = (hover.distance - distance) / hover.distance

                            if (hover.mode === "repulse") {
                                const angle = Math.atan2(dy, dx)
                                particle.x += Math.cos(angle) * force * 2
                                particle.y += Math.sin(angle) * force * 2
                            } else if (hover.mode === "attract") {
                                const angle = Math.atan2(dy, dx)
                                particle.x -= Math.cos(angle) * force * 0.5
                                particle.y -= Math.sin(angle) * force * 0.5
                            } else if (hover.mode === "bubble") {
                                particle.size = particle.originalSize * (1 + force * 0.5)
                            } else if (hover.mode === "grab") {
                                // Draw line to mouse
                                ctx.beginPath()
                                ctx.moveTo(particle.x, particle.y)
                                ctx.lineTo(mouse.x, mouse.y)
                                const lineOpacity = force * 0.3
                                ctx.strokeStyle = hexToRgba(particle.color, lineOpacity)
                                ctx.lineWidth = 1
                                ctx.stroke()
                            }
                        }
                    } else if (hover.mode === "bubble") {
                        // Reset bubble size when not hovering
                        particle.size = particle.originalSize
                    }

                    // Draw particle
                    ctx.beginPath()
                    ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI)

                    // Calculate particle opacity based on settings
                    let particleOpacity = particle.opacity
                    if (opacity.type === "Random") {
                        // Keep the stored random opacity for this particle
                        particleOpacity = particle.opacity
                    } else if (opacity.type === "Range") {
                        // Keep the stored range opacity for this particle
                        particleOpacity = particle.opacity
                    } else {
                        // Use the fixed value
                        particleOpacity = opacity.value
                    }

                    // Convert hex color to RGBA with opacity (particle.color is already hex)
                    const colorWithOpacity = hexToRgba(particle.color, particleOpacity)
                    ctx.fillStyle = colorWithOpacity
                    ctx.fill()

                    // Only add subtle stroke if opacity is very low, otherwise skip stroke
                    if (particleOpacity < 0.5) {
                        const strokeOpacity = Math.min(particleOpacity + 0.1, 0.3)
                        const strokeColor = hexToRgba(particle.color, strokeOpacity)
                        ctx.strokeStyle = strokeColor
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }

                    // Handle trail effect
                    if (hover.mode === "trail" && hover.enable && mouse.isHovering) {
                        const dx = particle.x - mouse.x
                        const dy = particle.y - mouse.y
                        const distance = Math.sqrt(dx * dx + dy * dy)

                        if (distance < hover.distance) {
                            // Draw trail
                            ctx.beginPath()
                            ctx.moveTo(particle.x, particle.y)
                            ctx.lineTo(mouse.x, mouse.y)
                            const trailOpacity = (hover.distance - distance) / hover.distance * 0.2
                            ctx.strokeStyle = hexToRgba(particle.color, trailOpacity)
                            ctx.lineWidth = 2
                            ctx.stroke()
                        }
                    }
                })

                // Handle connections between particles
                if (hover.mode === "connect" && hover.enable) {
                    for (let i = 0; i < particlesRef.current.length; i++) {
                        for (let j = i + 1; j < particlesRef.current.length; j++) {
                            const p1 = particlesRef.current[i]
                            const p2 = particlesRef.current[j]
                            const dx = p1.x - p2.x
                            const dy = p1.y - p2.y
                            const distance = Math.sqrt(dx * dx + dy * dy)

                            if (distance < hover.distance) {
                                ctx.beginPath()
                                ctx.moveTo(p1.x, p1.y)
                                ctx.lineTo(p2.x, p2.y)
                                const connectionOpacity = (hover.distance - distance) / hover.distance * 0.1
                                ctx.strokeStyle = hexToRgba(p1.color, connectionOpacity)
                                ctx.lineWidth = 1
                                ctx.stroke()
                            }
                        }
                    }
                }

                // Continue animation loop if still active
                if (move.enable) {
                    animationRef.current = requestAnimationFrame(animate)
                } else {
                    // Even if movement is disabled, keep the loop running for static display and hover effects
                    drawStaticParticles()
                    animationRef.current = requestAnimationFrame(animate)
                }
            } catch (error) {
                console.error("Animation error:", error)
            }
        }
        
        // Initialize particles and start appropriate mode
        const initializeCanvas = () => {
            // Cancel any existing animation loop to prevent duplicates
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
                animationRef.current = null
            }

            resizeCanvas() // Ensure canvas is sized properly
            setTimeout(() => {
                // Small delay to ensure canvas is ready after resize
                createParticles()
                
                // Reset timing for fresh start
                startTimeRef.current = null
                
                // Determine if we should animate - always animate in spline mode, or when not in canvas
                const shouldAnimate = splineMode || !isCanvas
                
                if (shouldAnimate) {
                    // Start animation loop
                    animate()
                } else {
                    // Draw static particles once
                    drawStaticParticles()
                }
            }, 50)
        }
        
        // Start with a delay to ensure canvas is ready
        setTimeout(initializeCanvas, 300)

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            if (canvas && hover.enable) {
                canvas.removeEventListener('mousemove', handleMouseMove as EventListener)
                canvas.removeEventListener('mouseleave', handleMouseLeave)
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isMounted, splineMode, tsParticlesAvailable, amount, size, opacity, move.speed, move.enable, isCanvas, error, backdrop, color, colors, hover.enable, hover.mode, modes.repulse, modes.grab, modes.bubble, modes.bubbleSize, modes.grabLinks, modes.connect, modes.connectLinks, move.timeLimit, move.loopAnimation])

    // Simplified mode selection: use canvas mode if in spline mode, or if tsParticles is not available
    const useCanvasMode = splineMode || (!tsParticlesAvailable || error)
    
    // Mode selection debug removed to prevent console spam

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: backdrop,
                borderRadius: radius,
                position: "relative",
                overflow: "hidden",
                minHeight: "200px", // Ensure minimum height for particles to show
            }}
        >
            {/* Canvas Mode - Spline or Fallback */}
            {useCanvasMode && (
                <canvas
                    ref={canvasRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "block", // Always show canvas when in canvas mode
                        pointerEvents: hover.enable ? "auto" : "none", // Enable mouse events for hover interactions
                    }}
                />
            )}
            
            {/* tsParticles Mode - Normal */}
            {!useCanvasMode && Particles && isMounted && (
            <Particles
                id="mojave-particles"
                init={init}
                    style={{ 
                        position: "absolute", 
                        width: "100%", 
                        height: "100%",
                        top: 0,
                        left: 0,
                    }}
                options={{
                    autoPlay: true, // Always play in tsParticles mode
                    fullScreen: { enable: false },
                    fpsLimit: fps,
                    detectRetina: true,
                        pauseOnBlur: true,
                        pauseOnOutsideViewport: true,
                    background: {
                        color: {
                            value: "transparent",
                        },
                    },

                    interactivity: isCanvas
                        ? { detectsOn: "canvas" }
                        : {
                              detectsOn: "canvas",
                              events: {
                                  onClick: {
                                      enable: false, // Simplified - no click interactions
                                      mode: [],
                                  },
                                  onHover: {
                                      enable: hover.enable,
                                      mode: hover.mode,
                                      parallax: {
                                          enable: hover.parallax,
                                          force: hover.force,
                                          smooth: hover.smooth,
                                      },
                                  },
                                  resize: true,
                              },
                              modes: {
                                  connect: {
                                      distance: modes.connect,
                                      links: {
                                          opacity: modes.connectLinks,
                                      },
                                      radius: modes.connectRadius,
                                  },
                                  grab: {
                                      distance: modes.grab,
                                      links: {
                                          opacity: modes.grabLinks,
                                      },
                                  },
                                  bubble: {
                                      distance: modes.bubble,
                                      size: modes.bubbleSize,
                                      duration: modes.bubbleDuration,
                                  },
                                  repulse: {
                                      distance: modes.repulse,
                                      duration: modes.repulseDistance,
                                  },
                                  push: {
                                      particles_nb: modes.push,
                                  },
                                  remove: {
                                      particles_nb: modes.remove,
                                  },
                                  trail: {
                                      delay: modes.trailDelay,
                                      quantity: modes.trail,
                                  },
                              },
                          },

                    particles: {
                        number: {
                            value: amount,
                            density: {
                                enable: density.enable,
                                area: density.area,
                                factor: density.factor,
                            },
                        },

                        color: {
                            value: cols,
                        },

                        shape: {
                            type: shape,
                        },

                        opacity: {
                            value:
                                opacity.type === "Range"
                                    ? { min: opacity.min, max: opacity.max }
                                    : opacity.value,
                        },

                        size: {
                            value:
                                size.type === "Range"
                                    ? { min: size.min, max: size.max }
                                    : size.value,
                        },

                        links: links.enable
                            ? {
                                  enable: true,
                                  distance: links.distance,
                                  color: Color.toHexString(Color(links.color)),
                                  opacity: links.opacity,
                                  width: links.width,
                              }
                            : { enable: false },

                        collisions: collisions.enable
                            ? {
                                  enable: true,
                                  mode: collisions.collisionMode || "bounce",
                                  bounce: {
                                      horizontal: {
                                          value:
                                              collisions.bounceHorizontal || 1,
                                      },
                                      vertical: {
                                          value: collisions.bounceVertical || 1,
                                      },
                                  },
                              }
                            : { enable: false },

                        move: move.enable
                            ? {
                                  enable: true,
                                  direction: move.direction,
                                  speed: {
                                      min: move.speed * 0.5,
                                      max: move.speed,
                                  },
                                  random: move.random,
                                  straight: move.straight,
                                  outModes: {
                                      default: move.out,
                                      top: move.outTop || move.out,
                                      bottom: move.outBottom || move.out,
                                      left: move.outLeft || move.out,
                                      right: move.outRight || move.out,
                                  },
                                  trail: {
                                      enable: move.trail,
                                      length: move.trailLength,
                                  },
                                  gravity: {
                                      enable: move.gravity,
                                      acceleration: move.gravityAcceleration,
                                      maxSpeed: move.gravityMaxSpeed || 50,
                                  },
                                  spin: {
                                      enable: move.spin,
                                      acceleration: move.spinSpeed,
                                  },
                                  attract: {
                                      enable: move.attract,
                                      distance: move.attractDistance,
                                      rotate: {
                                          x: 600,
                                          y: 1200,
                                      },
                                  },
                              }
                            : { enable: false },

                        rotate: {
                            value: rotate.value,
                            direction: rotate.direction,
                            animation: {
                                enable: rotate.animate,
                                speed: rotate.speed,
                                sync: rotate.sync,
                            },
                        },
                    },
                }}
            />
            )}
            
            {/* Canvas Mode Preview Text - Only show in static preview mode */}
            {isCanvas && useCanvasMode && !splineMode && (
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    fontSize: "14px",
                    textAlign: "center",
                    pointerEvents: "none",
                    zIndex: 10,
                }}>
                    Particles Preview
                    <br />
                    {amount} particles
                    <br />
                    Mode: Canvas (Static Preview)
                    <br />
                    Will animate when published
                    {error && <br />}
                    {error && <span style={{color: "red", fontSize: "12px"}}>{error}</span>}
                </div>
            )}
            

        </div>
    )
}

// Default properties
MojaveParticles.defaultProps = {
    backdrop: "#141414",
    color: "#ffffff",
    colors: [],
    fps: 60,
    amount: 50,
    density: { enable: true, area: 800, factor: 1000 },
    size: { type: "Range", value: 3, min: 1, max: 5 },
    opacity: { type: "Range", value: 0.5, min: 0.1, max: 1 },
    links: {
        enable: true,
        color: "#ffffff",
        opacity: 0.4,
        distance: 150,
        width: 1,
    },
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
    collisions: {
        enable: false,
        collisionMode: "bounce",
        bounceHorizontal: 1,
        bounceVertical: 1,
    },
    shape: "circle",
    click: { enable: true, mode: "push" },
    hover: {
        enable: true,
        mode: "grab",
        parallax: false,
        force: 60,
        smooth: 10,
    },
    rotate: {
        value: 0,
        direction: "clockwise",
        animate: false,
        speed: 5,
        sync: false,
    },
    radius: 0,
    id: "tsparticles",
    splineMode: false,
}

// Property controls for Framer
addPropertyControls(MojaveParticles, {
    splineMode: { type: ControlType.Boolean, title: "Spline Mode", defaultValue: false },
    backdrop: { type: ControlType.Color, title: "Background" },
    color: { type: ControlType.Color, title: "Color" },
    colors: {
        type: ControlType.Array,
        title: "Colors",
        control: { type: ControlType.Color },
    },
    fps: {
        type: ControlType.Enum,
        title: "FPS",
        options: [30, 60, 120],
        displaySegmentedControl: true,
    },
    amount: {
        type: ControlType.Number,
        title: "Amount",
        min: 0,
        max: 300,
        defaultValue: 50,
    },
    density: {
        type: ControlType.Object,
        title: "Density",
        controls: {
            enable: { type: ControlType.Boolean, defaultValue: true },
            area: {
                type: ControlType.Number,
                defaultValue: 800,
                hidden: (density) => !density.enable,
            },
            factor: {
                type: ControlType.Number,
                defaultValue: 1000,
                hidden: (density) => !density.enable,
            },
        },
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
    links: {
        type: ControlType.Object,
        title: "Links",
        controls: {
            enable: { type: ControlType.Boolean, defaultValue: true },
            color: {
                type: ControlType.Color,
                defaultValue: "#ffffff",
                hidden: (links) => !links.enable,
            },
            opacity: {
                type: ControlType.Number,
                defaultValue: 0.4,
                hidden: (links) => !links.enable,
            },
            distance: {
                type: ControlType.Number,
                defaultValue: 150,
                hidden: (links) => !links.enable,
            },
            width: {
                type: ControlType.Number,
                defaultValue: 1,
                hidden: (links) => !links.enable,
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
    collisions: {
        type: ControlType.Object,
        title: "Collisions",
        controls: {
            enable: { type: ControlType.Boolean, defaultValue: false },
            collisionMode: {
                type: ControlType.Enum,
                options: ["bounce", "destroy", "absorb"],
                defaultValue: "bounce",
                hidden: (collisions) => !collisions.enable,
            },
            bounceHorizontal: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0,
                max: 2,
                step: 0.1,
                hidden: (collisions) => !collisions.enable,
            },
            bounceVertical: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0,
                max: 2,
                step: 0.1,
                hidden: (collisions) => !collisions.enable,
            },
        },
    },
    shape: {
        type: ControlType.Enum,
        title: "Shape",
        options: [
            "circle",
            "square",
            "triangle",
            "polygon",
            "star",
            "character",
            "image",
            "line",
            "edge",
            "heart",
        ],
        defaultValue: "circle",
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
    rotate: {
        type: ControlType.Object,
        title: "Rotate",
        controls: {
            value: { type: ControlType.Number, defaultValue: 0 },
            direction: {
                type: ControlType.Enum,
                options: ["clockwise", "counterclockwise", "random"],
                defaultValue: "clockwise",
            },
            animate: { type: ControlType.Boolean, defaultValue: false },
            speed: {
                type: ControlType.Number,
                defaultValue: 5,
                hidden: (rotate) => !rotate.animate,
            },
            sync: {
                type: ControlType.Boolean,
                defaultValue: false,
                hidden: (rotate) => !rotate.animate,
            },
        },
    },
    radius: { type: ControlType.Number, defaultValue: 0 },
    id: { type: ControlType.String, defaultValue: "tsparticles" },
})

