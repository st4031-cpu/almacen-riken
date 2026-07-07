//====================================
// CARGAR HISTORIAL
//====================================

async function cargarHistorial() {

    const { data, error } = await supabaseClient

        .from("movimientos")

        .select("*")

        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        return;

    }

    const cuerpo = document.getElementById("cuerpoHistorial");

    cuerpo.innerHTML = "";

    data.forEach(movimiento => {

        const fecha = new Date(
            movimiento.created_at
        ).toLocaleString();

        cuerpo.innerHTML += `

        <tr>

            <td>${fecha}</td>

            <td>${movimiento.material_nombre}</td>

            <td>${movimiento.tipo}</td>

            <td>${movimiento.cantidad}</td>

            <td>${movimiento.responsable}</td>

            <td>${movimiento.empresa_area}</td>

        </tr>

        `;

    });

}

cargarHistorial();


//====================================
// BUSCADOR
//====================================

document.getElementById("buscarMovimiento")

.addEventListener("keyup", () => {

    const texto = document
        .getElementById("buscarMovimiento")
        .value
        .toLowerCase();

    const filas = document.querySelectorAll(
        "#cuerpoHistorial tr"
    );

    filas.forEach(fila => {

        if (fila.innerText.toLowerCase().includes(texto)) {

            fila.style.display = "";

        } else {

            fila.style.display = "none";

        }

    });

});