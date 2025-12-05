const footer = document.querySelector('footer');

window.addEventListener('scroll', () => {
	const scrollTop = window.scrollY; 
	const docHeight = document.body.scrollHeight - window.innerHeight;
	const scrollPercent = (scrollTop / docHeight) * 100;

	footer.style.backgroundColor = `hsl(${scrollPercent * 1.2}, 100%, 50%)`;
});

/*
        job 05
        Créez un fichier style.css. Définissez la taille minimale de votre body à 4096px.
        Ajoutez un <footer> qui prend toute la largeur de votre page en position : fixed en bas
        de votre fenêtre.
        De la même façon qu’une barre de chargement, la couleur du footer doit évoluer en
        fonction du pourcentage de scrolling.
*/
