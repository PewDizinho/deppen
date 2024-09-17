const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const headers = ['IP', 'MAC', 'Máscara', 'DATA', 'NomeDNS', 'TAG'];

const assetsDir = path.join(__dirname, 'assets');

function mergeAssetsInfo() {
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

                        fs.writeFile(outputFilePath, csvContent, (err) => {
                            if (err) {
                                console.error('Error writing to CSV file:', err);
                            } else {
                                console.log('CSV file has been saved:', outputFilePath);
                            }
                        });
                    }
                });

        });

    });
}

mergeAssetsInfo();