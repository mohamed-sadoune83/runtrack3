<?php
header('Content-Type: application/json');

// --- Connexion à la BDD ---
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

// --- Récupération des champs POST ---
$nom = trim($_POST['nom'] ?? '');
$prenom = trim($_POST['prenom'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$adresse = trim($_POST['adresse'] ?? '');
$cp = trim($_POST['cp'] ?? '');

// --- Validation minimale ---
if (!$nom || !$prenom || !$email || !$password) {
        echo json_encode(['success' => false, 'error' => 'Tous les champs obligatoires doivent être remplis.']);
        exit;
}

// Vérification email déjà utilisé
try {
        $stmt = $pdo->prepare("SELECT id FROM utilisateurs WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
                echo json_encode(['success' => false, 'error' => 'Email déjà utilisé.']);
                exit;
        }
} catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de la vérification de l’email : ' . $e->getMessage()]);
        exit;
}

// Hash du mot de passe
$hash = password_hash($password, PASSWORD_DEFAULT);

// Insertion dans la BDD
try {
        $stmt = $pdo->prepare("INSERT INTO utilisateurs (nom, prenom, email, password, adresse, cp) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$nom, $prenom, $email, $hash, $adresse, $cp]);
        echo json_encode(['success' => true]);
        exit;
} catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de l’insertion en base : ' . $e->getMessage()]);
        exit;
}
