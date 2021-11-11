const firebase = require('../database/configuracion');
const firestore  = firebase.firestore();

const Reunion = require('../models/reunion');
const Unirse = require('../models/unirse');

const unirseReunion = async(req, res) => {
  
  try {
    
    const [dataBase, dataBaseUnirse] = await Promise.all([
      firestore.collection('Reunion').get(),
      firestore.collection('Unirse').get()
    ])
    
    let idReunion = '';

    if (dataBase.empty){
      return res.status(400).json({
        ok: false,
        msg: "Datos incorrectos"
      });
    }else{
      dataBase.forEach(doc => {
        if (
          doc.data().codigo == req.body.codigo &&
          doc.data().contrasenia === req.body.contrasenia &&
          doc.data().estado === '1'
        ){

          idReunion = doc.id;

        }
      });
    }

    if (idReunion === ''){
      return res.status(400).json({
        ok: false,
        msg: "Datos incorrectos"
      })
    }


    let idUnirse = '';

    if (!dataBaseUnirse.empty){
      dataBaseUnirse.forEach(doc => {
        if (doc.data().user === req.uid && doc.data().reunion === idReunion){
          idUnirse = doc.id;
        }
      });
    }

    if (idUnirse !== ''){
      await firestore.collection('Unirse').doc(idUnirse).delete();
    }

    const newData = {
      'user': req.uid,
      'reunion': idReunion
    }
    await firestore.collection('Unirse').doc().set(newData);

    const dataReunirse = await firestore.collection('Unirse').get();
    let unirse;

    if (dataReunirse.empty){

      return res.status(404).json({
        ok: false,
        msg: "No existe"
      });

    }else{
      
      dataReunirse.forEach(doc => {
        if (doc.data().user === req.uid && doc.data().reunion === idReunion){
          unirse = new Unirse(
            doc.id,
            doc.data().user,
            doc.data().reunion,
          )
        }
      });

    }

    return res.json({
      ok: true,
      msg: "Correcto",
      nuevoReunirse: unirse
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error, consulte con el administrador",
      error
    });
  }

}

const salirReunion = async(req, res) => {

  try {
    
    const dataUnirse = await firestore.collection('Unirse').get();
    let unirse;
    dataUnirse.forEach(doc => {
      if (doc.data().user === req.uid && doc.data().reunion === req.params.reunion){
        unirse = new Unirse(
          doc.id,
          doc.data().user,
          doc.data().reunion,
        );
      }
    });

    await firestore.collection('Unirse').doc(unirse._id).delete();

    return res.json({
      ok: true,
      msg: "Ya ha salido de la reunion",
      unirse: unirse
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error, consulte con el administrador",
      error
    });
  }

}


module.exports = {
  unirseReunion,
  salirReunion
}