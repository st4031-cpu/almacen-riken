;//=========================
// DASHBOARD + RACKS
//=========================

async function cargarDashboard() {

    //-------------------------
    // MATERIALES
    //-------------------------

    const { data: materiales, error } = await supabaseClient

        .from("materiales")

        .select("*");

    if (error) {

        console.error(error);

        return;

    }

    //-------------------------
    // RACKS
    //-------------------------

    const { data: racks, error: errorRacks } = await supabaseClient

        .from("racks")

        .select("*")

        .order("nombre");

    if (errorRacks) {

        console.error(errorRacks);

        return;

    }

    //-------------------------
    // DASHBOARD
    //-------------------------

    document.getElementById("totalMateriales").textContent =
        materiales.length;

    const stockBajo = materiales.filter(m =>

        Number(m.cantidad) <= Number(m.minimo)

    );

    document.getElementById("stockBajo").textContent =
        stockBajo.length;
    //-------------------------
// LISTA STOCK BAJO
//-------------------------

const listaStock = document.getElementById("listaStockBajo");

listaStock.innerHTML = "";

if (stockBajo.length === 0) {

    listaStock.innerHTML = "<p>✅ Todo el inventario está correcto.</p>";

} else {

    stockBajo.forEach(material => {

    const rack = racks.find(r => r.id === material.rack_id);

    listaStock.innerHTML += `

    <div class="stockCard">

        <div class="stockTitulo">

            ${material.nombre}

        </div>

        <div class="stockInfo">

            📁 <b>Rack:</b> ${rack ? rack.nombre : "Sin rack"}

            <br>

            📦 <b>Existencias:</b> ${material.cantidad}

            <br>

            ⚠ <b>Stock mínimo:</b> ${material.minimo}

        </div>

        <button
            class="btnVerMaterial"
            onclick="location.href='material.html?id=${material.id}'">

            👁 Ver material

        </button>

    </div>

    `;

});
}

    //-------------------------
    // LISTA RACKS
    //-------------------------

    const lista = document.getElementById("listaRacks");

    lista.innerHTML = "";

    racks.forEach(rack => {

        const total = materiales.filter(m =>

            Number(m.rack_id) === rack.id

        ).length;

lista.innerHTML += `

<div class="card">

    <h2>

        📁 ${rack.nombre}

    </h2>

    <p>

        ${total} materiales

    </p>

    <button
    onclick="location.href='rack.html?id=${rack.id}'">

        Abrir Rack

    </button>

    <br><br>

    <button
    onclick="editarRack(${rack.id}, '${rack.nombre.replace(/'/g,"\\'")}')">

        ✏️ Editar

    </button>

    <button
    onclick="eliminarRack(${rack.id})">

        🗑️ Eliminar

    </button>

</div>

<br>

`;

    });

}
//=========================
// MOVIMIENTOS DEL DÍA
//=========================

async function cargarMovimientosHoy() {

    const hoy = new Date();

    const inicio =
        hoy.toISOString().substring(0,10) + "T00:00:00";

    const fin =
        hoy.toISOString().substring(0,10) + "T23:59:59";

    const { data, error } = await supabaseClient

        .from("movimientos")

        .select("*")

        .gte("created_at", inicio)

        .lte("created_at", fin);

    if(error){

        console.error(error);

        return;

    }

    let entradas = 0;

    let salidas = 0;

    data.forEach(movimiento=>{

        if(movimiento.tipo=="Entrada"){

            entradas += Number(movimiento.cantidad);

        }

        if(movimiento.tipo=="Salida"){

            salidas += Number(movimiento.cantidad);

        }

    });

    document.getElementById("entradasHoy").textContent =
        entradas;

    document.getElementById("salidasHoy").textContent =
        salidas;

}




//=========================
// BUSCAR RACK
//=========================

document.getElementById("buscarRack")

