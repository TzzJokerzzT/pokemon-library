import mongoose from "mongoose";

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      console.log("Ya existe una conexión a MongoDB");
      return;
    }

    try {
      await mongoose.connect(uri, {
        maxPoolSize: 10,
        minPoolSize: 5,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
      });

      this.isConnected = true;
      console.log("Conexión exitosa a MongoDB");

      mongoose.connection.on("error", (error) => {
        console.error("Error de MongoDB:", error);
        this.isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB desconectado");
        this.isConnected = false;
      });
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await mongoose.disconnect();
    this.isConnected = false;
    console.log("Desconectado de MongoDB");
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
