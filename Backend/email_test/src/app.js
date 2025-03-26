import bodyParser from "body-parser";
import express from "express";
import emailRoutes from "./routes/emailRout.js";
import { userEvents, userEventForget } from "./services/rabbitServicesListener.js";

const app = express();

app.use(bodyParser.json());
app.use('/api/email', emailRoutes);

userEvents().catch((err) => {
    console.error(`Error iniciando el consumidor de eventos:`, err);
})

userEventForget().catch((err) => {
    console.error(`Error iniciando el consumidor de eventos (forget password):`, err);
})

export default app;