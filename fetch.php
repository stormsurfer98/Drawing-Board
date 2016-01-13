<?php
	$filename = "store.txt";
	if(file_exists($filename)) {
		echo file_get_contents($filename);
	} else {
		echo "";
	}
?>