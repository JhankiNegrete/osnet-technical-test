# 🚗 Cars API - Technical Test (NestJS)

Este proyecto es una API desarrollada en **NestJS** como prueba técnica.  
Su objetivo es gestionar usuarios, productos (autos), órdenes y pagos con **PayPal (modo sandbox)**.  
Adicionalmente, la API incluye integración con **Redis** para cache.

> 🔹 **Usuario Admin por defecto**:  
> Para pruebas y administración, se incluye un usuario **admin genérico**:
>
> ```json
> {
>   "email": "admin@auto.com",
>   "password": "Admin123!",
>   "role": "admin",
>   "firstName": "Admin",
>   "lastName": "User",
>   "phone": "3000000000",
>   "address": "Main Street 1",
>   "city": "Bogota",
>   "country": "Colombia",
>   "isActive": true
> }
> ```

---

## 📦 Tecnologías principales

- [NestJS](https://nestjs.com/) - Framework backend en Node.js
- [TypeORM](https://typeorm.io/) - ORM para MySQL
- [MySQL](https://www.mysql.com/) - Base de datos relacional
- [Redis](https://redis.io/) - Cache en memoria
- [PayPal REST SDK](https://developer.paypal.com/) - Pasarela de pagos
- [Docker & Docker Compose](https://www.docker.com/) - Contenerización

---

## ⚙️ Configuración del entorno

El proyecto requiere un archivo `.env` (para desarrollo) o `.env.prod` (para producción).  
Ejemplo de configuración en **producción**:

```env
# ==========================
# Database
# ==========================
DB_HOST=api-cars-db
DB_PORT=3306
DB_USERNAME=store_user
DB_PASSWORD=st0r3_us3r
DB_NAME=cars_api_db

# ==========================
# Redis
# ==========================
REDIS_HOST=redis-db
REDIS_PORT=6379

# ==========================
# JWT
# ==========================
JWT_SECRET=mysecretkey

# ==========================
# PayPal
# ==========================
PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-sandbox-client-secret
```

> ⚠️ Los valores de `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET` se obtienen desde el [Dashboard de PayPal Developer](https://developer.paypal.com/).

> 💾 Además, en la ruta `./backup_db` se encuentra un archivo **SQL de respaldo** para inicializar la base de datos con datos de ejemplo.

---

## 🚀 Levantar el proyecto en local

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/JhankiNegrete/osnet-technical-test.git
   cd osnet-technical-test/nestjs-api-cars
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Levantar con Docker en modo desarrollo:

   ```bash
   docker-compose up --build -d
   ```

---

## 🌐 Despliegue en Producción

El proyecto cuenta con un archivo `docker-compose.prod.yaml`.  
Para levantarlo en un servidor (ejemplo: VPS o nube):

```bash
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build -d
```

---

## 📌 Endpoints principales

- **Auth**
  - `POST /auth/login`
  - `POST /auth/register`

- **Users**
  - `GET /users`
  - `GET /users/:id`

- **Products (Autos)**
  - `POST /products`
  - `GET /products`
  - `GET /products/:id`

- **Orders**
  - `POST /orders`
  - `GET /orders/:id`

- **Order Items**
  - `POST /order-items`
  - `GET /order-items/:id`

- **Payments (PayPal Sandbox)**
  - `POST /payments/create` → genera la orden en PayPal
  - `POST /payments/capture` → captura el pago confirmado

---

## 🧩 Redis en el proyecto

Redis se utiliza como sistema de cache.  
Ejemplo de uso en un servicio:

```ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async findAll() {
    const cached = await this.cacheManager.get('products');
    if (cached) return cached;

    const products = await this.productRepository.find();
    await this.cacheManager.set('products', products, 60_000); // TTL: 60s
    return products;
  }
}
```

---

## 🔑 Notas importantes

- PayPal está configurado en **modo sandbox** → solo pruebas, sin dinero real.
- Redis debe estar corriendo en el contenedor definido en `docker-compose`.
- JWT se usa para autenticación en endpoints protegidos.
- En producción, asegúrate de usar secretos seguros en `.env.prod`.
- Existe un usuario **admin por defecto** para pruebas y administración (`admin@auto.com` / `Admin123!`).
- Archivo de respaldo SQL disponible en `./backup_db`.

---

## 👨‍💻 Autor

Desarrollado por **Jhan Carlos Negrete** ✨

