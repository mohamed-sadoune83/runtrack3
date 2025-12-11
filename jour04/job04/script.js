async function loadUsers() {
	try {
		const response = await fetch('users.php');
		const users = await response.json();

		const tbody = document.getElementById('usersTableBody');
		tbody.innerHTML = '';

		users.forEach((user) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.nom}</td>
                        <td>${user.prenom}</td>
                        <td>${user.email}</td>
                        `;
			tbody.appendChild(tr);
		});
	} catch (err) {
		console.error('Erreur:', err);
	}
}

document.getElementById('updateBtn').addEventListener('click', loadUsers);

// harger les utilisateurs au démarrage
loadUsers();

/*
Job 04
Créez une base de données “utilisateurs” contenant une table “utilisateurs” et ayant
commechamps “id”, “nom”, “prenom” et “email”.
Ajoutez des utilisateurs directement dans phpmyadmin.
Créez une page users.php qui se connecte à la base de données, récupère l’ensemble
des utilisateurs et affiche ces informations au format json.
Dans votre page index.php, créez un tableau <table> permettant de contenir ces
informations ainsi qu’un <button> “update”. Lorsque l’on clique sur ce bouton, le tableau
doit se mettre à jour et contenir l’ensemble des informations des utilisateurs présents
dans la base de données.
Vous pouvez tester votre code en ajoutant/supprimant des utilisateurs à l’aide de
phpmyadmin entre deux clics
*/
