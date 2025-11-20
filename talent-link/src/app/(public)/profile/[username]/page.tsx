'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader, Frown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { userService } from '@/services/userService'
import { videoService } from '@/services/videoService'
import type { User, UserRole } from '@/types/user'
import type { Media } from '@/types/media'
import type { Experience } from '@/types/experience'
import type { VideoItem } from '@/services/videoService'
import { ArtistProfileView } from '@/components/profile/ArtistProfileView'
import { VenueProfileView } from '@/components/profile/VenueProfileView'
import { isArtist } from '@/types/user'
const ProfilePage = () => {
  const params = useParams<{ username: string }>()
  const t = useTranslations('NotFound')
  const username = params?.username ?? ''
  const router = useRouter()
  const { user: currentUser } = useAuthStore()

  const [profile, setProfile] = useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [gallery, setGallery] = useState<Media[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isOwnProfile = useMemo(
    () => currentUser?.username === username,
    [currentUser?.username, username],
  )

  // Set page title dynamically
  useEffect(() => {
    if (profile) {
      const displayName = profile.display_name
      document.title = `${displayName} | TalentLink`
    }
  }, [profile])

  useEffect(() => {
    let active = true

    if (!username) {
      setError('Username không hợp lệ')
      setLoading(false)
      return
    }

    const loadProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const userData = await userService.getUserByUsername(username)
        if (!active) return
        setProfile(userData)

        const [mediaRes, experiencesRes, videosRes] = await Promise.all([
          // userService.getAvatarByUserId(userData.id).catch(() => null),
          // userService.getCoverByUserId(userData.id).catch(() => null),
          userService.getUserMediaById(userData.id).catch(() => ({ media: [], total: 0 })),
          userService.listUserExperiences(userData.id).catch(() => []),
          videoService.getUserVideos(userData.username).catch(() => ({ items: [], total: 0 })),
        ])
        console.log('user:', userData)
        if (!active) return
        setAvatarUrl(userData.avatar_url ?? null)
        setCoverUrl(userData.cover_url ?? null)
        setGallery(mediaRes.media ?? [])
        setExperiences(experiencesRes)
        setVideos(videosRes.items ?? [])
      } catch (e) {
        console.error('Error loading profile', e)
        if (!active) return
        const message = e instanceof Error ? e.message : 'Không thể tải hồ sơ'
        setError(message)
        toast.error(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProfile()
    return () => {
      active = false
    }
  }, [username])

  const handleEdit = () => {
    if (!profile) return
    router.push('/settings/my-profile')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={24} />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-[70vh] w-full relative flex items-center justify-center">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `
        linear-gradient(to right, rgba(229,231,235,0.8) 0.3px, transparent 1px),
        linear-gradient(to bottom, rgba(229,231,235,0.8) 0.3px, transparent 1px),
        radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.3), transparent),
        radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.3), transparent)
      `,
            backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
          }}
        />

        <div className="w-full max-w-lg p-6">
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <Frown className="z-10 size-10" />
            <h2 className="text-2xl font-bold z-10">Profile Not Found</h2>
            <p className="z-10">{t('description')}</p>
            <Button
              onClick={() => router.replace('/')}
              variant="link"
              size="lg"
              className="z-10 text-md"
            >
              {t('back')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderProfile = () => {
    if (isArtist(profile.role as UserRole)) {
      return (
        <ArtistProfileView
          profile={profile}
          avatarUrl={avatarUrl}
          coverUrl={coverUrl}
          gallery={gallery}
          experiences={experiences}
          videos={videos}
          isOwner={isOwnProfile}
          onEdit={handleEdit}
        />
      )
    }

    return (
      <VenueProfileView
        profile={profile}
        avatarUrl={avatarUrl}
        coverUrl={coverUrl}
        isOwner={isOwnProfile}
        onEdit={handleEdit}
      />
    )
  }

  return renderProfile()
}

export default ProfilePage
