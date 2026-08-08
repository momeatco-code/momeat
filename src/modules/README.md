# Módulos de dominio

Cada módulo contiene su lógica de dominio, aplicación, infraestructura y presentación cuando sea necesario. No se permiten importaciones directas entre infraestructuras de módulos; las integraciones deben ocurrir mediante contratos explícitos.

- `identity`: perfiles, roles y control de acceso.
- `discovery`: preferencias y recorrido de descubrimiento.
- `catalog`: puntos aliados, menús, ítems y disponibilidad.
- `reservations`: borradores, reservas y transiciones de estado.
- `audit`: eventos de negocio y trazabilidad.

`payments`, `notifications` y `partner-ops` se añadirán cuando haya especificaciones aprobadas.
