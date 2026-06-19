// ============================================================
// BIBLIA 365 — CONSTANTS
// ============================================================

// App
export const APP_NAME = "Biblia 365"
export const APP_DESCRIPTION = "Tu compañero diario de lectura bíblica"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://biblia365.app"
export const APP_VERSION = "1.0.0"

// Rutas publicas
export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  RECOVER: "/auth/recover",
  BIBLE: "/biblia",
  DEVOTIONALS: "/devocionales",
  PLANS: "/planes",
  FAVORITES: "/favoritos",
  PHRASE: "/frase-del-dia",
  PROFILE: "/perfil",
  ADMIN: {
    ROOT: "/admin",
    DEVOTIONALS: "/admin/devocionales",
    PHRASES: "/admin/frases",
    USERS: "/admin/usuarios",
    PLANS: "/admin/planes",
  },
} as const

// Roles
export const ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const

// Biblia 66 libros
export const BIBLE_BOOKS = [
  { id: 1,  name: "Genesis",        abbr: "Gn",  testament: "OT", chapters: 50 },
  { id: 2,  name: "Exodo",          abbr: "Ex",  testament: "OT", chapters: 40 },
  { id: 3,  name: "Levitico",       abbr: "Lv",  testament: "OT", chapters: 27 },
  { id: 4,  name: "Numeros",        abbr: "Nm",  testament: "OT", chapters: 36 },
  { id: 5,  name: "Deuteronomio",   abbr: "Dt",  testament: "OT", chapters: 34 },
  { id: 6,  name: "Josue",          abbr: "Jos", testament: "OT", chapters: 24 },
  { id: 7,  name: "Jueces",         abbr: "Jue", testament: "OT", chapters: 21 },
  { id: 8,  name: "Rut",            abbr: "Rt",  testament: "OT", chapters: 4  },
  { id: 9,  name: "1 Samuel",       abbr: "1S",  testament: "OT", chapters: 31 },
  { id: 10, name: "2 Samuel",       abbr: "2S",  testament: "OT", chapters: 24 },
  { id: 11, name: "1 Reyes",        abbr: "1R",  testament: "OT", chapters: 22 },
  { id: 12, name: "2 Reyes",        abbr: "2R",  testament: "OT", chapters: 25 },
  { id: 13, name: "1 Cronicas",     abbr: "1Cr", testament: "OT", chapters: 29 },
  { id: 14, name: "2 Cronicas",     abbr: "2Cr", testament: "OT", chapters: 36 },
  { id: 15, name: "Esdras",         abbr: "Esd", testament: "OT", chapters: 10 },
  { id: 16, name: "Nehemias",       abbr: "Neh", testament: "OT", chapters: 13 },
  { id: 17, name: "Ester",          abbr: "Est", testament: "OT", chapters: 10 },
  { id: 18, name: "Job",            abbr: "Job", testament: "OT", chapters: 42 },
  { id: 19, name: "Salmos",         abbr: "Sal", testament: "OT", chapters: 150 },
  { id: 20, name: "Proverbios",     abbr: "Pr",  testament: "OT", chapters: 31 },
  { id: 21, name: "Eclesiastes",    abbr: "Ec",  testament: "OT", chapters: 12 },
  { id: 22, name: "Cantares",       abbr: "Cnt", testament: "OT", chapters: 8  },
  { id: 23, name: "Isaias",         abbr: "Is",  testament: "OT", chapters: 66 },
  { id: 24, name: "Jeremias",       abbr: "Jr",  testament: "OT", chapters: 52 },
  { id: 25, name: "Lamentaciones",  abbr: "Lm",  testament: "OT", chapters: 5  },
  { id: 26, name: "Ezequiel",       abbr: "Ez",  testament: "OT", chapters: 48 },
  { id: 27, name: "Daniel",         abbr: "Dn",  testament: "OT", chapters: 12 },
  { id: 28, name: "Oseas",          abbr: "Os",  testament: "OT", chapters: 14 },
  { id: 29, name: "Joel",           abbr: "Jl",  testament: "OT", chapters: 3  },
  { id: 30, name: "Amos",           abbr: "Am",  testament: "OT", chapters: 9  },
  { id: 31, name: "Abdias",         abbr: "Abd", testament: "OT", chapters: 1  },
  { id: 32, name: "Jonas",          abbr: "Jon", testament: "OT", chapters: 4  },
  { id: 33, name: "Miqueas",        abbr: "Miq", testament: "OT", chapters: 7  },
  { id: 34, name: "Nahum",          abbr: "Nah", testament: "OT", chapters: 3  },
  { id: 35, name: "Habacuc",        abbr: "Hab", testament: "OT", chapters: 3  },
  { id: 36, name: "Sofonias",       abbr: "Sof", testament: "OT", chapters: 3  },
  { id: 37, name: "Hageo",          abbr: "Hag", testament: "OT", chapters: 2  },
  { id: 38, name: "Zacarias",       abbr: "Zac", testament: "OT", chapters: 14 },
  { id: 39, name: "Malaquias",      abbr: "Mal", testament: "OT", chapters: 4  },
  { id: 40, name: "Mateo",          abbr: "Mt",  testament: "NT", chapters: 28 },
  { id: 41, name: "Marcos",         abbr: "Mr",  testament: "NT", chapters: 16 },
  { id: 42, name: "Lucas",          abbr: "Lc",  testament: "NT", chapters: 24 },
  { id: 43, name: "Juan",           abbr: "Jn",  testament: "NT", chapters: 21 },
  { id: 44, name: "Hechos",         abbr: "Hch", testament: "NT", chapters: 28 },
  { id: 45, name: "Romanos",        abbr: "Ro",  testament: "NT", chapters: 16 },
  { id: 46, name: "1 Corintios",    abbr: "1Co", testament: "NT", chapters: 16 },
  { id: 47, name: "2 Corintios",    abbr: "2Co", testament: "NT", chapters: 13 },
  { id: 48, name: "Galatas",        abbr: "Gl",  testament: "NT", chapters: 6  },
  { id: 49, name: "Efesios",        abbr: "Ef",  testament: "NT", chapters: 6  },
  { id: 50, name: "Filipenses",     abbr: "Fil", testament: "NT", chapters: 4  },
  { id: 51, name: "Colosenses",     abbr: "Col", testament: "NT", chapters: 4  },
  { id: 52, name: "1 Tesalonicenses", abbr: "1Ts", testament: "NT", chapters: 5 },
  { id: 53, name: "2 Tesalonicenses", abbr: "2Ts", testament: "NT", chapters: 3 },
  { id: 54, name: "1 Timoteo",      abbr: "1Ti", testament: "NT", chapters: 6  },
  { id: 55, name: "2 Timoteo",      abbr: "2Ti", testament: "NT", chapters: 4  },
  { id: 56, name: "Tito",           abbr: "Tit", testament: "NT", chapters: 3  },
  { id: 57, name: "Filemon",        abbr: "Flm", testament: "NT", chapters: 1  },
  { id: 58, name: "Hebreos",        abbr: "Heb", testament: "NT", chapters: 13 },
  { id: 59, name: "Santiago",       abbr: "Stg", testament: "NT", chapters: 5  },
  { id: 60, name: "1 Pedro",        abbr: "1P",  testament: "NT", chapters: 5  },
  { id: 61, name: "2 Pedro",        abbr: "2P",  testament: "NT", chapters: 3  },
  { id: 62, name: "1 Juan",         abbr: "1Jn", testament: "NT", chapters: 5  },
  { id: 63, name: "2 Juan",         abbr: "2Jn", testament: "NT", chapters: 1  },
  { id: 64, name: "3 Juan",         abbr: "3Jn", testament: "NT", chapters: 1  },
  { id: 65, name: "Judas",          abbr: "Jud", testament: "NT", chapters: 1  },
  { id: 66, name: "Apocalipsis",    abbr: "Ap",  testament: "NT", chapters: 22 },
] as const

