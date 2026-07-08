//=========================
// CARGAR MATERIALES POR REPONER
//=========================

let materiales = [];

async function cargarMateriales() {

    const { data, error } = await supabaseClient

        .from("materiales")

        .select("*")

        .order("nombre");

    if (error) {

        console.error(error);

        return;

    }

    materiales = data.filter(material =>

        Number(material.cantidad) <= Number(material.minimo)

    );

    document.getElementById("totalReponer").textContent = materiales.length;

    mostrarMateriales(materiales);

}

//=========================
// MOSTRAR MATERIALES
//=========================

function mostrarMateriales(lista){

    const contenedor = document.getElementById("listaReponer");

    contenedor.innerHTML = "";

    if(lista.length === 0){

        contenedor.innerHTML = `

        <div class="card">

            <h2>✅ Excelente</h2>

            <p>No existen materiales por reponer.</p>

        </div>

        `;

        return;

    }

    lista.forEach(material=>{

        contenedor.innerHTML += `

        <div class="stockCard" style="border-left-color:${obtenerColor(material.color)};">

            <div class="stockTitulo">

                ${material.nombre}

            </div>

            <div class="stockInfo">

                📦 Existencias: <b>${material.cantidad}</b>

                <br>

                ⚠ Stock mínimo: <b>${material.minimo}</b>

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

//=========================
// BUSCADOR
//=========================

document.getElementById("buscarReponer")

.addEventListener("keyup", e=>{

    const texto = e.target.value.toLowerCase();

    const resultado = materiales.filter(material=>

        material.nombre.toLowerCase().includes(texto) ||

        material.codigo.toLowerCase().includes(texto)

    );

    mostrarMateriales(resultado);

});

//=========================
// COLORES
//=========================

function obtenerColor(color){

    switch(color){

        case "azul": return "#1565c0";
        case "verde": return "#2ecc71";
        case "rojo": return "#e74c3c";
        case "amarillo": return "#f1c40f";
        case "morado": return "#8e44ad";
        case "gris": return "#7f8c8d";

        default: return "#1565c0";

    }

}

cargarMateriales();