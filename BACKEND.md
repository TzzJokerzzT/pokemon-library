# Backend API - Pokemon Library

Backend construido con arquitectura hexagonal para el proyecto Pokemon Library, utilizando Node.js, Express, MongoDB, y TypeScript.

## Características de Seguridad

- **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **Validación de Inputs**: Usando Valibot para validación robusta
- **Protección contra Inyecciones**:
  - NoSQL Injection: Middleware personalizado de sanitización
  - XSS: Sanitización personalizada de inputs
  - SQL Injection: N/A (usando MongoDB)
- **Autenticación**: JWT con bcrypt para hashing de contraseñas
- **Rate Limiting**: Límites de peticiones por IP
- **Headers Seguros**: Helmet para configuración de headers HTTP
- **CORS**: Configuración restrictiva de orígenes permitidos
- **Cookies HTTP-only**: Tokens almacenados de forma segura
- **Dependency Injection**: Container para gestión de dependencias
- **Manejo de Errores Centralizado**: Sistema robusto de manejo de errores

## Requisitos Previos

- **Bun 1.0+** (recomendado) o Node.js 18+
- MongoDB 6+ (o MongoDB Atlas)
- npm, yarn o bun

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
bun install
# o
npm install
```

3. Copiar el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Configurar las variables de entorno en el archivo `.env`:
```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_PREFIX=/api/v1

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/pokemon-library

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=30d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_WINDOW_MS=900000
RATE_LIMIT_AUTH_MAX_REQUESTS=5

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Cookie Configuration
COOKIE_SECRET=your-super-secret-cookie-key-change-this-in-production
COOKIE_SECURE=false
COOKIE_SAME_SITE=strict
```

## Estructura del Proyecto

```
src/backend/
├── domain/                 # Capa de dominio
│   ├── entities/          # Entidades del dominio
│   ├── repositories/      # Interfaces de repositorios
│   └── errors/            # Errores del dominio
├── application/           # Capa de aplicación
│   ├── use-cases/         # Casos de uso
│   └── dto/               # DTOs y validadores
├── infrastructure/        # Capa de infraestructura
│   ├── database/          # MongoDB y modelos
│   ├── security/          # Servicios de seguridad
│   └── http/              # Express, controllers, routes
└── shared/                # Código compartido
    ├── utils/             # Utilidades
    ├── types/             # Tipos compartidos
    └── container.ts       # Dependency Injection
```

## Scripts Disponibles

```bash
# Desarrollo con hot-reload (con Bun - recomendado)
bun run dev:backend

# O con npm
npm run dev:backend

# Compilar TypeScript
bun run build:backend
# o
npm run build:backend

# Ejecutar en producción
bun run start:backend
# o
npm run start:backend
```

## Endpoints Disponibles

### Health Check
```http
GET /api/v1/health
```

### Autenticación

#### Registro de Usuario
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  },
  "message": "Usuario registrado exitosamente"
}
```

#### Login de Usuario
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  },
  "message": "Login exitoso"
}
```

#### Logout de Usuario
```http
POST /api/v1/auth/logout
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

## Validaciones de Contraseña

La contraseña debe cumplir con los siguientes requisitos:
- Mínimo 8 caracteres
- Máximo 128 caracteres
- Al menos una letra minúscula
- Al menos una letra mayúscula
- Al menos un número
- Al menos un carácter especial

## Manejo de Errores

Todos los errores siguen el siguiente formato:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/..."
}
```

### Códigos de Error Comunes

- `VALIDATION_ERROR` (400): Error en la validación de datos
- `UNAUTHORIZED` (401): Credenciales inválidas
- `FORBIDDEN` (403): Sin permisos
- `NOT_FOUND` (404): Recurso no encontrado
- `CONFLICT` (409): Conflicto (ej: email ya registrado)
- `RATE_LIMIT_EXCEEDED` (429): Límite de peticiones excedido
- `INTERNAL_SERVER_ERROR` (500): Error interno del servidor

## Rate Limiting

- **General**: 100 peticiones cada 15 minutos
- **Autenticación**: 5 intentos cada 15 minutos

## Seguridad en Producción

Asegúrate de configurar las siguientes variables para producción:

1. `NODE_ENV=production`
2. `COOKIE_SECURE=true` (requiere HTTPS)
3. Generar secretos fuertes para JWT y cookies
4. Configurar orígenes CORS específicos
5. Usar HTTPS en producción
6. Configurar MongoDB con autenticación

## Tecnologías Utilizadas

- **Bun / Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Lenguaje
- **MongoDB + Mongoose** - Base de datos
- **Valibot** - Validación de schemas
- **JWT** - Autenticación
- **Bcrypt** - Hashing de contraseñas
- **Helmet** - Headers de seguridad
- **Express Rate Limit** - Rate limiting
- **CORS** - Control de acceso
- **Middleware personalizado** - Protección contra NoSQL injection y XSS

## Licencia

MIT
