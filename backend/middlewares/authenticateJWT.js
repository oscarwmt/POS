const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET || "Secreto2023", (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Token inválido o expirado" });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: "Token de autenticación requerido" });
  }
};

module.exports = authenticateJWT;
