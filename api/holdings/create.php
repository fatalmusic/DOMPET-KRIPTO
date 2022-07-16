<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST");
	header("Content-Type: application/json");

	if($_SERVER["REQUEST_METHOD"] == "POST") {
		if(empty($_POST)) {
			$json = file_get_contents("php://input");
			$_POST = json_decode($json, true);
		}

		$username = !empty($_POST["username"]) ? $_POST["username"] : die();
		
		$utils = require_once("../utils.php");
		$helper = new Utils($username);

		$token = !empty($_POST["token"]) ? $_POST["token"] : die();
		if($helper->verifySession($token)) {
			$id = !empty($_POST["id"]) ? $_POST["id"] : die();
			$symbol = !empty($_POST["symbol"]) ? $_POST["symbol"] : die();
			$amount = !empty($_POST["amount"]) ? $_POST["amount"] : die();

			$current = json_decode(file_get_contents($helper->holdingsFile), true);
		
			if(array_key_exists($id, $current)) {
				$current[$id]["amount"] += $amount;
			} else {
				$current[$id] = array("symbol" => $symbol, "amount" => $amount);
			}

			if(time() - 1 > filemtime($helper->holdingsFile)) {
				$create = file_put_contents($helper->holdingsFile, json_encode($current));

				if($create) {
					echo json_encode(array("message" => "Portofolio berhasil ditambahkan."));
				} else {
					echo json_encode(array("error" => "Portofolio gagal ditambahkan."));
				}
			} else {
				echo json_encode(array("error" => "permintaan duplikat terdeteksi. hanya yang lebih awal akan diproses."));
			}
		} else {
			echo json_encode(array("error" => "tolong login terlebih dahulu."));
		}
	} else {
		echo json_encode(array("error" => "request error, coba lagi"));
	}
?>