// Versiones de la Biblia
export const BIBLE_VERSIONS = [
  { id: "RVR1960", name: "Reina-Valera 1960",          lang: "es" },
  { id: "NVI",     name: "Nueva Version Internacional", lang: "es" },
  { id: "LBLA",    name: "La Biblia de las Americas",   lang: "es" },
  { id: "DHH",     name: "Dios Habla Hoy",              lang: "es" },
  { id: "KJV",     name: "King James Version",          lang: "en" },
  { id: "NIV",     name: "New International Version",   lang: "en" },
] as const

export const DEFAULT_BIBLE_VERSION = "RVR1960"

// Categorias de devocionales
export const DEVOTIONAL_CATEGORIES = [
  { id: "fe",         label: "Fe" },
  { id: "esperanza",  label: "Esperanza" },
  { id: "amor",       label: "Amor" },
  { id: "oracion",    label: "Oracion" },
  { id: "familia",    label: "Familia" },
  { id: "proposito",  label: "Proposito" },
  { id: "perdon",     label: "Perdon" },
  { id: "alabanza",   label: "Alabanza" },
  { id: "sabiduria",  label: "Sabiduria" },
  { id: "identidad",  label: "Identidad en Cristo" },
] as const

// Duraciones de planes
export const PLAN_DURATIONS = [
  { value: 7,   label: "1 semana" },
  { value: 14,  label: "2 semanas" },
  { value: 30,  label: "1 mes" },
  { value: 60,  label: "2 meses" },
  { value: 90,  label: "3 meses" },
  { value: 180, label: "6 meses" },
  { value: 365, label: "1 ano" },
] as const

