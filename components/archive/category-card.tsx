'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  CreditCard, 
  Wallet, 
  Users, 
  Home, 
  Heart, 
  Award, 
  Receipt, 
  User,
  ArrowRight
} from 'lucide-react'
import { CategoryInfo } from '@/types/archive'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  CreditCard,
  Wallet,
  Users,
  Home,
  Heart,
  Award,
  Receipt,
  User,
}

interface CategoryCardProps {
  category: CategoryInfo
  delay?: number
}

export function CategoryCard({ category, delay = 0 }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || GraduationCap
  
  return (
    <Link href={`/archive?category=${category.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="group cursor-pointer"
      >
        <div className={cn(
          "rounded-2xl p-6 border border-border bg-card hover:shadow-md transition-all duration-300",
          "hover:border-primary/30"
        )}>
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              category.color
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </div>
          
          <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
            {category.label}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            {category.count} {category.count === 1 ? 'document' : 'documents'}
          </p>
        </div>
      </motion.div>
    </Link>
  )
}
