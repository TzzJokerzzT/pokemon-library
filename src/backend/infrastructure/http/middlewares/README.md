# Middleware de Autenticación

## Ubicación
`src/backend/infrastructure/http/middlewares/expireToken.ts`

## Funcionalidad

Este middleware valida tokens JWT para proteger rutas que requieren autenticación.

### Características:
- ✅ Valida la firma del token usando el servicio JWT
- ✅ Verifica que el token no esté expirado
- ✅ Extrae información del usuario del token
- ✅ Adjunta `req.user` al objeto Request
- ✅ Maneja errores de forma centralizada
- ✅ Sigue la arquitectura hexagonal (usa el container)

## Middlewares Disponibles

### 1. `authenticateToken` (Obligatorio)
Requiere que el usuario esté autenticado. Si no hay token o es inválido, devuelve error 401.

```typescript
import { authenticateToken } from '../middlewares/expireToken';

// Aplicar a una ruta específica
router.get('/profile', authenticateToken, (req, res) => {
  // req.user está disponible aquí
  console.log(req.user.userId);
  console.log(req.user.email);
});

// Aplicar a todas las rutas de un router
router.use(authenticateToken);
```

### 2. `optionalAuthentication` (Opcional)
Intenta autenticar al usuario, pero no falla si no hay token. Útil para rutas públicas que pueden comportarse diferente si el usuario está autenticado.

```typescript
import { optionalAuthentication } from '../middlewares/expireToken';

router.get('/posts', optionalAuthentication, (req, res) => {
  if (req.user) {
    // Usuario autenticado - mostrar posts personalizados
  } else {
    // Usuario no autenticado - mostrar posts públicos
  }
});
```

## Uso en Rutas

### Ejemplo 1: Proteger rutas individuales

```typescript
import { Router } from 'express';
import { authenticateToken } from '../middlewares/expireToken';

const router = Router();

// Ruta pública
router.get('/public', (req, res) => {
  res.json({ message: 'Acceso público' });
});

// Ruta protegida
router.get('/private', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Acceso protegido',
    user: req.user 
  });
});
```

### Ejemplo 2: Proteger todas las rutas de un router

```typescript
import { Router } from 'express';
import { authenticateToken } from '../middlewares/expireToken';

const router = Router();

// Aplicar a TODAS las rutas de este router
router.use(authenticateToken);

router.get('/profile', (req, res) => {
  // req.user disponible
});

router.get('/settings', (req, res) => {
  // req.user disponible
});
```

## Formato del Token

El token debe enviarse en el header `Authorization`:

```
Authorization: Bearer <token>
```

### Ejemplo con curl:

```bash
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:3001/api/v1/users/profile
```

### Ejemplo con fetch:

```javascript
fetch('http://localhost:3001/api/v1/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

## Objeto req.user

Cuando el token es válido, el middleware adjunta información al request:

```typescript
req.user = {
  userId: string;  // ID del usuario en MongoDB
  email: string;   // Email del usuario
}
```

## Respuestas de Error

### Sin token:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token de autenticación no proporcionado"
  },
  "timestamp": "2026-01-17T08:26:19.100Z"
}
```

### Token inválido o expirado:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido o expirado"
  },
  "timestamp": "2026-01-17T08:26:19.249Z"
}
```

## Configuración de Expiración

La expiración del token se configura en el archivo `.env`:

```env
JWT_EXPIRES_IN=7d        # Token de acceso expira en 7 días
JWT_REFRESH_EXPIRES_IN=30d  # Token de refresco expira en 30 días
```

## Arquitectura

El middleware sigue la arquitectura hexagonal:

```
expireToken.ts (Infrastructure Layer)
    ↓
container.ts (Shared Layer)
    ↓
JWTService.ts (Infrastructure Layer)
    ↓
ITokenService (Interface)
```

## TypeScript Types

El middleware extiende el tipo `Request` de Express:

```typescript
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}
```

## Pruebas

Probado y funcionando:
- ✅ Rechaza requests sin token
- ✅ Rechaza tokens inválidos
- ✅ Rechaza tokens expirados
- ✅ Acepta tokens válidos
- ✅ Adjunta req.user correctamente
