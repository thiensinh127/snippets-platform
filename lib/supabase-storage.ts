import { supabase } from './supabase'

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)

  return { data, error }
}

export async function getPublicUrl(bucket: string, path: string): Promise<string> {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

export async function deleteFile(bucket: string, path: string): Promise<{ error: any }> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  return { error }
}

export async function listFiles(bucket: string, path?: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path)

  return { data, error }
}
