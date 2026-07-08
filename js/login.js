document.getElementById("entrar").onclick = async () => {

    const password = document.getElementById("password").value;

    const { data, error } = await supabaseClient

        .from("configuracion")

        .select("valor")

        .eq("clave", "password")

        .single();

    if (error) {

        alert("Error al verificar la contraseña.");

        console.error(error);

        return;

    }

    if (password !== data.valor) {

        alert("Contraseña incorrecta.");

        return;

    }

    sessionStorage.setItem("sesion", "activa");

    sessionStorage.setItem("modo", "admin");

    location.href = "index.html";

};

document.getElementById("password").addEventListener("keypress", e => {

    if (e.key === "Enter") {

        document.getElementById("entrar").click();

    }

});