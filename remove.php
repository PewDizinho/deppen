<?php
// Define the assets directory
function execute()
{

    $assetsDir = './assets/';

    // Remove existing files in the assets directory
    $files = glob($assetsDir . '*'); // Get all file names
    foreach ($files as $file) {
        if (is_file($file)) {
            unlink($file); // Delete file
        }
    }

    // Base URL for downloading files
    $baseUrl = 'https://ocs.celepar.parana/ocsreports/index.php?function=export_csv&no_header=1&tablename=IPDISCOVER&nolimit=true'; // Replace with your actual base URL
    $fileExtension = '.csv'; // File extension

    // Loop to download files with different IDs
    for ($i = 1; $i <= 20; $i++) {
        $fileUrl = $baseUrl . $i . $fileExtension;
        $fileName = $assetsDir . 'file_' . $i . $fileExtension;

        // Initialize cURL session
        $ch = curl_init($fileUrl);
        $fp = fopen($fileName, 'wb');

        // Set cURL options
        curl_setopt($ch, CURLOPT_FILE, $fp);
        curl_setopt($ch, CURLOPT_HEADER, 0);

        // Execute cURL session
        curl_exec($ch);

        // Close cURL session and file pointer
        curl_close($ch);
        fclose($fp);
    }
}
