<?php
header('Content-Type: application/json');

$host = 'localhost';
$db = 'utilisateurs';
$user = 'root';
$pass = 'root1234';
$charset = 'utf8mb4';

try {
        $pdo = new PDO(
                "mysql:host=$host;dbname=$db;charset=$charset",
                $user,
                $pass,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
} catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Erreur de connexion à la base : ' . $e->getMessage()]);
        exit;
}

// Récupération des champs
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
        echo json_encode(['success' => false, 'error' => 'Veuillez remplir tous les champs.']);
        exit;
}

try {
        $stmt = $pdo->prepare("SELECT id, nom, prenom, password FROM utilisateurs WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
                echo json_encode(['success' => false, 'error' => 'Aucun compte associé à cet email.']);
                exit;
        }

        if (!password_verify($password, $user['password'])) {
                echo json_encode(['success' => false, 'error' => 'Mot de passe incorrect.']);
                exit;
        }

        // Connexion réussie
        echo json_encode([
                'success' => true,
                'user' => [
                        'id' => $user['id'],
                        'nom' => $user['nom'],
                        'prenom' => $user['prenom'],
                        'email' => $email
                ]
        ]);

} catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de la connexion : ' . $e->getMessage()]);
}
