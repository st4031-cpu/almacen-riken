const parametros = new URLSearchParams(window.location.search);

const id = parametros.get("id");

const nombre = document.getElementById("nombre");
const codigo = document.getElementById("codigo");
const cantidad = document.getElementById("cantidad");
const rack = document.getElementById("rack");
const descripcion = document.getElementById("descripcion");
const minimo = document.getElementById("minimo");
const color = document.getElementById("color");

//==================================
// CARGAR RACKS
//==================================

async function cargarRacks() {

    const { data, error } = await supabaseClient

        .from("racks")

        .select("*")

        .order("nombre");

    if (error) {

        console.log(error);

        return;

    }

    rack.innerHTML = "";

    data.forEach(r => {

        rack.innerHTML += `

            <option value="${r.id}">

                ${r.nombre}

            </option>

        `;

    });

}

//==================================
// CARGAR MATERIAL
//==================================

async function cargar() {

    await cargarRacks();

    const { data, error } = await supabaseClient

        .from("materiales")

        .select("*")

        .eq("id", id)

        .single();

    if (error) {

        console.log(error);

        return;

    }

    nombre.value = data.nombre;

    codigo.value = data.codigo;

    cantidad.value = data.cantidad;

    descripcion.value = data.descripcion;

    minimo.value = data.minimo;

    rack.value = data.rack_id;

    color.value = data.color || "azul";

}

//==================================
// GUARDAR
//==================================

async function guardarCambios() {

    const { error } = await supabaseClient

        .from("materiales")

        .update({

            nombre: nombre.value,

            codigo: codigo.value,

            cantidad: Number(cantidad.value),

            rack_id: Number(rack.value),

            descripcion: descripcion.value,

            minimo: Number(minimo.value),

            color: color.value

        })

        .eq("id", id);

    if (error) {

        console.log(error);

        alert("Error al guardar");

        return;

    }

    alert("Material actualizado");

    location.href = "material.html?id=" + id;

}

document

.getElementById("guardar")

.addEventListener("click", guardarCambios);

cargar();