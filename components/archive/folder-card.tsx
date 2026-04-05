'use client'

import { motion } from 'framer-motion'
import { Folder, ChevronRight, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ArchiveFolder } from '@/types/archive'
import { cn } from '@/lib/utils'

interface FolderCardProps {
  folder: ArchiveFolder
  onClick: () => void
  delay?: number
}

export function FolderCard({ folder, onClick, delay = 0 }: FolderCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group w-full text-left"
    >
      <div className="glass rounded-3xl p-5 border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 hover:bg-primary/5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Folder className="w-7 h-7 text-primary fill-primary/10" />
          </div>
          <div className="p-2 rounded-xl bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-bold text-foreground text-lg truncate group-hover:text-primary transition-colors">
            {folder.name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{format(new Date(folder.modifiedTime), 'MMM d, yyyy')}</span>
            </div>
            <span>•</span>
            <span>{folder.itemCount > 0 ? `${folder.itemCount} items` : 'Folder'}</span>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

export function FolderCardList({ folder, onClick, delay = 0 }: FolderCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="group w-full flex items-center gap-4 p-4 glass rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md transition-all text-left"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
        <Folder className="w-6 h-6 text-primary fill-primary/10" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
          {folder.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          Modified {format(new Date(folder.modifiedTime), 'MMM d, yyyy')}
        </p>
      </div>
      
      <div className="text-sm font-medium text-muted-foreground/60 mr-4">
        {folder.itemCount > 0 ? `${folder.itemCount} items` : 'Folder'}
      </div>
      
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </motion.button>
  )
}
