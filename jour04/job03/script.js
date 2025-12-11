const API = 'https://tyradex.vercel.app/api/v1/pokemon';
let allPokemon = [];
let filteredPokemon = [];
let currentPage = 1;
const perPage = 50;

// DOM
const listDiv = document.getElementById('pokemonList');
const searchInput = document.getElementById('searchName');
const typeSelect = document.getElementById('typeSelect');
const generationSelect = document.getElementById('generationSelect');
const pageInfo = document.getElementById('pageInfo');
const btnNext = document.getElementById('nextPage');
const btnPrev = document.getElementById('prevPage');

// modal
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');

// theme
const themeToggle = document.getElementById('themeToggle');

const TYPE_COLORS = {
	Feu: '#f08030',
	Eau: '#6890f0',
	Plante: '#78c850',
	Électrik: '#f8d030',
	Glace: '#98d8d8',
	Combat: '#c03028',
	Poison: '#a040a0',
	Sol: '#e0c068',
	Vol: '#a890f0',
	Psy: '#f85888',
	Insecte: '#a8b820',
	Roche: '#b8a038',
	Spectre: '#705898',
	Dragon: '#7038f8',
	Ténèbres: '#705848',
	Acier: '#b8b8d0',
	Fée: '#ee99ac',
	Normal: '#A8A878',
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
	try {
		const res = await fetch(API);
		allPokemon = await res.json();
	} catch (e) {
		console.error('fetch error', e);
		allPokemon = [];
	}
	buildFilters();
	filteredPokemon = [...allPokemon];
	displayPage();
}

// Build filters
function buildFilters() {
	const typesSet = new Set();
	const genSet = new Set();
	allPokemon.forEach((p) => {
		if (Array.isArray(p.types)) p.types.forEach((t) => t?.name && typesSet.add(t.name));
		if (p.generation != null) genSet.add(p.generation);
	});

	Array.from(typesSet)
		.sort()
		.forEach((t) => {
			const opt = document.createElement('option');
			opt.value = t;
			opt.textContent = t;
			typeSelect.appendChild(opt);
		});

	Array.from(genSet)
		.sort((a, b) => a - b)
		.forEach((g) => {
			const opt = document.createElement('option');
			opt.value = g;
			opt.textContent = 'Génération ' + g;
			generationSelect.appendChild(opt);
		});
}

function applyFilters() {
	const nameQ = (searchInput.value || '').toLowerCase();
	const typeQ = typeSelect.value;
	const genQ = generationSelect.value;

	filteredPokemon = allPokemon.filter((p) => {
		const nameFr = p.name?.fr?.toLowerCase() || p.name?.en?.toLowerCase() || '';
		const matchName = nameFr.includes(nameQ);
		const matchType = !typeQ || (Array.isArray(p.types) && p.types.some((t) => t?.name === typeQ));
		const matchGen = !genQ || String(p.generation) === String(genQ);
		return matchName && matchType && matchGen;
	});
	currentPage = 1;
	displayPage();
}

function displayPage() {
	listDiv.innerHTML = '';
	const total = filteredPokemon.length;
	const totalPages = Math.max(1, Math.ceil(total / perPage));
	if (currentPage > totalPages) currentPage = totalPages;

	const start = (currentPage - 1) * perPage;
	const end = start + perPage;
	const page = filteredPokemon.slice(start, end);

	page.forEach((p) => {
		const card = document.createElement('div');
		card.className = 'pokemon-card';

		const primaryType = p.types?.[0]?.name || 'Normal';
		const bg = TYPE_COLORS[primaryType] || '#7b7b7b';
		card.style.borderTop = `6px solid ${bg}`;

		const imgSrc = p.sprites?.regular || 'https://via.placeholder.com/120?text=No+Img';
		const nameFr = p.name?.fr || p.name?.en || '???';
		const typesHtml = p.types?.map((t) => `<span class="type-badge" style="background:${TYPE_COLORS[t.name] || '#666'}">${t.name}</span>`).join(' ') || '<span style="opacity:0.6">—</span>';

		card.innerHTML = `
			<img class="sprite" src="${imgSrc}" alt="${nameFr}" style="max-width:100%; height:auto;">
			<h3>${nameFr}</h3>
			<div class="types">${typesHtml}</div>
		`;

		card.addEventListener('click', () => openModal(p));
		listDiv.appendChild(card);

		setTimeout(() => card.classList.add('show'), 50);
	});

	pageInfo.textContent = `Page ${currentPage} / ${totalPages} — ${total} pokémon(s) trouvé(s)`;
	btnPrev.disabled = currentPage <= 1;
	btnNext.disabled = currentPage >= totalPages;
}

// Pagination events
btnNext.addEventListener('click', () => {
	currentPage++;
	displayPage();
});
btnPrev.addEventListener('click', () => {
	currentPage--;
	displayPage();
});

