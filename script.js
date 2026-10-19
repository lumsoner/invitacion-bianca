
(() => {
    "use strict";

  // =====================================
  // CONFIGURACIÓN DEL EVENTO
  // =====================================

    const CONFIG = {
    anio: 2026,
    mes: 10, // Enero = 0; noviembre = 10
    dia: 28,
    hora: 21,
    minuto: 0,

    alias: "gomezbianca02",

    // Número de WhatsApp con código de país,
    // sin +, espacios ni guiones.
    telefonoWhatsApp: "5491168078506",

    // Dejá esta URL si querés conservar el registro
    // opcional de invitados en Google Apps Script.
    urlRegistro:
        "https://script.google.com/macros/s/AKfycbzZx3IhEQSjvr7fJLM92RsSfrgpBAQXTeQtqefThm2bCu-H5hnBuQMRHB9_0AdPgPD3CQ/exec"
    };

    const $ = (selector) => document.querySelector(selector);

    const portada = $("#portada");
    const invitacion = $("#invitacion");
    const botonEntrar = $("#entrar");

    const pantallaGracias = $("#pantallaGracias");

    const CLAVE_CONFIRMACION = "bianca_confirmacion_iniciada";
    const CLAVE_WHATSAPP_OCULTO = "bianca_whatsapp_abierto";

    const musica = $("#musica");
    const controlMusica = $("#controlMusica");

    const formulario = $("#formConfirmacion");
    const listaInvitados = $("#invitados");

    let numeroInvitado = 2;
    let musicaActiva = false;


// =====================================
// APERTURA DEL SOBRE Y DE LA INVITACIÓN
// =====================================

const botonAbrirSobre = document.getElementById("abrirSobre");

if (botonAbrirSobre) {
    botonAbrirSobre.addEventListener("click", () => {
        // Evitar que se abra varias veces
        if (portada.classList.contains("sobre-abriendose")) {
            return;
        }

        botonAbrirSobre.disabled = true;

        // Iniciar la animación del sobre
        portada.classList.add("sobre-abriendose");

        // Esperar a que se abra el sobre
        window.setTimeout(() => {
            portada.classList.add("sobre-abierto");

// Mostrar la invitación inmediatamente
                invitacion.hidden = false;
                controlMusica.hidden = false;

                // Desvanecer la portada mientras aparece la invitación
                portada.classList.add("saliendo");

                // Intentar reproducir la música
                reproducirMusica();

                // Ocultar la portada cuando termine la transición
                window.setTimeout(() => {
                    portada.hidden = true;
                }, 850);

        }, 1950);
    });
}

    function mostrarPantallaGracias() {
        portada.hidden = true;
        invitacion.hidden = true;
        pantallaGracias.hidden = false;
        controlMusica.hidden = true;

        musica.pause();
        musicaActiva = false;
    }
    
    // =====================================
    // VOLVER A LA INVITACIÓN
    // =====================================

    const botonVolverInvitacion = $("#volverInvitacion");

    if (botonVolverInvitacion) {
        botonVolverInvitacion.addEventListener("click", () => {

            // Limpiar el estado de la confirmación anterior
            sessionStorage.removeItem(CLAVE_CONFIRMACION);
            sessionStorage.removeItem(CLAVE_WHATSAPP_OCULTO);

            // Ocultar la pantalla final
            pantallaGracias.hidden = true;

            // Mostrar directamente la invitación completa
            portada.hidden = true;
            invitacion.hidden = false;

            // Volver a mostrar el control de música
            controlMusica.hidden = false;

            // La música queda pausada hasta que la persona la active
            musica.pause();
            musicaActiva = false;
            actualizarControlMusica();

            // Volver al comienzo de la invitación
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    // Si la persona recarga la página durante la misma sesión,
    // conservar la pantalla final después de iniciar la confirmación.
    if (sessionStorage.getItem(CLAVE_CONFIRMACION) === "1") {
        mostrarPantallaGracias();
    }

    // Detectar cuando sale del navegador hacia WhatsApp
    // y cuando vuelve a la invitación.
    document.addEventListener("visibilitychange", () => {
        if (
            document.visibilityState === "hidden" &&
            sessionStorage.getItem(CLAVE_CONFIRMACION) === "1"
        ) {
            sessionStorage.setItem(CLAVE_WHATSAPP_OCULTO, "1");
        }

        if (
            document.visibilityState === "visible" &&
            sessionStorage.getItem(CLAVE_CONFIRMACION) === "1" &&
            sessionStorage.getItem(CLAVE_WHATSAPP_OCULTO) === "1"
        ) {
            mostrarPantallaGracias();
        }
    });

  // =====================================
  // MÚSICA OPCIONAL
  // =====================================

    async function reproducirMusica() {
    try {
        musica.volume = 0.25;

        await musica.play();

        musicaActiva = true;
        actualizarControlMusica();
    } catch (error) {
        musicaActiva = false;
        actualizarControlMusica();
    }
    }

    function actualizarControlMusica() {
    controlMusica.setAttribute(
        "aria-pressed",
        String(musicaActiva)
    );

    controlMusica.textContent = musicaActiva
        ? "♫ PAUSAR MÚSICA"
        : "♫ ACTIVAR MÚSICA";
    }

    controlMusica.addEventListener("click", async () => {
    if (musicaActiva && !musica.paused) {
        musica.pause();

        musicaActiva = false;
        actualizarControlMusica();

        return;
    }

    await reproducirMusica();
    });

    musica.addEventListener("pause", () => {
    musicaActiva = false;
    actualizarControlMusica();
    });

    musica.addEventListener("play", () => {
    musicaActiva = true;
    actualizarControlMusica();
    });

  // =====================================
  // CUENTA REGRESIVA
  // =====================================

    const fechaEvento = new Date(
    CONFIG.anio,
    CONFIG.mes,
    CONFIG.dia,
    CONFIG.hora,
    CONFIG.minuto,
    0
    ).getTime();

    function actualizarContador() {
    const diferencia = fechaEvento - Date.now();

    const dias = $("#dias");
    const horas = $("#horas");
    const minutos = $("#minutos");
    const nota = $("#contadorNota");

    if (diferencia <= 0) {
        dias.textContent = "00";
        horas.textContent = "00";
        minutos.textContent = "00";

        nota.textContent = "¡Llegó el gran día!";
        return;
    }

    const totalMinutos = Math.floor(
        diferencia / 60000
    );

    const cantidadDias = Math.floor(
        totalMinutos / 1440
    );

    const cantidadHoras = Math.floor(
        (totalMinutos % 1440) / 60
    );

    const cantidadMinutos = totalMinutos % 60;

    dias.textContent = String(cantidadDias).padStart(2, "0");

    horas.textContent = String(cantidadHoras).padStart(2, "0");

    minutos.textContent = String(cantidadMinutos).padStart(2, "0");

    nota.textContent = "";
    }

    actualizarContador();

  // Actualizar cada minuto es suficiente para este contador.
    window.setInterval(actualizarContador, 60000);

  // =====================================
  // COPIAR ALIAS
  // =====================================

    $("#aliasRegalo").textContent = CONFIG.alias;

    $("#copiarAlias").addEventListener("click", async () => {
    const estado = $("#estadoCopia");

    try {
        await navigator.clipboard.writeText(CONFIG.alias);

        estado.textContent = "Alias copiado correctamente.";
    } catch (error) {
      // Alternativa para navegadores sin portapapeles disponible.
        const campo = document.createElement("textarea");

        campo.value = CONFIG.alias;
        campo.setAttribute("readonly", "");

        campo.style.position = "fixed";
        campo.style.opacity = "0";

        document.body.appendChild(campo);

        campo.select();

        const copiado = document.execCommand("copy");

        campo.remove();

        estado.textContent = copiado
        ? "Alias copiado correctamente."
        : "Copiá el alias manualmente: " + CONFIG.alias;
    }
    });

  // =====================================
  // AGREGAR Y QUITAR INVITADOS
  // =====================================

    $("#agregarInvitado").addEventListener("click", () => {
    const id = numeroInvitado++;

    const fila = document.createElement("div");
    fila.className = "fila-invitado";

    const input = document.createElement("input");

    input.type = "text";
    input.id = "invitado-" + id;
    input.name = "invitado[]";
    input.className = "input-invitado";
    input.placeholder = "Nombre y apellido";
    input.setAttribute(
        "aria-label",
        "Nombre y apellido del invitado " + id
    );
    input.maxLength = 100;
    input.required = true;

    const botonEliminar = document.createElement("button");

    botonEliminar.type = "button";
    botonEliminar.className = "btn-eliminar";
    botonEliminar.textContent = "X";
    botonEliminar.setAttribute(
        "aria-label",
        "Quitar invitado " + id
    );

    botonEliminar.addEventListener("click", () => {
        fila.remove();
    });

    fila.appendChild(input);
    fila.appendChild(botonEliminar);

    listaInvitados.appendChild(fila);

    input.focus();
    });

  // =====================================
  // CONFIRMACIÓN POR WHATSAPP
  // =====================================

    formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const estado = $("#estadoConfirmacion");

    estado.textContent = "";

    const campos = Array.from(
        listaInvitados.querySelectorAll(".input-invitado")
    );

    const nombres = campos
        .map((campo) => campo.value.trim())
        .filter((nombre) => nombre !== "");

    if (nombres.length === 0) {
        estado.textContent = "Ingresá al menos un nombre.";
        return;
    }

    // Validar que todos los campos agregados estén completos.
    const campoVacio = campos.find(
        (campo) => campo.value.trim() === ""
    );

    if (campoVacio) {
        campoVacio.focus();

        estado.textContent =
        "Completá todos los nombres o eliminá los campos vacíos.";

        return;
    }

    const mensaje = [
        "✨ ¡Hola, Bianca! ✨",
        "",
        "¡Confirmo mi asistencia a tus 15 años!",
        "",
        "Asistiremos:",
        ...nombres.map((nombre) => "• " + nombre),
        "",
        "¡Nos vemos el 28 de noviembre!"
    ].join("\n");

    const urlWhatsApp =
        "https://wa.me/" +
        CONFIG.telefonoWhatsApp +
        "?text=" +
        encodeURIComponent(mensaje);

    // Recordar que se inició la confirmación.
    // La pantalla final aparecerá cuando vuelva del navegador o de WhatsApp.
    sessionStorage.setItem(CLAVE_CONFIRMACION, "1");
    sessionStorage.removeItem(CLAVE_WHATSAPP_OCULTO);

    // Abrir WhatsApp directamente desde el toque del usuario.
    const ventana = window.open(
        urlWhatsApp,
        "_blank"
    );

    if (ventana) {
        ventana.opener = null;

        estado.textContent =
        "WhatsApp se abrió con el mensaje preparado. " +
        "Revisalo y tocá Enviar para confirmar.";
    } else {
        estado.textContent =
        "El navegador bloqueó la ventana. ";

        const enlace = document.createElement("a");

        enlace.href = urlWhatsApp;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.textContent = "Abrir WhatsApp";

        estado.appendChild(enlace);
    }

    // =====================================
    // REGISTRO OPCIONAL EN GOOGLE APPS SCRIPT
    // =====================================

    // Esto intenta registrar los nombres en la planilla.
    // No reemplaza el envío manual de WhatsApp.
    if (CONFIG.urlRegistro) {
        try {
        await fetch(CONFIG.urlRegistro, {
            method: "POST",
            mode: "no-cors",
            keepalive: true,
            headers: {
            "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
            evento: "15 años de Bianca",
            invitados: nombres,
            fecha: new Date().toISOString()
            })
        });
        } catch (error) {
        console.error(
            "No se pudo enviar el registro de invitados.",
            error
        );
        }
    }
    });

})();
