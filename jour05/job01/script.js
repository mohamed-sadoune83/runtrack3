const $ = (id) => document.getElementById(id);

// debounce utilitaire
function debounce(fn, ms = 250) {
	let id;
	return (...args) => {
		clearTimeout(id);
		id = setTimeout(() => fn(...args), ms);
	};
}

if ($('signupForm')) {
	const signupForm = $('signupForm');
	const submitBtn = $('submitBtn');
	const formMessage = $('formMessage');

	let validity = {
		nom: false,
		prenom: false,
		email: false,
		password: false,
		adresse: true,
		cp: true,
	};

	// validators
	const validators = {
		nom: async (v) => (v?.trim().length >= 2 ? { ok: true } : { ok: false, msg: 'Nom trop court (min 2).' }),
		prenom: async (v) => (v?.trim().length >= 2 ? { ok: true } : { ok: false, msg: 'Prénom trop court.' }),
		email: async (v) => {
			const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!re.test(v)) return { ok: false, msg: 'Email invalide.' };
			// simulation côté serveur
			const simulatedExisting = ['jean.dupont@example.com', 'test@domain.com'];
			if (simulatedExisting.includes(v.toLowerCase())) return { ok: false, msg: 'Email déjà utilisé.' };
			return { ok: true };
		},
		password: async (v) => {
			if (!v || v.length < 8) return { ok: false, msg: 'Mot de passe trop court (min 8).' };
			const score = [/[a-z]/, /[A-Z]/, /\d/, /[^\w\s]/].reduce((s, r) => s + (r.test(v) ? 1 : 0), 0);
			if (score < 2) return { ok: false, msg: 'Mot de passe trop simple.' };
			return { ok: true };
		},
		adresse: async (v) => (!v || v.trim().length >= 6 ? { ok: true } : { ok: false, msg: 'Adresse trop courte.' }),
		cp: async (v) => (!v || /^\d{5}$/.test(v) ? { ok: true } : { ok: false, msg: 'Code postal invalide (5 chiffres).' }),
	};

	// update UI
	function setFieldState(id, result) {
		const err = $('err-' + id);
		err.textContent = result.ok ? '' : result.msg;
		validity[id] = result.ok;
		updateSubmitState();
	}

	function updateSubmitState() {
		submitBtn.disabled = !(validity.nom && validity.prenom && validity.email && validity.password);
	}

	// attach listeners
	Object.keys(validators).forEach((field) => {
		const input = $(field);
		if (!input) return;
		input.addEventListener(
			'input',
			debounce(async (e) => {
				setFieldState(field, await validators[field](e.target.value));
			}, 300),
		);
	});

	// submit
	signupForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		formMessage.textContent = '';

		// validation finale
		const results = await Promise.all(Object.keys(validators).map((f) => validators[f]($(f).value)));

		Object.keys(validators).forEach((f, i) => setFieldState(f, results[i]));

		if (!results.every((r) => r.ok)) {
			formMessage.innerHTML = "<div class='error'>Veuillez corriger les erreurs avant de valider.</div>";
			return;
		}

		// envoi au serveur
		const formData = new FormData(signupForm);
		const res = await fetch('php/signup.php', { method: 'POST', body: formData });
		const json = await res.json();

		if (json.success) formMessage.innerHTML = "<div class='success'>Compte créé !</div>";
		else formMessage.innerHTML = "<div class='error'>" + json.error + '</div>';
	});
}

if ($('loginForm')) {
	const loginForm = $('loginForm');
	const loginBtn = $('loginBtn');
	const loginMessage = $('loginMessage');
	let valid = { email: false, password: false };

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

	function setStateConnexion(id, res) {
		const err = $('err-' + id);
		err.textContent = res.ok ? '' : res.msg;
		valid[id] = res.ok;
		loginBtn.disabled = !(valid.email && valid.password);
	}

	Object.keys(validatorsConnexion).forEach((field) => {
		const input = $(field);
		if (!input) return;
		input.addEventListener(
			'input',
			debounce(async (e) => setStateConnexion(field, await validatorsConnexion[field](e.target.value)), 250),
		);
	});

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
