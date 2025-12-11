<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'utilisateurs';
$user = 'root';
$pass = 'root1234';

try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->query("SELECT * FROM utilisateurs");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($users);

} catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
}
