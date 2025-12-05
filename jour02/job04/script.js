const textarea = document.querySelector('#keylogger');

document.addEventListener('keydown', function (e) {
	const key = e.key;

	if (/^[a-zA-Z]$/.test(key)) {
		if (document.activeElement === textarea) {
			textarea.value += key + key;
		} else {
			textarea.value += key;
		}
	}
});

/*
        Job 04
        Créez un <textarea> dont l’id est “keylogger”.
        Chaque fois que l’utilisateur tape une lettre sur son clavier (a-z), celle-ci est ajoutée
        dans le textarea (même si le focus en cours n’est pas le textarea).
        Si le focus en cours est dans le textarea, la lettre doit être ajoutée deux fois.

*/
