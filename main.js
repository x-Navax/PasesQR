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
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTISdcTEaxRBLbeUh31VX1fFV4yEVUbDWj49guTByLu1m8gp6_FPX60EMcCtmzHlj5/exec";

const formConfirmacionQR = document.getElementById("formConfirmacionQR");
const resultadoQR = document.getElementById("resultadoQR");

formConfirmacionQR.addEventListener("submit", (e) => {
  e.preventDefault();

  resultadoQR.innerHTML = "Enviando confirmación...";

  const datos = {
    nombre: document.getElementById("nombreQR").value.trim(),
    dni: document.getElementById("dniQR").value.trim(),
    email: document.getElementById("emailQR").value.trim(),
    cantidad: document.getElementById("cantidadQR").value.trim(),
    restricciones: document.getElementById("restriccionesQR").value.trim()
  };

  enviarJSONP(datos);
});

function enviarJSONP(datos) {
  const callbackName = "callbackQR_" + Date.now();

  window[callbackName] = function(data) {
    if (!data.ok) {
      resultadoQR.innerHTML = `
        <div class="qr-error">
          <strong>${data.mensaje}</strong>
        </div>
      `;
    } else {
      resultadoQR.innerHTML = `
        <div class="qr-ok">
          <h3>Asistencia confirmada</h3>

          <p>
            Tu código de ingreso fue enviado a tu correo electrónico.
          </p>

          <p style="margin-top:10px;font-size:14px;opacity:.85;">
            ⚠️ Si no lo encontrás en los próximos minutos,
            revisá la carpeta de <strong>Correo no deseado</strong> o
            <strong>Spam</strong>.
          </p>
        </div>
      `;

      formConfirmacionQR.reset();
    }

    document.body.removeChild(script);
    delete window[callbackName];
  };

  const params = new URLSearchParams({
    ...datos,
    callback: callbackName
  });

  const script = document.createElement("script");
  script.src = `${SCRIPT_URL}?${params.toString()}`;

  script.onerror = function() {
    resultadoQR.innerHTML = `
      <div class="qr-error">
        Error al enviar la confirmación. Intentá nuevamente.
      </div>
    `;
  };

  document.body.appendChild(script);
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