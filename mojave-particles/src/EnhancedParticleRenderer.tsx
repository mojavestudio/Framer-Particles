import { useRef, useEffect } from 'react'

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
        spin: boolean
        spinSpeed: number
        attract: boolean
        attractDistance: number
        vibrate: boolean
        vibrateFrequency: number
        infinite: boolean
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

        // Use fixed size from configuration (matching generated code)
        canvas.width = config.width
        canvas.height = config.height
        canvas.style.width = config.width + "px"
        canvas.style.height = config.height + "px"



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
            const amount = config.amount // Use full amount for consistency with generated code
            const cols = config.colors.length > 0 ? config.colors : [config.color]
            
            // Using color array for particle creation
            
            for (let i = 0; i < amount; i++) {
                const particleColor = cols[Math.floor(Math.random() * cols.length)]
                
                let vx = 0, vy = 0
                const baseSpeed = config.move.speed * 0.2 // Higher speed for better slider response
                
                // Add natural speed variation for varied movement
                const speedVariation = 0.6 + Math.random() * 0.8 // 0.6x to 1.4x speed for natural variation
                const speed = baseSpeed * speedVariation
                
                switch (config.move.direction) {
                    case "top": 
                        vy = -speed
                        // Extremely minimal horizontal drift to prevent spinning
                        vx = (Math.random() - 0.5) * 0.05
                        break
                    case "bottom": 
                        vy = speed
                        vx = (Math.random() - 0.5) * 0.05
                        break
                    case "left": 
                        vx = -speed
                        vy = (Math.random() - 0.5) * 0.05
                        break
                    case "right": 
                        vx = speed
                        vy = (Math.random() - 0.5) * 0.05
                        break
                    default:
                        vx = (Math.random() - 0.5) * speed * 0.3
                        vy = (Math.random() - 0.5) * speed * 0.3
                        break
                }



                // Calculate particle size based on type
                let particleSize: number
                if (config.size.type === "Range") {
                    particleSize = Math.random() * (config.size.max - config.size.min) + config.size.min
                } else if (config.size.type === "Small") {
                    particleSize = Math.random() * (50 - 1) + 1
                } else if (config.size.type === "Medium") {
                    particleSize = Math.random() * (200 - 50) + 50
                } else if (config.size.type === "Large") {
                    particleSize = Math.random() * (500 - 200) + 200
                } else if (config.size.type === "ExtraLarge") {
                    particleSize = Math.random() * (1000 - 500) + 500
                } else {
                    particleSize = config.size.value
                }

                // Calculate particle opacity based on type (matching generated code)
                const particleOpacity = (() => {
                    if (config.opacity.type === "Range") {
                        return Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min
                    } else if (config.opacity.type === "Fade") {
                        return Math.random() * (0.5 - 0.1) + 0.1
                    } else if (config.opacity.type === "Normal") {
                        return Math.random() * (1.0 - 0.5) + 0.5
                    } else if (config.opacity.type === "Full") {
                        return Math.random() * (1.0 - 0.8) + 0.8
                    } else {
                        return config.opacity.value
                    }
                })()

                // Position particles for natural infinite streams
                let startX = Math.random() * config.width
                let startY = Math.random() * config.height
                
                // For directional movement, create natural infinite streams
                if (config.move.direction === "top") {
                    // For upward movement (bubbles), distribute naturally
                    startX = Math.random() * config.width
                    startY = config.height - Math.random() * (config.height * 0.3) // Bottom 30% for natural flow
                } else if (config.move.direction === "bottom") {
                    // For downward movement (snow), distribute naturally
                    startX = Math.random() * config.width
                    startY = Math.random() * (config.height * 0.3) // Top 30% for natural flow
                } else if (config.move.direction === "left") {
                    // For leftward movement, distribute naturally
                    startX = config.width - Math.random() * (config.width * 0.3) // Right 30% for natural flow
                    startY = Math.random() * config.height
                } else if (config.move.direction === "right") {
                    // For rightward movement, distribute naturally
                    startX = Math.random() * (config.width * 0.3) // Left 30% for natural flow
                    startY = Math.random() * config.height
                }
                


                particles.push({
                    x: startX,
                    y: startY,
                    vx, vy,
                    color: particleColor,
                    size: particleSize,
                    opacity: particleOpacity,
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
            ctx.clearRect(0, 0, config.width, config.height)

            // Draw backdrop with proper Framer Color handling
            if (config.backdrop && config.backgroundOpacity > 0) {
                ctx.save()
                ctx.globalAlpha = config.backgroundOpacity
                
                // Handle Framer Color objects
                if (typeof config.backdrop === "object" && (config.backdrop as { r: number; g: number; b: number }).r !== undefined) {
                    const color = config.backdrop as { r: number; g: number; b: number }
                    ctx.fillStyle = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, 1)`
                } else {
                    ctx.fillStyle = config.backdrop as string
                }
                
                ctx.fillRect(0, 0, config.width, config.height)
                ctx.restore()
            }

            const particles = particlesRef.current

            particles.forEach((particle, i) => {
                // Reset size for bubble effect
                particle.size = particle.originalSize

                // Movement updates
                if (config.move.enable) {
                    // Gravity
                    if (config.move.gravity) {
                        particle.gravityVel += config.move.gravityAcceleration * 0.0005
                        if (config.move.reverseGravity) {
                            particle.vy -= particle.gravityVel // Reverse gravity
                        } else {
                            particle.vy += particle.gravityVel // Normal gravity
                        }
                    }

                    // Spin
                    if (config.move.spin) {
                        particle.spinAngle += config.move.spinSpeed * 0.01
                    }

                    // Update position
                    particle.x += particle.vx
                    particle.y += particle.vy

                    // Handle boundary behavior
                    if (config.move.out === "out") {
                        // Remove particles that exit the frame
                        if (particle.x < 0 || particle.x > config.width || particle.y < 0 || particle.y > config.height) {
                            if (config.move.infinite) {
                                // Infinite particles: spawn based on movement direction with better distribution
                                if (config.move.direction === "top") {
                                    // For upward movement (bubbles), spawn at bottom for infinite stream
                                    particle.x = Math.random() * config.width
                                    particle.y = config.height - Math.random() * 50 // Spawn within bottom area
                                } else if (config.move.direction === "bottom") {
                                    // For downward movement (snow), spawn at top for infinite stream
                                    particle.x = Math.random() * config.width
                                    particle.y = Math.random() * 50 // Spawn within top area
                                } else if (config.move.direction === "left") {
                                    // For leftward movement, spawn at right for infinite stream
                                    particle.x = config.width - Math.random() * 50 // Spawn within right area
                                    particle.y = Math.random() * config.height
                                } else if (config.move.direction === "right") {
                                    // For rightward movement, spawn at left for infinite stream
                                    particle.x = Math.random() * 50 // Spawn within left area
                                    particle.y = Math.random() * config.height
                                } else {
                                    // For random or other directions, spawn on opposite side
                                    if (particle.x < 0) {
                                        particle.x = config.width - Math.random() * 50
                                        particle.y = Math.random() * config.height
                                    } else if (particle.x > config.width) {
                                        particle.x = Math.random() * 50
                                        particle.y = Math.random() * config.height
                                    } else if (particle.y < 0) {
                                        particle.y = config.height - Math.random() * 50
                                        particle.x = Math.random() * config.width
                                    } else if (particle.y > config.height) {
                                        particle.y = Math.random() * 50
                                        particle.x = Math.random() * config.width
                                    }
                                }
                                
                                // Reset velocities with natural variation for infinite streams
                                const baseSpeed = config.move.speed * 0.2
                                const speedVariation = 0.6 + Math.random() * 0.8 // 0.6x to 1.4x speed for natural variation
                                const speed = baseSpeed * speedVariation
                                
                                // Set proper velocities based on direction to prevent spinning
                                if (config.move.direction === "top") {
                                    particle.vx = (Math.random() - 0.5) * 0.05 // Extremely minimal horizontal drift
                                    particle.vy = -speed // Consistent upward movement
                                } else if (config.move.direction === "bottom") {
                                    particle.vx = (Math.random() - 0.5) * 0.05 // Extremely minimal horizontal drift
                                    particle.vy = speed // Consistent downward movement
                                } else if (config.move.direction === "left") {
                                    particle.vx = -speed // Consistent leftward movement
                                    particle.vy = (Math.random() - 0.5) * 0.05 // Extremely minimal vertical drift
                                } else if (config.move.direction === "right") {
                                    particle.vx = speed // Consistent rightward movement
                                    particle.vy = (Math.random() - 0.5) * 0.05 // Extremely minimal vertical drift
                                } else {
                                    // For random movement, use controlled random velocities
                                    particle.vx = (Math.random() - 0.5) * speed * 0.3
                                    particle.vy = (Math.random() - 0.5) * speed * 0.3
                                }
                                
                                // Reset particle properties to maintain consistency
                                particle.size = particle.originalSize
                                particle.twinklePhase = Math.random() * Math.PI * 2
                            } else {
                                // Normal behavior: reset to top with controlled velocities
                                particle.x = Math.random() * config.width
                                particle.y = -10 // Start from top
                                
                                // Reset velocities to prevent chaotic movement
                                const baseSpeed = config.move.speed * 0.2
                                const speedVariation = 0.9 + Math.random() * 0.2
                                const speed = baseSpeed * speedVariation
                                
                                if (config.move.direction === "top") {
                                    particle.vx = (Math.random() - 0.5) * 0.05
                                    particle.vy = -speed
                                } else if (config.move.direction === "bottom") {
                                    particle.vx = (Math.random() - 0.5) * 0.05
                                    particle.vy = speed
                                } else if (config.move.direction === "left") {
                                    particle.vx = -speed
                                    particle.vy = (Math.random() - 0.5) * 0.05
                                } else if (config.move.direction === "right") {
                                    particle.vx = speed
                                    particle.vy = (Math.random() - 0.5) * 0.05
                                } else {
                                    particle.vx = (Math.random() - 0.5) * speed * 0.3
                                    particle.vy = (Math.random() - 0.5) * speed * 0.3
                                }
                            }
                        }
                    } else {
                        // Bounce off edges (default behavior) - with controlled velocity
                        if (particle.x <= 0 || particle.x >= width) {
                            particle.vx *= -0.8 // Reduce velocity on bounce to prevent chaos
                        }
                        if (particle.y <= 0 || particle.y >= height) {
                            particle.vy *= -0.8 // Reduce velocity on bounce to prevent chaos
                        }
                        particle.x = Math.max(0, Math.min(width, particle.x))
                        particle.y = Math.max(0, Math.min(height, particle.y))
                    }
                    
                    // Special behavior for lava lamp effect (direction "top")
                    if (config.move.direction === "top" && config.backdrop === "#1a0f0f") {
                        // Bubbles grow as they rise
                        const heightRatio = 1 - (particle.y / height) // 0 at bottom, 1 at top
                        particle.size = particle.originalSize * (0.6 + heightRatio * 0.8) // More dramatic growth
                        particle.opacity = 0.3 + heightRatio * 0.6 // More dramatic fade in
                        

                    }


                }

                // Hover interactions
                if (config.hover.enable && mouseRef.current.isHovering) {
                    const dx = mouseRef.current.x - particle.x
                    const dy = mouseRef.current.y - particle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    switch (config.hover.mode) {
                        case "repulse": {
                            if (distance < config.modes.repulse * 0.5) { // Scale for preview
                                const force = (config.modes.repulse * 0.5 - distance) / (config.modes.repulse * 0.5) * config.modes.repulseDistance * 2
                                particle.x -= (dx / distance) * force
                                particle.y -= (dy / distance) * force
                            }
                            break
                        }
                        case "grab": {
                            if (distance < config.modes.grab * 0.5) {
                                const force = (config.modes.grab * 0.5 - distance) / (config.modes.grab * 0.5) * config.hover.force * 0.02
                                particle.x += (dx / distance) * force
                                particle.y += (dy / distance) * force
                            }
                            break
                        }
                        case "bubble": {
                            if (distance < config.modes.bubble * 0.3) {
                                const scale = 1 + (config.modes.bubble * 0.3 - distance) / (config.modes.bubble * 0.3)
                                particle.size = particle.originalSize * scale
                            }
                            break
                        }
                        case "attract": {
                            if (distance < config.move.attractDistance * 0.5) {
                                const force = config.hover.force * 0.01
                                particle.x += (dx / distance) * force
                                particle.y += (dy / distance) * force
                            }
                            break
                        }
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
                    
                    // Draw glow with same shape as particle
                    switch (config.shape.type) {
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
                ctx.beginPath()
                
                // Draw different shapes based on config
                switch (config.shape.type) {
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
                    case "hexagon": {
                        const sides = 6
                        const angleStep = (Math.PI * 2) / sides
                        ctx.moveTo(particle.x + particle.size * Math.cos(0), particle.y + particle.size * Math.sin(0))
                        for (let i = 1; i <= sides; i++) {
                            const angle = i * angleStep
                            ctx.lineTo(particle.x + particle.size * Math.cos(angle), particle.y + particle.size * Math.sin(angle))
                        }
                        break
                    }
                    case "star": {
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
                    }
                    case "text": {
                        // For text, we don't draw any background shape
                        break
                    }
                    case "mixed": {
                        // For mixed shapes, choose a consistent shape based on particle index
                        const randomShape = config.shape.mixedTypes[i % config.shape.mixedTypes.length] || "circle"
                        switch(randomShape) {
                            case "square": {
                                ctx.rect(particle.x - particle.size, particle.y - particle.size, particle.size * 2, particle.size * 2)
                                break
                            }
                            case "triangle": {
                                const height = particle.size * Math.sqrt(3)
                                ctx.moveTo(particle.x, particle.y - height * 0.6)
                                ctx.lineTo(particle.x - particle.size, particle.y + height * 0.4)
                                ctx.lineTo(particle.x + particle.size, particle.y + height * 0.4)
                                ctx.closePath()
                                break
                            }
                            case "star": {
                                const spikes = 5
                                const outerRadius = particle.size
                                const innerRadius = particle.size * 0.4
                                ctx.moveTo(particle.x + outerRadius * Math.cos(0), particle.y + outerRadius * Math.sin(0))
                                for (let i = 0; i < spikes * 2; i++) {
                                    const radius = i % 2 === 0 ? outerRadius : innerRadius
                                    const angle = (i * Math.PI) / spikes
                                    ctx.lineTo(particle.x + radius * Math.cos(angle), particle.y + radius * Math.sin(angle))
                                }
                                ctx.closePath()
                                break
                            }
                            case "hexagon": {
                                const sides = 6
                                ctx.moveTo(particle.x + particle.size * Math.cos(0), particle.y + particle.size * Math.sin(0))
                                for (let i = 1; i < sides; i++) {
                                    const angle = (i * 2 * Math.PI) / sides
                                    ctx.lineTo(particle.x + particle.size * Math.cos(angle), particle.y + particle.size * Math.sin(angle))
                                }
                                ctx.closePath()
                                break
                            }
                            case "diamond": {
                                ctx.moveTo(particle.x, particle.y - particle.size)
                                ctx.lineTo(particle.x + particle.size, particle.y)
                                ctx.lineTo(particle.x, particle.y + particle.size)
                                ctx.lineTo(particle.x - particle.size, particle.y)
                                ctx.closePath()
                                break
                            }
                            default: {
                                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                            }
                        }
                        break
                    }
                    default:
                        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                }
                
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
                
                // Render text or emoji on top if needed
                if (config.shape.type === "text") {
                    ctx.save()
                    
                    const displayText = config.shape.text
                    ctx.font = `${particle.size * 1.2}px Arial`
                    ctx.textAlign = "center"
                    ctx.textBaseline = "middle"
                    
                    // Measure text for background/border
                    const textMetrics = ctx.measureText(displayText)
                    const textWidth = textMetrics.width
                    const textHeight = particle.size * 1.2
                    const padding = 4
                    
                    // STRICT: Only show backgrounds when explicitly requested for actual text
                    // Never show backgrounds for: emojis, single symbols, or phosphor icons
                    const shouldShowBackground = config.fill.enable && 
                        config.shape.type === "text" && 
                        displayText && 
                        displayText.length > 1 && 
                        /[a-zA-Z]/.test(displayText) // Must contain at least one letter
                    
                    // Draw fill background ONLY for multi-letter text
                    if (shouldShowBackground) {
                        const r = parseInt(config.fill.color.slice(1, 3), 16)
                        const g = parseInt(config.fill.color.slice(3, 5), 16)
                        const b = parseInt(config.fill.color.slice(5, 7), 16)
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${config.fill.opacity})`
                        
                        if (config.border.radius > 0) {
                            // Rounded rectangle fill
                            const rectX = particle.x - textWidth / 2 - padding
                            const rectY = particle.y - textHeight / 2 - padding
                            const rectWidth = textWidth + padding * 2
                            const rectHeight = textHeight + padding * 2
                            const radius = Math.min(config.border.radius, rectWidth / 2, rectHeight / 2)
                            
                            ctx.beginPath()
                            ctx.moveTo(rectX + radius, rectY)
                            ctx.lineTo(rectX + rectWidth - radius, rectY)
                            ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius)
                            ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius)
                            ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - radius, rectY + rectHeight)
                            ctx.lineTo(rectX + radius, rectY + rectHeight)
                            ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius)
                            ctx.lineTo(rectX, rectY + radius)
                            ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY)
                            ctx.closePath()
                            ctx.fill()
                        } else {
                            // Regular rectangle fill
                            ctx.fillRect(
                                particle.x - textWidth / 2 - padding,
                                particle.y - textHeight / 2 - padding,
                                textWidth + padding * 2,
                                textHeight + padding * 2
                            )
                        }
                    }
                        
                    // Draw border ONLY for multi-letter text (same logic as background)
                    if (config.border.enable && config.border.width > 0 && shouldShowBackground) {
                        const r = parseInt(config.border.color.slice(1, 3), 16)
                        const g = parseInt(config.border.color.slice(3, 5), 16)
                        const b = parseInt(config.border.color.slice(5, 7), 16)
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${config.border.opacity})`
                        ctx.lineWidth = config.border.width
                        if (config.border.radius > 0) {
                            // Rounded rectangle border
                            const rectX = particle.x - textWidth / 2 - padding
                            const rectY = particle.y - textHeight / 2 - padding
                            const rectWidth = textWidth + padding * 2
                            const rectHeight = textHeight + padding * 2
                            const radius = Math.min(config.border.radius, rectWidth / 2, rectHeight / 2)
                            
                            ctx.beginPath()
                            ctx.moveTo(rectX + radius, rectY)
                            ctx.lineTo(rectX + rectWidth - radius, rectY)
                            ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius)
                            ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius)
                            ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - radius, rectY + rectHeight)
                            ctx.lineTo(rectX + radius, rectY + rectHeight)
                            ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius)
                            ctx.lineTo(rectX, rectY + radius)
                            ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY)
                            ctx.closePath()
                            ctx.stroke()
                        } else {
                            // Regular rectangle border
                            ctx.strokeRect(
                                particle.x - textWidth / 2 - padding,
                                particle.y - textHeight / 2 - padding,
                                textWidth + padding * 2,
                                textHeight + padding * 2
                            )
                        }
                    }
                    
                    // Draw the text/emoji/icon
                    ctx.fillStyle = particle.color
                    ctx.fillText(displayText, particle.x, particle.y)
                    ctx.restore()
                }
                
                // Add border if enabled
                if (config.border.enable && config.border.width > 0) {
                    // Save context for border drawing
                    ctx.save()
                    
                    // Use border color if specified, otherwise use particle color
                    if (config.border.color && config.border.color !== "#ffffff") {
                        if (typeof config.border.color === "object" && (config.border.color as { r: number; g: number; b: number }).r !== undefined) {
                            const borderColor = config.border.color as { r: number; g: number; b: number }
                            ctx.strokeStyle = `rgba(${Math.round(borderColor.r * 255)}, ${Math.round(borderColor.g * 255)}, ${Math.round(borderColor.b * 255)}, ${currentOpacity})`
                        } else {
                            ctx.strokeStyle = config.border.color as string
                        }
                    } else {
                        // Parse particle color for border
                        if (particle.color.includes('#')) {
                            const r = parseInt(particle.color.slice(1, 3), 16)
                            const g = parseInt(particle.color.slice(3, 5), 16)
                            const b = parseInt(particle.color.slice(5, 7), 16)
                            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`
                        } else {
                            ctx.strokeStyle = particle.color
                        }
                    }
                    ctx.lineWidth = config.border.width
                    ctx.stroke()
                    
                    // Restore context after border
                    ctx.restore()
                }
                
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
                            ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * (1 - distance / (config.modes.connectRadius * 0.5))})`
                            ctx.lineWidth = 3
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