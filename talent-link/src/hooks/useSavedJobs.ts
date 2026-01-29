import { useState, useEffect, useCallback } from 'react'

const SAVED_JOBS_KEY = 'talentlink_saved_jobs'

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  // Load saved jobs from localStorage on mount and when storage changes
  useEffect(() => {
    const loadSavedJobs = () => {
      const saved = localStorage.getItem(SAVED_JOBS_KEY)
      if (saved) {
        try {
          setSavedJobs(new Set(JSON.parse(saved)))
        } catch (e) {
          console.error('Failed to load saved jobs', e)
        }
      }
    }

    loadSavedJobs()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SAVED_JOBS_KEY) {
        loadSavedJobs()
      }
    }

    // Custom event to sync across components in the same window/tab
    const handleLocalChange = () => {
      loadSavedJobs()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('local-storage-saved-jobs-change', handleLocalChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage-saved-jobs-change', handleLocalChange)
    }
  }, [])

  const toggleSave = useCallback((jobId: string) => {
    // Read current state from localStorage to ensure we have the latest data
    const saved = localStorage.getItem(SAVED_JOBS_KEY)
    const currentSaved = saved ? new Set(JSON.parse(saved)) : new Set<string>()
    
    if (currentSaved.has(jobId)) {
      currentSaved.delete(jobId)
    } else {
      currentSaved.add(jobId)
    }

    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(Array.from(currentSaved)))
    
    // Dispatch custom event to notify all listeners (including this hook's useEffect)
    window.dispatchEvent(new Event('local-storage-saved-jobs-change'))
    // We don't manually setSavedJobs here because the event listener will do it
  }, [])

  const isJobSaved = useCallback((jobId: string) => {
    return savedJobs.has(jobId)
  }, [savedJobs])

  return {
    savedJobs,
    toggleSave,
    isJobSaved
  }
}
