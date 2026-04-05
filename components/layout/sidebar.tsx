'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Archive, 
  FolderOpen, 
  Clock, 
  Heart, 
  CalendarDays,
  Settings,
  Cloud
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useArchive } from '@/hooks/use-archive'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/archive', label: 'Archive', icon: Archive },
  { href: '/categories', label: 'Categories', icon: FolderOpen },
  { href: '/timeline', label: 'Timeline', icon: CalendarDays },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/recent', label: 'Recent', icon: Clock },
]

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { connectionStatus, getStats } = useArchive()
  const stats = getStats()
  
  const isConnected = !!(connectionStatus.connected && connectionStatus.folderId)
  
  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen glass fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-4 group">
          <motion.div 
            className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <Cloud className="w-6 h-6 text-primary relative z-10" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary/20 rounded-full blur-lg" />
          </motion.div>
          <div>
            <h1 className="font-semibold text-lg text-foreground tracking-tight">Vaulty</h1>
            <p className="text-xs text-muted-foreground">Your Document Vault</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-3">
          <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Navigation
          </span>
        </div>
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                    isActive 
                      ? "text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 bg-primary rounded-xl shadow-lg glow-sm"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }}
                    />
                  )}
                  <motion.div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center relative z-10 transition-colors",
                      isActive 
                        ? "bg-primary-foreground/10" 
                        : "bg-accent/50 group-hover:bg-accent"
                    )}
                  >
                    <item.icon className={cn(
                      "w-[18px] h-[18px] transition-transform group-hover:scale-110",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                  </motion.div>
                  <span className="relative z-10">{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-foreground/80"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      {/* Bottom Section */}
      <div className="px-4 py-4 border-t border-border/50">
        <ul className="space-y-1.5">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                    isActive ? "bg-foreground/5" : "bg-accent/50 group-hover:bg-accent"
                  )}>
                    <item.icon className="w-[18px] h-[18px]" />
                  </div>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        
        {/* Storage indicator */}
        <div className="mt-4 px-4 py-3 rounded-xl bg-accent/30">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Google Drive</span>
            <span className={cn(
              "font-medium",
              isConnected ? "text-emerald-500" : "text-muted-foreground"
            )}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: isConnected ? '35%' : '0%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
