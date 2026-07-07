async function cargarDashboard() {

    //=========================
    // MATERIALES
    //=========================

    const { data: materiales, error } = await supabaseClient

        .from("materiales")

        .select("*")

        .order("id");

    if (error) {

        console.error(error);

        return;

    }

    //-------------------------
    // TARJETA
    //-------------------------

    document.getElementById("totalMateriales").textContent =
        materiales.length;

    //-------------------------
    // STOCK BAJO
    //-------------------------

    const stockBajo = materiales.filter(material =>

        Number(material.cantidad) <= Number(material.minimo)

    );

    document.getElementById("stockBajo").textContent =
        stockBajo.length;

    //-------------------------
    // CAMBIAR COLOR TARJETA
    //-------------------------

    const tarjeta = document.querySelector(".alerta");

    if (stockBajo.length > 0) {

        tarjeta.style.background = "#e74c3c";

        tarjeta.style.color = "white";

    } else {

        tarjeta.style.background = "#2ecc71";

        tarjeta.style.color = "white";

    }

    //-------------------------
    // LISTA STOCK BAJO
    //-------------------------

    const listaStock =
        document.getElementById("listaStockBajo");

    listaStock.innerHTML = "";

    if (stockBajo.length == 0) {

        listaStock.innerHTML =

        "<p>✅ Todo el inventario está correcto.</p>";

    } else {

        stockBajo.forEach(material => {

            listaStock.innerHTML += `

            <div class="card">

                <h3 style="color:red;">

                    ${material.nombre}

                </h3>

                <p>

                    Existencias:

                    <b>${material.cantidad}</b>

                </p>

                <p>

                    Stock mínimo:

                    <b>${material.minimo}</b>

                </p>

            </div>

            <br>

            `;

        });

    }

    //-------------------------
    // LISTA MATERIALES
    //-------------------------

    const lista =
        document.getElementById("listaMateriales");

    lista.innerHTML = "";

    materiales.forEach(material => {

        let color = "#1565c0";

        switch(material.color){

            case "verde":
                color="#27ae60";
                break;

            case "rojo":
                color="#e74c3c";
                break;

            case "morado":
                color="#8e44ad";
                break;

            case "amarillo":
                color="#f1c40f";
                break;

            case "gris":
                color="#7f8c8d";
                break;

        }

        lista.innerHTML += `

        <div class="card"

        style="border-left:12px solid ${color};">

            <h2 style="color:${color};">

                ${material.nombre}

            </h2>

            <p>

                <b>Código:</b>

                ${material.codigo}

            </p>

            <p>

                <b>Existencias:</b>

                ${material.cantidad}

            </p>

            <p>

                <b>Ubicación:</b>

                ${material.ubicacion}

            </p>

            <button

            onclick="location.href='material.html?id=${material.id}'">

                Ver Material

            </button>

        </div>

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
// BUSCADOR
//=========================

document.getElementById("buscar")

.addEventListener("keyup",()=>{

    const texto =
        document.getElementById("buscar")
        .value
        .toLowerCase();

    const tarjetas =
        document.querySelectorAll("#listaMateriales .card");

    tarjetas.forEach(card=>{

        if(card.innerText.toLowerCase().includes(texto)){

            card.style.display="block";

        }else{

            card.style.display="none";

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