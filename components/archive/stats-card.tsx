'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description?: string
  className?: string
  delay?: number
  trend?: 'up' | 'down' | 'neutral'
}

function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    let startTime: number
    const startValue = displayValue
    const diff = value - startValue
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplayValue(Math.floor(startValue + diff * eased))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])
  
  return <span>{displayValue}</span>
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  className,
  delay = 0,
  trend = 'neutral'
}: StatsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useTransform(y, [-100, 100], [5, -5])
  const rotateY = useTransform(x, [-100, 100], [-5, 5])
  
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }
  
  const numericValue = typeof value === 'number' ? value : parseInt(value.toString()) || 0
  const isNumeric = typeof value === 'number' || !isNaN(parseInt(value.toString()))
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative glass rounded-3xl p-6 cursor-default group overflow-hidden",
        "hover:shadow-xl hover:glow-sm transition-all duration-300",
        className
      )}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-4xl font-bold text-foreground tracking-tight">
            {isNumeric ? <AnimatedCounter value={numericValue} duration={0.8 + delay} /> : value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              {trend === 'up' && <span className="text-emerald-500">+</span>}
              {trend === 'down' && <span className="text-rose-500">-</span>}
              {description}
            </p>
          )}
        </div>
        
        <motion.div 
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Icon className="w-7 h-7 text-primary" />
          <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
    </motion.div>
  )
}
