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
import { useArchive } from '@/hooks/use-archive'
import toast from 'react-hot-toast'

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
  const { connectionStatus, refresh } = useArchive()

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
            className="fixed left-0 top-0 bottom-0 w-72 bg-background z-50 lg:hidden shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground tracking-tight">Vaulty</h1>
                  <p className="text-xs text-muted-foreground">Document Vault</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* Recent Folders Quick Switcher */}
              {connectionStatus.recentFolders && connectionStatus.recentFolders.length > 1 && (
                <div className="px-4 py-4 border-b border-border/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Switch Archive</p>
                  <div className="space-y-1">
                    {connectionStatus.recentFolders.map(folder => (
                      <button
                        key={folder.id}
                        onClick={() => {
                          handleFolderSwitch(folder.id, folder.name)
                          onClose()
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                          connectionStatus.folderId === folder.id
                            ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <FolderOpen className={cn("w-4 h-4", connectionStatus.folderId === folder.id ? "text-primary" : "text-muted-foreground")} />
                        <span className="truncate">{folder.name}</span>
                        {connectionStatus.folderId === folder.id && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <nav className="p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-4">Navigation</p>
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
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
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
            </div>

            <div className="p-4 border-t border-border mt-auto">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">BK</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">Bhargav Karande</p>
                  <p className="text-[10px] text-muted-foreground truncate">bhargavkarande.dev</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
