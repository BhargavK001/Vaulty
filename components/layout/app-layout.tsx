'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-72 min-h-screen">
        {children}
      </main>
    </div>
  )
}
