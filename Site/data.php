<?php
include 'utility.class.php'; // Adjust this path if needed

$encrypted = utility::app_crypt('hello', 'e'); // Encrypting "hello"
echo $encrypted;
?>

