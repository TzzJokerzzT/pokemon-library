import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================
// MIDDLEWARE DE NEXT.JS
// ============================================

/**
 * Rutas que requieren autenticación
 */
const PROTECTED_ROUTES = ["/pokemon"];

/**
 * Rutas de autenticación (redirigir si ya está autenticado)
 */
const AUTH_ROUTES = ["/", "/register"];

/**
 * Middleware para proteger rutas
 * Se ejecuta en el servidor antes de renderizar la página
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener token de la cookie o localStorage (en edge runtime usamos cookies)
  const token = request.cookies.get("token")?.value;

  // Verificar si es una ruta protegida
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Verificar si es una ruta de autenticación
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirect", pathname); // Guardar ruta original para redirección después del login
    return NextResponse.redirect(url);
  }

  // Si es una ruta de autenticación y ya hay token, redirigir a /pokemon
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/pokemon";
    return NextResponse.redirect(url);
  }

  // Permitir el acceso
  return NextResponse.next();
}

// ============================================
// CONFIGURACIÓN
// ============================================

/**
 * Configurar en qué rutas se ejecuta el middleware
 */
export const config = {
  matcher: [
    /*
     * Match todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
