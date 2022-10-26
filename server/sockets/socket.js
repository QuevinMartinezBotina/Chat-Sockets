const { io } = require("../server");
const Usuarios = require("../classes/usuario");
const { crearMensaje } = require("../utilidades/utilidades");

const Usuario = new Usuarios();

io.on("connection", (client) => {
  client.on("entrarChat", (data, callback) => {
    // console.log(data);

    if (!data.nombre || !data.sala) {
      return callback({
        error: true,
        mensaje: "El nombre/sala es necesario",
      });
    }

    // Unir a sala
    client.join(data.sala);

    Usuario.agregarPersona(client.id, data.nombre, data.sala);

    client.broadcast
      .to(data.sala)
      .emit("listaPersona", Usuario.getPersonasPorSala(data.sala));

    client.broadcast
      .to(data.sala)
      .emit(
        "crearMensaje",
        crearMensaje("Administrador", `${data.nombre} se unió`)
      );

    callback(Usuario.getPersonasPorSala(data.sala));
  });

  client.on("crearMensaje", (data, callback) => {
    let persona = Usuario.getPersona(client.id);

    let mensaje = crearMensaje(persona.nombre, data.mensaje);
    client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);

    callback(mensaje);
  });

  client.on("disconnect", () => {
    let personaBorrada = Usuario.borrarPersona(client.id);

    // console.log("Persona borrada", personaBorrada);

    client.broadcast
      .to(personaBorrada.sala)
      .emit(
        "crearMensaje",
        crearMensaje("Administrador", `${personaBorrada.nombre} salió`)
      );

    client.broadcast
      .to(personaBorrada.sala)
      .emit("listaPersona", Usuario.getPersonasPorSala(personaBorrada.sala));
  });

  // Mensajes privados
  client.on("mensajePrivado", (data) => {
    let persona = Usuario.getPersona(client.id);

    client.broadcast
      .to(data.para)
      .emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
  });
});