.addEventListener("keyup", () => {

    const texto = document

        .getElementById("buscarRack")

        .value

        .toLowerCase();

    const tarjetas = document.querySelectorAll("#listaRacks .card");

    tarjetas.forEach(card => {

        if (card.innerText.toLowerCase().includes(texto)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});



//=========================
// BOTÓN HISTORIAL
//=========================

document.getElementById("verHistorial").onclick = () => {

    location.href = "historial.html";

};



//=========================
// INICIAR
//=========================

cargarDashboard();

cargarMovimientosHoy();
//=========================
// ACTUALIZAR DASHBOARD
//=========================

setInterval(() => {

    cargarDashboard();

}, 5000);
//=====================
// BOTONES PRINCIPALES
//=====================

//=========================
// NUEVO RACK
//=========================

document.getElementById("nuevoRack").onclick = async () => {

    const nombre = prompt("Nombre del nuevo Rack");

    if (!nombre) return;

    const { error } = await supabaseClient

        .from("racks")

        .insert({

            nombre: nombre.trim()

        });

    if (error) {

        console.error(error);

        alert("No se pudo crear el rack.");

        return;

    }

    cargarDashboard();

};

// Ver historial
document.getElementById("verHistorial").onclick = () => {

    location.href = "historial.html";

};
//====================================
// EXPORTAR INVENTARIO A EXCEL
//====================================

document.getElementById("excelInventario").onclick = async () => {

    const { data, error } = await supabaseClient
        .from("materiales")
        .select("*")
        .order("nombre");

    if (error) {

        console.error(error);

        alert("No se pudo obtener el inventario.");

        return;

    }

    const inventario = [];

    inventario.push([
        "RIKEN MÉXICO"
    ]);

    inventario.push([
        "REPORTE DE INVENTARIO"
    ]);

    inventario.push([
        "Generado: " + new Date().toLocaleString()
    ]);

    inventario.push([]);

    inventario.push([
        "Nombre",
        "Código",
        "Existencias",
        "Stock mínimo",
        "Ubicación",
        "Descripción"
    ]);

    data.forEach(material => {

        inventario.push([

            material.nombre,

            material.codigo,

            material.cantidad,

            material.minimo,

            material.ubicacion,

            material.descripcion

        ]);

    });

    inventario.push([]);

    inventario.push([
        "Total de materiales:",
        data.length
    ]);

    const hoja = XLSX.utils.aoa_to_sheet(inventario);
        //====================================
    // ANCHO DE COLUMNAS
    //====================================

    hoja["!cols"] = [

        { wch: 25 }, // Nombre

        { wch: 18 }, // Código

        { wch: 12 }, // Existencias

        { wch: 15 }, // Stock mínimo

        { wch: 20 }, // Ubicación

        { wch: 45 }  // Descripción

    ];

    //====================================
    // FILTRO EN ENCABEZADOS
    //====================================

    hoja["!autofilter"] = {

        ref: "A5:F" + (data.length + 5)

    };
    

    //====================================
    // CREAR LIBRO
    //====================================

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        libro,

        hoja,

        "Inventario"

    );

    //====================================
    // NOMBRE DEL ARCHIVO
    //====================================

    const hoy = new Date();

    const fecha =

        hoy.getFullYear() + "-" +

        String(hoy.getMonth() + 1).padStart(2,"0") + "-" +

        String(hoy.getDate()).padStart(2,"0");

    XLSX.writeFile(

        libro,

        `Inventario_RIKEN_${fecha}.xlsx`

    );

};
//====================================
// EXPORTAR HISTORIAL A EXCEL
//====================================

document.getElementById("excelMovimientos").onclick = async () => {

    const { data, error } = await supabaseClient

        .from("movimientos")

        .select("*")

        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        alert("No se pudo obtener el historial.");

        return;

    }

    const historial = [];

    historial.push([
        "RIKEN MÉXICO"
    ]);

    historial.push([
        "REPORTE DE HISTORIAL DE MOVIMIENTOS"
    ]);

    historial.push([
        "Generado: " + new Date().toLocaleString()
    ]);

    historial.push([]);

    historial.push([
        "Fecha",
        "Material",
        "Movimiento",
        "Cantidad",
        "Responsable",
        "Área / Empresa"
    ]);

    data.forEach(movimiento => {

        historial.push([

            new Date(movimiento.created_at).toLocaleString(),

            movimiento.material_nombre,

            movimiento.tipo,

            movimiento.cantidad,

            movimiento.responsable,

            movimiento.empresa_area

        ]);

    });

    historial.push([]);

    historial.push([
        "Total de movimientos:",
        data.length
    ]);

    const hoja = XLSX.utils.aoa_to_sheet(historial);

    hoja["!cols"] = [

        { wch: 22 },

        { wch: 28 },

        { wch: 15 },

        { wch: 12 },

        { wch: 28 },

        { wch: 30 }

    ];

    hoja["!autofilter"] = {

        ref: "A5:F" + (data.length + 5)

    };

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        libro,

        hoja,

        "Historial"

    );

    const hoy = new Date();

    const fecha =

        hoy.getFullYear() + "-" +

        String(hoy.getMonth() + 1).padStart(2, "0") + "-" +

        String(hoy.getDate()).padStart(2, "0");

    XLSX.writeFile(

        libro,

        `Historial_Movimientos_${fecha}.xlsx`

    );

};
//=========================
// EDITAR RACK
//=========================

async function editarRack(id, nombreActual) {

    const nombre = prompt("Nuevo nombre del Rack", nombreActual);

    if (!nombre) return;

    const { error } = await supabaseClient

        .from("racks")

        .update({

            nombre: nombre.trim()

        })

        .eq("id", id);

    if (error) {

        console.error(error);

        alert("No se pudo actualizar el rack.");

        return;

    }

    cargarDashboard();

}

//=========================
// ELIMINAR RACK
//=========================

async function eliminarRack(id) {

    if (!confirm("¿Eliminar este rack?")) return;

    // Verificar si tiene materiales
    const { data: materiales, error: errorMateriales } = await supabaseClient

        .from("materiales")

        .select("id")

        .eq("rack_id", id);

    if (errorMateriales) {

        console.error(errorMateriales);

        return;

    }

    if (materiales.length > 0) {

        alert("Este rack todavía contiene materiales.");

        return;

    }

    const { error } = await supabaseClient

        .from("racks")

        .delete()

        .eq("id", id);

    if (error) {

        console.error(error);

        alert("No se pudo eliminar el rack.");

        return;

    }

    cargarDashboard();

}