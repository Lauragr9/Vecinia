# Vecinia

Plataforma de gestión de comunidades de vecinos: administradores de fincas, presidentes y vecinos en un único sitio, sustituyendo WhatsApp/correo/papel.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (Base UI)
- [Prisma 7](https://www.prisma.io) + PostgreSQL
- [NextAuth.js v5](https://authjs.dev) (credenciales)
- [Recharts](https://recharts.org) para gráficas

## Requisitos

- Node.js 20+
- Docker (para levantar PostgreSQL en local)

## Puesta en marcha

```bash
docker compose up -d          # levanta PostgreSQL en local
npm install
npx prisma migrate dev        # crea el esquema
npx prisma db seed            # carga datos de ejemplo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Usuarios de prueba (contraseña `password123`)

| Email | Rol |
|---|---|
| `admin@fincas.test` | Administrador de fincas (varias comunidades) |
| `presidente@fincas.test` | Presidente |
| `vecino1@fincas.test` / `vecino2@fincas.test` | Vecino |

## Funcionalidades

- **Panel admin**: comunidades, edificios, unidades (viviendas/garajes/trasteros), vecinos, incidencias, reservas, votaciones, documentos, anuncios, gastos y recibos.
- **Portal del vecino/presidente**: su unidad, anuncios, documentos, incidencias, reservas de zonas comunes, votaciones y recibos.

## Fuera de alcance (backlog "Fase 2")

IA (resúmenes de actas, chat, asistente), chat en tiempo real, app móvil nativa, empresas externas, pasarela de pago real, automatizaciones.
