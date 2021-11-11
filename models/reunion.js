class Reunion {
  constructor(_id,titulo,contrasenia,fechaCreacion,codigo,diagrama,estado,user){
    this._id = _id;
    this.titulo = titulo;
    this.contrasenia = contrasenia;
    this.fechaCreacion = fechaCreacion;
    this.codigo = codigo;
    this.diagrama = diagrama;
    this.estado = estado;
    this.user = user
  }
}

module.exports = Reunion;
