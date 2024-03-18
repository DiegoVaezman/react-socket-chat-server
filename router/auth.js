// path: api/login

const Router = require("express");
const { createUser, login, renewToken } = require("../controllers/auth");
const { check } = require("express-validator");
const { validateField } = require("../middlewares/validate-field");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

//crear nuevo usuario
router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").notEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").notEmpty(),
    //validateField middleware personalizado que recopila errores de los check y responde error evitando ejecutar el controlador login
    validateField,
  ],
  createUser
);

//login
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").notEmpty(),
    //validateField middleware personalizado que recopila errores de los check y responde error evitando ejecutar el controlador login
    validateField,
  ],
  login
);

// revalidad token
router.get("/renew", validateJWT, renewToken);

module.exports = router;
