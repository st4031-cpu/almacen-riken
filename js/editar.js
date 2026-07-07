const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

const nombre = document.getElementById("nombre");
const codigo = document.getElementById("codigo");
const cantidad = document.getElementById("cantidad");
const ubicacion = document.getElementById("ubicacion");
const descripcion = document.getElementById("descripcion");
const minimo = document.getElementById("minimo");
const color = document.getElementById("color");

async function cargar() {

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
    ubicacion.value = data.ubicacion;
    descripcion.value = data.descripcion;
    minimo.value = data.minimo;

    if (color) {
        color.value = data.color || "azul";
    }
}  

async function guardarCambios() {

    const { error } = await supabaseClient
        .from("materiales")
        .update({
            nombre: nombre.value,
            codigo: codigo.value,
            cantidad: Number(cantidad.value),
            ubicacion: ubicacion.value,
            descripcion: descripcion.value,
            minimo: Number(minimo.value),
            color: color ? color.value : "azul"
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
