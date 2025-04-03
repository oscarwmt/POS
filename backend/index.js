const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const sectorsRoutes = require("./routes/sectors");
const authenticateJWT = require("./middlewares/authenticateJWT");
const productsRoutes = require("./routes/products");

require("dotenv").config();

/**
 * ===========================================
 * SECCIÓN 1: INICIALIZACIÓN Y CONFIGURACIÓN
 * ===========================================
 */
const app = express();

// Verificar dependencias al iniciar
try {
  require("sequelize");
  console.log("✅ Sequelize está correctamente instalado");
} catch (error) {
  console.error("❌ Error: Sequelize no está instalado");
  console.error("Ejecuta: npm install sequelize pg pg-hstore");
  process.exit(1);
}

/**
 * ===========================================
 * SECCIÓN 2: MIDDLEWARES
 * ===========================================
 */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

/**
 * ===========================================
 * SECCIÓN 3: CONFIGURACIÓN DE MULTER (UPLOADS)
 * ===========================================
 */
const uploadsDir = path.join(__dirname, "public/uploads/products");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    mimetype && extname
      ? cb(null, true)
      : cb("Error: Solo imágenes (JPEG, JPG, PNG, GIF)");
  },
});

/**
 * ===========================================
 * SECCIÓN 4: CONEXIÓN A POSTGRESQL
 * ===========================================
 */
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "pos-db",
  password: process.env.DB_PASSWORD || "Ticex2021",
  port: process.env.DB_PORT || 5432,
});

// Verificar conexión a la base de datos
pool
  .connect()
  .then(() => console.log("✅ Conexión a PostgreSQL establecida"))
  .catch((err) => console.error("❌ Error al conectar a PostgreSQL:", err));

/**
 * ===========================================
 * SECCIÓN 5: CONFIGURACIÓN DE AUTENTICACIÓN JWT
 * ===========================================
 */
// Configuración de credenciales de administrador
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USER || "admin",
  password: process.env.ADMIN_PASS || "admin123",
};

// Middleware de autenticación JWT
const authenticateJWTMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token de autenticación requerido" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET || "tu_secreto_jwt", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido o expirado" });
    }

    req.user = user;
    next();
  });
};

// Router de autenticación
const authRouter = express.Router();
authRouter.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const token = jwt.sign(
      { username, role: "admin" },
      process.env.JWT_SECRET || "tu_secreto_jwt",
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }

  res.status(401).json({ error: "Credenciales inválidas" });
});

/**
 * ===========================================
 * SECCIÓN 6: CONFIGURACIÓN DE RUTAS
 * ===========================================
 */
// Rutas públicas
app.use("/api/auth", authRouter);
app.get("/api/health", (req, res) =>
  res.status(200).json({
    status: "OK",
    message: "Servidor POS funcionando",
    timestamp: new Date().toISOString(),
  })
);

// Rutas protegidas
app.use("/api/products", productsRoutes(pool, upload));
app.use("/api/categories", require("./routes/categories")(pool));
app.use("/api/tables", require("./routes/tables")(pool));
app.use("/api/customers", require("./routes/customers")(pool));
app.use("/api/sectors", require("./routes/sectors")(pool));
// Rutas con Sequelize
// const { sequelize, Sector, Table } = require("./db");
app.use("/api/sectors", sectorsRoutes);

/**
 * ===========================================
 * SECCIÓN 7: MANEJO DE ERRORES
 * ===========================================
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Algo salió mal",
    details: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

/**
 * ===========================================
 * SECCIÓN 8: INICIO DEL SERVIDOR
 * ===========================================
 */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor POS en puerto ${PORT}`));

module.exports = app;
