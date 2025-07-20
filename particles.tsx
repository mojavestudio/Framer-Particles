// Mojave Particles component - Fixed version
// This component leverages react-tsparticles to provide extensive customization.

// Handle React import conflicts with Spline or other embedded viewers
let React
try {
    // @ts-ignore
    React = require("react")
} catch (e) {
    // @ts-ignore
    React = window.React
}

import { addPropertyControls, ControlType, Color, RenderTarget } from "framer"
import { useCallback, useEffect, useRef, useState } from "react"

// Conditional import to avoid Three.js conflicts
let Particles, loadFull
if (typeof window !== 'undefined') {
    try {
        // @ts-ignore
        const tsparticles = require("react-tsparticles")
        // @ts-ignore
        const tsparticlesEngine = require("tsparticles")
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

export default function MojaveParticles(props) {
    const {
        backdrop,
        color,
        colors,
        fps,
        amount,
        density,
        size,
        opacity,
        links,
        modes,
        move,
        shape,
        click,
        hover,
        rotate,
        radius,
        id,
        collisions,
        splineMode,
        testMode,
        previewAnimation,
    } = props

    // State to track if tsParticles is available
    const [tsParticlesAvailable, setTsParticlesAvailable] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    // Canvas ref for Spline mode
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const particlesRef = useRef<any[]>([])
    const previewTimerRef = useRef<number | null>(null)

    // Detect environment
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const isPreview = RenderTarget.current() === RenderTarget.preview
    const isPublished = RenderTarget.current() !== RenderTarget.canvas && RenderTarget.current() !== RenderTarget.preview

    // Check tsParticles availability
    useEffect(() => {
        setIsMounted(true)
        
        if (!splineMode && Particles && loadFull) {
            setTsParticlesAvailable(true)
            setError(null)
        } else if (!splineMode) {
            setTsParticlesAvailable(false)
            setError("tsParticles not available - switching to Canvas Mode")
        }
    }, [splineMode])

    // Callback to initialize the tsParticles engine
    const init = useCallback(async (engine) => {
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

    // Handle multiple colors for particles
    const cols = Array.isArray(colors) && colors.length ? colors : [color]



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
        
        // Set canvas size with fallback
        const resizeCanvas = () => {
            const container = canvas.parentElement
            const containerWidth = container?.offsetWidth || 800
            const containerHeight = container?.offsetHeight || 600
            
            canvas.width = containerWidth
            canvas.height = containerHeight
        }
        
        // Initial resize with delay to ensure container is ready
        setTimeout(resizeCanvas, 100)
        window.addEventListener('resize', resizeCanvas)

        // Create particles
        const createParticles = () => {
            const canvasWidth = canvas.width || 800
            const canvasHeight = canvas.height || 600
            
            const particles: any[] = []
            for (let i = 0; i < amount; i++) {
                particles.push({
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                    vx: (Math.random() - 0.5) * (move.speed || 2),
                    vy: (Math.random() - 0.5) * (move.speed || 2),
                    size: size.type === "Range" 
                        ? Math.random() * (size.max - size.min) + size.min
                        : size.value,
                })
            }
            
            particlesRef.current = particles
        }

        // Draw static particles (no animation)
        const drawStaticParticles = () => {
            const particles = particlesRef.current
            if (particles && particles.length > 0) {
                ctx.fillStyle = backdrop || "#141414"
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                
                particles.forEach(particle => {
                    ctx.beginPath()
                    ctx.arc(particle.x, particle.y, Math.max(2, particle.size), 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.3, opacity.type === "Range" ? opacity.max : opacity.value)})`
                    ctx.fill()
                    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.5, opacity.type === "Range" ? opacity.max : opacity.value)})`
                    ctx.lineWidth = 1
                    ctx.stroke()
                })
            }
        }

        // Animation loop for dynamic particles
        const animate = () => {
            try {
                if (!canvas || !ctx) return
                
                const width = canvas.width || 800
                const height = canvas.height || 600
                
                if (!width || !height) {
                    animationRef.current = requestAnimationFrame(animate)
                    return
                }
                
                // Clear canvas with background
                ctx.fillStyle = backdrop || "#141414"
                ctx.fillRect(0, 0, width, height)
                
                // Draw particles
                const particles = particlesRef.current
                if (particles && particles.length > 0) {
                    particles.forEach(particle => {
                        // Update position
                        particle.x += particle.vx
                        particle.y += particle.vy
                        
                        // Bounce off edges
                        if (particle.x < 0 || particle.x > width) particle.vx *= -1
                        if (particle.y < 0 || particle.y > height) particle.vy *= -1
                        
                        // Keep particles within bounds
                        particle.x = Math.max(0, Math.min(width, particle.x))
                        particle.y = Math.max(0, Math.min(height, particle.y))
                        
                        // Draw particle with more visible settings
                        ctx.beginPath()
                        ctx.arc(particle.x, particle.y, Math.max(1, particle.size), 0, Math.PI * 2)
                        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.3, opacity.type === "Range" ? opacity.max : opacity.value)})`
                        ctx.fill()
                        
                        // Add a stroke to make particles more visible
                        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.5, opacity.type === "Range" ? opacity.max : opacity.value)})`
                        ctx.lineWidth = 1
                        ctx.stroke()
                    })
                }
                
                animationRef.current = requestAnimationFrame(animate)
            } catch (err) {
                console.error("Canvas animation error:", err)
                setError("Canvas animation error: " + err.message)
            }
        }
        
        // Initialize particles and start appropriate mode
        const initializeCanvas = () => {
            resizeCanvas() // Ensure canvas is sized
            createParticles()
            
            // Determine if we should animate or show static particles
            const shouldAnimate = previewAnimation || !isCanvas || testMode
            
            if (shouldAnimate) {
                // Start animation loop
                animate()
            } else {
                // Draw static particles once
                drawStaticParticles()
            }
        }
        
        // Start with a delay to ensure canvas is ready
        setTimeout(initializeCanvas, 300)

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isMounted, splineMode, tsParticlesAvailable, amount, size, opacity, move.speed, isCanvas, error, testMode, backdrop, previewAnimation])

    // Determine which mode to use
    const useCanvasMode = splineMode || !tsParticlesAvailable || error

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
                    }}
                />
            )}
            
            {/* tsParticles Mode - Normal */}
            {!useCanvasMode && Particles && isMounted && (
            <Particles
                id={id}
                init={init}
                    style={{ 
                        position: "absolute", 
                        width: "100%", 
                        height: "100%",
                        top: 0,
                        left: 0,
                    }}
                options={{
                        autoPlay: previewAnimation || !isCanvas, // Play when preview animation is enabled or not in canvas
                    fullScreen: { enable: false },
                    fpsLimit: isCanvas && !previewAnimation ? 1 : fps,
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
                                      enable: click.enable,
                                      mode: click.mode,
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
            
            {/* Canvas Mode Preview Text */}
            {isCanvas && !testMode && !previewAnimation && useCanvasMode && (
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
                    Mode: Canvas (Static)
                    <br />
                    Toggle "Preview Animation" to see movement
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
        random: false,
        straight: false,
        out: "out",
        outTop: "out",
        outBottom: "out",
        outLeft: "out",
        outRight: "out",
        trail: false,
        trailLength: 10,
        gravity: false,
        gravityAcceleration: 9.81,
        gravityMaxSpeed: 50,
        spin: false,
        spinSpeed: 2,
        attract: false,
        attractDistance: 200,
        vibrate: false,
        vibrateFrequency: 50,
        vibrateAmplitude: 1,
        angleOffset: 0,
        angleValue: 90,
        pathEnable: false,
        pathGenerator: "polygonPathGenerator",
        pathSides: 6,
        pathTurns: 30,
        pathAngle: 30,
        drift: 0,
        decay: 0,
        noise: false,
        noiseDelay: 0,
        noiseFactor: 1,
        warp: false,
        warpDistance: 100,
        magnet: false,
        magnetDistance: 200,
        magnetStrength: 1,
        spiral: false,
        spiralRadius: 50,
        spiralSpeed: 1,
        spiralDirection: "clockwise",
        wave: false,
        waveAmplitude: 10,
        waveFrequency: 0.1,
        wavePhase: 0,
        orbit: false,
        orbitRadius: 100,
        orbitSpeed: 1,
        orbitCenterX: 50,
        orbitCenterY: 50,
        follow: false,
        followTarget: "mouse",
        followDistance: 100,
        followSpeed: 1,
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
    testMode: false,
    previewAnimation: false,
}

// Property controls for Framer
addPropertyControls(MojaveParticles, {
    splineMode: { type: ControlType.Boolean, title: "Spline Mode", defaultValue: false },
    testMode: { type: ControlType.Boolean, title: "Test Mode (Show in Canvas)", defaultValue: false },
    previewAnimation: { type: ControlType.Boolean, title: "Preview Animation", defaultValue: false },
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
                title: "Out Mode (Default)",
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
            outTop: {
                type: ControlType.Enum,
                title: "Out Mode (Top)",
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
            outBottom: {
                type: ControlType.Enum,
                title: "Out Mode (Bottom)",
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
            outLeft: {
                type: ControlType.Enum,
                title: "Out Mode (Left)",
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
            outRight: {
                type: ControlType.Enum,
                title: "Out Mode (Right)",
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
                hidden: (move) => !move.enable,
            },
            trailLength: {
                type: ControlType.Number,
                defaultValue: 10,
                hidden: (move) => !move.trail,
            },
            gravity: {
                type: ControlType.Boolean,
                defaultValue: false,
                hidden: (move) => !move.enable,
            },
            gravityAcceleration: {
                type: ControlType.Number,
                defaultValue: 9.81,
                hidden: (move) => !move.gravity,
            },
            gravityMaxSpeed: {
                type: ControlType.Number,
                defaultValue: 50,
                hidden: (move) => !move.gravity,
            },
            spin: {
                type: ControlType.Boolean,
                defaultValue: false,
                hidden: (move) => !move.enable,
            },
            spinSpeed: {
                type: ControlType.Number,
                defaultValue: 2,
                hidden: (move) => !move.spin,
            },
            attract: {
                type: ControlType.Boolean,
                defaultValue: false,
                hidden: (move) => !move.enable,
            },
            attractDistance: {
                type: ControlType.Number,
                defaultValue: 200,
                hidden: (move) => !move.attract,
            },
            vibrate: {
                type: ControlType.Boolean,
                defaultValue: false,
                hidden: (move) => !move.enable,
                title: "Vibrate",
            },
            vibrateFrequency: {
                type: ControlType.Number,
                defaultValue: 50,
                min: 1,
                max: 100,
                step: 1,
                hidden: (move) => !move.vibrate,
            },
            vibrateAmplitude: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0.1,
                max: 10,
                step: 0.1,
                hidden: (move) => !move.vibrate,
            },
            angleOffset: {
                type: ControlType.Number,
                defaultValue: 0,
                min: 0,
                max: 360,
                title: "Angle Offset",
                hidden: (move) => !move.enable,
            },
            angleValue: {
                type: ControlType.Number,
                defaultValue: 90,
                min: 0,
                max: 360,
                title: "Angle Value",
                hidden: (move) => !move.enable,
            },
            pathEnable: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Path Following",
                hidden: (move) => !move.enable,
            },
            pathGenerator: {
                type: ControlType.Enum,
                options: ["polygonPathGenerator", "perlinNoiseGenerator"],
                defaultValue: "polygonPathGenerator",
                hidden: (move) => !move.pathEnable,
            },
            pathSides: {
                type: ControlType.Number,
                defaultValue: 6,
                min: 3,
                max: 12,
                hidden: (move) => !move.pathEnable,
            },
            pathTurns: {
                type: ControlType.Number,
                defaultValue: 30,
                min: 10,
                max: 100,
                hidden: (move) => !move.pathEnable,
            },
            pathAngle: {
                type: ControlType.Number,
                defaultValue: 30,
                min: 10,
                max: 90,
                hidden: (move) => !move.pathEnable,
            },
            drift: {
                type: ControlType.Number,
                defaultValue: 0,
                min: -5,
                max: 5,
                step: 0.1,
                title: "Drift Force",
                hidden: (move) => !move.enable,
            },
            decay: {
                type: ControlType.Number,
                defaultValue: 0,
                min: 0,
                max: 0.1,
                step: 0.001,
                title: "Speed Decay",
                hidden: (move) => !move.enable,
            },
            noise: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Noise Movement",
                hidden: (move) => !move.enable,
            },
            noiseDelay: {
                type: ControlType.Number,
                defaultValue: 0,
                min: 0,
                max: 5,
                step: 0.1,
                hidden: (move) => !move.noise,
            },
            noiseFactor: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0.1,
                max: 5,
                step: 0.1,
                hidden: (move) => !move.noise,
            },
            warp: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Warp Effect",
                hidden: (move) => !move.enable,
            },
            warpDistance: {
                type: ControlType.Number,
                defaultValue: 100,
                min: 10,
                max: 500,
                hidden: (move) => !move.warp,
            },
            magnet: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Magnetic Field",
                hidden: (move) => !move.enable,
            },
            magnetDistance: {
                type: ControlType.Number,
                defaultValue: 200,
                min: 50,
                max: 1000,
                hidden: (move) => !move.magnet,
            },
            magnetStrength: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0.1,
                max: 5,
                step: 0.1,
                hidden: (move) => !move.magnet,
            },
            spiral: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Spiral Movement",
                hidden: (move) => !move.enable,
            },
            spiralRadius: {
                type: ControlType.Number,
                defaultValue: 50,
                min: 10,
                max: 200,
                hidden: (move) => !move.spiral,
            },
            spiralSpeed: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0.1,
                max: 10,
                step: 0.1,
                hidden: (move) => !move.spiral,
            },
            spiralDirection: {
                type: ControlType.Enum,
                options: ["clockwise", "counterclockwise"],
                defaultValue: "clockwise",
                hidden: (move) => !move.spiral,
            },
            wave: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Wave Motion",
                hidden: (move) => !move.enable,
            },
            waveAmplitude: {
                type: ControlType.Number,
                defaultValue: 10,
                min: 1,
                max: 100,
                hidden: (move) => !move.wave,
            },
            waveFrequency: {
                type: ControlType.Number,
                defaultValue: 0.1,
                min: 0.01,
                max: 1,
                step: 0.01,
                hidden: (move) => !move.wave,
            },
            wavePhase: {
                type: ControlType.Number,
                defaultValue: 0,
                min: 0,
                max: 360,
                hidden: (move) => !move.wave,
            },
            orbit: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Orbit Movement",
                hidden: (move) => !move.enable,
            },
            orbitRadius: {
                type: ControlType.Number,
                defaultValue: 100,
                min: 10,
                max: 500,
                hidden: (move) => !move.orbit,
            },
            orbitSpeed: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0.1,
                max: 10,
                step: 0.1,
                hidden: (move) => !move.orbit,
            },
            orbitCenterX: {
                type: ControlType.Number,
                defaultValue: 50,
                min: 0,
                max: 100,
                title: "Orbit Center X%",
                hidden: (move) => !move.orbit,
            },
            orbitCenterY: {
                type: ControlType.Number,
                defaultValue: 50,
                min: 0,
                max: 100,
                title: "Orbit Center Y%",
                hidden: (move) => !move.orbit,
            },
            follow: {
                type: ControlType.Boolean,
                defaultValue: false,
                title: "Follow Target",
                hidden: (move) => !move.enable,
            },
            followTarget: {
                type: ControlType.Enum,
                options: ["mouse", "center", "random"],
                defaultValue: "mouse",
                hidden: (move) => !move.follow,
            },
            followDistance: {
                type: ControlType.Number,
                defaultValue: 100,
                min: 10,
                max: 500,
                hidden: (move) => !move.follow,
            },
            followSpeed: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0.1,
                max: 10,
                step: 0.1,
                hidden: (move) => !move.follow,
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
