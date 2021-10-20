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
$randStr = generateRandomString();
$name = "sketches/sketch_" . $randStr . ".html";
$content = file_get_contents("template_sketch.html");
if (!file_exists($name)) { $handle = fopen($name,'w+'); fwrite($handle,$content); fclose($handle); }
$handle = fopen($name,'a');
fwrite($handle, '<span style="display: none;" id="id">' . $name . '</span>');
fclose($handle);
header('Location: ' . $name);
exit();
?>