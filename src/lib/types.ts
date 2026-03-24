export interface Usuario {
  id: string   // DNI
  name: string
}

export interface Control {
  id: string
  nombre: string
}

export interface Modelo {
  modelo: string
  equivalencia: string  // id del control
}

export interface Reemplazo {
  id: string
  reemplazos: string[]  // ids de controles de reemplazo
}
