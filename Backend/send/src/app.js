import bodyParser from "body-parser";
import express from "express";
import usersRoutes from "./routes/sendRoutes.js";

const app = express();

app.use(bodyParser.json());

app.use('/api/send', usersRoutes);


export default app;