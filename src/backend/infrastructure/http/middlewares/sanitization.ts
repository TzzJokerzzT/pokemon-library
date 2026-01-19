import { Request, Response, NextFunction } from 'express';

// Middleware para sanitizar inputs y prevenir NoSQL injection
export function sanitizeInput(req: Request, res: Response, next: NextFunction): void {
  const sanitizeNoSQL = (obj: unknown, path = ''): unknown => {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      // Detectar y eliminar operadores de MongoDB
      if (obj.startsWith('$') || obj.includes('$where')) {
        console.warn(`Intento de inyección NoSQL detectado en ${req.path}, path: ${path}`);
        return obj.replace(/\$/g, '_').replace(/\$where/g, '');
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item, index) => sanitizeNoSQL(item, `${path}[${index}]`));
    }

    if (typeof obj === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        // Detectar claves que son operadores de MongoDB
        if (key.startsWith('$')) {
          console.warn(`Intento de inyección NoSQL detectado en ${req.path}, key: ${key}`);
          sanitized[key.replace('$', '_')] = sanitizeNoSQL(value, `${path}.${key}`);
        } else {
          sanitized[key] = sanitizeNoSQL(value, `${path}.${key}`);
        }
      }
      return sanitized;
    }

    return obj;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeNoSQL(req.body, 'body');
  }

  next();
}

// Middleware adicional para limpiar inputs de XSS
export function xssProtection(req: Request, res: Response, next: NextFunction): void {
  const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
      // Remover tags HTML y scripts
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    if (value !== null && typeof value === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeValue(val);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  next();
}
