const $ = (id) => document.getElementById(id);

// Fonction utilitaire debounce pour limiter la fréquence d'exécution d'une fonction
// ex: éviter d'appeler une validation à chaque frappe instantanément
function debounce(fn, ms = 250) {
	let id;
	return (...args) => {
		clearTimeout(id); // annule le timeout précédent
		id = setTimeout(() => fn(...args), ms); // exécute fn après ms ms
	};
}

// ========================== SIGNUP ==========================
if ($('signupForm')) {
	// si le formulaire d'inscription existe sur la page
	const signupForm = $('signupForm');
	const submitBtn = $('submitBtn'); // bouton de soumission
	const formMessage = $('formMessage'); // zone d'affichage des messages généraux

	// objet pour suivre la validité de chaque champ
	let validity = {
		nom: false,
		prenom: false,
		email: false,
		password: false,
		adresse: true, // champs facultatifs initialisés à true
		cp: true,
	};

	// ---------- VALIDATEURS ----------
	const validators = {
		nom: async (v) => (v?.trim().length >= 2 ? { ok: true } : { ok: false, msg: 'Nom trop court (min 2).' }),
		prenom: async (v) => (v?.trim().length >= 2 ? { ok: true } : { ok: false, msg: 'Prénom trop court.' }),
		email: async (v) => {
			const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regex pour email
			if (!re.test(v)) return { ok: false, msg: 'Email invalide.' };
			// simulation d'un check serveur : tableau des emails déjà utilisés
			const simulatedExisting = ['jean.dupont@example.com', 'test@domain.com'];
			if (simulatedExisting.includes(v.toLowerCase())) return { ok: false, msg: 'Email déjà utilisé.' };
			return { ok: true };
		},
		password: async (v) => {
			if (!v || v.length < 8) return { ok: false, msg: 'Mot de passe trop court (min 8).' };
			// vérifie complexité : lettres minuscules, majuscules, chiffres, symboles
			const score = [/[a-z]/, /[A-Z]/, /\d/, /[^\w\s]/].reduce((s, r) => s + (r.test(v) ? 1 : 0), 0);
			if (score < 2) return { ok: false, msg: 'Mot de passe trop simple.' };
			return { ok: true };
		},
		adresse: async (v) => (!v || v.trim().length >= 6 ? { ok: true } : { ok: false, msg: 'Adresse trop courte.' }),
		cp: async (v) => (!v || /^\d{5}$/.test(v) ? { ok: true } : { ok: false, msg: 'Code postal invalide (5 chiffres).' }),
	};

	// ---------- MISE À JOUR DE L'UI ----------
	function setFieldState(id, result) {
		const err = $('err-' + id); // récupère le span d'erreur correspondant
		err.textContent = result.ok ? '' : result.msg; // affiche le message si erreur
		validity[id] = result.ok; // met à jour l'état de validité
		updateSubmitState(); // active/désactive le bouton submit
	}

	function updateSubmitState() {
		// bouton activé seulement si les champs obligatoires sont valides
		submitBtn.disabled = !(validity.nom && validity.prenom && validity.email && validity.password);
	}

	// ---------- AJOUT DES ÉCOUTEURS ----------
	Object.keys(validators).forEach((field) => {
		const input = $(field);
		if (!input) return; // ignore si le champ n'existe pas
		input.addEventListener(
			'input',
			debounce(async (e) => {
				setFieldState(field, await validators[field](e.target.value)); // validation asynchrone
			}, 300),
		);
	});

	// ---------- SUBMIT DU FORMULAIRE ----------
	signupForm.addEventListener('submit', async (e) => {
		e.preventDefault(); // bloque l'envoi classique
		formMessage.textContent = '';

		// validation finale de tous les champs avant envoi
		const results = await Promise.all(Object.keys(validators).map((f) => validators[f]($(f).value)));

		// mise à jour UI pour chaque champ
		Object.keys(validators).forEach((f, i) => setFieldState(f, results[i]));

		// si une erreur, on bloque
		if (!results.every((r) => r.ok)) {
			formMessage.innerHTML = "<div class='error'>Veuillez corriger les erreurs avant de valider.</div>";
			return;
		}

		// envoi vers le serveur (signup.php)
		const formData = new FormData(signupForm);
		const res = await fetch('php/signup.php', { method: 'POST', body: formData });
		const json = await res.json();

		if (json.success) formMessage.innerHTML = "<div class='success'>Compte créé !</div>";
		else formMessage.innerHTML = "<div class='error'>" + json.error + '</div>';
	});
}

// ========================== LOGIN ==========================
if ($('loginForm')) {
	const loginForm = $('loginForm');
	const loginBtn = $('loginBtn');
	const loginMessage = $('loginMessage');
	let valid = { email: false, password: false };

	// validators pour le login (plus simple côté front)
	const validatorsConnexion = {
		email: async (v) => {
			const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!re.test(v)) return { ok: false, msg: 'Email invalide.' };
			return { ok: true }; // plus de tableau simulé
		},
		password: async (v) => {
			if (!v || v.length < 6) return { ok: false, msg: 'Mot de passe trop court.' };
			return { ok: true };
		},
	};

	// mise à jour UI login
	function setStateConnexion(id, res) {
		const err = $('err-' + id);
		err.textContent = res.ok ? '' : res.msg;
		valid[id] = res.ok;
		loginBtn.disabled = !(valid.email && valid.password);
	}

	// écouteurs pour login
	Object.keys(validatorsConnexion).forEach((field) => {
		const input = $(field);
		if (!input) return;
		input.addEventListener(
			'input',
			debounce(async (e) => setStateConnexion(field, await validatorsConnexion[field](e.target.value)), 250),
		);
	});

	// submit login
	loginForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		loginMessage.textContent = '';

		const form = new FormData(loginForm);
		const res = await fetch('php/connexion.php', { method: 'POST', body: form });
		const json = await res.json();

		if (json.success) {
			loginMessage.innerHTML = "<div class='success'>Connexion réussie</div>";
		} else {
			loginMessage.innerHTML = "<div class='error'>" + json.error + '</div>';
		}
	});
}
