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

                // Calculate particle opacity based on type
                let particleOpacity: number
                if (config.opacity.type === "Range") {
                    particleOpacity = Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min
                } else if (config.opacity.type === "Fade") {
                    particleOpacity = Math.random() * (0.5 - 0.1) + 0.1
                } else if (config.opacity.type === "Normal") {
                    particleOpacity = Math.random() * (1.0 - 0.5) + 0.5
                } else if (config.opacity.type === "Full") {
                    particleOpacity = Math.random() * (1.0 - 0.8) + 0.8
                } else {
                    particleOpacity = config.opacity.value
                }

                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
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
            ctx.clearRect(0, 0, width, height)

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
                
                ctx.fillRect(0, 0, width, height)
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