<!DOCTYPE html>
<html lang="fr">

<head>
        <meta charset="UTF-8">
        <title>Tyradex Pokédex</title>
        <link rel="stylesheet" href="style.css">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>

        <header>
                <h1>Tyradex Pokédex</h1>
                <button id="themeToggle">🌙 / ☀️ Mode</button>
        </header>

        <section id="filters">
                <input type="text" id="searchName" placeholder="Recherche par nom...">
                <select id="typeSelect">
                        <option value="">Tous les types</option>
                </select>
                <select id="generationSelect">
                        <option value="">Toutes les générations</option>
                </select>
        </section>

        <section id="pokemonList" class="grid"></section>

        <section id="pagination">
                <button id="prevPage">Précédent</button>
                <span id="pageInfo"></span>
                <button id="nextPage">Suivant</button>
        </section>

        <!-- Modal Pokémon -->
        <div id="modal" class="hidden">
                <div class="modal-content">
                        <button id="closeModal">✖</button>
                        <div id="modalBody"></div>
                </div>
        </div>

        <script src="script.js"></script>
</body>

</html>