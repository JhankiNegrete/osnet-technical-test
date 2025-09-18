# Prueba Técnica - NestJS API & Go Ping Script

Este repositorio incluye **dos partes** de la prueba técnica:

---

## Parte 1: Cars API (NestJS)

API desarrollada en **NestJS** para gestionar usuarios, productos (autos), órdenes y pagos con **PayPal (sandbox)**.  
Incluye integración con **Redis** para cache y autenticación con **JWT**.

### Tecnologías
- NestJS, TypeORM, MySQL, Redis, PayPal REST SDK, Docker.

### Endpoints principales
- **Auth:** `/auth/login`, `/auth/register`
- **Users:** `/users`, `/users/:id`
- **Products (Autos):** `/products`, `/products/:id`
- **Orders:** `/orders`, `/orders/:id`
- **Order Items:** `/order-items`, `/order-items/:id`
- **Payments (PayPal Sandbox):** `/payments/create`, `/payments/capture`

### Usuario Admin por defecto
```json
{
  "email": "admin@example.com",
  "password": "Admin@123",
  "role": "admin",
  "firstName": "Admin",
  "lastName": "User",
  "isActive": true
}
```

### Base de datos
- Archivo SQL de respaldo disponible en `./backup_db`.

---

## Parte 2: Ping Concurrente a IPs Privadas (Go)

Script en **Go** para hacer pings concurrentes a **3000 IPs privadas** desde `./utils/ips_private.txt`.

### Características
- Pool de 100 workers (`goroutines`) para concurrencia.
- Timeout de 2 segundos por ping.
- Rangos de IP: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.
- Librería: [go-ping](https://github.com/go-ping/ping).

### Uso
```bash
go run src/multi-ping.go
```

### Resultados
- Ping exitoso: `Ping exitoso a <IP>`
- Ping fallido: `No se pudo hacer ping a <IP>`