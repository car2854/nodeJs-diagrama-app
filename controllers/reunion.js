const firebase = require('../database/configuracion');
const firestore  = firebase.firestore();
const Reunion = require('../models/reunion');

const { devolverFecha } = require('../helpers/devolverFecha');

const crearReunion = async(req,res) => {
  
  try {
    
    const dataBase = await firestore.collection('Reunion');
    let data = await dataBase.get();

    let existe = false;
    if (!data.empty){
      data.forEach(doc => {
        if (doc.data().codigo === req.body.codigo){
          existe = true;
        }
      });
    }

    if (existe){
      return res.status(401).json({
        ok: false,
        msg: "Ese codigo ya esta registrado"
      });
    }

    const dataReunion = {
      'user': req.uid,
      'diagrama': '',
      'fechaCreacion': devolverFecha(),
      'estado': '1',
      ...req.body
    }

    let reunion;
    await dataBase.doc().set(dataReunion);

    data = await dataBase.get();
    
    if (data.empty){
      return res.status(404).json({
        ok: false,
        msg: "No hay dato a devolver"
      });
    }else{
      data.forEach(doc => {
        if (doc.data().codigo === req.body.codigo){
          reunion = new Reunion(
            doc.id,
            doc.data().titulo,
            doc.data().contrasenia,
            doc.data().fechaCreacion,
            doc.data().codigo,
            doc.data().diagrama,
            doc.data().estado,
            doc.data().user,
          )
        }
      });
    }

    return res.json({
      ok: true,
      msg: "Guardado con exito",
      nuevaReunion: reunion
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

const obtenerReunion = async(req,res) => {
  
  try {
    
    const dataBase = await firestore.collection('Reunion');
    const data = await dataBase.get();
    let reunion;
    let existe = false;

    if (data.empty){
      return res.status(404).json({
        ok: false,
        msg: "No existe esa reunion"
      });
    }else{
      data.forEach(doc => {
        if (doc.id === req.params.id && doc.data().estado === '1'){
          existe = true;
          reunion = new Reunion(
            doc.id,
            doc.data().titulo,
            doc.data().contrasenia,
            doc.data().fechaCreacion,
            doc.data().codigo,
            doc.data().diagrama,
            doc.data().estado,
            doc.data().user,
          );
        }
      });
    }

    if (!existe){
      return res.status(404).json({
        ok: false,
        msg: "No existe esa reunion"
      });
    }

    return res.json({
      ok: true,
      reunion
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

const obtenerTodasReuniones = async(req,res) => {
  
  try {
    
    const dataBase = await firestore.collection('Reunion').get();
    const reuniones = [];


    dataBase.forEach(doc => {
      if (doc.data().user === req.uid && doc.data().estado === '1'){
        const reunion = new Reunion(
          doc.id,
          doc.data().titulo,
          doc.data().contrasenia,
          doc.data().fechaCreacion,
          doc.data().codigo,
          doc.data().diagrama,
          doc.data().estado,
          doc.data().user,
        );
        reuniones.push(reunion);
      }
    });

    return res.json({
      ok: true,
      reuniones
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

const eliminarReunion = async(req,res) => {
  
  try {
    
    let reunion = await firestore.collection('Reunion').doc(req.params.id);
    reunion = await reunion.get();
    if (reunion.empty){
      return res.status(404).json({
        ok: false,
        msg: "No existe esa reunion"
      });
    }

    if (reunion.data().estado === '0'){
      return res.status(404).json({
        ok: false,
        msg: "No existe esa reunion"
      });
    }

    let nuevaData = {
      'estado': '0'
    }
    
    const reunionEliminar = await firestore.collection('Reunion').doc(req.params.id);
    await reunionEliminar.update(nuevaData);


    nuevaData = {
      '_id': reunion.id,
      ...reunion.data()
    }

    nuevaData.estado = '0';


    return res.json({
      ok: true,
      msg: "La reunion se a eliminado",
      reunion: nuevaData
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


const guardarDiagram = async(req, res = response) => {
  
  
  const {reunion, diagrama} = req.body;
  try {
    
    const dataBase = await firestore.collection('Reunion').doc(req.body.reunion);
    const reunion = await dataBase.get();

    if (!reunion.exists){
      return res.status(404).json({
        ok: false,
        msg: "No existe esa reunion"
      });
    }
    
    if (reunion.data().estado === '0'){
      return res.status(404).json({
        ok: false,
        msg: "No existe esa reunion"
      });
    }

    const jsonDiagrama = JSON.parse(diagrama);

    const jsonData = JSON.stringify(jsonDiagrama);

    let data = {
      diagrama: jsonData
    }

    await dataBase.update(data);

    data = {
      '_id': reunion.id,
      ...reunion.data()
    }

    data.diagrama = jsonData;
  
    return res.json({
      ok: true,
      msg: "Guardado con exito",
      reunionDB: data
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Consulte con el administrador"
    });
  }

}

const cargarDiagram = async(req,res = response) => {

  try {

    const dataBase = await firestore.collection('Reunion').doc(req.params.id);
    const reunion = await dataBase.get();
    
    if (!reunion.exists){
      return res.status(404).json({
        ok: false,
        msg: "No existe esa reunion"
      });
    }
    
    if (reunion.data().estado === '0'){
      return res.status(404).json({
        ok: false,
        msg: "No existe esa reunion"
      });
    }

    let jsonDiagrama = '';
    if (reunion.data().diagrama != ''){
      jsonDiagrama = JSON.parse(reunion.data().diagrama);
    }

    return res.json({
      ok: true,
      jsonDiagrama
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Consulte con el administrador"
    });
  }

}


module.exports = {
  crearReunion,
  obtenerReunion,
  obtenerTodasReuniones,
  eliminarReunion,
  guardarDiagram,
  cargarDiagram,
}