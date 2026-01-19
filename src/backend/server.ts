import dotenv from "dotenv";
import { createApp } from "./infrastructure/http/app";
import { DatabaseConnection } from "./infrastructure/database/connection";

// Cargar variables de entorno
dotenv.config();

// Validar variables de entorno críticas
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: La variable de entorno ${envVar} es requerida`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI as string;

async function startServer() {
  try {
    // Conectar a la base de datos
    const db = DatabaseConnection.getInstance();
    await db.connect(MONGODB_URI);

    // Crear aplicación Express
    const app = createApp();

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   Servidor iniciado exitosamente      ║
║                                        ║
║   Puerto: ${PORT}                      
║   Ambiente: ${process.env.NODE_ENV || "development"}
║   API Prefix: ${process.env.API_PREFIX || "/api/v1"}
║                                        ║
╚════════════════════════════════════════╝
      `);
    });

    // Manejo de señales de terminación
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} recibido. Cerrando servidor...`);

      server.close(async () => {
        console.log("Servidor HTTP cerrado");

        try {
          await db.disconnect();
          console.log("Desconexión de base de datos exitosa");
          process.exit(0);
        } catch (error) {
          console.error("Error al cerrar conexiones:", error);
          process.exit(1);
        }
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.error("Forzando cierre después de timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Manejo de errores no capturados
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      gracefulShutdown("UNCAUGHT_EXCEPTION");
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();
