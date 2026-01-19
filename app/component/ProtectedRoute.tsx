"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useAuthLoading } from "../store/authStore";
import { Spinner } from "@heroui/react";

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente para proteger rutas en el cliente
 * Segunda capa de protección después del middleware
 */
export default function ProtectedRoute({
  children,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();

  useEffect(() => {
    // Si no está autenticado y no está cargando, redirigir
    if (!isAuthenticated && !isLoading) {
      // Guardar la URL actual para redirección después del login
      const currentPath = window.location.pathname;
      router.replace(`${redirectTo}?redirect=${currentPath}`);
    } else {
      router.replace(`/pokemon`);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" label="Verificando sesión..." />
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (el useEffect redirigirá)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" label="Redirigiendo..." />
      </div>
    );
  }

  // Si está autenticado, renderizar el contenido
  return <>{children}</>;
}
