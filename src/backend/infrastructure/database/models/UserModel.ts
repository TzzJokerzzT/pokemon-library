import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // No incluir password por defecto en queries
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = mongoose.model('User', userSchema);
// Esto crea la colección "users" (plural automático)

// Si quieres un nombre personalizado, usa el tercer parámetro:
// export const UserModel = mongoose.model('User', userSchema, 'miColeccionPersonalizada');
