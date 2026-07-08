//=========================
// CARGAR MATERIALES
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

    materiales = data;

    mostrarMateriales(materiales);

}

//=========================
// MOSTRAR MATERIALES
//=========================

function mostrarMateriales(lista) {

    const contenedor = document.getElementById("listaMateriales");

    contenedor.innerHTML = "";

    lista.forEach(material => {

        contenedor.innerHTML += `

        <div class="card">

            <h2>${material.nombre}</h2>

            <p><b>Código:</b> ${material.codigo}</p>

            <p><b>Existencias:</b> ${material.cantidad}</p>

            <button onclick="location.href='material.html?id=${material.id}&modo=operador'">

                👁 Ver Material

            </button>

        </div>

        <br>

        `;

    });

}

//=========================
// BUSCADOR
//=========================

document.getElementById("buscar").addEventListener("keyup", e => {

    const texto = e.target.value.toLowerCase();

    const filtrados = materiales.filter(material =>

        material.nombre.toLowerCase().includes(texto) ||

        material.codigo.toLowerCase().includes(texto)

    );

    mostrarMateriales(filtrados);

});

cargarMateriales();