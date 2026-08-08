# MomEat — propuesta de modelo de datos V1

Estado: **propuesta, no aplicada**. No crear migraciones ni datos de producción hasta confirmar el proyecto Supabase definitivo y las reglas operativas.

## Identidad

| Tabla | Propósito | Campos clave |
| --- | --- | --- |
| `profiles` | Perfil extendido de `auth.users` | `id`, `display_name`, `phone_e164`, `created_at`, `updated_at` |
| `user_roles` | Roles de aplicación, no metadata editable | `user_id`, `role`, `assigned_at` |

Roles iniciales: `customer`, `momeat_operator`, `momeat_admin`, `partner_member`.

## Descubrimiento

| Tabla | Propósito | Campos clave |
| --- | --- | --- |
| `preference_questions` | Preguntas versionadas de onboarding | `id`, `slug`, `prompt`, `position`, `is_active` |
| `preference_options` | Opciones por pregunta | `id`, `question_id`, `label`, `position` |
| `user_preference_responses` | Respuestas del usuario | `user_id`, `option_id`, `created_at` |

## Catálogo

| Tabla | Propósito | Campos clave |
| --- | --- | --- |
| `partner_locations` | Punto Aliado operable | `id`, `name`, `slug`, `status`, `timezone` |
| `menu_categories` | Categorías de exploración | `id`, `slug`, `name`, `position`, `is_active` |
| `menus` | Menú curado o personalizable | `id`, `partner_location_id`, `kind`, `status`, `available_from`, `available_until` |
| `menu_items` | Opción reservable | `id`, `menu_id`, `name`, `description`, `price_amount`, `currency`, `is_available` |
| `customization_groups` | Paso seleccionable del builder | `id`, `menu_item_id`, `name`, `min_selections`, `max_selections`, `position` |
| `customization_options` | Opción dentro de un paso | `id`, `group_id`, `name`, `price_delta_amount`, `is_available` |

Los importes se guardan en unidades mínimas enteras y moneda ISO; esto modela catálogo, no cobros ni splits.

## Reservas

| Tabla | Propósito | Campos clave |
| --- | --- | --- |
| `reservation_drafts` | Selección editable previa a enviar | `id`, `user_id`, `partner_location_id`, `expires_at` |
| `reservations` | Reserva enviada a operación | `id`, `user_id`, `partner_location_id`, `status`, `scheduled_for`, `total_amount`, `currency` |
| `reservation_items` | Snapshot de ítems elegidos | `id`, `reservation_id`, `catalog_item_id`, `name_snapshot`, `unit_price_amount`, `quantity` |
| `reservation_item_customizations` | Snapshot de personalizaciones | `id`, `reservation_item_id`, `option_id`, `name_snapshot`, `price_delta_amount` |

Estados propuestos: `draft` → `pending_confirmation` → `confirmed`; la cancelación queda permitida para diseñar la interfaz, pero sus efectos operativos y financieros no están definidos.

## Eventos y seguridad

| Tabla | Propósito | Campos clave |
| --- | --- | --- |
| `reservation_events` | Historial inmutable de estado y acciones | `id`, `reservation_id`, `event_type`, `actor_type`, `actor_id`, `metadata`, `occurred_at` |
| `audit_events` | Eventos sensibles de dominio/administración | `id`, `entity_type`, `entity_id`, `action`, `actor_id`, `metadata`, `occurred_at` |

- RLS se habilita en toda tabla pública desde la misma migración que la crea.
- El cliente solo accede a sus borradores, reservas y preferencias.
- Catálogo publicado: lectura pública controlada; mutaciones únicamente para roles operativos autorizados.
- Los roles viven en `user_roles`; nunca se autorizan decisiones con `user_metadata`.
- Los eventos se insertan desde rutas/procedimientos servidor autorizados y no se editan ni borran desde el cliente.
