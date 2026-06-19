export type Rol = "usuario" | "admin"
export type Testamento = "antiguo" | "nuevo"
export type Version = "RVR1960" | "NVI" | "RVA2015"
export type Tema = "dark" | "light"

export interface Usuario {
  id: string
  email: string
  nombre: string | null
  avatar_url: string | null
  rol: Rol
  plan_activo: string
  notificaciones_activas: boolean
  hora_notificacion: string
  tema: Tema
  idioma: string
  created_at: string
  updated_at: string
}

export interface Libro {
  id: number
  nombre: string
  abreviatura: string
  testamento: Testamento
  total_capitulos: number
  orden: number
  descripcion: string | null
  created_at: string
}

export interface Capitulo {
  id: number
  libro_id: number
  numero: number
  total_versiculos: number
  created_at: string
}

export interface Versiculo {
  id: number
  libro_id: number
  capitulo_id: number
  numero: number
  texto: string
  version: Version
  created_at: string
  libro?: Libro
  capitulo?: Capitulo
}

export interface Devocional {
  id: string
  titulo: string
  versiculo_base: string
  referencia: string
  reflexion: string
  aplicacion: string
  oracion: string
  imagen_url: string | null
  autor: string
  publicado: boolean
  fecha_publicacion: string | null
  tags: string[] | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface FraseDia {
  id: string
  frase: string
  autor: string | null
  aplicacion: string
  oracion: string
  imagen_url: string | null
  fecha: string | null
  publicado: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Favorito {
  id: string
  usuario_id: string
  tipo: "versiculo" | "devocional"
  referencia_id: string
  nota: string | null
  created_at: string
  versiculo?: Versiculo
  devocional?: Devocional
}

export interface PlanLectura {
  id: string
  nombre: string
  descripcion: string
  duracion_dias: number
  imagen_url: string | null
  activo: boolean
  created_at: string
}

export interface ProgresoLectura {
  id: string
  usuario_id: string
  plan_id: string
  dia_actual: number
  completado: boolean
  fecha_inicio: string
  fecha_fin: string | null
  created_at: string
  updated_at: string
}
