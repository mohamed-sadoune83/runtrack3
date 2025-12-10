// Tableau représentant l'état actuel du puzzle
let tiles = [];

// Ordre final gagnant : 8 tuiles + la case vide
const winningOrder = ['1', '2', '3', '4', '5', '6', '7', '8', 'empty'];

// Récupération des éléments HTML
const taquin = document.getElementById('taquin');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');

// Initialisation du jeu
function initGame() {
	message.textContent = ''; // Efface le message
	restartBtn.style.display = 'none'; // Cache le bouton recommencer
	tiles = shufflePuzzle(); // Génére un mélange solvable
	renderBoard(); // Affiche la grille
}

// Rendering du plateau
function renderBoard() {
	taquin.innerHTML = ''; // Vide la grille avant de la reconstruire

	tiles.forEach((id) => {
		// Pour chaque case du puzzle
		const div = document.createElement('div'); // Crée une tuile (div)
		div.className = 'tile'; // lui donne la classe CSS
		div.dataset.id = id; // stocke l'id dans data-id

		// Si la tuile est la case vide
		if (id === 'empty') {
			div.classList.add('empty'); // style spécial dans le CSS
			div.draggable = false; // interdiction de drag
		} else {
			// Donne l'image correspondant à la tuile
			div.style.backgroundImage = `url("images/piece${id}.png")`;

			// Active le drag HTML5
			div.draggable = true;

			// Quand on commence à drag
			div.addEventListener('dragstart', (e) => {
				// on stocke l'ID de la tuile glissée dans l'objet drag
				e.dataTransfer.setData('text/plain', id);

				// Option visuelle (pas obligatoire)
				e.dataTransfer.effectAllowed = 'move';
			});
		}

		// Déplacement par clic
				div.addEventListener('click', () => {
			moveTile(id); // tente de déplacer la tuile
		});

		// Drag & drop (toutes cases)
		div.addEventListener('dragover', (e) => {
			e.preventDefault();
		});

		// drop = si la tuile est lâchée sur cette case
		div.addEventListener('drop', (e) => {
			e.preventDefault();

			// on récupère l'id de la tuile glissée
			const draggedId = e.dataTransfer.getData('text/plain');

			// rejet si la case cible n'est pas la case vide
			if (div.dataset.id !== 'empty') return;

			// Indices de la tuile glissée + case vide
			const emptyIndex = tiles.indexOf('empty');
			const draggedIndex = tiles.indexOf(draggedId);

			// Vérifie la proximité
			if (areAdjacent(emptyIndex, draggedIndex)) {
				// échange les 2 positions dans le tableau
				[tiles[emptyIndex], tiles[draggedIndex]] = [tiles[draggedIndex], tiles[emptyIndex]];

				// rafraîchit la grille
				renderBoard();

				// Si victoire : message + blocage + bouton
				if (isWinning(tiles)) {
					onWin();
				}
			}
		});

		// Ajoute cette tuile à la grille HTML
		taquin.appendChild(div);
	});
}

// Vérifie si deux cases sont adjacentes dans la grille 3×3
function areAdjacent(i, j) {
	// Conversion index → ligne/colonne
	const ri = Math.floor(i / 3),
		ci = i % 3;
	const rj = Math.floor(j / 3),
		cj = j % 3;

	// horizontal ou vertical à 1 de distance
	return (ri === rj && Math.abs(ci - cj) === 1) || (ci === cj && Math.abs(ri - rj) === 1);
}

// Déplacement par clic
function moveTile(id) {
	const idxTile = tiles.indexOf(id); // position de la tuile
	const idxEmpty = tiles.indexOf('empty'); // position de la case vide

	// Si la tuile est voisine de la case vide
	if (areAdjacent(idxTile, idxEmpty)) {
		// On échange les deux
		[tiles[idxEmpty], tiles[idxTile]] = [tiles[idxTile], tiles[idxEmpty]];

		renderBoard(); // Re-crée la grille

		// Si tout est en ordre : victoire
		if (isWinning(tiles)) onWin();
	}
}

// Mélange solvable (Fisher-Yates)
// on vérifie qu’on ne tombe pas sur un état déjà gagné
function shufflePuzzle() {
	let arr = ['1', '2', '3', '4', '5', '6', '7', '8', 'empty'];

	do {
		// Mélange Fisher-Yates
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	} while (!isSolvable(arr) || isWinning(arr)); // rejette mélange impossible

	return arr;
}

// Vérifie si un mélange est solvable
// (nombre d'inversions pair = OK sur un 3x3)
function isSolvable(arr) {
	// On enlève la case vide
	const flat = arr.filter((x) => x !== 'empty').map(Number);

	let inv = 0; // compteur d'inversions

	// Compare chaque paire
	for (let i = 0; i < flat.length; i++) {
		for (let j = i + 1; j < flat.length; j++) {
			if (flat[i] > flat[j]) inv++;
		}
	}

	// Solvable si nombre pair
	return inv % 2 === 0;
}

// Vérifie si le plateau est dans l'ordre gagnant
function isWinning(arr) {
	return JSON.stringify(arr) === JSON.stringify(winningOrder);
}

// Quand le joueur gagne
function onWin() {
	message.textContent = 'Vous avez gagné'; // message
	message.style.color = 'lime'; // couleur verte

	// Désactive toute interaction avec les tuiles
	taquin.querySelectorAll('.tile').forEach((t) => (t.style.pointerEvents = 'none'));

	restartBtn.style.display = 'inline-block'; // montre le bouton
}

// Bouton recommencer
restartBtn.addEventListener('click', initGame);

// Démarre automatiquement une partie au chargement
initGame();
