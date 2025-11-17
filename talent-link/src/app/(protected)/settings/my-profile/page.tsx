'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { useAuthStore } from '@/stores/authStore'
import { userService } from '@/services/userService'
import { UserRole } from '@/types/user'
import ArtistProfileEditor from '@/components/profile/edit/ArtistProfileEditor'
import VenueProfileEditor from '@/components/profile/edit/VenueProfileEditor'

export default function MyProfileSettingsPage() {
  const { user, isInitialized } = useAuthStore()
  const [role, setRole] = useState<UserRole | null>((user?.role as UserRole) || null)
  const [loading, setLoading] = useState(!user)

  useEffect(() => {
    if (user?.role) {
      setRole(user.role as UserRole)
      setLoading(false)
      return
    }
    if (!isInitialized) return
    const fetchRole = async () => {
      try {
        setLoading(true)
        const me = await userService.getMe()
        setRole(me.role as UserRole)
      } catch (error) {
        console.error(error)
        toast.error('Không lấy được thông tin người dùng')
      } finally {
        setLoading(false)
      }
    }
    fetchRole()
  }, [user, isInitialized])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!role) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-medium">Không thể xác định vai trò của bạn</p>
        <p className="text-muted-foreground">Vui lòng đăng nhập lại hoặc liên hệ hỗ trợ.</p>
      </div>
    )
  }

  if (role === UserRole.VENUE) {
    return <VenueProfileEditor />
  }

  return <ArtistProfileEditor />
}
