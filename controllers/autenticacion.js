const { response } = require('express');

const firebase = require('../database/configuracion');
const firestore = firebase.firestore();

const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/generarJWT');

const User = require('../models/usuario');

const login = async(req, res = response) => {

  const { email, password } = req.body;

  try {

    let usuarioDB;
    const usuarios = await firestore.collection('User');
    let data = await usuarios.get();
    let existe = false;

    if (data.empty){
      return res.status(404).json({
        ok: false,
        msg: "Datos incorrectos"
      });
    }else{
      data.forEach(doc => {
        
        if (doc.data().email === req.body.email){
          existe = true;
          usuarioDB = new User(
            doc.id,
            doc.data().name, 
            doc.data().email,
            doc.data().password
          );
        }

      });
    }

    if(!existe){
      return res.status(400).json({
        ok: false,
        msg: "Datos incorrectos"
      });
    }

    const validPassword = await bcrypt.compare(password, usuarioDB.password);
    if (!validPassword){
      return res.status(400).json({
        ok: false,
        msg: "Datos incorrectos"
      });
    }


    const token = await generarJWT(usuarioDB._id);
    
    
    return res.json({
      ok: true,
      userDB: usuarioDB,
      token
    });
    
  } catch (error) {
    
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Consulte con el administrador"
    });

  }


}

const renewToken = async(req,res = response) => {

  const uid = req.uid;
  
  // Generar JWT
  const token = await generarJWT(uid);

  // Obtener el usuario por UID
  try {

    const usuarioDB = await firestore.collection('User').doc(uid);
    const data = await usuarioDB.get();

    if (!data.exists){
      res.status(404).json({
        ok: false,
        msg: "No existe ese Usuario"
      });
    }

    const usuario = new User(
      data.id,
      data.data().name, 
      data.data().email,
      data.data().password
    );


    return res.json({
        ok: true,
        usuario: usuario,
        token
    });
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          'ok': false,
          'mensaje': 'Error, consulte con el administrador'
      });
  }
}

module.exports = {
  login,
  renewToken
}