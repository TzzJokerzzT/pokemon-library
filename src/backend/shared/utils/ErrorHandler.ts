import { Request, Response, NextFunction } from "express";
import { DomainError } from "../../domain/errors/DomainErrors";
import * as v from "valibot";

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export class ErrorHandler {
  static handle(
    error: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ): void {
    console.error("Error:", {
      message: error.message,
      stack: error.stack,
      method: req.method,
    });

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Ha ocurrido un error interno",
      },
      timestamp: new Date().toISOString(),
    };

    // Manejo de errores de dominio
    if (error instanceof DomainError) {
      errorResponse.error.code = error.code;
      errorResponse.error.message = error.message;
      res.status(error.statusCode).json(errorResponse);
      return;
    }

    // Manejo de errores de validación de Valibot
    if (v.isValiError(error)) {
      errorResponse.error.code = "VALIDATION_ERROR";
      errorResponse.error.message = "Error de validación";
      errorResponse.error.details = error.issues.map((issue) => ({
        message: issue.message,
      }));
      res.status(400).json(errorResponse);
      return;
    }

    // Manejo de errores de MongoDB
    if (error.name === "MongoError" || error.name === "MongoServerError") {
      const mongoError = error as { code?: number };
      if (mongoError.code === 11000) {
        errorResponse.error.code = "DUPLICATE_KEY";
        errorResponse.error.message = "El registro ya existe";
        res.status(409).json(errorResponse);
        return;
      }
    }

    // Error genérico
    res.status(500).json(errorResponse);
  }

  static notFound(req: Request, res: Response): void {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `La ruta ${req.path} no existe`,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(404).json(errorResponse);
  }
}
