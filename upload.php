<?php
	$filename = "store.txt";
	file_put_contents($filename, $_POST["RAW_DATA"]);
	echo $_POST["RAW_DATA"]
?>