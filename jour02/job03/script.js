const buttonElement = document.querySelector('#button');

function addone() {
	const compteurElement = document.querySelector('#compteur');
	let valeur = parseInt(compteurElement.textContent, 10);
	valeur += 1;
	compteurElement.textContent = valeur;
}

buttonElement.addEventListener('click', addone);

/*
Job 03
 Créez une balise <button> ayant comme id “button”.
 Créez une balise <p> ayant comme id “compteur” et contenant “0”.
 Ce contenu doit évoluer proportionnellement au nombre d'événements click reçu par le
 bouton
 ATTENTION : Vous ne devez pas utiliser “onclick()” dans votre html.
 La fonction permettant d’effectuer la modification doit s'appeler “addone()”.
*/
