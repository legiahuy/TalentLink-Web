import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2, Check } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { searchService } from '@/services/searchService'
import { AdminUserCard } from './AdminUserCard'
import type { FeaturedUser } from '@/types/admin'
import type { UserSearchDto } from '@/types/search'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchUsersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserFeatured: () => void
}

const mapSearchResultToFeaturedUser = (user: UserSearchDto): FeaturedUser => {
  return {
    id: user.id,
    display_name: user.displayName,
    username: user.username,
    role: user.role,
    avatar_url: user.avatarUrl,
    is_verified: user.isValidated,
    is_featured: false,
    created_at: '', // Not in search result usually, optional?
    brief_bio: user.briefBio,
    city: user.location, // Assuming location string mapping
    country: '', // Might need parsing or extra field
    genres: user.genres,
    // Add other fields as needed
  } as FeaturedUser
}

export function SearchUsersDialog({ open, onOpenChange, onUserFeatured }: SearchUsersDialogProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState<FeaturedUser[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searching, setSearching] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [featuring, setFeaturing] = useState(false)

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery.trim()) {
        setResults([])
        setSearching(false)
        setIsTyping(false)
        return
      }

      setSearching(true)
      setIsTyping(false)
      try {
        const response = await searchService.searchUsers({
          query: debouncedQuery,
          page: 1,
          pageSize: 50,
        })
        
        // Map search results and filter to only include producer and singer roles
        const mappedUsers = response.userProfiles
          .filter(user => user.role === 'producer' || user.role === 'singer')
          .map(mapSearchResultToFeaturedUser)
        setResults(mappedUsers)
      } catch (error) {
        console.error('Search failed:', error)
        toast.error('Failed to search users')
      } finally {
        setSearching(false)
      }
    }

    search()
  }, [debouncedQuery])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      setSelectedIds(new Set())
      setSearching(false)
      setIsTyping(false)
    }
  }, [open])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      setIsTyping(true)
    } else {
      setIsTyping(false)
      setSearching(false)
    }
  }

  const handleSelect = (userId: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedIds(newSelected)
  }

  const handleFeatureSelected = async () => {
    if (selectedIds.size === 0) return

    setFeaturing(true)
    let successCount = 0
    let failCount = 0

    try {
      const promises = Array.from(selectedIds).map(id => 
        adminService.featureUser(id)
          .then(() => { successCount++ })
          .catch(() => { failCount++ })
      )

      await Promise.all(promises)

      if (successCount > 0) {
        toast.success(`Successfully featured ${successCount} users`)
        onUserFeatured()
        onOpenChange(false)
      }
      
      if (failCount > 0) {
        toast.error(`Failed to feature ${failCount} users`)
      }

    } catch (error) {
      console.error('Failed to feature users:', error)
      toast.error('An error occurred while featuring users')
    } finally {
      setFeaturing(false)
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[40vw] w-full h-[90vh] overflow-hidden flex flex-col border-border/50 bg-card/95 backdrop-blur-md p-0 gap-0">
        <DialogHeader className="p-6 pb-2 border-b border-border/50">
          <DialogTitle className="text-2xl">Search Users to Feature</DialogTitle>
        </DialogHeader>

        {/* Search Input Area */}
        <div className="p-4 border-b border-border/50 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username or display name..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="pl-10 h-12 text-lg bg-background border-border/50 focus-visible:ring-primary/20"
              autoFocus
            />
            {(searching || isTyping) && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/5">
          {searching && results.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Searching for users...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium mb-1">
                {query.trim() ? 'No users found' : 'Start searching'}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {query.trim() 
                  ? `We couldn't find any users matching "${query}"` 
                  : 'Enter a username or display name to find users to feature.'}
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6 auto-rows-fr transition-opacity duration-200 ${searching ? 'opacity-50' : 'opacity-100'}`}
            >
              {results.map((user) => (
                <motion.div 
                  key={user.id} 
                  variants={fadeInUp} 
                  initial="hidden"
                  animate="show"
                  className="h-full"
                >
                  <AdminUserCard
                    user={user}
                    selectable={true}
                    selected={selectedIds.has(user.id)}
                    onSelect={handleSelect}
                    isLoading={featuring}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="p-4 border-t border-border/50 bg-background flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedIds.size} user{selectedIds.size !== 1 && 's'} selected
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleFeatureSelected} 
              disabled={selectedIds.size === 0 || featuring}
              className="gap-2 min-w-[140px]"
            >
              {featuring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Feature Selected
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
