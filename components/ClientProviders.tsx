"use client"

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/react-query'
import { ErrorBoundary } from './ErrorBoundary'
import { Providers } from './wallet/Providers'
import { registerServiceWorker } from '../lib/sw-register'
import { useEffect } from 'react'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Providers>{children}</Providers>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}