'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Moon, Sun, Menu, Bell, Command, FolderOpen, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileNav } from './mobile-nav'
import { useArchive } from '@/hooks/use-archive'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface TopbarProps {
  onSearch?: (query: string) => void
  searchValue?: string
  title?: string
}

export function Topbar({ onSearch, searchValue = '', title }: TopbarProps) {
  const { theme, setTheme } = useTheme()
  const { connectionStatus, refresh } = useArchive()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  
  const handleFolderSwitch = async (folderId: string, folderName: string) => {
    try {
      const res = await fetch('/api/drive/select-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId, folderName })
      })
      if (res.ok) {
        toast.success(`Switched to "${folderName}"`)
        refresh()
      } else {
        throw new Error('Failed to switch folder')
      }
    } catch (error) {
      console.error('Error switching folder:', error)
      toast.error('Failed to switch folder')
    }
  }
  
  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8 gap-4">
          {/* Mobile menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-xl hover:bg-accent/50"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Left Section: Title & Folder Switcher */}
          <div className="flex items-center gap-4 hidden lg:flex min-w-[200px]">
            {title && (
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-semibold text-foreground whitespace-nowrap"
              >
                {title}
              </motion.h1>
            )}
            
            {connectionStatus.recentFolders && connectionStatus.recentFolders.length > 1 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors group cursor-pointer relative overflow-hidden">
                <FolderOpen className="w-4 h-4 text-primary" />
                <select 
                  className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer appearance-none pr-4 max-w-[120px] truncate"
                  value={connectionStatus.folderId}
                  onChange={(e) => {
                    const folder = connectionStatus.recentFolders?.find(f => f.id === e.target.value)
                    if (folder) handleFolderSwitch(folder.id, folder.name)
                  }}
                >
                  {connectionStatus.recentFolders.map(folder => (
                    <option key={folder.id} value={folder.id} className="bg-background text-foreground">
                      {folder.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 w-3 h-3 text-primary opacity-50 group-hover:opacity-100 pointer-events-none transition-opacity" />
              </div>
            )}
          </div>
          
          {/* Search */}
          <div className="flex-1 max-w-lg mx-auto">
            <motion.div 
              className="relative"
              animate={{ scale: searchFocused ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className={cn(
                "relative flex items-center rounded-2xl transition-all duration-300",
                searchFocused 
                  ? 'bg-card shadow-lg ring-2 ring-primary/20' 
                  : 'bg-accent/40 hover:bg-accent/60'
              )}>
                <Search className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="search"
                  placeholder="Search documents..."
                  value={searchValue}
                  onChange={(e) => onSearch?.(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full h-11 pl-11 pr-20 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                />
                <div className="absolute right-3 hidden sm:flex items-center gap-1.5 pointer-events-none">
                  <kbd className="inline-flex h-6 items-center gap-1 rounded-md bg-muted/80 px-2 font-mono text-[10px] font-medium text-muted-foreground border border-border/50">
                    <Command className="w-3 h-3" />K
                  </kbd>
                </div>
              </div>
              
              {/* Search glow effect */}
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 -z-10 rounded-2xl bg-primary/10 blur-xl"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl hover:bg-accent/50"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
              </Button>
            </motion.div>
            
            {/* Theme toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-xl hover:bg-accent/50"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground" />
              </Button>
            </motion.div>
            
            {/* User avatar */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center cursor-pointer border border-primary/10 hover:shadow-lg transition-all">
                <span className="text-sm font-semibold text-primary">BK</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>
      
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  )
}
