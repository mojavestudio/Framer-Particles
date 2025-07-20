// Simple Particles component - Alternative version for Spline compatibility
// This version uses a more basic approach to avoid React import conflicts

import React from "react"
import { addPropertyControls, ControlType, Color, RenderTarget } from "framer"
import { useCallback, useEffect, useRef } from "react"

export default function SimpleParticles(props) {
    const {
        backdrop,
        color,
        amount,
        size,
        opacity,
        speed,
        debug,
    } = props

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const particlesRef = useRef<any[]>([])

    // Detect if running in Framer Canvas (design mode)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    // Initialize particles
    useEffect(() => {
        if (!canvasRef.current || isCanvas) return

        const canvas = canvasRef.current
        if (!canvas) return
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }
        
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        // Create particles
        const particles: any[] = []
        for (let i = 0; i < amount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                size: Math.random() * size + 1,
            })
        }
        
        particlesRef.current = particles

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx
                particle.y += particle.vy
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
                
                // Draw particle
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
                ctx.fill()
            })
            
            animationRef.current = requestAnimationFrame(animate)
        }
        
        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [amount, size, opacity, speed, isCanvas])

    if (debug) {
        console.log("SimpleParticles props:", { amount, size, opacity, speed, isCanvas })
    }

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: backdrop,
                position: "relative",
                overflow: "hidden",
                minHeight: "200px",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: isCanvas ? "none" : "block",
                }}
            />
            {isCanvas && (
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    fontSize: "14px",
                    textAlign: "center",
                }}>
                    Particles Preview
                    <br />
                    {amount} particles
                </div>
            )}
            {debug && (
                <div style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "rgba(0,0,0,0.8)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    zIndex: 1000,
                }}>
                    <div>Particles: {amount}</div>
                    <div>Canvas: {isCanvas ? "Yes" : "No"}</div>
                    <div>Size: {size}</div>
                    <div>Speed: {speed}</div>
                </div>
            )}
        </div>
    )
}

// Default properties
SimpleParticles.defaultProps = {
    backdrop: "#141414",
    color: "#ffffff",
    amount: 50,
    size: 3,
    opacity: 0.5,
    speed: 2,
    debug: false,
}

// Property controls for Framer
addPropertyControls(SimpleParticles, {
    backdrop: { type: ControlType.Color, title: "Background" },
    debug: { type: ControlType.Boolean, title: "Debug Mode" },
    color: { type: ControlType.Color, title: "Color" },
    amount: {
        type: ControlType.Number,
        title: "Amount",
        min: 0,
        max: 200,
        defaultValue: 50,
    },
    size: {
        type: ControlType.Number,
        title: "Size",
        min: 1,
        max: 10,
        defaultValue: 3,
    },
    opacity: {
        type: ControlType.Number,
        title: "Opacity",
        min: 0,
        max: 1,
        step: 0.1,
        defaultValue: 0.5,
    },
    speed: {
        type: ControlType.Number,
        title: "Speed",
        min: 0,
        max: 10,
        step: 0.5,
        defaultValue: 2,
    },
}) 