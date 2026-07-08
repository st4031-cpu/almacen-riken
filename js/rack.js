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

            <button

            onclick="location.href='material.html?id=${material.id}'">

                Ver Material

            </button>

        </div>

        `;

    });

}

//=========================
// NUEVO MATERIAL
//=========================

document.getElementById("nuevoMaterial").onclick = () => {

    location.href = "nuevo.html?rack=" + rackId;

};

cargarRack();