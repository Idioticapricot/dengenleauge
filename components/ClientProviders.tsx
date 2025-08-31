"use client"

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/react-query'
import { Providers } from './wallet/Providers'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>{children}</Providers>
    </QueryClientProvider>
  )
}