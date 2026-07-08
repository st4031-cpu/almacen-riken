//=====================
// OBTENER ID DEL MATERIAL
//=====================

const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

//=====================
// VARIABLES
//=====================

let cantidadOriginal = 0;
let cantidadActual = 0;
let nombreMaterial = "";
//=====================
// CARGAR MATERIAL
//=====================

async function cargarMaterial() {

    const { data, error } = await supabaseClient
        .from("materiales")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        alert("No se pudo cargar el material.");
        return;
    }

    nombreMaterial = data.nombre;

    cantidadOriginal = data.cantidad;
    cantidadActual = data.cantidad;

    document.getElementById("nombre").textContent = data.nombre;
    document.getElementById("codigo").textContent = data.codigo;
    document.getElementById("cantidad").textContent = data.cantidad;
    document.getElementById("cantidadNueva").textContent = data.cantidad;
    document.getElementById("ubicacion").textContent = data.ubicacion;
    document.getElementById("descripcion").textContent = data.descripcion;
    document.getElementById("minimo").textContent = data.minimo;

}

cargarMaterial();
//=====================
// BOTONES + Y -
//=====================

document.getElementById("mas").onclick = () => {

    cantidadActual++;

    document.getElementById("cantidadNueva").textContent = cantidadActual;

};

document.getElementById("menos").onclick = () => {

    if (cantidadActual > 0) {

        cantidadActual--;

        document.getElementById("cantidadNueva").textContent = cantidadActual;

    }

};
//=====================
// MODAL MOVIMIENTO
//=====================

const modal = document.getElementById("modalMovimiento");

document.getElementById("guardar").onclick = () => {

    if (cantidadActual === cantidadOriginal) {

        alert("No hubo cambios en el inventario.");
        return;

    }

    document.getElementById("responsable").value = "";
    document.getElementById("empresa").value = "";

    modal.style.display = "flex";

};

document.getElementById("cancelarModal").onclick = () => {

    modal.style.display = "none";

};
//=====================
// GUARDAR MOVIMIENTO
//=====================

document.getElementById("confirmarMovimiento").onclick = async () => {

    const responsable = document
        .getElementById("responsable")
        .value
        .trim();

    const empresa = document
        .getElementById("empresa")
        .value
        .trim();

    if (responsable === "") {

        alert("Escribe el nombre del responsable.");

        return;

    }

    if (empresa === "") {

        alert("Escribe el Área o Empresa.");

        return;

    }

    const boton = document.getElementById("confirmarMovimiento");

    boton.disabled = true;

    boton.textContent = "Guardando...";

    //-----------------------------------
    // ACTUALIZAR INVENTARIO
    //-----------------------------------

    const { error } = await supabaseClient

        .from("materiales")

        .update({

            cantidad: cantidadActual

        })

        .eq("id", id);

    if (error) {

        console.error(error);

        alert("No se pudo actualizar el inventario.");

        boton.disabled = false;

        boton.textContent = "Guardar";

        return;

    }

    //-----------------------------------
    // CALCULAR MOVIMIENTO
    //-----------------------------------

    let tipo = "";

    let piezas = 0;

    if (cantidadActual > cantidadOriginal) {

        tipo = "Entrada";

        piezas = cantidadActual - cantidadOriginal;

    } else {

        tipo = "Salida";

        piezas = cantidadOriginal - cantidadActual;

    }

    //-----------------------------------
    // GUARDAR HISTORIAL
    //-----------------------------------

    const { error: errorMovimiento } = await supabaseClient

        .from("movimientos")

        .insert({

            material_id: Number(id),

            material_nombre: nombreMaterial,

            tipo: tipo,

            cantidad: piezas,

            responsable: responsable,

            empresa_area: empresa

        });

    if (errorMovimiento) {

        console.error(errorMovimiento);

        alert("No se pudo guardar el historial.");

        boton.disabled = false;

        boton.textContent = "Guardar";

        return;

    }

    //-----------------------------------
    // ACTUALIZAR PANTALLA
    //-----------------------------------

    cantidadOriginal = cantidadActual;

    document.getElementById("cantidad").textContent = cantidadActual;

    document.getElementById("cantidadNueva").textContent = cantidadActual;

    modal.style.display = "none";

    document.getElementById("responsable").value = "";

    document.getElementById("empresa").value = "";

    boton.disabled = false;

    boton.textContent = "Guardar";

    alert("Movimiento registrado correctamente.");

};
//=====================
// EDITAR MATERIAL
//=====================

document.getElementById("editar").onclick = () => {

    location.href = "editar.html?id=" + id;

};

//=====================
// GENERAR QR
//=====================

const modalQR = document.getElementById("modalQR");

const contenedorQR = document.getElementById("contenedorQR");

document.getElementById("generarQR").onclick = () => {

    // Limpiar contenido anterior
    contenedorQR.innerHTML = "";

    // URL pública del material

   const urlQR = "https://st4031-cpu.github.io/almacen-riken/material.html?id=" + id + "&modo=operador";

    // Crear contenedor
    const divQR = document.createElement("div");

    divQR.id = "codigoQR";

    contenedorQR.appendChild(divQR);

    // Nombre del material
    const titulo = document.createElement("h3");

    titulo.textContent = nombreMaterial;

    titulo.style.marginTop = "20px";

    titulo.style.textAlign = "center";

    contenedorQR.appendChild(titulo);

    // Generar QR
    new QRCode(divQR, {

        text: urlQR,

        width: 250,

        height: 250

    });

    modalQR.style.display = "flex";

};

//=====================
// CERRAR QR
//=====================

document.getElementById("cerrarQR").onclick = () => {

    modalQR.style.display = "none";

};

//=====================
// PERMISOS
//=====================

const sesion = sessionStorage.getItem("sesion");
const modoOperador = new URLSearchParams(window.location.search).get("modo");

const botonEditar = document.getElementById("editar");
const botonQR = document.getElementById("generarQR");
const botonBuscar = document.getElementById("buscarOtroMaterial");

//=====================
// ADMINISTRADOR
//=====================

if (sesion === "activa") {

    botonEditar.style.display = "";

    botonQR.style.display = "";

    botonBuscar.innerHTML = "🏠 Inicio";

    botonBuscar.onclick = () => {

        location.href = "panel.html";

    };

}

//=====================
// OPERADOR
//=====================

else if (modoOperador === "operador") {

    botonEditar.style.display = "none";

    botonQR.style.display = "none";

    botonBuscar.innerHTML = "🔍 Buscar otro material";

    botonBuscar.onclick = () => {

        location.href = "buscar.html";

    };

}

//=====================
// SIN PERMISOS
//=====================

else {

    location.href = "login.html";

}