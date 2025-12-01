<?php
header("Content-Type: application/json");

$secret_key = 'GabrielliBarryEncodedDataforGDPRNewRule12345!';
$secret_iv = 'WA-NewDATAEncodeSchemeCode123!@#';

function app_crypt($string, $action = 'd') {
    $encrypt_method = "AES-256-CBC";
    $key = hash('sha256', $GLOBALS['secret_key']);
    $iv = substr(hash('sha256', $GLOBALS['secret_iv']), 0, 16);

    if ($action == 'd') {
        $string = base64_decode($string);
        return openssl_decrypt($string, $encrypt_method, $key, 0, $iv);
    }
    return null;
}

$encrypted = $_GET['data'];
$decrypted = app_crypt($encrypted, 'd');

echo json_encode(['decrypted' => $decrypted]);
?>