// Dificultad de planes
export const PLAN_DIFFICULTIES = [
  { value: "beginner",     label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced",     label: "Avanzado" },
] as const

// Tipos de favorito
export const FAVORITE_TYPES = {
  VERSE:      "verse",
  DEVOTIONAL: "devotional",
  PHRASE:     "phrase",
} as const

// Paginacion
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  ADMIN_PAGE_SIZE:   20,
  BIBLE_PAGE_SIZE:   50,
} as const

// Limites de texto
export const TEXT_LIMITS = {
  TITLE_MAX:   100,
  EXCERPT_MAX: 300,
  CONTENT_MAX: 10000,
  PHRASE_MAX:  500,
  NOTE_MAX:    1000,
  SEARCH_MAX:  100,
} as const

// Horarios de notificacion
export const NOTIFICATION_TIMES = [
  { value: "06:00", label: "6:00 AM" },
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "21:00", label: "9:00 PM" },
] as const

// API externa
export const BIBLE_API = {
  BASE_URL: "https://bible-api.com",
  TIMEOUT:  5000,
} as const

// Claves de almacenamiento
export const STORAGE_KEYS = {
  BIBLE_VERSION:   "biblia365_version",
  FONT_SIZE:       "biblia365_fontsize",
  THEME:           "biblia365_theme",
  LAST_BOOK:       "biblia365_last_book",
  LAST_CHAPTER:    "biblia365_last_chapter",
  ONBOARDING_DONE: "biblia365_onboarding",
} as const

// Temas
export const THEMES = {
  LIGHT: "light",
  DARK:  "dark",
  SEPIA: "sepia",
} as const

// Tamanios de fuente
export const FONT_SIZES = [
  { value: "sm",   label: "Pequeno",    class: "text-sm"   },
  { value: "base", label: "Normal",     class: "text-base" },
  { value: "lg",   label: "Grande",     class: "text-lg"   },
  { value: "xl",   label: "Muy grande", class: "text-xl"   },
] as const

export const DEFAULT_FONT_SIZE = "base"
