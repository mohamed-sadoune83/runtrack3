// === Références DOM ===
const rebootBtn = document.getElementById('rebootBtn');
const cardWorld = document.getElementById('card-world');
const bladeRunnerCard = document.getElementById('modal-blade-runner');
const paginationLinks = document.querySelectorAll('.page-link');

// === Citations Blade Runner (1982) ===
const citations = [
	{
		title: 'Blade Runner',
		subtitle: "I've seen things you people wouldn't croire...",
		text1: 'De grands navires en feu surgissant de l’épaule d’Orion.',
		text2: 'J’ai vu des rayons fabuleux briller dans l’ombre.',
		text3: 'Tous ces moments se perdront dans l’oubli, comme les larmes dans la pluie.',
	},
	{
		title: 'Blade Runner',
		subtitle: "It's too bad she won't live...",
		text1: 'Mais alors, qui vit réellement ?',
		text2: 'Le futur est incertain.',
		text3: "Nous marchons tous vers l'inconnu.",
	},
	{
		title: 'Blade Runner',
		subtitle: 'All those moments will be lost in time...',
		text1: 'Comme des larmes dans la pluie.',
		text2: "Tout s'efface avec le temps.",
		text3: 'Seule la mémoire persiste.',
	},
];

rebootBtn.addEventListener('click', () => {
	const random = citations[Math.floor(Math.random() * citations.length)];

	// Modifier le jumbotron directement
	document.getElementById('jumboTitle').textContent = random.title;
	document.getElementById('jumboSubtitle').textContent = random.subtitle;
	document.getElementById('jumboText1').textContent = random.text1;
	document.getElementById('jumboText2').textContent = random.text2;
	document.getElementById('jumboText3').textContent = random.text3;
});

// === Rebooter le Monde ===
rebootBtn.addEventListener('click', () => {
	const random = citations[Math.floor(Math.random() * citations.length)];

	bladeRunnerCard.querySelector('h4').textContent = random.title;
	bladeRunnerCard.querySelector('h6').textContent = random.subtitle;
	bladeRunnerCard.querySelector('p').textContent = random.text;

	cardWorld.classList.add('d-none');
	bladeRunnerCard.classList.remove('z-0');
	bladeRunnerCard.classList.add('z-3');
});

// === Pagination ===
document.addEventListener('DOMContentLoaded', () => {
	const pages = document.querySelectorAll('.page-link');

	pages.forEach((page) => {
		page.addEventListener('click', (e) => {
			e.preventDefault();

			const pageNumber = e.target.textContent;

			if (pageNumber === '1') {
				document.getElementById('jumboTitle').textContent = 'Limbes';
				document.getElementById('jumboSubtitle').textContent = 'Premier cercle';
				document.getElementById('jumboText1').textContent = 'Un lieu sans espoir.';
				document.getElementById('jumboText2').textContent = 'Les âmes y errent éternellement.';
				document.getElementById('jumboText3').textContent = 'Aucune souffrance, aucune joie.';
			}

			if (pageNumber === '2') {
				document.getElementById('jumboTitle').textContent = 'Luxure';
				document.getElementById('jumboSubtitle').textContent = 'Deuxième cercle';
				document.getElementById('jumboText1').textContent = 'Le désir mène à la perte.';
				document.getElementById('jumboText2').textContent = 'Les passions gouvernent.';
				document.getElementById('jumboText3').textContent = "Le vent ne s'arrête jamais.";
			}

			if (pageNumber === '3') {
				document.getElementById('jumboTitle').textContent = 'Internet Explorer';
				document.getElementById('jumboSubtitle').textContent = 'Dernier cercle';
				document.getElementById('jumboText1').textContent = 'Temps de chargement infini.';
				document.getElementById('jumboText2').textContent = 'Compatibilité douteuse.';
				document.getElementById('jumboText3').textContent = 'Personne n’en est jamais sorti.';
			}
		});
	});

	// === List-group : gestion de l'état actif ===
	const listItems = document.querySelectorAll('.list-group-item');

	listItems.forEach((item) => {
		item.addEventListener('click', (e) => {
			e.preventDefault();

			listItems.forEach((el) => el.classList.remove('active'));

			e.target.classList.add('active');
		});
	});

	const progressBar = document.getElementById('progressBar');
	const increaseBtn = document.getElementById('increaseBtn');
	const decreaseBtn = document.getElementById('decreaseBtn');

	function updateProgress(amount) {
		let current = parseInt(progressBar.style.width);

		let newValue = current + amount;

		newValue = Math.max(0, Math.min(100, newValue));

		progressBar.style.width = newValue + '%';
		progressBar.textContent = `Installation de AI 9000 - ${newValue}%`;
	}

	increaseBtn.addEventListener('click', () => updateProgress(10));
	decreaseBtn.addEventListener('click', () => updateProgress(-10));

	// === Séquence du code clavier ===
	const codeSequence = ['d', 'g', 'c'];
	let codeIndex = 0;

	document.addEventListener('keydown', (e) => {
		if (e.key.toLowerCase() === codeSequence[codeIndex]) {
			codeIndex++;

			if (codeIndex === codeSequence.length) {
				codeIndex = 0;
				showFormSummary();
			}
		} else {
			codeIndex = 0;
		}
	});

	// === Fonction qui récupère les valeurs du formulaire et affiche la modal ===
	function showFormSummary() {
		const formFields = document.querySelectorAll('form input');
		let summary = '';

		formFields.forEach((input) => {
			const label = input.closest('.input-group')?.querySelector('label')?.textContent || input.placeholder || 'Champ';
			summary += `<strong>${label}:</strong> ${input.value || '<em>Vide</em>'}<br>`;
		});

		document.getElementById('formSummaryContent').innerHTML = summary;

		const modal = new bootstrap.Modal(document.getElementById('formSummaryModal'));
		modal.show();
	}

	const submitBtn = document.getElementById('submitBtn');
	const emailInput = document.getElementById('emailInput');
	const passwordInput = document.getElementById('passwordInput');

	const colors = ['bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-primary', 'bg-secondary', 'bg-dark'];

	submitBtn.addEventListener('click', () => {
		const email = emailInput.value.trim();
		const password = passwordInput.value.trim();

		if (email && password) {
			progressBar.classList.remove(...colors);

			const randomColor = colors[Math.floor(Math.random() * colors.length)];
			progressBar.classList.add(randomColor);
		} else {
			alert('Veuillez remplir email et mot de passe !');
		}
	});
});
