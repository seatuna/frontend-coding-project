'use client'

import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initMocks = async () => {
      if (typeof window !== 'undefined') {
        const { worker } = await import('./browser')
        await worker.start({
          // skips requests to the API that are not mocked
          onUnhandledRequest: 'bypass',
        })
        setIsReady(true)
      }
    }

    initMocks()
  }, [])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
