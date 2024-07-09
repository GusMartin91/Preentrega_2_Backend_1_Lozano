import express from "express";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import viewsRoutes from "./routes/views.routes.js";
import __dirname from "./dirname.js";

const app = express();

const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.use("/api", routes);
app.use("/", viewsRoutes);

const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
});
