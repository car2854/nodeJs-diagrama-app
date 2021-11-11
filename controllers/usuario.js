const bcrypt = require('bcryptjs');

const firebase = require('../database/configuracion');
const User = require('../models/usuario');
const firestore = firebase.firestore();

const { generarJWT } = require('../helpers/generarJWT');

const createUser = async(req, res) => {

  try{

    const usuarios = await firestore.collection('User');
    let data = await usuarios.get();

    let existe = false;
    if (!data.empty){
      data.forEach(doc => {
        
        if (doc.data().email === req.body.email){
          existe = true;
        }
        
      });
    }
    
    if (existe){
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado"
      });
    }
      
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
    const salt = bcrypt.genSaltSync();
    userData.password = bcrypt.hashSync(req.body.password, salt);

    await firestore.collection('User').doc().set(userData);
    let usuarioDB;


    data = await usuarios.get();
    if (data.empty){
      return res.status(404).json({
        ok: false,
        msg: "No hay ese usuario"
      });
    }else{
      data.forEach(doc => {
        
        if (doc.data().email === userData.email){
          usuarioDB = new User(
            doc.id,
            doc.data().name, 
            doc.data().email,
            doc.data().password
          );
        }

      });
    }

    const token = await generarJWT(usuarioDB._id);
    
    
    return res.json({
      ok: true,
      user: usuarioDB,
      token
    });
    
  } catch (err) {
    
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Consulte con el administrador"
    });

  }

}

const obtenerUsuarioReunion = async(req, res) => {
  try {

    const [dataBaseUnirse, dataBaseUsuario] = await Promise.all([
      firestore.collection('Unirse').get(),
      firestore.collection('User').get(),
    ])

    let usuarios = [];

    if (dataBaseUnirse.empty){
      return res.status(404).json({
        ok: false,
        msg: "No existe ese usuario"
      });
    }else{
      dataBaseUnirse.forEach(doc => {
        
        if (doc.data().reunion == req.params.reunion){


          dataBaseUsuario.forEach(doc2 => {

            if (doc2.id == doc.data().user){
              
              let usuario = new User(
                doc2.id,
                doc2.data().name,
                doc2.data().email,
                doc2.data().password,
              );

              usuarios.push(usuario);

            }

          })

        }

        
      });
    }

    return res.json({
      ok: true,
      usuarios
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Check with the administrator'
    });
  }
}

module.exports = {
  createUser,
  obtenerUsuarioReunion
}