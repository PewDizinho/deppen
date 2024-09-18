//import express from "express";
const express = require("express");
var path = require("path");
const fs = require("fs");
const app = express();
const port = "6060";


app.get("/", (req, res) => {
    res.send("SERVER LIGADO");//home screen
});
app.get("/pedidos", (req, res) => {
	//Páginas de pedidos	
});


app.get("/api/regionais", (req, res) => {
	res.send("R1 - Curitiba");	
});


app.get('/api', (req, res) => {
    fs.readFile(__dirname + '/public/index.html', 'utf8', (err, text) => {
        res.send(text);
    });
});

app.listen(port, () => {
    console.log("Funcionando");
})
