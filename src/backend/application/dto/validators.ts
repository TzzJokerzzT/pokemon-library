import * as v from "valibot";
import { customPasswordValidators } from "../constans/customPasswordValidators";

// Esquema para validar email con protección contra XSS
const EmailSchema = v.pipe(
  v.string("El email debe ser un texto"),
  v.trim(),
  v.toLowerCase(),
  v.email("El formato del email no es válido"),
  v.maxLength(255, "El email no puede exceder 255 caracteres"),
  v.regex(
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
    "El email contiene caracteres no permitidos",
  ),
);

// Esquema para validar contraseña
const PasswordSchema = v.pipe(
  v.string("La contraseña debe ser un texto"),
  v.custom((value) => {
    if (typeof value !== "string") return false;
    return !customPasswordValidators.some(
      (weak) => value.toLowerCase() === weak.toLowerCase(),
    );
  }, "La contraseña utilizada no es válida"),
  v.minLength(8, "La contraseña debe tener al menos 8 caracteres"),
  v.maxLength(128, "La contraseña no puede exceder 128 caracteres"),
  v.regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula"),
  v.regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula"),
  v.regex(/[0-9]/, "La contraseña debe contener al menos un número"),
  v.regex(
    /[^a-zA-Z0-9]/,
    "La contraseña debe contener al menos un carácter especial",
  ),
);

// Esquema para validar nombre con sanitización
const NameSchema = v.pipe(
  v.string("El nombre debe ser un texto"),
  v.trim(),
  v.minLength(2, "El nombre debe tener al menos 2 caracteres"),
  v.maxLength(100, "El nombre no puede exceder 100 caracteres"),
  v.regex(
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    "El nombre solo puede contener letras y espacios",
  ),
);

// Esquema para registro de usuario
export const RegisterUserSchema = v.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: NameSchema,
});

// Esquema para login de usuario
export const LoginUserSchema = v.object({
  email: EmailSchema,
  password: v.string("La contraseña es requerida"),
});

// Tipos inferidos desde los esquemas
export type RegisterUserInput = v.InferOutput<typeof RegisterUserSchema>;
export type LoginUserInput = v.InferOutput<typeof LoginUserSchema>;

// Función helper para validar y sanitizar datos
export function validateAndSanitize<T>(
  schema: v.BaseSchema<unknown, T, v.BaseIssue<unknown>>,
  data: unknown,
): T {
  return v.parse(schema, data);
}
