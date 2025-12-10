const btnElement = document.querySelector('#button');

btnElement.addEventListener('click', function () {
	fetch('expression.txt')
		.then((response) => response.text())
		.then((text) => {
			const p = document.createElement('p');
			p.textContent = text;

			document.body.appendChild(p);
		})
		.catch((error) => console.error('Erreur :', error));
});

/*
Job 01
Créez un <button> ayant comme id “button”. Créez un fichier expression.txt contenant
votre expression favorite.
Lorsqu’un utilisateur clique sur le bouton, à l’aide de Fetch, récupérez le contenu du
f
ichier expression.txt, placez le dans un paragraphe <p> et insérez le dans le corps de
votre page.
*/
