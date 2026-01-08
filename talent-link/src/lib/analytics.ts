// Analytics event tracking service
import { logEvent, EventParams, Analytics } from 'firebase/analytics'
import { getFirebaseAnalytics } from './firebase'

// Analytics instance cache
let analyticsInstance: Analytics | null = null

// Initialize analytics instance (call once on app load)
export const initAnalytics = async (): Promise<void> => {
  if (typeof window !== 'undefined' && !analyticsInstance) {
    analyticsInstance = await getFirebaseAnalytics()
  }
}

// Get analytics instance
const getAnalytics = (): Analytics | null => {
  return analyticsInstance
}

// Generic event logging function
const logAnalyticsEvent = async (
  eventName: string,
  eventParams?: EventParams,
): Promise<void> => {
  try {
    const analytics = getAnalytics()
    if (analytics) {
      logEvent(analytics, eventName, eventParams)
    }
  } catch (error) {
    console.error('Analytics event logging error:', error)
  }
}

// ===== User Events =====

export const analytics = {
  // Page view tracking
  logPageView: (pageName: string, pagePath?: string) => {
    return logAnalyticsEvent('page_view', {
      page_title: pageName,
      page_location: pagePath || window.location.href,
      page_path: pagePath || window.location.pathname,
    })
  },

  // ===== Authentication Events =====

  logSignUp: (method: 'email' | 'google' | 'oauth') => {
    return logAnalyticsEvent('sign_up', {
      method,
    })
  },

  logLogin: (method: 'email' | 'google' | 'oauth') => {
    return logAnalyticsEvent('login', {
      method,
    })
  },

  logLogout: () => {
    return logAnalyticsEvent('logout')
  },

  // ===== Search Events =====

  logSearch: (searchTerm: string, searchType?: 'jobs' | 'users' | 'all') => {
    return logAnalyticsEvent('search', {
      search_term: searchTerm,
      search_type: searchType || 'all',
    })
  },

  logViewSearchResults: (
    searchTerm: string,
    resultCount: number,
    searchType: 'jobs' | 'users' | 'all',
  ) => {
    return logAnalyticsEvent('view_search_results', {
      search_term: searchTerm,
      search_type: searchType,
      result_count: resultCount,
    })
  },

  // ===== Job Events =====

  logViewJob: (jobId: string, jobTitle: string, jobType?: string) => {
    return logAnalyticsEvent('view_job', {
      job_id: jobId,
      job_title: jobTitle,
      job_type: jobType,
    })
  },

  logApplyJob: (jobId: string, jobTitle: string) => {
    return logAnalyticsEvent('apply_job', {
      job_id: jobId,
      job_title: jobTitle,
    })
  },

  logCreateJob: (jobType: string) => {
    return logAnalyticsEvent('create_job', {
      job_type: jobType,
    })
  },

  logShareJob: (jobId: string, method: 'link' | 'social') => {
    return logAnalyticsEvent('share_job', {
      job_id: jobId,
      method,
    })
  },

  // ===== Profile Events =====

  logViewProfile: (userId: string, profileType: 'producer' | 'singer' | 'venue') => {
    return logAnalyticsEvent('view_profile', {
      user_id: userId,
      profile_type: profileType,
    })
  },

  logEditProfile: (section?: string) => {
    return logAnalyticsEvent('edit_profile', {
      section: section || 'general',
    })
  },

  // ===== Message Events =====

  logSendMessage: (conversationId: string, messageType: 'text' | 'media') => {
    return logAnalyticsEvent('send_message', {
      conversation_id: conversationId,
      message_type: messageType,
    })
  },

  logStartConversation: (recipientId: string) => {
    return logAnalyticsEvent('start_conversation', {
      recipient_id: recipientId,
    })
  },

  // ===== Navigation Events =====

  logNavigation: (destination: string, source?: string) => {
    return logAnalyticsEvent('navigation', {
      destination,
      source: source || 'unknown',
    })
  },

  // ===== Engagement Events =====

  logClick: (elementName: string, elementType?: string) => {
    return logAnalyticsEvent('click', {
      element_name: elementName,
      element_type: elementType,
    })
  },

  logDownload: (fileType: string, fileName?: string) => {
    return logAnalyticsEvent('file_download', {
      file_type: fileType,
      file_name: fileName,
    })
  },

  logVideoPlay: (videoId: string, videoTitle?: string) => {
    return logAnalyticsEvent('video_play', {
      video_id: videoId,
      video_title: videoTitle,
    })
  },

  // ===== Error Events =====

  logError: (errorType: string, errorMessage: string, errorLocation?: string) => {
    return logAnalyticsEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
      error_location: errorLocation,
    })
  },

  // ===== Custom Event =====

  logCustomEvent: (eventName: string, eventParams?: EventParams) => {
    return logAnalyticsEvent(eventName, eventParams)
  },
}
