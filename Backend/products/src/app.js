import bodyParser from "body-parser";
import express from "express";
import usersRoutes from "./routes/productRoutes.js";
import swaggerSpec from "./api-docs.js";
import swaggerUI from "swagger-ui-express";
import path from "path";

// Obtener la ruta del directorio actual con import.meta.url
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Rutas de productos
app.use("/api/products", usersRoutes);

// Configuración de Swagger para la documentación de la API
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Servir archivos estáticos de la carpeta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

export default app;
