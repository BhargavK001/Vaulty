'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Moon, Sun, Menu, Bell, Command } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileNav } from './mobile-nav'

interface TopbarProps {
  onSearch?: (query: string) => void
  searchValue?: string
  title?: string
}

export function Topbar({ onSearch, searchValue = '', title }: TopbarProps) {
  const { theme, setTheme } = useTheme()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  
  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
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
          
          {/* Title */}
          {title && (
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-semibold text-foreground hidden lg:block"
            >
              {title}
            </motion.h1>
          )}
          
          {/* Search */}
          <div className="flex-1 max-w-lg mx-4 lg:mx-0 lg:ml-auto">
            <motion.div 
              className="relative"
              animate={{ scale: searchFocused ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`
                relative flex items-center rounded-2xl transition-all duration-300
                ${searchFocused 
                  ? 'bg-card shadow-lg ring-2 ring-primary/20' 
                  : 'bg-accent/40 hover:bg-accent/60'}
              `}>
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
                <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded-md bg-muted/80 px-2 font-mono text-[10px] font-medium text-muted-foreground">
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
          <div className="flex items-center gap-2 ml-4">
            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl hover:bg-accent/50"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                <span className="sr-only">Notifications</span>
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
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>
            
            {/* User avatar */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
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
