import { createClient } from "@supabase/supabase-js"
import fs from "fs"

const env = fs.readFileSync(".env.local", "utf-8")
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim()
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim()

const supabase = createClient(url, key)

const LIBROS = [
  ["gn","Genesis","antiguo",1],["ex","Exodo","antiguo",2],["lv","Levitico","antiguo",3],
  ["nm","Numeros","antiguo",4],["dt","Deuteronomio","antiguo",5],["js","Josue","antiguo",6],
  ["jud","Jueces","antiguo",7],["rt","Rut","antiguo",8],["1sm","1 Samuel","antiguo",9],
  ["2sm","2 Samuel","antiguo",10],["1kgs","1 Reyes","antiguo",11],["2kgs","2 Reyes","antiguo",12],
  ["1ch","1 Cronicas","antiguo",13],["2ch","2 Cronicas","antiguo",14],["ezr","Esdras","antiguo",15],
  ["ne","Nehemias","antiguo",16],["et","Ester","antiguo",17],["job","Job","antiguo",18],
  ["ps","Salmos","antiguo",19],["prv","Proverbios","antiguo",20],["ec","Eclesiastes","antiguo",21],
  ["so","Cantares","antiguo",22],["is","Isaias","antiguo",23],["jr","Jeremias","antiguo",24],
  ["lm","Lamentaciones","antiguo",25],["ez","Ezequiel","antiguo",26],["dn","Daniel","antiguo",27],
  ["ho","Oseas","antiguo",28],["jl","Joel","antiguo",29],["am","Amos","antiguo",30],
  ["ob","Abdias","antiguo",31],["jn","Jonas","antiguo",32],["mi","Miqueas","antiguo",33],
  ["na","Nahum","antiguo",34],["hk","Habacuc","antiguo",35],["zp","Sofonias","antiguo",36],
  ["hg","Hageo","antiguo",37],["zc","Zacarias","antiguo",38],["ml","Malaquias","antiguo",39],
  ["mt","Mateo","nuevo",40],["mk","Marcos","nuevo",41],["lk","Lucas","nuevo",42],
  ["jo","Juan","nuevo",43],["act","Hechos","nuevo",44],["rm","Romanos","nuevo",45],
  ["1co","1 Corintios","nuevo",46],["2co","2 Corintios","nuevo",47],["gl","Galatas","nuevo",48],
  ["eph","Efesios","nuevo",49],["ph","Filipenses","nuevo",50],["cl","Colosenses","nuevo",51],
  ["1ts","1 Tesalonicenses","nuevo",52],["2ts","2 Tesalonicenses","nuevo",53],
  ["1tm","1 Timoteo","nuevo",54],["2tm","2 Timoteo","nuevo",55],["tt","Tito","nuevo",56],
  ["phm","Filemon","nuevo",57],["hb","Hebreos","nuevo",58],["jm","Santiago","nuevo",59],
  ["1pe","1 Pedro","nuevo",60],["2pe","2 Pedro","nuevo",61],["1jo","1 Juan","nuevo",62],
  ["2jo","2 Juan","nuevo",63],["3jo","3 Juan","nuevo",64],["jd","Judas","nuevo",65],
  ["re","Apocalipsis","nuevo",66],
]

const mapa = Object.fromEntries(LIBROS.map(l => [l[0], l]))

const data = JSON.parse(fs.readFileSync("data-temp/es_rvr.json", "utf-8"))

let totalVersiculos = 0
let totalCapitulos = 0
let librosOk = 0
let librosFallidos = []

for (const libroJson of data) {
  const info = mapa[libroJson.abbrev]
  if (!info) {
    librosFallidos.push(libroJson.abbrev)
    continue
  }
  const [abbrev, nombre, testamento, orden] = info

  const { data: libroInsertado, error: errLibro } = await supabase
    .from("books")
    .insert({ name: nombre, abbrev, testament: testamento, book_order: orden })
    .select("id")
    .single()

  if (errLibro) {
    console.log(`ERROR insertando libro ${nombre}: ${errLibro.message}`)
    continue
  }

  const bookId = libroInsertado.id

  for (let i = 0; i < libroJson.chapters.length; i++) {
    const numeroCapitulo = i + 1
    const versiculos = libroJson.chapters[i]

    const { data: capInsertado, error: errCap } = await supabase
      .from("chapters")
      .insert({ book_id: bookId, number: numeroCapitulo })
      .select("id")
      .single()

    if (errCap) {
      console.log(`ERROR insertando capitulo ${nombre} ${numeroCapitulo}: ${errCap.message}`)
      continue
    }

    const chapterId = capInsertado.id
    totalCapitulos++

    const filas = versiculos.map((texto, idx) => ({
      chapter_id: chapterId,
      number: idx + 1,
      text: texto,
    }))

    const { error: errVer } = await supabase.from("verses").insert(filas)
    if (errVer) {
      console.log(`ERROR insertando versiculos ${nombre} ${numeroCapitulo}: ${errVer.message}`)
      continue
    }
    totalVersiculos += filas.length
  }

  librosOk++
  console.log(`OK: ${nombre} (${libroJson.chapters.length} capitulos)`)
}

console.log("\n--- RESUMEN ---")
console.log(`Libros cargados: ${librosOk} / 66`)
console.log(`Capitulos cargados: ${totalCapitulos}`)
console.log(`Versiculos cargados: ${totalVersiculos}`)
if (librosFallidos.length) {
  console.log(`Abreviaturas no reconocidas: ${librosFallidos.join(", ")}`)
}
