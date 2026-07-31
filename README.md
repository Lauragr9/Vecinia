# Vecinia

Plataforma de gestión de comunidades de vecinos: administradores de fincas, presidentes y vecinos en un único sitio, sustituyendo WhatsApp/correo/papel.

## Arquitectura

Monorepo con dos aplicaciones independientes:

- **`backend/`** — API REST (Node.js + TypeScript + Express + Prisma + PostgreSQL + JWT). Toda la lógica de negocio y el acceso a datos viven aquí.
- **`frontend/`** — Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui (Base UI). Cliente puro de la API: no accede a la base de datos directamente. El login guarda el JWT en una cookie `httpOnly` propia (patrón BFF) — el navegador nunca habla con el backend directamente.

## Stack

- Backend: Express 5, Prisma 7, PostgreSQL, JWT (`jsonwebtoken`), `bcryptjs`, `multer`, `zod`.
- Frontend: Next.js 16, Tailwind CSS v4, shadcn/ui (Base UI), Recharts, `lucide-react`.

## Requisitos

- Node.js 20+
- Docker (para levantar PostgreSQL en local)

## Puesta en marcha

```bash
docker compose up -d                              # levanta PostgreSQL en local
npm install                                        # instala backend y frontend (workspaces)
npm run prisma:migrate --workspace=backend          # crea el esquema
npm run prisma:seed --workspace=backend             # carga datos de ejemplo
npm run dev                                         # levanta backend (:4000) y frontend (:3000) a la vez
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
