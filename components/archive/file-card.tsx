'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FileText, Image as ImageIcon, Heart, Calendar, ExternalLink } from 'lucide-react'
import { ArchiveFile } from '@/types/archive'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface FileCardProps {
  file: ArchiveFile
  onClick?: () => void
  onFavoriteClick?: () => void
  delay?: number
  variant?: 'default' | 'compact' | 'grid'
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  academic: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
  identity: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
  finance: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
  family: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20' },
  property: { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/20' },
  medical: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20' },
  certificates: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/20' },
  receipts: { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/20' },
  personal: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20' },
}

export function FileCard({ 
  file, 
  onClick, 
  onFavoriteClick,
  delay = 0,
  variant = 'default'
}: FileCardProps) {
  const isImage = file.type === 'image'
  const colors = categoryColors[file.category] || categoryColors.personal
  const hasThumbnail = !!file.thumbnail
  
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="group cursor-pointer glass rounded-2xl p-4 hover:shadow-lg hover:glow-sm transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
            isImage ? "bg-emerald-500/10" : "bg-blue-500/10"
          )}>
            {isImage ? (
              <ImageIcon className="w-5 h-5 text-emerald-500" />
            ) : (
              <FileText className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
              {file.title}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{file.fileName}</p>
          </div>
          {file.favorite && (
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
          )}
        </div>
      </motion.div>
    )
  }
  
  if (variant === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -4 }}
        className="group cursor-pointer"
        onClick={onClick}
      >
        <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 relative">
          {hasThumbnail ? (
            <Image
              src={file.thumbnail!}
              alt={file.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className={cn(
              "absolute inset-0 flex items-center justify-center",
              isImage 
                ? "bg-gradient-to-br from-emerald-500/10 to-teal-500/10" 
                : "bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
            )}>
              {isImage ? (
                <ImageIcon className="w-12 h-12 text-emerald-500/50" />
              ) : (
                <FileText className="w-12 h-12 text-blue-500/50" />
              )}
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Favorite button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteClick?.()
            }}
            className="absolute top-3 left-3 w-9 h-9 rounded-xl glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Heart className={cn(
              "w-4 h-4 transition-colors",
              file.favorite 
                ? "text-rose-500 fill-rose-500" 
                : "text-white/80"
            )} />
          </motion.button>
          
          {/* View link */}
          {file.webViewLink && (
            <a
              href={file.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 right-3 w-9 h-9 rounded-xl glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20"
            >
              <ExternalLink className="w-4 h-4 text-white/80" />
            </a>
          )}
          
          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white font-medium text-sm truncate">{file.title}</p>
          </div>
        </div>
      </motion.div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-card rounded-3xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-xl glow-sm transition-all duration-300">
        {/* Thumbnail */}
        <div className={cn(
          "aspect-[4/3] relative overflow-hidden"
        )}>
          {hasThumbnail ? (
            <Image
              src={file.thumbnail!}
              alt={file.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className={cn(
              "absolute inset-0 flex items-center justify-center",
              isImage 
                ? "bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-teal-500/5" 
                : "bg-gradient-to-br from-blue-500/5 via-blue-500/10 to-indigo-500/5"
            )}>
              {isImage ? (
                <ImageIcon className="w-14 h-14 text-emerald-500/40" />
              ) : (
                <FileText className="w-14 h-14 text-blue-500/40" />
              )}
            </div>
          )}
          
          {/* Type badge */}
          <div className="absolute top-3 right-3">
            <Badge 
              className={cn(
                "text-[10px] font-semibold uppercase backdrop-blur-md border",
                isImage 
                  ? "bg-emerald-500/90 text-white border-emerald-400/30" 
                  : "bg-blue-500/90 text-white border-blue-400/30"
              )}
            >
              {file.extension}
            </Badge>
          </div>
          
          {/* Favorite button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteClick?.()
            }}
            className="absolute top-3 left-3 w-9 h-9 rounded-xl glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Heart className={cn(
              "w-4 h-4 transition-colors",
              file.favorite 
                ? "text-rose-500 fill-rose-500" 
                : "text-foreground/60"
            )} />
          </motion.button>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {file.title}
            </h3>
          </div>
          
          <p className="text-xs text-muted-foreground mb-4 line-clamp-1 font-mono">
            {file.fileName}
          </p>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] font-medium capitalize border",
                colors.bg, colors.text, colors.border
              )}
            >
              {file.category}
            </Badge>
            
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(file.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
