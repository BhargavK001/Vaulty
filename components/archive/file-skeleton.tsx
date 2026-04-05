'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function FileSkeleton() {
  return (
    <div className="group relative glass rounded-2xl p-4 border-border/50 hover:border-primary/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        {/* Category icon skeleton */}
        <div className="w-12 h-12 rounded-xl bg-muted animate-pulse" />
        {/* Favorite button skeleton */}
        <div className="w-9 h-9 rounded-lg bg-muted animate-pulse" />
      </div>

      {/* Title skeleton */}
      <div className="h-6 bg-muted rounded-lg w-3/4 mb-2 animate-pulse" />
      {/* File info skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
        <div className="w-1 h-1 bg-muted rounded-full animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/5 animate-pulse" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        {/* Tag skeleton */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          <div className="h-6 w-12 bg-muted rounded-full animate-pulse" />
        </div>
        {/* Arrow skeleton */}
        <div className="w-5 h-5 bg-muted rounded animate-pulse" />
      </div>
    </div>
  )
}

export function FileSkeletonList() {
  return (
    <div className="flex items-center gap-4 p-3 bg-card border border-border/50 rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
        <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
        <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
      </div>
    </div>
  )
}
