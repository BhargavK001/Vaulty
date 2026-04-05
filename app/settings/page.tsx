'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { 
  Settings, 
  Moon, 
  Sun, 
  Monitor,
  Cloud,
  CloudOff,
  FolderOpen,
  Info,
  Check,
  RefreshCw,
  ChevronRight,
  Loader2,
  ExternalLink,
  History,
  FolderCheck
} from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { AnimatedPage } from '@/components/layout/animated-page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useArchive } from '@/hooks/use-archive'

interface DriveFolder {
  id: string
  name: string
  modifiedTime: string
}

function SettingsContent() {
  const { theme, setTheme } = useTheme()
  const searchParams = useSearchParams()
  const { connectionStatus, getStats, getCategories, refresh } = useArchive()
  
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [folders, setFolders] = useState<DriveFolder[]>([])
  const [loadingFolders, setLoadingFolders] = useState(false)
  const [selectingFolder, setSelectingFolder] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const stats = getStats()
  const categories = getCategories()
  
  // Handle URL params for OAuth callback
  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    
    if (success === 'connected') {
      toast.success('Successfully connected to Google Drive!')
      refresh()
      loadFolders()
    }
    
    if (error) {
      const errorMessages: Record<string, string> = {
        access_denied: 'Access was denied. Please try again.',
        no_code: 'Authentication failed. Please try again.',
        token_exchange_failed: 'Failed to authenticate. Please try again.'
      }
      toast.error(errorMessages[error] || 'An error occurred. Please try again.')
    }
  }, [searchParams, refresh])
  
  // Load folders on mount if connected
  useEffect(() => {
    if (connectionStatus.connected && !connectionStatus.folderId) {
      loadFolders()
    }
  }, [connectionStatus.connected, connectionStatus.folderId])
  
  const loadFolders = async () => {
    setLoadingFolders(true)
    try {
      const res = await fetch('/api/drive/folders')
      if (!res.ok) throw new Error('Failed to load folders')
      const data = await res.json()
      setFolders(data.folders || [])
    } catch (error) {
      console.error('Error loading folders:', error)
      toast.error('Failed to load folders')
    } finally {
      setLoadingFolders(false)
    }
  }
  
  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const res = await fetch('/api/auth/google')
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error connecting:', error)
      toast.error('Failed to start connection. Please check your API credentials.')
      setIsConnecting(false)
    }
  }
  
  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    try {
      await fetch('/api/auth/google/disconnect', { method: 'POST' })
      toast.success('Disconnected from Google Drive')
      refresh()
      setFolders([])
    } catch (error) {
      console.error('Error disconnecting:', error)
      toast.error('Failed to disconnect')
    } finally {
      setIsDisconnecting(false)
    }
  }
  
  const handleSelectFolder = async (folder: { id: string; name: string }) => {
    setSelectingFolder(folder.id)
    try {
      const res = await fetch('/api/drive/select-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: folder.id, folderName: folder.name })
      })
      
      if (!res.ok) throw new Error('Failed to select folder')
      
      toast.success(`Selected "${folder.name}" as your archive folder`)
      refresh()
    } catch (error) {
      console.error('Error selecting folder:', error)
      toast.error('Failed to select folder')
    } finally {
      setSelectingFolder(null)
    }
  }
  
  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]
  
  return (
    <AnimatedPage>
      <Topbar title="Settings" />
      
      <div className="px-4 lg:px-8 py-8 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-lg shadow-primary/5">
              <Settings className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Customize your archive experience
              </p>
            </div>
          </div>
        </motion.div>
        
        <div className="space-y-6">
          {/* Google Drive Connection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-3xl glass border-border/50 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    connectionStatus.connected 
                      ? "bg-emerald-500/10" 
                      : "bg-blue-500/10"
                  )}>
                    {connectionStatus.connected ? (
                      <Cloud className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <CloudOff className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  Google Drive Connection
                </CardTitle>
                <CardDescription>
                  {connectionStatus.connected 
                    ? 'Your Google Drive is connected' 
                    : 'Connect to browse documents from Google Drive'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {connectionStatus.connected ? (
                  <>
                    {/* Connected state */}
                    <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <Check className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{connectionStatus.email}</p>
                          <p className="text-sm text-muted-foreground">Connected account</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleDisconnect}
                        disabled={isDisconnecting}
                        className="rounded-xl"
                      >
                        {isDisconnecting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Disconnect'
                        )}
                      </Button>
                    </div>
                    
                    {/* Selected folder & Recent Folders */}
                    {connectionStatus.folderId && (
                      <div className="space-y-6">
                        <div className="p-4 bg-muted/30 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <FolderOpen className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium text-foreground">{connectionStatus.folderName}</p>
                              <p className="text-sm text-muted-foreground">Selected archive folder</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            className="mt-3 text-sm rounded-xl"
                            onClick={loadFolders}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Change folder
                          </Button>
                        </div>

                        {/* Recent Folders */}
                        {connectionStatus.recentFolders && connectionStatus.recentFolders.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                              <History className="w-4 h-4 text-muted-foreground" />
                              <h3>Recent Folders</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {connectionStatus.recentFolders.map((folder) => (
                                <button
                                  key={folder.id}
                                  onClick={() => handleSelectFolder(folder)}
                                  disabled={connectionStatus.folderId === folder.id || selectingFolder !== null}
                                  className={cn(
                                    "group flex items-center gap-3 p-4 rounded-2xl border text-left transition-all",
                                    connectionStatus.folderId === folder.id
                                      ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20 cursor-default"
                                      : "bg-card hover:bg-accent border-border/50 shadow-sm hover:shadow-md"
                                  )}
                                >
                                  <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                    connectionStatus.folderId === folder.id 
                                      ? "bg-primary/10" 
                                      : "bg-muted group-hover:bg-primary/5"
                                  )}>
                                    <FolderCheck className={cn(
                                      "w-5 h-5",
                                      connectionStatus.folderId === folder.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                    )} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{folder.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {connectionStatus.folderId === folder.id ? 'Currently active' : 'Click to switch'}
                                    </p>
                                  </div>
                                  {selectingFolder === folder.id && (
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Folder selection list */}
                    {!connectionStatus.folderId && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Select Archive Folder</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={loadFolders}
                            disabled={loadingFolders}
                            className="rounded-lg"
                          >
                            {loadingFolders ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        
                        {loadingFolders ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : folders.length > 0 ? (
                          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {folders.map((folder) => (
                              <motion.button
                                key={folder.id}
                                onClick={() => handleSelectFolder(folder)}
                                disabled={selectingFolder !== null}
                                className={cn(
                                  "w-full flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/50 hover:border-primary/30 transition-all text-left group",
                                  selectingFolder === folder.id && "border-primary bg-primary/5"
                                )}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                <div className="flex items-center gap-3">
                                  <FolderOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                  <span className="font-medium text-foreground">{folder.name}</span>
                                </div>
                                {selectingFolder === folder.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                                )}
                              </motion.button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground py-4 text-center">
                            No folders found. Click refresh to load your folders.
                          </p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Disconnected state */}
                    <div className="text-center py-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                        <Cloud className="w-8 h-8 text-blue-500" />
                      </div>
                      <p className="text-muted-foreground mb-6">
                        Connect your Google Drive to automatically import and organize your documents.
                      </p>
                      <Button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="rounded-2xl h-12 px-8"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Cloud className="w-4 h-4 mr-2" />
                            Connect Google Drive
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Setup instructions */}
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4">
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-2">
                        Setup Required
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You need to set up Google OAuth credentials and add them as environment variables:
                      </p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1 font-mono">
                        <li>GOOGLE_CLIENT_ID</li>
                        <li>GOOGLE_CLIENT_SECRET</li>
                        <li>NEXT_PUBLIC_APP_URL</li>
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="rounded-3xl glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Appearance</CardTitle>
                <CardDescription>
                  Choose how Vaulty looks to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label className="text-sm text-muted-foreground mb-3 block">Theme</Label>
                <div className="flex gap-3">
                  {themeOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-medium transition-all",
                        mounted && theme === option.value 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "bg-accent/50 text-foreground hover:bg-accent"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Archive Stats */}
          {connectionStatus.folderId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="rounded-3xl glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Archive Statistics</CardTitle>
                  <CardDescription>
                    Overview of your document collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-2xl p-4">
                      <p className="text-3xl font-bold text-foreground">{stats.totalFiles}</p>
                      <p className="text-sm text-muted-foreground">Total Documents</p>
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-4">
                      <p className="text-3xl font-bold text-foreground">{categories.filter(c => c.count > 0).length}</p>
                      <p className="text-sm text-muted-foreground">Categories</p>
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-4">
                      <p className="text-3xl font-bold text-foreground">{stats.pdfs}</p>
                      <p className="text-sm text-muted-foreground">PDF Files</p>
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-4">
                      <p className="text-3xl font-bold text-foreground">{stats.images}</p>
                      <p className="text-sm text-muted-foreground">Images</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-3xl glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground text-lg">Vaulty</p>
                  <p className="text-sm text-muted-foreground">
                    A calm place for every important document
                  </p>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Built with Next.js, Tailwind CSS, and Framer Motion</p>
                  <p>Google Drive integration for seamless document management</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}
