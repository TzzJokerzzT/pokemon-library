import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { ErrorHandler } from "../../shared/utils/ErrorHandler";
import { corsOptions } from "./middlewares/cors";
import { generalRateLimiter } from "./middlewares/rateLimiter";
import { sanitizeInput, xssProtection } from "./middlewares/sanitization";
import { setupSecurityHeaders } from "./middlewares/securityHeaders";
import routes from "./routes";

export function createApp(): Express {
  const app = express();

  // Middlewares de seguridad
  setupSecurityHeaders(app);
  app.use(corsOptions);

  // Parsers
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // Sanitización y protección XSS
  app.use(sanitizeInput);
  app.use(xssProtection);

  // Rate limiting general
  app.use(generalRateLimiter);

  // Rutas
  const apiPrefix = process.env.API_PREFIX || "/api/v1";
  app.use(apiPrefix, routes);

  // Manejo de rutas no encontradas
  app.use(ErrorHandler.notFound);

  // Manejo de errores global
  app.use(ErrorHandler.handle);

  return app;
}
