# MomEat

Plataforma de alimentación mediante reservas programadas. Esta Foundation cubre descubrimiento, menús curados/personalizables y reservas pendientes de confirmación. Pagos, Mercado Pago, WhatsApp, reembolsos y splits están fuera de alcance.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Supabase: Auth, PostgreSQL y Storage (sin proyecto remoto enlazado aún)
- Vitest, ESLint y Prettier
- Vercel y GitHub Actions preparados; no se ha desplegado nada

## Inicio local

1. Copia `.env.example` como `.env.local`.
2. Añade la URL y publishable key del proyecto Supabase de desarrollo aprobado.
3. Ejecuta `pnpm install` y luego `pnpm dev`.

Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` ni le asignes el prefijo `NEXT_PUBLIC_`.

## Comandos

| Comando             | Uso                     |
| ------------------- | ----------------------- |
| `pnpm dev`          | Desarrollo local        |
| `pnpm lint`         | Reglas de lint          |
| `pnpm format`       | Aplicar formato         |
| `pnpm format:check` | Verificar formato       |
| `pnpm typecheck`    | Verificación TypeScript |
| `pnpm test`         | Pruebas unitarias       |
| `pnpm build`        | Build de producción     |

## Estructura

`src/app` contiene rutas; `src/modules` contiene dominios; `src/lib/supabase` contiene adaptadores; `src/shared` contiene configuración y observabilidad. El diseño de datos propuesto está en `docs/data-model-v1.md` y no está aplicado.

## Decisiones vigentes

- Repositorio único y modular; no microservicios.
- Email OTP será la primera estrategia de autenticación cuando se habilite Auth.
- Las reservas comienzan como `pending_confirmation`.
- No se aplican migraciones ni se enlaza Supabase hasta confirmar el proyecto definitivo.
