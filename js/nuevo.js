//=========================
// OBTENER RACK
//=========================

const parametros = new URLSearchParams(window.location.search);

const rackSeleccionado = parametros.get("rack");

//=========================
// CARGAR RACKS
//=========================

async function cargarRacks() {

    const { data, error } = await supabaseClient

        .from("racks")

        .select("*")

        .order("nombre");

    if (error) {

        console.error(error);

        return;

    }

    const select = document.getElementById("rack");

    select.innerHTML = "";

    data.forEach(rack => {

        const option = document.createElement("option");

        option.value = rack.id;

        option.textContent = rack.nombre;

        select.appendChild(option);

    });

    if (rackSeleccionado) {

        select.value = rackSeleccionado;

    }

}

cargarRacks();

//=========================
// GUARDAR MATERIAL
//=========================

document.getElementById("guardar").onclick = async () => {

    const nombre = document.getElementById("nombre").value.trim();

    const codigo = document.getElementById("codigo").value.trim();

    const cantidad = Number(document.getElementById("cantidad").value);

    const rack_id = Number(document.getElementById("rack").value);

    const descripcion = document.getElementById("descripcion").value.trim();

    const minimo = Number(document.getElementById("minimo").value);

    const color = document.getElementById("color").value;

    const { error } = await supabaseClient

        .from("materiales")

        .insert({

            nombre,

            codigo,

            cantidad,

            rack_id,

            descripcion,

            minimo,

            color

        });

    if (error) {

        console.error(error);

        alert("Error al guardar");

        return;

    }

    alert("Material guardado correctamente");

    if (rackSeleccionado) {

        location.href = "rack.html?id=" + rackSeleccionado;

    } else {

        location.href = "index.html";

    }

};

//=========================
// CANCELAR
//=========================

document.getElementById("cancelar").onclick = () => {

    history.back();

};