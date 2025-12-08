const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];

let position = 0;

document.addEventListener('keydown', function (event) {
	if (event.key === konamiCode[position]) {
		position++;

		if (position === konamiCode.length) {
			activateKonami();
			position = 0;
		}
	} else {
		position = 0;
	}
});

function activateKonami() {
	const container = document.querySelector('#container');

	container.classList.remove('hidden');
}

/*
        Job 06
        Par défaut, votre index.php n’a pas de contenu.
        Lorsqu’un utilisateur effectue un code konami, la page devient stylisée, aux couleurs de
        La Plateforme_.
*/
