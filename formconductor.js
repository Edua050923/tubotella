// Obtener el formulario por su id
const form = document.getElementById("form-signup");

// Añadir un evento de envío al formulario
form.addEventListener("submit", function(event) {
  // Evitar el comportamiento por defecto del formulario
  event.preventDefault();

  // Obtener los valores de los campos del formulario
  const nombre = document.getElementById("nombre").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const provincia = document.getElementById("provincia").value;
  const ci = document.getElementById("ci").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Definir las expresiones regulares para validar el formato de los campos
  const regexTelefono = /^\+53[5][0-9]{7}$/; // El teléfono debe empezar por +53 y tener 8 dígitos
  const regexCI = /^[0-9]{2}[0,1][0-9][0-3][0-9][0-9]{5}$/; // El CI debe tener 11 dígitos y seguir el formato DDMMYYXXXXX
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // El email debe tener un formato válido

  // Definir una variable para almacenar los posibles errores
  let errores = [];

  // Validar cada campo y añadir un mensaje de error si no se cumple la condición
  if (nombre === "") {
    errores.push("El nombre es obligatorio");
  }

  if (direccion === "") {
    errores.push("La dirección es obligatoria");
  }

  if (telefono === "") {
    errores.push("El teléfono es obligatorio");
  } else if (!regexTelefono.test(telefono)) {
    errores.push("El teléfono debe ser numérico y empezar por +53");
  }

  if (provincia === "") {
    errores.push("La provincia es obligatoria");
  }

  if (ci === "") {
    errores.push("El CI es obligatorio");
  } else if (!regexCI.test(ci)) {
    errores.push("El CI debe ser numérico y seguir el formato DDMMYYXXXXX");
  }

  if (email === "") {
    errores.push("El email es obligatorio");
  } else if (!regexEmail.test(email)) {
    errores.push("El email debe ser válido");
  }

  if (password === "") {
    errores.push("La contraseña es obligatoria");
  }

  // Si hay errores, mostrar una alerta con los mensajes y cancelar el envío del formulario
  if (errores.length > 0) {
    alert("Por favor, corrige los siguientes errores:\n" + errores.join("\n"));
    return false;
  }

  // Si no hay errores, enviar el formulario al servidor
  return true;
});
