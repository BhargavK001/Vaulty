'use client'

import { motion } from 'framer-motion'
import { TimelineGroup, ArchiveFile } from '@/types/archive'
import { FileCard } from './file-card'
import { cn } from '@/lib/utils'

interface TimelineSectionProps {
  group: TimelineGroup
  onFileClick?: (file: ArchiveFile) => void
  delay?: number
}

export function TimelineSection({ group, onFileClick, delay = 0 }: TimelineSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      {/* Year Header */}
      <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-xl py-4 -mx-4 px-4 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-4">
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-primary"
          >
            {group.year}
          </motion.span>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          <span className="text-sm text-muted-foreground">
            {group.months.reduce((acc, m) => acc + m.files.length, 0)} documents
          </span>
        </div>
      </div>
      
      {/* Months */}
      <div className="space-y-8 mt-6">
        {group.months.map((monthGroup, monthIndex) => (
          <motion.div
            key={monthGroup.month}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 + monthIndex * 0.05 }}
          >
            {/* Month Label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-primary/30" />
              <h3 className="text-lg font-semibold text-foreground">{monthGroup.month}</h3>
              <span className="text-sm text-muted-foreground">
                ({monthGroup.files.length})
              </span>
            </div>
            
            {/* Files Grid */}
            <div className="pl-6 border-l-2 border-border/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {monthGroup.files.map((file, fileIndex) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    variant="compact"
                    delay={fileIndex * 0.02}
                    onClick={() => onFileClick?.(file)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
