const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Pasta onde as imagens serão salvas
const uploadDir = path.join(__dirname, "images");

// Criar a pasta se não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuração do Multer para armazenar imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.use(express.static("public"));
app.use("/images", express.static("images"));

// Rota de upload de imagem
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }
    const imageUrl = `/images/${req.file.filename}`;
    res.json({ url: imageUrl });
});

// Rota para listar todas as imagens
app.get("/images", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao listar imagens." });
        }
        res.json(files);
    });
});

// Rota para deletar uma imagem
app.delete("/delete/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(uploadDir, imageName);

    fs.unlink(imagePath, (err) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao deletar a imagem." });
        }
        res.json({ message: "Imagem deletada com sucesso!" });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
