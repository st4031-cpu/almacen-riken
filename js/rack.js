const parametros = new URLSearchParams(window.location.search);

const rackId = parametros.get("id");

//=========================
// CARGAR RACK
//=========================

async function cargarRack() {

    const { data: rack } = await supabaseClient

        .from("racks")

        .select("*")

        .eq("id", rackId)

        .single();

    document.getElementById("nombreRack").textContent = rack.nombre;

    const { data: materiales } = await supabaseClient

        .from("materiales")

        .select("*")

        .eq("rack_id", rackId)

        .order("nombre");

    const lista = document.getElementById("listaMateriales");

    lista.innerHTML = "";

    materiales.forEach(material => {

        const color = obtenerColor(material.color);

        const categoria = obtenerCategoria(material.color);

        lista.innerHTML += `

        <div class="card"

        style="border-left:12px solid ${color};">

            <h2 style="color:${color};">

                📦 ${material.nombre}

            </h2>

            <p style="
                display:inline-block;
                background:${color};
                color:white;
                padding:6px 12px;
                border-radius:20px;
                font-size:14px;
                font-weight:bold;
                margin-bottom:12px;
            ">

                ${categoria}

            </p>

            <p>

                <b>Código:</b>

                ${material.codigo}

            </p>

            <p>

                <b>Existencias:</b>

                ${material.cantidad}

            </p>

            <button

            onclick="location.href='material.html?id=${material.id}'">

                👁 Ver Material

            </button>

        </div>

        `;

    });

}

//=========================
// COLORES
//=========================

function obtenerColor(color){

    switch(color){

        case "azul":
            return "#1565c0";

        case "morado":
            return "#8e44ad";

        case "verde":
            return "#2ecc71";

        case "naranja":
            return "#e67e22";

        case "cafe":
            return "#8B4513";

        case "amarillo":
            return "#f1c40f";

        case "gris":
            return "#7f8c8d";

        case "rojo":
            return "#e74c3c";

        case "turquesa":
            return "#1abc9c";

        case "rosa":
            return "#ff69b4";

        case "blanco":
            return "#bdc3c7";

        case "negro":
            return "#2c3e50";

        default:
            return "#1565c0";

    }

}

//=========================
// CATEGORÍAS
//=========================

function obtenerCategoria(color){

    switch(color){

        case "azul":
            return "⚡ Eléctrico";

        case "morado":
            return "🤖 Automatización";

        case "verde":
            return "💨 Neumática";

        case "naranja":
            return "🚰 Hidráulica";

        case "cafe":
            return "🔧 Mecánico";

        case "amarillo":
            return "🦺 Seguridad";

        case "gris":
            return "📦 Consumibles";

        case "rojo":
            return "🚨 Crítico";

        case "turquesa":
            return "🌐 Redes";

        case "rosa":
            return "📏 Instrumentación";

        case "blanco":
            return "📄 Documentación";

        case "negro":
            return "🛠 Herramientas";

        default:
            return "📦 General";

    }

}

//=========================
// NUEVO MATERIAL
//=========================

document.getElementById("nuevoMaterial").onclick = () => {

    location.href = "nuevo.html?rack=" + rackId;

};

cargarRack();