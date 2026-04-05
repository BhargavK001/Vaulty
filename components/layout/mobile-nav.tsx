'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Archive, 
  FolderOpen, 
  Clock, 
  Heart, 
  CalendarDays,
  Settings,
  X,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/archive', label: 'Archive', icon: Archive },
  { href: '/categories', label: 'Categories', icon: FolderOpen },
  { href: '/timeline', label: 'Timeline', icon: CalendarDays },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/recent', label: 'Recent', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()
  
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
          />
          
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-background z-50 lg:hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground tracking-tight">Bhargav Archive</h1>
                  <p className="text-xs text-muted-foreground">Document Vault</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <nav className="p-3">
              <ul className="space-y-1">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname.startsWith(item.href))
                  
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link 
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
