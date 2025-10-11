'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Loader2, Plus, X } from 'lucide-react'
import { useErrorHandler } from '@/hooks/use-error-handler'
import { useRouter } from 'next/navigation'

const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  tags: z.array(z.string()).optional(),
})

type SnippetFormData = z.infer<typeof snippetSchema>

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'R', 'SQL', 'HTML', 'CSS',
  'SCSS', 'Sass', 'Less', 'JSON', 'XML', 'YAML', 'Markdown', 'Shell',
  'Bash', 'PowerShell', 'Dockerfile', 'Other'
]

interface SnippetFormProps {
  initialData?: Partial<SnippetFormData>
  onSubmit?: (data: SnippetFormData) => Promise<void>
  mode?: 'create' | 'edit'
}

export default function SnippetForm({ 
  initialData, 
  onSubmit, 
  mode = 'create' 
}: SnippetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')
  const router = useRouter()
  const { handleError } = useErrorHandler({
    onError: (error) => setSubmitError(error.message)
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<SnippetFormData>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      code: initialData?.code || '',
      language: initialData?.language || '',
      tags: initialData?.tags || [],
    }
  })

  const watchedTags = watch('tags') || []

  const addTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      setValue('tags', [...watchedTags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove))
  }

  const onFormSubmit = async (data: SnippetFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        const response = await fetch('/api/snippets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create snippet')
        }

        const snippet = await response.json()
        router.push(`/snippets/${snippet.id}`)
      }
    } catch (error) {
      handleError(error as Error, 'SnippetForm submission')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create New Snippet' : 'Edit Snippet'}
        </CardTitle>
        <CardDescription>
          Share your code with the developer community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {submitError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-800 dark:text-red-200">
                {submitError}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter snippet title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe what this snippet does"
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language *</Label>
            <Select onValueChange={(value) => setValue('language', value)}>
              <SelectTrigger className={errors.language ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select programming language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.language && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.language.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Textarea
              id="code"
              {...register('code')}
              placeholder="Paste your code here"
              rows={10}
              className={`font-mono ${errors.code ? 'border-red-500' : ''}`}
            />
            {errors.code && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.code.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {watchedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                mode === 'create' ? 'Create Snippet' : 'Update Snippet'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
