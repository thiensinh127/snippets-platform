'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface UseErrorHandlerOptions {
  onError?: (error: Error) => void
  redirectOnError?: boolean
  redirectPath?: string
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const router = useRouter()
  const { onError, redirectOnError = false, redirectPath = '/' } = options

  const handleError = useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error)
    
    // Call custom error handler
    onError?.(error)
    
    // Redirect if enabled
    if (redirectOnError) {
      router.push(redirectPath)
    }
  }, [onError, redirectOnError, redirectPath, router])

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn()
    } catch (error) {
      handleError(error as Error, context)
      return null
    }
  }, [handleError])

  return {
    handleError,
    handleAsyncError,
  }
}
