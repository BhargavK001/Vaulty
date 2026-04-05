'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Image, 
  Heart, 
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown
} from 'lucide-react'
import { Category } from '@/types/archive'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  selectedCategory?: Category
  selectedType?: 'pdf' | 'image'
  showFavorites?: boolean
  sortBy: 'date' | 'name' | 'type'
  sortOrder: 'asc' | 'desc'
  viewMode: 'grid' | 'list'
  years: number[]
  selectedYear?: number
  onCategoryChange: (category?: Category) => void
  onTypeChange: (type?: 'pdf' | 'image') => void
  onFavoriteToggle: () => void
  onSortChange: (sortBy: 'date' | 'name' | 'type', order: 'asc' | 'desc') => void
  onViewModeChange: (mode: 'grid' | 'list') => void
  onYearChange: (year?: number) => void
  onClearFilters: () => void
}

const categories: { id: Category; label: string }[] = [
  { id: 'academic', label: 'Academic' },
  { id: 'identity', label: 'Identity' },
  { id: 'finance', label: 'Finance' },
  { id: 'family', label: 'Family' },
  { id: 'property', label: 'Property' },
  { id: 'medical', label: 'Medical' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'receipts', label: 'Receipts' },
  { id: 'personal', label: 'Personal' },
]

export function FilterBar({
  selectedCategory,
  selectedType,
  showFavorites,
  sortBy,
  sortOrder,
  viewMode,
  years,
  selectedYear,
  onCategoryChange,
  onTypeChange,
  onFavoriteToggle,
  onSortChange,
  onViewModeChange,
  onYearChange,
  onClearFilters,
}: FilterBarProps) {
  const hasFilters = selectedCategory || selectedType || showFavorites || selectedYear
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Dropdown */}
        <Select
          value={selectedCategory || 'all'}
          onValueChange={(value) => onCategoryChange(value === 'all' ? undefined : value as Category)}
        >
          <SelectTrigger className="w-[160px] rounded-xl h-10">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Type Filter Chips */}
        <div className="flex gap-2">
          <Button
            variant={selectedType === 'pdf' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTypeChange(selectedType === 'pdf' ? undefined : 'pdf')}
            className="rounded-xl h-10 gap-2"
          >
            <FileText className="w-4 h-4" />
            PDF
          </Button>
          <Button
            variant={selectedType === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTypeChange(selectedType === 'image' ? undefined : 'image')}
            className="rounded-xl h-10 gap-2"
          >
            <Image className="w-4 h-4" />
            Images
          </Button>
        </div>
        
        {/* Favorites Toggle */}
        <Button
          variant={showFavorites ? 'default' : 'outline'}
          size="sm"
          onClick={onFavoriteToggle}
          className="rounded-xl h-10 gap-2"
        >
          <Heart className={cn("w-4 h-4", showFavorites && "fill-current")} />
          Favorites
        </Button>
        
        {/* Year Dropdown */}
        {years.length > 0 && (
          <Select
            value={selectedYear?.toString() || 'all'}
            onValueChange={(value) => onYearChange(value === 'all' ? undefined : parseInt(value))}
          >
            <SelectTrigger className="w-[120px] rounded-xl h-10">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="rounded-xl h-10 gap-2 text-muted-foreground"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSortChange('date', sortOrder === 'desc' && sortBy === 'date' ? 'asc' : 'desc')}>
              Date {sortBy === 'date' && (sortOrder === 'desc' ? '(Newest)' : '(Oldest)')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('name', sortOrder === 'asc' && sortBy === 'name' ? 'desc' : 'asc')}>
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '(A-Z)' : '(Z-A)')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('type', sortOrder === 'asc' && sortBy === 'type' ? 'desc' : 'asc')}>
              Type {sortBy === 'type' && (sortOrder === 'asc' ? '(A-Z)' : '(Z-A)')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* View Mode Toggle */}
        <div className="flex border border-border rounded-xl overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-none h-10"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="rounded-none h-10"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Active Filters Pills */}
      {hasFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2"
        >
          {selectedCategory && (
            <Badge variant="secondary" className="rounded-full px-3 py-1 gap-1">
              Category: {selectedCategory}
              <button onClick={() => onCategoryChange(undefined)} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedType && (
            <Badge variant="secondary" className="rounded-full px-3 py-1 gap-1">
              Type: {selectedType.toUpperCase()}
              <button onClick={() => onTypeChange(undefined)} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {showFavorites && (
            <Badge variant="secondary" className="rounded-full px-3 py-1 gap-1">
              Favorites only
              <button onClick={onFavoriteToggle} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedYear && (
            <Badge variant="secondary" className="rounded-full px-3 py-1 gap-1">
              Year: {selectedYear}
              <button onClick={() => onYearChange(undefined)} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
