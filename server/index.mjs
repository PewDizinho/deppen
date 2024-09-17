import express from "express";

const app = express();
const port = "6060";

app.get("/", (req, res) => {
    res.send("SERVER LIGADO");
});

app.listen(port, () => {
    console.log("Funcionando");
})
