
import express from "express";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath }  from 'url';
import multer from "multer";
import * as merge from "./merge.mjs";
import ping from "net-ping";

const upload = multer({dest: 'uploads/'});
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const port = "6060";
  app.post('/stats', upload.any('uploaded_file'), async function  (req, res) {
      await merge.mergeAssetsInfo(res);
    
      
});

app.get("/", (req, res) => {
    fs.readFile(__dirname + '/public/index.html', 'utf8', (err, text) => {
        res.send(text);
    });
});
app.get("/ping/:ip", (req, res) => {
    var session= ping.createSession();
        var target = req.params.ip;
        session.pingHost(target, function (err, target) {
            if(err){
              res.send(target + ": " + err.toString());
            }else{
                res.send(target + ": Alive");
            }
        })
    
});



app.get("/api/regionais/getip/:ip", async (req, res) => {
     fs.readFile(__dirname + "/localDB/regionais.json", 'utf8', (err, text) =>{    
            res.send(JSON.parse(text)[JSON.parse(text).findIndex(obj => obj.ipv4 == req.params.ip)]);	
    });
});




app.listen(port, () => {
    console.log("Funcionando");
})
