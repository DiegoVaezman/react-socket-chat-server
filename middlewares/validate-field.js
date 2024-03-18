const { validationResult } = require("express-validator");

// los middlewares en las rutas se ejecutan uno a uno antes del controlador, cada uno debe tener internamente un next()
// que manda continuar al siguiente middelware o al controlador.

const validateField = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }

  next();
};

module.exports = {
  validateField,
};