// Filters events
searchInput.addEventListener('input', debounce(applyFilters, 200));
typeSelect.addEventListener('change', applyFilters);
generationSelect.addEventListener('change', applyFilters);

// Modal
function openModal(p) {
	modalBody.innerHTML = '';
	modal.classList.remove('hidden');

	// Construire le HTML
	modalBody.innerHTML = buildModalHtml(p);

	// Ajouter le canvas pour le radar chart
	const canvas = document.createElement('canvas');
	canvas.id = 'statsRadar';
	modalBody.appendChild(canvas);

	// Construire le radar chart
	const ctx = canvas.getContext('2d');
	if (window.statsChart) window.statsChart.destroy();
	const labels = ['HP', 'ATK', 'DEF', 'SPE_ATK', 'SPE_DEF', 'VIT'];
	const data = [p.stats.hp, p.stats.atk, p.stats.def, p.stats.spe_atk, p.stats.spe_def, p.stats.vit];
	window.statsChart = new Chart(ctx, {
		type: 'radar',
		data: { labels, datasets: [{ label: p.name.fr, data, backgroundColor: 'rgba(78,161,255,0.3)', borderColor: 'rgba(78,161,255,0.8)', borderWidth: 2, pointBackgroundColor: 'rgba(78,161,255,0.8)' }] },
		options: { scales: { r: { beginAtZero: true, max: 180 } } },
	});
}

closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => {
	if (e.target === modal) modal.classList.add('hidden');
});

// Radar chart
function buildRadar(p) {
	const canvas = document.createElement('canvas');
	canvas.id = 'statsRadar';
	modalBody.appendChild(canvas);
	const ctx = canvas.getContext('2d');
	if (window.statsChart) window.statsChart.destroy();
	const labels = ['HP', 'ATK', 'DEF', 'SPE_ATK', 'SPE_DEF', 'VIT'];
	const data = [p.stats.hp, p.stats.atk, p.stats.def, p.stats.spe_atk, p.stats.spe_def, p.stats.vit];
	window.statsChart = new Chart(ctx, {
		type: 'radar',
		data: { labels, datasets: [{ label: p.name.fr, data, backgroundColor: 'rgba(78,161,255,0.3)', borderColor: 'rgba(78,161,255,0.8)', borderWidth: 2, pointBackgroundColor: 'rgba(78,161,255,0.8)' }] },
		options: { scales: { r: { beginAtZero: true, max: 180 } } },
	});
}

// Build modal HTML
function buildModalHtml(p) {
	const img = p.sprites?.regular || 'https://via.placeholder.com/150?text=No+Img';
	const nameFr = p.name?.fr || p.name?.en || '???';
	const types = p.types?.map((t) => `<span class="type-badge" style="background:${TYPE_COLORS[t.name] || '#555'}">${t.name}</span>`).join(' ') || '<span style="opacity:0.6">—</span>';

	const stats = p.stats
		? Object.entries(p.stats)
				.map(
					([k, v]) => `
					<div class="modal-section">
						<strong>${k.toUpperCase()} : ${v ?? '—'}</strong>
						<div class="stat-bar-container">
							<div class="stat-bar" style="width:${((v ?? 0) / 180) * 100}%;"></div>
						</div>
					</div>
				`,
				)
				.join('')
		: '<div class="modal-section">Aucune stat disponible</div>';

	const resistances = p.resistances?.map((r) => `<div class="res-item">${r.name || '—'}<br><strong>x${r.multiplier ?? 1}</strong></div>`).join(' ') || '<div class="res-item">—</div>';

	return `
		<div>
			<img src="${img}" alt="${nameFr}" style="max-width:100%; height:auto;">
		</div>
		<div>
			<h2>${nameFr} — #${p.pokedex_id ?? '—'}</h2>
			<div class="modal-section">
				<h3>Types</h3>
				${types}
			</div>
			<div class="modal-section">
				<h3>Détails</h3>
				<div><strong>Catégorie :</strong> ${p.category || '—'}</div>
				<div><strong>Génération :</strong> ${p.generation ?? '—'}</div>
				<div><strong>Taille :</strong> ${p.height || '—'}</div>
				<div><strong>Poids :</strong> ${p.weight || '—'}</div>
			</div>
			<div class="modal-section">
				<h3>Stats</h3>
				${stats}
			</div>
			<div class="modal-section">
				<h3>Résistances</h3>
				<div class="res-table">${resistances}</div>
			</div>
		</div>
	`;
}

// Debounce
function debounce(fn, ms = 200) {
	let id;
	return (...args) => {
		clearTimeout(id);
		id = setTimeout(() => fn(...args), ms);
	};
}

// Dark / Light toggle
themeToggle.addEventListener('click', () => document.body.classList.toggle('light'));
