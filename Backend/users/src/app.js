import bodyParser from "body-parser";
import express from "express";
import usersRoutes from "./routes/usersRoutes.js";
import swaggerSpec from "./api-docs.js";
import swaggerUI from "swagger-ui-express";
import { userEvents } from "./services/rabbitServicesListener.js"

const app = express();

app.use(bodyParser.json());

app.use('/api/users', usersRoutes);
app.use('/api-docs', swaggerUI.serve,
    swaggerUI.setup(swaggerSpec));

userEvents().catch((err) => {
    console.error(`Error iniciando el consumidor de eventos:`, err);
})

export default app;