<!DOCTYPE html>
<html lang="en">
<?php
include_once "remove.php";
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deppen Teste</title>
</head>

<button onclick="<?php execute() ?>">DOWNLOAD</button>

<body>
    <?php
    $assetsDir = __DIR__ . '/assets';
    $headers = ['IP', 'MAC', 'Máscara', 'DATA', 'NomeDNS', 'TAG'];

    function mergeAssetsInfo($assetsDir, $headers)
    {
        if (!is_dir($assetsDir)) {
            echo "Error: Directory does not exist.";
            return;
        }

        $files = scandir($assetsDir);
        $results = [];
        $filesProcessed = 0;

        foreach ($files as $file) {
            if ($file === '.' || $file === '..')
                continue;

            $filePath = $assetsDir . '/' . $file;
            if (($handle = fopen($filePath, 'r')) !== FALSE) {
                while (($data = fgetcsv($handle, 1000, ';')) !== FALSE) {
                    if ($data[0] !== 'IP') {
                        $results[] = $data;
                    }
                }
                fclose($handle);
            }
            $filesProcessed++;
        }

        if ($filesProcessed === count($files) - 2) { // Subtracting 2 for '.' and '..'
            $outputFilePath = __DIR__ . '/merged_results.csv';
            $csvContent = implode(';', $headers) . "\n";

            foreach ($results as $row) {
                $csvContent .= implode(';', array_map(function ($header, $index) use ($row) {
                    return $row[$index] ?? '';
                }, $headers, array_keys($headers))) . "\n";
            }

            file_put_contents($outputFilePath, $csvContent);
            echo "CSV file has been saved: $outputFilePath";
        }
    }

    // Call the function to merge information
    mergeAssetsInfo($assetsDir, $headers);
    ?>

</body>

</html>