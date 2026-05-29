// =====================
// CONTADOR
// =====================
const fechaObjetivo = new Date("July 18, 2028 21:30:00").getTime();

const actualizarContador = () => {
  const ahora = new Date().getTime();
  const diferencia = fechaObjetivo - ahora;

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  document.getElementById("dias").innerText = dias;
  document.getElementById("horas").innerText = horas;
  document.getElementById("minutos").innerText = minutos;
  document.getElementById("segundos").innerText = segundos;
};

setInterval(actualizarContador, 1000);
actualizarContador();


// =====================
// CARRUSEL (MULTIPLE)
// =====================
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.slide');
  const next = carousel.querySelector('.next');
  const prev = carousel.querySelector('.prev');

  let index = 0;

  function actualizar() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  next.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    actualizar();
  });

  prev.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    actualizar();
  });
});


// =====================
// COPIAR ALIAS
// =====================
function copiarAlias() {
  const alias = "UNALIAS";

  navigator.clipboard.writeText(alias).then(() => {
    const mensaje = document.getElementById("mensaje-copiado");
    mensaje.innerText = "Alias copiado ✔";

    setTimeout(() => {
      mensaje.innerText = "";
    }, 2000);
  });
}


// =====================
// WHATSAPP
// =====================
const SHEET_NAME = "PasesQR";

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  if (!sheet) {
    return respuesta({
      ok: false,
      mensaje: "No se encontró la hoja: " + SHEET_NAME
    }, e.parameter.callback);
  }

  if (e.parameter.modo === "buscar") {
    return buscarQR(e);
  }

  const data = e.parameter;
  const rows = sheet.getDataRange().getValues();
  const dniNuevo = String(data.dni || "").trim();

  if (!dniNuevo) {
    return respuesta({
      ok: false,
      mensaje: "Falta el DNI."
    }, e.parameter.callback);
  }

  for (let i = 1; i < rows.length; i++) {
    const dniExistente = String(rows[i][2]).trim();

    if (dniExistente === dniNuevo) {
      return respuesta({
        ok: false,
        mensaje: "Este DNI ya confirmó asistencia."
      }, e.parameter.callback);
    }
  }

  const qrId = generarQRID();

  sheet.appendRow([
    qrId,
    data.nombre || "",
    data.dni || "",
    data.email || "",
    data.cantidad || "",
    data.restricciones || "",
    "",
    "No",
    ""
  ]);

  enviarEmailQR(data.email, data.nombre, qrId);

  return respuesta({
    ok: true,
    mensaje: "Confirmación guardada correctamente.",
    qr_id: qrId
  }, e.parameter.callback);
}

function enviarEmailQR(email, nombre, qrId) {
  if (!email) return;

  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(qrId);

  const asunto = "Tu QR de ingreso";

  const html = `
    <div style="font-family: Arial, sans-serif; text-align:center; color:#111;">
      <h2>Confirmación recibida</h2>
      <p>Hola <strong>${nombre}</strong>, tu asistencia fue confirmada correctamente.</p>
      <p>Presentá este QR en la entrada del evento:</p>

      <img src="${qrUrl}" style="width:260px; height:260px; margin:20px auto; display:block;" />

      <h3 style="letter-spacing:1px;">${qrId}</h3>

      <p style="font-size:13px; color:#666;">
        Este código es personal y será escaneado en recepción.
      </p>
    </div>
  `;

  MailApp.sendEmail({
    to: email,
    subject: asunto,
    htmlBody: html
  });
}

function buscarQR(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const qrId = String(e.parameter.qr_id || "").trim();
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === qrId) {
      return respuesta({
        ok: true,
        qr_id: rows[i][0],
        nombre: rows[i][1],
        dni: rows[i][2],
        email: rows[i][3],
        cantidad: rows[i][4],
        restricciones: rows[i][5],
        mesa: rows[i][6],
        ingreso: rows[i][7],
        horaIngreso: rows[i][8]
      }, e.parameter.callback);
    }
  }

  return respuesta({
    ok: false,
    mensaje: "QR no encontrado."
  }, e.parameter.callback);
}

function generarQRID() {
  return "QR-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function respuesta(obj, callback) {
  const json = JSON.stringify(obj);

  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${json})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}


// =====================
// WELCOME + MÚSICA
// =====================
const btnIngresar = document.getElementById("btnIngresar");
const welcome = document.getElementById("welcome");
const audio = document.getElementById("musica");
const btnMusica = document.getElementById("btnMusica");

btnIngresar.addEventListener("click", () => {
  // sacar pantalla de bienvenida
  welcome.classList.add("salir");

  setTimeout(() => {
    welcome.style.display = "none";
  }, 800);

  // mostrar botón música
  btnMusica.classList.add("activo");
  btnMusica.innerText = "❚❚";

  // reproducir música
  audio.volume = 0.5; // volumen inicial
audio.play().then(() => {
  console.log("audio ok");
}).catch(err => {
  console.log("error audio:", err);
});
});

btnMusica.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    btnMusica.innerText = "❚❚";
  } else {
    audio.pause();
    btnMusica.innerText = "▶";
  }
});