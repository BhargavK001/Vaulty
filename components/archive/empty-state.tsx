'use client'

import { motion } from 'framer-motion'
import { LucideIcon, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ 
  icon: Icon = FolderOpen, 
  title, 
  description,
  action 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      
      {action && (
        <Button onClick={action.onClick} className="rounded-xl">
          {action.label}
        </Button>
      )}
    </motion.div>
  )
}
