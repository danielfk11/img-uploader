async function sendToServer() {
    const input = document.getElementById("imageInput");
    if (input.files.length === 0) {
        alert("Selecione uma imagem!");
        return;
    }

    const formData = new FormData();
    formData.append("image", input.files[0]);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            const lastUploaded = document.getElementById("lastUploaded");
            lastUploaded.innerHTML = `<p><a href="${data.url}" target="_blank">${data.url}</a></p>`;
            loadAllImages();
        } else {
            alert("Erro: " + data.message);
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

async function loadAllImages() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "Carregando...";

    try {
        const response = await fetch("/images");
        const images = await response.json();

        gallery.innerHTML = "";
        images.forEach(image => {
            let container = document.createElement("div");
            container.classList.add("image-container");

            let imgElement = document.createElement("img");
            imgElement.src = `/images/${image}`;

            let deleteButton = document.createElement("button");
            deleteButton.innerText = "✖"; // Ícone mais suave
            deleteButton.classList.add("delete-btn");
            deleteButton.onclick = () => deleteImage(image);

            container.appendChild(imgElement);
            container.appendChild(deleteButton);
            gallery.appendChild(container);
        });
    } catch (error) {
        console.error("Erro ao carregar imagens:", error);
    }
}

async function deleteImage(imageName) {
    if (!confirm("Tem certeza que deseja excluir esta imagem?")) {
        return;
    }

    try {
        const response = await fetch(`/delete/${imageName}`, { method: "DELETE" });

        if (response.ok) {
            alert("Imagem deletada com sucesso!");
            loadAllImages();
        } else {
            alert("Erro ao deletar a imagem.");
        }
    } catch (error) {
        console.error("Erro ao deletar imagem:", error);
    }
}
