const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");

//crear usuario
const createUser = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    //verificar si ya existe usuario
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya existe",
      });
    }

    //crear modelo de usuario
    const user = new User(req.body);

    //encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //guardar usuario en ddbb
    await user.save();

    //generar jwt
    const token = await generateJWT(user.id);

    //.respuesta final del controlador
    res.status(200).json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Contacte con el administrador",
    });
  }
};

//login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //verificar usuario existe
    const ddbbUser = await User.findOne({ email });
    console.log(ddbbUser);
    if (!ddbbUser) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    //validar password
    const validPassword = bcrypt.compareSync(password, ddbbUser.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password no es correcto",
      });
    }

    //generar jwt
    const token = await generateJWT(ddbbUser.id);

    //.respuesta final del controlador
    res.status(200).json({
      ok: true,
      user: ddbbUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Contacte con el administrador",
    });
  }
};

//.renovar token
const renewToken = async (req, res) => {
  //obtener uid desde middleware verificador de token
  const uid = req.uid;

  //generar nuevo token
  const token = await generateJWT(uid);

  //obtener el usuario por uid
  const user = await User.findById(uid);

  res.status(200).json({
    ok: true,
    user,
    token,
  });
};

module.exports = {
  createUser,
  login,
  renewToken,
};
