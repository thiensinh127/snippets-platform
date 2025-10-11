// Performance monitoring utilities

export function measurePerformance(name: string, fn: () => Promise<any> | any) {
  return async (...args: any[]) => {
    const start = performance.now()
    const result = await fn(...args)
    const end = performance.now()
    
    // Performance monitoring can be enabled here if needed
    // console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`)
    
    return result
  }
}

export function logWebVitals(metric: any) {
  // Web Vitals monitoring can be enabled here if needed
  // console.log('📊 Web Vitals:', metric)
  
  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    // Example: send to Google Analytics, Vercel Analytics, etc.
    // gtag('event', metric.name, {
    //   value: Math.round(metric.value),
    //   event_category: 'Web Vitals',
    // })
  }
}

export function getCacheHeaders(maxAge: number = 60) {
  return {
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    'CDN-Cache-Control': `max-age=${maxAge}`,
    'Vercel-CDN-Cache-Control': `max-age=${maxAge}`,
  }
}
