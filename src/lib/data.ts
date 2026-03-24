import { supabase } from './supabase'
import type { Control, Modelo, Reemplazo, Usuario } from './types'

export async function loginUser(dni: string): Promise<Usuario | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', dni)
    .single()
  if (error || !data) return null
  return data as Usuario
}

export async function getControles(): Promise<Control[]> {
  const { data } = await supabase
    .from('controles')
    .select('*')
    .order('id')
  return (data || []) as Control[]
}

export async function getModelos(): Promise<Modelo[]> {
  const { data } = await supabase
    .from('marcasymodelos')
    .select('*')
  return (data || []) as Modelo[]
}

export async function getReemplazos(): Promise<Reemplazo[]> {
  const { data } = await supabase
    .from('reemplazos')
    .select('*')
  return (data || []) as Reemplazo[]
}

export async function getAllData() {
  const [controles, modelos, reemplazos] = await Promise.all([
    getControles(),
    getModelos(),
    getReemplazos(),
  ])
  return { controles, modelos, reemplazos }
}
