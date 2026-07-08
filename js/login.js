document.getElementById("entrar").onclick = async () => {

    const password = document.getElementById("password").value.trim();

    const { data, error } = await supabaseClient

        .from("configuracion")

        .select("valor")

        .eq("clave", "password")
        .limit(1);

    if (error) {

        console.error(error);

        alert("No se pudo verificar la contraseña.");

        return;

    }

    if (!data || data.length === 0) {

        alert("No existe una contraseña configurada.");

        return;

    }

    if (password !== data[0].valor) {

        alert("Contraseña incorrecta.");

        return;

    }

    sessionStorage.setItem("sesion", "activa");

    location.href = "index.html";

};

document.getElementById("password").addEventListener("keypress", e => {

    if (e.key === "Enter") {

        document.getElementById("entrar").click();

    }

});