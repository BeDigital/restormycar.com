<?php
require 'cloudfiles.php';

$auth = new CF_Authentication('conradweidenkel', '1e6304d0e9a0e4cad054069bd5c3a531');
$auth->authenticate();
$conn = new CF_Connection($auth);
$cont = $conn->get_container('foo');
$obj = $cont->get_object('foo.jpg');
echo $obj->get_temp_url('foo', 60 * 60, "GET");
echo "\n";
?>
