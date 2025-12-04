function jourtravaille(date) {
	const joursFeries2020 = [new Date(2020, 0, 1), new Date(2020, 3, 13), new Date(2020, 4, 1), new Date(2020, 4, 8), new Date(2020, 4, 21), new Date(2020, 5, 1), new Date(2020, 6, 14), new Date(2020, 7, 15), new Date(2020, 10, 1), new Date(2020, 10, 11), new Date(2020, 11, 25)];

	const jour = date.getDate();
	const mois = date.getMonth() + 1;
	const annee = date.getFullYear();

	for (let f of joursFeries2020) {
		if (f.getDate() === date.getDate() && f.getMonth() === date.getMonth() && f.getFullYear() === date.getFullYear()) {
			console.log(`Le ${jour} ${mois} ${annee} est un jour férié`);
			return;
		}
	}

	const jourSemaine = date.getDay();

	if (jourSemaine === 0 || jourSemaine === 6) {
		console.log(`Non, le ${jour} ${mois} ${annee} est un week-end`);
	} else {
		console.log(`Oui, le ${jour} ${mois} ${annee} est un jour travaillé`);
	}
}

jourtravaille(new Date(2020, 0, 1));
jourtravaille(new Date(2020, 6, 14));
jourtravaille(new Date(2020, 10, 7));
jourtravaille(new Date(2020, 9, 17));
