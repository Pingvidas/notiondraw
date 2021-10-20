<?php

// $dataJson=json_decode($_GET['data']);
$data = $_POST['sketch'];
$id = $_POST['id'];
echo $data;
list($type, $data) = explode(';', $data);
list(, $data)      = explode(',', $data);
$data = base64_decode($data);

// print_r($data);

file_put_contents($_SERVER['DOCUMENT_ROOT'] . "/draw/sketches/" . $id . '/canvas.png', $data);
die;
?>
