<?php

// $dataJson=json_decode($_GET['data']);
$data = $_POST['sketch'];
$id = $_POST['id'];
echo $data;
list($type, $data) = explode(';', $data);
list(, $data)      = explode(',', $data);
$data = base64_decode($data);

// print_r($data);

// mkdir($_SERVER['DOCUMENT_ROOT'] . "/draw/photos/");

file_put_contents($_SERVER['DOCUMENT_ROOT'] . "/draw/canvases/" . $id . '.png', $data);
die;
?>
