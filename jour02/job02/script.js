const buttonElement = document.querySelector('#button');

function showhide() {
	let article = document.querySelector('article');

	if (!article) {
		article = document.createElement('article');
		article.textContent = "L'important n'est pas la chute, mais l'atterrissage.";
		document.body.appendChild(article);
	} else {
		article.remove();
	}
}

buttonElement.addEventListener('click', showhide);

/*
Job 02
        Créez une balise <button> ayant comme id “button”.
        Lorsque l’on clique dessus, un <article> contenant le texte suivant est ajouté au contenu
        de la page : “L'important n'est pas la chute, mais l'atterrissage.”
        Si on clique à nouveau sur ce bouton, l’article disparaît.
        L’apparition / Disparition doivent être gérées dans une fonction nommée “showhide()”.
*/
