'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { searchService } from '@/services/searchService'
import type {
  JobPostSearchDto,
  JobSearchResultDto,
  UserSearchDto,
  UserSearchResultDto,
} from '@/types/search'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('query') || ''
  const [query, setQuery] = useState(initialQuery)
  const [jobs, setJobs] = useState<JobSearchResultDto | null>(null)
  const [users, setUsers] = useState<UserSearchResultDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const q = initialQuery.trim()
    if (!q) {
      setJobs(null)
      setUsers(null)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await searchService.searchAll(q)
        setJobs(result.jobs)
        setUsers(result.users)
      } catch (err) {
        console.error(err)
        setError('Không thể tải kết quả tìm kiếm.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/search?query=${encodeURIComponent(q)}`)
  }

  const renderJobs = (items?: JobPostSearchDto[]) => {
    if (!items || items.length === 0) return <p className="text-muted-foreground">Không có job phù hợp.</p>
    return (
      <div className="space-y-3">
        {items.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="block border border-border/50 rounded-lg p-4 bg-card hover:border-primary/60 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground truncate">
                  {job.creatorDisplayName || job.creatorUsername}
                </p>
                <h3 className="font-semibold text-lg truncate">{job.title}</h3>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full shrink-0">
                {job.postType}
              </span>
            </div>
            {job.location && <p className="text-sm text-muted-foreground mt-1">{job.location}</p>}
            {job.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>
            )}
          </Link>
        ))}
      </div>
    )
  }

  const renderUsers = (items?: UserSearchDto[]) => {
    if (!items || items.length === 0) return <p className="text-muted-foreground">Không tìm thấy hồ sơ người dùng.</p>
    return (
      <div className="space-y-3">
        {items.map((user) => (
          <div key={user.id} className="border border-border/50 rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{user.username}</p>
                <h3 className="font-semibold text-lg">{user.displayName || user.username}</h3>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{user.role}</span>
            </div>
            {user.location && <p className="text-sm text-muted-foreground mt-1">{user.location}</p>}
            {user.briefBio && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{user.briefBio}</p>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 pt-28 pb-12 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Kết quả tìm kiếm</h1>
        <form className="flex gap-3" onSubmit={handleSubmit}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm nghệ sĩ, job, dịch vụ..."
              className="pl-10 h-11"
            />
          </div>
          <Button type="submit" size="lg">
            Tìm kiếm
          </Button>
        </form>
        {initialQuery && (
          <p className="text-sm text-muted-foreground mt-2">
            Đang hiển thị kết quả cho “{initialQuery}”
          </p>
        )}
      </section>

      {error && <p className="text-destructive">{error}</p>}
      {loading && <p className="text-muted-foreground">Đang tải kết quả...</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Job</h2>
            {renderJobs(jobs?.jobPosts)}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Người dùng</h2>
            {renderUsers(users?.userProfiles)}
          </div>
        </div>
      )}
    </main>
  )
}

