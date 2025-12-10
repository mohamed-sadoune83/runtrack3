$(document).ready(function () {
	const correctOrder = ['images/haut1.png', 'images/haut2.png', 'images/haut3.png', 'images/bas1.png', 'images/bas2.png', 'images/bas3.png'];

	const $container1 = $('.container1');
	const $slots = $('.container2 .slot');

	// Fonction qui crée les images à partir d'un tableau donné (order)
	function createImages(order) {
		// Vide le container1 avant d'y ajouter les nouvelles images
		$container1.empty();

		// Pour chaque image dans le tableau "order"
		order.forEach((src) => {
			console.log("ORDER : ", order);
			// Crée un élément <img> avec son chemin + un data-src pour la vérification
			const $img = $(`<img src="${src}" data-src="${src}">`);
			console.log("SRC :", src);

			// Ajoute cette image dans le container1
			$container1.append($img);
		});

		// Active le drag-and-drop sur les nouvelles images
		initDrag();
	}

	$('#shuffle').click(function () {
		// Copie du tableau correctOrder pour éviter de le modifier
		const shuffled = correctOrder.slice();
		console.log("CORRECTORDER :", correctOrder);
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		createImages(shuffled);

		// Efface le message (victoire/perdu)
		$('#resultat').text('');
	});

	function initDrag() {
		$('img').draggable({
			revert: 'invalid', // Revient à la position d'origine si drop invalide
			helper: 'clone', // On déplace une copie, pas l'image originale
			cursor: 'grab', // Curseur en mode 'main'
		});

		// Rend chaque slot du container2 capable de recevoir une image
		$slots.droppable({
			accept: 'img', // Seules les images peuvent être droppées
			hoverClass: 'hovered', // Classe appliquée visuellement quand une image passe dessus

			// Fonction exécutée quand on dépose une image dans un slot
			drop: function (event, ui) {
				// L'image déplacée
				const dragged = ui.draggable;
				console.log("DRAGGED :", dragged);

				// Le slot où l'image est déposée
				const droppedSlot = $(this);
				console.log("DROPPEDSLOT :", droppedSlot);

				// Vérifie si le slot contient déjà une image
				const existingImg = droppedSlot.children('img');

				// Si une image est déjà dans le slot, on la renvoie dans container1
				if (existingImg.length) {
					existingImg.detach().appendTo($container1);
				}

				// On place l'image saisie dans ce slot
				dragged.detach().appendTo(droppedSlot);

				// On remet ses coordonnées à zéro (sinon elle reste collée à la position précédente)
				dragged.css({ top: 0, left: 0, position: 'relative' });

				// Vérifie si l'ordre complet est correct
				checkOrder();
			},
		});
	}

	// Vérifie l'ordre des images dans les slots
	function checkOrder() {
		// Récupère toutes les images dans les slots
		const imgs = $slots.children('img');

		// Si toutes les images ne sont pas encore placées, on ne vérifie pas
		if (imgs.length !== correctOrder.length) return;

		let success = true;

		// Compare chaque image avec l'ordre correct
		imgs.each(function (index) {
			// Si la data-src ne correspond pas à l'image attendue → erreur
			if ($(this).data('src') !== correctOrder[index]) {
				success = false;
			}
		});

		// Affiche le message selon le résultat
		if (success) {
			$('#resultat').text('Bravo, vous avez découvert une image très rare, JD entrain de travailler !!!').css('color', 'green');
		} else {
			$('#resultat').text("L'ordre est incorrect.").css('color', 'red');
		}
	}

	// Lance automatiquement un mélange au chargement de la page
	$('#shuffle').click();
});
