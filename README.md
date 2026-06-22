# Bitácora de Evaluación

## Postman

### 1. Token generado
Se generó un JWT válido desde el endpoint auxiliar `POST /v1/auth/token`.

![Token generado](./evidencias/token-generado.png)

### 2. Acceso válido
Se probó el acceso autenticado con un token vigente.

![Acceso válido](./evidencias/acceso-valido.png)

### 3. Acceso con token expirado
Se validó la respuesta controlada `403` cuando el token superó su tiempo de vida.

![Acceso expirado](./evidencias/acceso-expirado.png)

### 4. Error operacional 500
Se simuló el fallo de conexión del clúster de saldos en `POST /v1/transfer-beta/execute`.

![Error operacional](./evidencias/error-operacional.png)

## Sentry

### 5. Evento registrado
El error operacional `500` fue capturado en Sentry.

![Error en Sentry](./evidencias/error-sentry.png)

### 6. Dashboard
Vista general del panel con el incidente registrado.

![Dashboard Sentry](./evidencias/dashboard-sentry.png)

### 7. Tag del usuario afectado
Se evidencia el tag personalizado con el identificador del usuario recuperado desde el JWT.

![Tag de usuario](./evidencias/tag-usuario-sentry.png)
