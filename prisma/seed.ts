import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@fincas.test" },
    update: {},
    create: {
      email: "admin@fincas.test",
      passwordHash: password,
      nombre: "Ana Administradora",
      telefono: "600111222",
    },
  });

  const presidente = await prisma.user.upsert({
    where: { email: "presidente@fincas.test" },
    update: {},
    create: {
      email: "presidente@fincas.test",
      passwordHash: password,
      nombre: "Pedro Presidente",
      telefono: "600333444",
    },
  });

  const vecino1 = await prisma.user.upsert({
    where: { email: "vecino1@fincas.test" },
    update: {},
    create: {
      email: "vecino1@fincas.test",
      passwordHash: password,
      nombre: "Vera Vecina",
      telefono: "600555666",
    },
  });

  const vecino2 = await prisma.user.upsert({
    where: { email: "vecino2@fincas.test" },
    update: {},
    create: {
      email: "vecino2@fincas.test",
      passwordHash: password,
      nombre: "Vicente Vecino",
      telefono: "600777888",
    },
  });

  const comunidadA = await prisma.comunidad.upsert({
    where: { id: "comunidad-demo-a" },
    update: {},
    create: {
      id: "comunidad-demo-a",
      nombre: "Residencial Los Almendros",
      direccion: "Calle Mayor 12, Madrid",
      cif: "H12345678",
    },
  });

  const comunidadB = await prisma.comunidad.upsert({
    where: { id: "comunidad-demo-b" },
    update: {},
    create: {
      id: "comunidad-demo-b",
      nombre: "Urbanización El Pinar",
      direccion: "Avenida del Pinar 5, Pozuelo de Alarcón",
      cif: "H87654321",
    },
  });

  await prisma.membership.upsert({
    where: { userId_comunidadId: { userId: admin.id, comunidadId: comunidadA.id } },
    update: {},
    create: { userId: admin.id, comunidadId: comunidadA.id, role: "ADMIN" },
  });
  await prisma.membership.upsert({
    where: { userId_comunidadId: { userId: admin.id, comunidadId: comunidadB.id } },
    update: {},
    create: { userId: admin.id, comunidadId: comunidadB.id, role: "ADMIN" },
  });
  await prisma.membership.upsert({
    where: { userId_comunidadId: { userId: presidente.id, comunidadId: comunidadA.id } },
    update: {},
    create: { userId: presidente.id, comunidadId: comunidadA.id, role: "PRESIDENTE" },
  });
  await prisma.membership.upsert({
    where: { userId_comunidadId: { userId: vecino1.id, comunidadId: comunidadA.id } },
    update: {},
    create: { userId: vecino1.id, comunidadId: comunidadA.id, role: "VECINO" },
  });
  await prisma.membership.upsert({
    where: { userId_comunidadId: { userId: vecino2.id, comunidadId: comunidadA.id } },
    update: {},
    create: { userId: vecino2.id, comunidadId: comunidadA.id, role: "VECINO" },
  });

  const edificio1 = await prisma.edificio.upsert({
    where: { id: "edificio-demo-1" },
    update: {},
    create: {
      id: "edificio-demo-1",
      comunidadId: comunidadA.id,
      nombre: "Bloque A",
      direccion: "Calle Mayor 12",
    },
  });

  const unidad1 = await prisma.unidad.upsert({
    where: { edificioId_identificador: { edificioId: edificio1.id, identificador: "1ºA" } },
    update: {},
    create: {
      edificioId: edificio1.id,
      tipo: "VIVIENDA",
      identificador: "1ºA",
      propietarioId: vecino1.id,
    },
  });

  const unidad2 = await prisma.unidad.upsert({
    where: { edificioId_identificador: { edificioId: edificio1.id, identificador: "2ºB" } },
    update: {},
    create: {
      edificioId: edificio1.id,
      tipo: "VIVIENDA",
      identificador: "2ºB",
      propietarioId: vecino2.id,
    },
  });

  await prisma.unidad.upsert({
    where: { edificioId_identificador: { edificioId: edificio1.id, identificador: "Garaje 3" } },
    update: {},
    create: {
      edificioId: edificio1.id,
      tipo: "GARAJE",
      identificador: "Garaje 3",
      propietarioId: vecino1.id,
    },
  });

  await prisma.unidad.upsert({
    where: { edificioId_identificador: { edificioId: edificio1.id, identificador: "Trastero 3" } },
    update: {},
    create: {
      edificioId: edificio1.id,
      tipo: "TRASTERO",
      identificador: "Trastero 3",
      propietarioId: vecino1.id,
    },
  });

  await prisma.anuncio.upsert({
    where: { id: "anuncio-demo-1" },
    update: {},
    create: {
      id: "anuncio-demo-1",
      comunidadId: comunidadA.id,
      titulo: "Corte de agua programado",
      cuerpo: "El próximo martes se cortará el suministro de agua de 9:00 a 13:00 por mantenimiento.",
      autorId: presidente.id,
    },
  });

  const incidencia = await prisma.incidencia.upsert({
    where: { id: "incidencia-demo-1" },
    update: {},
    create: {
      id: "incidencia-demo-1",
      comunidadId: comunidadA.id,
      unidadId: unidad1.id,
      titulo: "Ascensor averiado",
      descripcion: "No funciona desde esta mañana.",
      estado: "EN_PROCESO",
      creadoPorId: vecino1.id,
    },
  });

  await prisma.incidenciaComentario.upsert({
    where: { id: "comentario-demo-1" },
    update: {},
    create: {
      id: "comentario-demo-1",
      incidenciaId: incidencia.id,
      autorId: admin.id,
      texto: "Técnico avisado, llega mañana a primera hora.",
    },
  });

  const zonaComun = await prisma.zonaComun.upsert({
    where: { id: "zona-demo-piscina" },
    update: {},
    create: {
      id: "zona-demo-piscina",
      comunidadId: comunidadA.id,
      nombre: "Piscina",
      descripcion: "Piscina comunitaria, uso por franjas de 1 hora.",
    },
  });

  await prisma.zonaComun.upsert({
    where: { id: "zona-demo-sala" },
    update: {},
    create: {
      id: "zona-demo-sala",
      comunidadId: comunidadA.id,
      nombre: "Sala común",
      descripcion: "Sala para reuniones y eventos privados.",
    },
  });

  const proximaFecha = new Date();
  proximaFecha.setDate(proximaFecha.getDate() + 3);
  await prisma.reserva.upsert({
    where: { id: "reserva-demo-1" },
    update: {},
    create: {
      id: "reserva-demo-1",
      zonaComunId: zonaComun.id,
      unidadId: unidad1.id,
      fecha: proximaFecha,
      horaInicio: "10:00",
      horaFin: "11:00",
    },
  });

  const fechaCierre = new Date();
  fechaCierre.setDate(fechaCierre.getDate() + 14);
  await prisma.votacion.upsert({
    where: { id: "votacion-demo-1" },
    update: {},
    create: {
      id: "votacion-demo-1",
      comunidadId: comunidadA.id,
      pregunta: "¿Aprobar presupuesto para pintar la fachada?",
      fechaCierre,
      resultadosVisibles: true,
    },
  });

  await prisma.documento.upsert({
    where: { id: "documento-demo-1" },
    update: {},
    create: {
      id: "documento-demo-1",
      comunidadId: comunidadA.id,
      categoria: "Actas",
      nombre: "Acta junta ordinaria 2026-01.pdf",
      url: "/uploads/demo/acta-2026-01.pdf",
      subidoPorId: admin.id,
    },
  });

  await prisma.recibo.upsert({
    where: { id: "recibo-demo-1" },
    update: {},
    create: {
      id: "recibo-demo-1",
      unidadId: unidad1.id,
      concepto: "Cuota comunidad julio 2026",
      importe: 85.5,
      fechaEmision: new Date("2026-07-01"),
      fechaVencimiento: new Date("2026-07-15"),
      estado: "PAGADO",
    },
  });

  await prisma.recibo.upsert({
    where: { id: "recibo-demo-2" },
    update: {},
    create: {
      id: "recibo-demo-2",
      unidadId: unidad2.id,
      concepto: "Cuota comunidad julio 2026",
      importe: 85.5,
      fechaEmision: new Date("2026-07-01"),
      fechaVencimiento: new Date("2026-07-15"),
      estado: "PENDIENTE",
    },
  });

  await prisma.movimientoContable.upsert({
    where: { id: "movimiento-demo-1" },
    update: {},
    create: {
      id: "movimiento-demo-1",
      comunidadId: comunidadA.id,
      tipo: "INGRESO",
      concepto: "Cuotas mensuales julio",
      importe: 3200,
      fecha: new Date("2026-07-05"),
    },
  });

  await prisma.movimientoContable.upsert({
    where: { id: "movimiento-demo-2" },
    update: {},
    create: {
      id: "movimiento-demo-2",
      comunidadId: comunidadA.id,
      tipo: "GASTO",
      concepto: "Mantenimiento ascensor",
      importe: 450,
      fecha: new Date("2026-07-10"),
    },
  });

  console.log("Seed completado.");
  console.log("Usuarios de prueba (password: password123):");
  console.log("  admin@fincas.test (ADMIN, varias comunidades)");
  console.log("  presidente@fincas.test (PRESIDENTE, Los Almendros)");
  console.log("  vecino1@fincas.test / vecino2@fincas.test (VECINO, Los Almendros)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
