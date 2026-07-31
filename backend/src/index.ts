import "dotenv/config";
import express from "express";
import path from "path";
import { authRouter } from "./routes/auth.routes.js";
import { comunidadesRouter } from "./routes/comunidades.routes.js";
import { incidenciasRouter } from "./routes/incidencias.routes.js";
import { reservasRouter } from "./routes/reservas.routes.js";
import { votacionesRouter } from "./routes/votaciones.routes.js";
import { documentosRouter } from "./routes/documentos.routes.js";
import { anunciosRouter } from "./routes/anuncios.routes.js";
import { gastosRouter } from "./routes/gastos.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error-handler.js";

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api", comunidadesRouter);
app.use("/api", incidenciasRouter);
app.use("/api", reservasRouter);
app.use("/api", votacionesRouter);
app.use("/api", documentosRouter);
app.use("/api", anunciosRouter);
app.use("/api", gastosRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Vecinia API escuchando en http://localhost:${port}`);
});
