import { useEffect, useRef, useState } from 'react'

// Confetti component for the victory animation
const Confetti = ({ active }: { active: boolean }) => {
    type ParticleType = 'circle' | 'ribbon' | 'square' | 'triangle'

    interface Particle {
        x: number
        y: number
        color: string
        size: number
        speed: number
        angle: number
        spin: number
        type: ParticleType
        rotationAngle: number
        width?: number
        height?: number
    }

    const [particles, setParticles] = useState<Particle[]>([])
    const animationRef = useRef<number | null>(null)
    const lastUpdateTimeRef = useRef<number>(0)

    useEffect(() => {
        if (active) {
            // Create confetti particles
            const newParticles: Particle[] = []
            const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722']
            const types: ParticleType[] = ['circle', 'ribbon', 'square', 'triangle']

            for (let i = 0; i < 500; i++) {
                const type = types[Math.floor(Math.random() * types.length)]
                const size = 5 + Math.random() * 15

                const particle: Particle = {
                    x: Math.random() * window.innerWidth,
                    y: -20 - Math.random() * 200,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size,
                    speed: 2 + Math.random() * 10,
                    angle: Math.random() * Math.PI * 2,
                    spin: (Math.random() - 0.5) * 0.1,
                    type,
                    rotationAngle: Math.random() * Math.PI * 2
                }

                // Special properties for ribbons
                if (type === 'ribbon') {
                    particle.width = size * 6
                    particle.height = size / 2
                }

                newParticles.push(particle)
            }

            setParticles(newParticles)
            lastUpdateTimeRef.current = performance.now()

            const animate = (timestamp: number) => {
                const deltaTime = timestamp - lastUpdateTimeRef.current
                lastUpdateTimeRef.current = timestamp

                setParticles(prevParticles =>
                    prevParticles
                        .map(particle => ({
                            ...particle,
                            x: particle.x + Math.cos(particle.angle) * particle.speed * (deltaTime / 16),
                            y: particle.y + Math.sin(particle.angle) * particle.speed * (deltaTime / 16) + (deltaTime / 16),
                            rotationAngle: particle.rotationAngle + particle.spin * deltaTime
                        }))
                        .filter(particle => particle.y < window.innerHeight)
                )

                if (active) {
                    animationRef.current = requestAnimationFrame(animate)
                }
            }

            animationRef.current = requestAnimationFrame(animate)

            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current)
                }
            }
        }
    }, [active])

    if (!active) return null

    const renderParticle = (particle: Particle, index: number) => {
        switch (particle.type) {
            case 'circle':
                return (
                    <div
                        key={index}
                        className="absolute rounded-full"
                        style={{
                            backgroundColor: particle.color,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            left: `${particle.x}px`,
                            top: `${particle.y}px`
                        }}
                    />
                )
            case 'ribbon':
                return (
                    <div
                        key={index}
                        className="absolute"
                        style={{
                            backgroundColor: particle.color,
                            width: `${particle.width}px`,
                            height: `${particle.height}px`,
                            left: `${particle.x}px`,
                            top: `${particle.y}px`,
                            transform: `rotate(${particle.rotationAngle}rad)`,
                            borderRadius: '2px'
                        }}
                    />
                )
            case 'square':
                return (
                    <div
                        key={index}
                        className="absolute"
                        style={{
                            backgroundColor: particle.color,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            left: `${particle.x}px`,
                            top: `${particle.y}px`,
                            transform: `rotate(${particle.rotationAngle}rad)`
                        }}
                    />
                )
            case 'triangle':
                return (
                    <div
                        key={index}
                        className="absolute"
                        style={{
                            width: 0,
                            height: 0,
                            borderLeft: `${particle.size / 2}px solid transparent`,
                            borderRight: `${particle.size / 2}px solid transparent`,
                            borderBottom: `${particle.size}px solid ${particle.color}`,
                            left: `${particle.x}px`,
                            top: `${particle.y}px`,
                            transform: `rotate(${particle.rotationAngle}rad)`
                        }}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {particles.map((particle, index) => renderParticle(particle, index))}
        </div>
    )
}

export default Confetti