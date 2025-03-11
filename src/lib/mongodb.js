import { MongoClient } from "mongodb";
import mongoose from "mongoose";

// Comprueba si la autenticación está habilitada
const isAuthEnabled = process.env.AUTH_ENABLED === "true";

// Solo realiza la verificación y configuración de MongoDB si la autenticación está habilitada
if (isAuthEnabled && !process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dummy";
const options = {};

let client;
let clientPromise;

// Solo inicializa la conexión si la autenticación está habilitada
if (isAuthEnabled) {
  if (process.env.NODE_ENV === "development") {
    // En desarrollo, usamos una variable global para preservar el valor
    // a través de las recargas de módulos causadas por HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // En producción, es mejor no usar una variable global.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Función para conectar con Mongoose
export const connectMongoDB = async () => {
  // Si la autenticación está deshabilitada, no hace nada
  if (!isAuthEnabled) {
    return null;
  }
  
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    return await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

// Exporta una promesa dummy si la autenticación está deshabilitada
export default isAuthEnabled ? clientPromise : Promise.resolve({});
