//const fs = require('fs');
//const path = require('path');
//const csv = require('csv-parser');
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { dirname } from "path";
import { fileURLToPath }  from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const headers = ['IP', 'MAC', 'Máscara', 'DATA', 'NomeDNS', 'TAG'];

const assetsDir = path.join(__dirname, 'uploads');

export async function mergeAssetsInfo(res) {
    fs.readdir(assetsDir, (err, files) => {
        if (err) {
            console.error('Error reading the assets directory:', err);
            return;
        }
        const results = [];
        let filesProcessed = 0;
        files.forEach(async file => {
            const filePath = path.join(assetsDir, file);

            fs.createReadStream(filePath)
                .pipe(csv({ separator: ';', headers: false }))
                .on('data', (data) => {
                    if (data[0] !== 'IP') {
                        results.push(data);
                    }
                })
                .on('end', () => {
                    filesProcessed++;
                    if (filesProcessed === files.length) {
                        const outputFilePath = path.join(__dirname, 'merged_results.csv');
                        const csvHeaders = headers.join(';') + '\n';
                        const csvRows = results.map(row => {
                            return headers.map((header, index) => row[index] || '').join(';');
                        }).join('\n');

                        const csvContent = csvHeaders + csvRows;

                        fs.writeFile(outputFilePath, csvContent,  (err) => {
                            if (err) {
                                console.error('Error writing to CSV file:', err);
                            } else {
                                console.log('CSV file has been saved:', outputFilePath);
                                const directory = __dirname + "/uploads";
                                res.sendFile(__dirname + "/merged_results.csv");
                             /*   fs.unlink(path.join(__dirname, "/merged_results.cvs"), (err) => {
                                    if(err) throw err;
                                })*/
                               fs.readdir(directory, (err, files) => {
                                if(err) throw err;
                                for(const file of files){
                                        fs.unlink(path.join(directory, file), (err) => {
                                            if(err) throw err;
                                        })
                                }
                               })
                            }
                          
                        });
                    }
                    
                });

        });

    });
}

