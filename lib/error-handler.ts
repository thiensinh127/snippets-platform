import { NextResponse } from 'next/server'

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    
    Error.captureStackTrace(this, this.constructor)
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof AppError) {
    return NextResponse.json(
      { 
        error: error.message,
        statusCode: error.statusCode 
      },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof Error) {
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
        statusCode: 500 
      },
      { status: 500 }
    )
  }
  
  return NextResponse.json(
    { 
      error: 'Unknown error occurred',
      statusCode: 500 
    },
    { status: 500 }
  )
}

export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error('Function error:', error)
      throw error
    }
  }
}

export function createErrorResponse(message: string, statusCode: number = 500) {
  return NextResponse.json(
    { error: message, statusCode },
    { status: statusCode }
  )
}
