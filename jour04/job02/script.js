async function jsonValueKey(url, key) {
	try {
		const response = await fetch(url);
		const obj = await response.json(); 
		return obj[key];
	} catch (error) {
		console.error('Erreur JSON :', error);
		return undefined;
	}
}

document.getElementById('searchBtn').addEventListener('click', async () => {
	const key = document.getElementById('keyInput').value.trim();
	const resultField = document.getElementById('result');

	if (key === '') {
		resultField.textContent = 'Veuillez entrer une clé.';
		return;
	}

	const value = await jsonValueKey('./infos.json', key);

	if (value !== undefined) {
		resultField.textContent = 'Valeur trouvée : ' + value;
		resultField.style.color = 'deeppink';
	} else {
		resultField.textContent = 'Clé introuvable dans le fichier JSON.';
		resultField.style.color = 'red';
	}
});

/*
Job 02
Créez une fonction javascript “jsonValueKey()” qui prend en paramètre une chaîne de
caractères au format json et une clé.
Cette fonction retourne la valeur liée à cette clé dans la chaîne de caractères.
Par exemple : si la string passée en paramètre est
“{
name: "La Plateforme_",
address: "8 rue d'hozier",
city: "Marseille",
nb_staff: "11",
creation:"2019"
}”
si la clé est “city”, la fonction retourne “Marseille”
*/
