document.getElementById("guardar").onclick = async () => {

    const nombre = document.getElementById("nombre").value;

    const codigo = document.getElementById("codigo").value;

    const cantidad = Number(document.getElementById("cantidad").value);

    const ubicacion = document.getElementById("ubicacion").value;

    const descripcion = document.getElementById("descripcion").value;

    const minimo = Number(document.getElementById("minimo").value);

    const color = document.getElementById("color").value;

    const { error } = await supabaseClient

        .from("materiales")

        .insert({

            nombre,

            codigo,

            cantidad,

            ubicacion,

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

    location.href = "index.html";

};

document.getElementById("cancelar").onclick = () => {

    history.back();

};