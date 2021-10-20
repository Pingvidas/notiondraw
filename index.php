<?php
function generateRandomString($length = 20) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
$name = "sketches/sketch_" . generateRandomString() . ".html";
$content = file_get_contents("template_sketch.html");
if (!file_exists($name)) { $handle = fopen($name,'w+'); fwrite($handle,$content); fclose($handle); }
header('Location: ' . $name);
exit();
?>