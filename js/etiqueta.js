console.log("Etiqueta cargada");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    alert("No se recibió el ID del material.");
    throw new Error("Sin ID");
}

function obtenerColor(color){

    const colores = {

        azul:"#1565c0",

        verde:"#27ae60",

        rojo:"#e74c3c",

        amarillo:"#f1c40f",

        morado:"#8e44ad",

        gris:"#7f8c8d",

        cafe:"#8B4513",

        naranja:"#e67e22"

    };

    return colores[color] || "#1565c0";

}

async function cargarEtiqueta(){

    //==========================
    // MATERIAL
    //==========================

    const respuestaMaterial = await supabaseClient

        .from("materiales")

        .select("*")

        .eq("id", Number(id))

        .single();

    if(respuestaMaterial.error){

        console.error(respuestaMaterial.error);

        alert("No se encontró el material.");

        return;

    }

    const material = respuestaMaterial.data;

    //==========================
    // RACK
    //==========================

    let nombreRack = "Sin rack";

    if(material.rack_id){

        const respuestaRack = await supabaseClient

            .from("racks")

            .select("nombre")

            .eq("id", material.rack_id)

            .single();

        if(!respuestaRack.error && respuestaRack.data){

            nombreRack = respuestaRack.data.nombre;

        }

    }

    //==========================
    // CATEGORIAS
    //==========================

    const categorias = {

        azul:"⚡ ELÉCTRICO",

        verde:"💨 NEUMÁTICO",

        rojo:"🚨 SEGURIDAD",

        amarillo:"🧰 HERRAMIENTAS",

        morado:"🤖 AUTOMATIZACIÓN",

        gris:"📦 GENERAL",

        cafe:"🔧 MECÁNICO",

        naranja:"🚰 TUBERÍAS"

    };

    //==========================
    // HTML
    //==========================

    document.getElementById("nombre").textContent =
        material.nombre;

    document.getElementById("codigo").textContent =
        material.codigo;

    document.getElementById("rack").textContent =
        nombreRack;

    document.getElementById("categoria").textContent =
        categorias[material.color] || "📦 GENERAL";

    const color = obtenerColor(material.color);

    document.querySelector(".etiqueta").style.borderColor =
        color;

    document.getElementById("categoria").style.background =
        color;

    //==========================
    // QR
    //==========================

    document.getElementById("codigoQR").innerHTML = "";

    new QRCode(document.getElementById("codigoQR"),{

        text:
        "https://st4031-cpu.github.io/almacen-riken/material.html?id="+
        material.id+
        "&modo=operador",

        width:150,

        height:150

    });

}

cargarEtiqueta();