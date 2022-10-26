let paramsUrl = new URLSearchParams(window.location.search);
let nombre = paramsUrl.get("nombre");
let sala = paramsUrl.get("sala");

// * Referencias de jquery
let divUsuarios = $("#divUsuarios");
let formEnviar = $("#formEnviar");
let txtMensaje = $("#txtMensaje");
let divChatbox = $("#divChatbox");

//* Funciones para renderizar usuarios
function renderizarUsuarios(personas) {
  console.log("holi");
  console.log(personas);

  let html = "";

  html += `<li>
            <a href="javascript:void(0)" class="active"> Chat de <span> ${paramsUrl.get(
              "sala"
            )}</span></a>
          </li>`;

  personas.forEach((persona) => {
    html += `<li>
                         <a data-id="${persona.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persona.nombre}<small class="text-success">online</small></span></a>
                    </li>`;
  });

  divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo) {
  let html = "";
  let fecha = new Date(mensaje.fecha);
  let hora = fecha.getHours() + ":" + fecha.getMinutes();

  let adminClass = "info";

  if (mensaje.nombre === "Administrador") {
    adminClass = "danger";
  }

  if (yo) {
    html += `
        <li class="reverse">
          <div class="chat-content">
              <h5>${mensaje.nombre}</h5>
              <div class="box bg-light-inverse">${mensaje.mensaje}</div>
              </div>
          </div>
          </div>
          <div class="chat-time">${hora}</div>
        </li> 
  `;
  } else {
    html += `
        <li class="animated fadeIn">
            <div class="chat-content">
            <h5>${mensaje.nombre}</h5>
            <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
            </div>
            <div class="chat-time">${hora}</div>
        </li>
    `;
  }

  divChatbox.append(html);
}

function scrollBottom() {
  // selectors
  var newMessage = divChatbox.children("li:last-child");

  // heights
  var clientHeight = divChatbox.prop("clientHeight");
  var scrollTop = divChatbox.prop("scrollTop");
  var scrollHeight = divChatbox.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    divChatbox.scrollTop(scrollHeight);
  }
}

// * Listeners
divUsuarios.on("click", "a", function () {
  let id = $(this).data("id");

  if (id) {
    console.log(id);
  }
});

formEnviar.on("submit", function (e) {
  /* It prevents the default action of the event from happening. */
  e.preventDefault();

  if (txtMensaje.val().trim().length === 0) {
    return;
  }

  socket.emit(
    "crearMensaje",
    {
      nombre,
      mensaje: txtMensaje.val(),
    },
    function (mensaje) {
      txtMensaje.val("").focus();
      renderizarMensajes(mensaje, true);
      scrollBottom();
    }
  );
});
