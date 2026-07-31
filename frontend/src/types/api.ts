export type Role = "ADMIN" | "PRESIDENTE" | "VECINO";
export type TipoUnidad = "VIVIENDA" | "GARAJE" | "TRASTERO";
export type EstadoIncidencia = "PENDIENTE" | "EN_PROCESO" | "RESUELTO";
export type EstadoReserva = "CONFIRMADA" | "CANCELADA";
export type EstadoRecibo = "PENDIENTE" | "PAGADO";
export type TipoMovimiento = "INGRESO" | "GASTO";
export type OpcionVoto = "SI" | "NO" | "ABSTENCION";

export interface User {
  id: string;
  email: string;
  nombre: string;
  telefono?: string | null;
}

export interface Comunidad {
  id: string;
  nombre: string;
  direccion: string;
  cif?: string | null;
}

export interface Membership {
  id: string;
  userId: string;
  comunidadId: string;
  role: Role;
  comunidad: Comunidad;
}

export interface Unidad {
  id: string;
  edificioId: string;
  tipo: TipoUnidad;
  identificador: string;
  propietarioId?: string | null;
  inquilinoId?: string | null;
  propietario?: User | null;
  inquilino?: User | null;
}

export interface Edificio {
  id: string;
  comunidadId: string;
  nombre: string;
  direccion: string;
  unidades: Unidad[];
}

export interface ComunidadStats {
  edificios: number;
  unidades: number;
  vecinos: number;
  incidenciasAbiertas: number;
  recibosPendientes: number;
}

export interface VecinoMembership {
  id: string;
  userId: string;
  comunidadId: string;
  role: Role;
  user: User;
}

export interface IncidenciaComentario {
  id: string;
  incidenciaId: string;
  autorId: string;
  texto: string;
  createdAt: string;
  autor: User;
}

export interface Incidencia {
  id: string;
  comunidadId: string;
  unidadId?: string | null;
  titulo: string;
  descripcion: string;
  estado: EstadoIncidencia;
  fotos: string[];
  creadoPorId: string;
  createdAt: string;
  unidad?: Unidad | null;
  creadoPor: User;
  comentarios?: IncidenciaComentario[];
}

export interface ZonaComun {
  id: string;
  comunidadId: string;
  nombre: string;
  descripcion?: string | null;
}

export interface Reserva {
  id: string;
  zonaComunId: string;
  unidadId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: EstadoReserva;
  unidad: Unidad;
}

export interface ZonaComunConReservas extends ZonaComun {
  reservas: Reserva[];
}

export interface Voto {
  id: string;
  votacionId: string;
  unidadId: string;
  opcion: OpcionVoto;
}

export interface Votacion {
  id: string;
  comunidadId: string;
  pregunta: string;
  fechaCierre: string;
  resultadosVisibles: boolean;
  votos: Voto[];
}

export interface Documento {
  id: string;
  comunidadId: string;
  categoria: string;
  nombre: string;
  url: string;
  subidoPorId: string;
  createdAt: string;
}

export interface Anuncio {
  id: string;
  comunidadId: string;
  titulo: string;
  cuerpo: string;
  autorId: string;
  createdAt: string;
  autor: User;
}

export interface Recibo {
  id: string;
  unidadId: string;
  concepto: string;
  importe: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: EstadoRecibo;
  unidad: Unidad;
}

export interface MovimientoContable {
  id: string;
  comunidadId: string;
  tipo: TipoMovimiento;
  concepto: string;
  importe: string;
  fecha: string;
}
