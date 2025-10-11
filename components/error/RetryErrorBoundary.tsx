'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Info } from 'lucide-react'
import Link from 'next/link'

interface RetryErrorBoundaryState {
  hasError: boolean
  error?: Error
  retryCount: number
}

interface RetryErrorBoundaryProps {
  children: React.ReactNode
  maxRetries?: number
  onRetry?: (retryCount: number) => void
  fallback?: React.ComponentType<{ 
    error: Error; 
    retry: () => void; 
    retryCount: number; 
    maxRetries: number;
  }>
}

export class RetryErrorBoundary extends React.Component<RetryErrorBoundaryProps, RetryErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: RetryErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): RetryErrorBoundaryState {
    return { hasError: true, error, retryCount: 0 }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RetryErrorBoundary caught an error:', error, errorInfo)
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  handleRetry = () => {
    const { maxRetries = 3, onRetry } = this.props
    const { retryCount } = this.state

    if (retryCount < maxRetries) {
      this.setState({ 
        hasError: false, 
        error: undefined, 
        retryCount: retryCount + 1 
      })
      
      onRetry?.(retryCount + 1)
      
      // Auto-retry with exponential backoff
      this.retryTimeoutId = setTimeout(() => {
        this.setState({ hasError: false })
      }, Math.pow(2, retryCount) * 1000)
    }
  }

  render() {
    const { hasError, error, retryCount } = this.state
    const { children, maxRetries = 3, fallback } = this.props

    if (hasError) {
      if (fallback) {
        const FallbackComponent = fallback
        return (
          <FallbackComponent 
          error={error!} 
          retry={this.handleRetry}
          retryCount={retryCount}
          maxRetries={maxRetries}
        />
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                {retryCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    Retry attempt {retryCount} of {maxRetries}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                  <p className="text-sm text-red-800 dark:text-red-200 font-mono">
                    {error.message}
                  </p>
                </div>
              )}
              
              {retryCount < maxRetries && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    We'll automatically retry in a few seconds...
                  </span>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                {retryCount < maxRetries ? (
                  <Button onClick={this.handleRetry} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Now ({retryCount + 1}/{maxRetries})
                  </Button>
                ) : (
                  <Button onClick={this.handleRetry} variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}
                
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return children
  }
}
