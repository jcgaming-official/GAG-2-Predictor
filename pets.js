/* ==========================================================================
   RAREST PETS INDEX MODULE (DECOUPLED LOGIC)
   ========================================================================== */

const PETS_DATA = [
    { rank: "✦", name: "Mega Rainbow Black Dragon", rarity: "Super", size: "Mega", rainbow: true, exist: null, odds: "???,???,???,???", image: "black-dragon-huge" },
    { rank: "1", name: "Mega Rainbow Unicorn", rarity: "Mythic", size: "Mega", rainbow: true, exist: 1, odds: "50,000,000", image: "unicorn-huge" },
    { rank: "2", name: "Mega Rainbow Bee", rarity: "Legendary", size: "Mega", rainbow: true, exist: 1, odds: "50,000,000", image: "bee-huge" },
    { rank: "3", name: "Mega Rainbow Robin", rarity: "Legendary", size: "Mega", rainbow: true, exist: 1, odds: "50,000,000", image: "robin-huge" },
    { rank: "4", name: "Rainbow Bear", rarity: "Mythic", size: "Normal", rainbow: true, exist: 2, odds: "25,000,000", image: "bear" },
    { rank: "5", name: "Mega Raccoon", rarity: "Super", size: "Mega", rainbow: false, exist: 3, odds: "17,000,000", image: "raccoon-huge" },
    { rank: "6", name: "Mega Bear", rarity: "Mythic", size: "Mega", rainbow: false, exist: 4, odds: "13,000,000", image: "bear-huge" },
    { rank: "7", name: "Big Rainbow Turtle", rarity: "Rare", size: "Big", rainbow: true, exist: 4, odds: "13,000,000", image: "turtle-big" },
    { rank: "8", name: "Mega Rainbow Frog", rarity: "Common", size: "Mega", rainbow: true, exist: 7, odds: "7,100,000", image: "frog-huge" },
    { rank: "9", name: "Mega Unicorn", rarity: "Mythic", size: "Mega", rainbow: false, exist: 9, odds: "5,600,000", image: "unicorn-huge" },
    { rank: "10", name: "Big Rainbow Owl", rarity: "Uncommon", size: "Big", rainbow: true, exist: 9, odds: "5,600,000", image: "owl-big" },
    { rank: "11", name: "Mega Rainbow Deer", rarity: "Rare", size: "Mega", rainbow: true, exist: 11, odds: "4,500,000", image: "deer-huge" },
    { rank: "12", name: "Mega Rainbow Bunny", rarity: "Common", size: "Mega", rainbow: true, exist: 11, odds: "4,500,000", image: "bunny-huge" },
    { rank: "13", name: "Rainbow Monkey", rarity: "Mythic", size: "Normal", rainbow: true, exist: 13, odds: "3,800,000", image: "monkey" },
    { rank: "14", name: "Mega Turtle", rarity: "Rare", size: "Mega", rainbow: false, exist: 19, odds: "2,600,000", image: "turtle-huge" },
    { rank: "15", name: "Big Rainbow Robin", rarity: "Legendary", size: "Big", rainbow: true, exist: 23, odds: "2,200,000", image: "robin-big" },
    { rank: "16", name: "Big Rainbow Bee", rarity: "Legendary", size: "Big", rainbow: true, exist: 28, odds: "1,800,000", image: "bee-big" },
    { rank: "17", name: "Rainbow Raccoon", rarity: "Super", size: "Normal", rainbow: true, exist: 33, odds: "1,500,000", image: "raccoon" },
    { rank: "18", name: "Rainbow Unicorn", rarity: "Mythic", size: "Normal", rainbow: true, exist: 39, odds: "1,300,000", image: "unicorn" },
    { rank: "19", name: "Big Monkey", rarity: "Mythic", size: "Big", rainbow: false, exist: 42, odds: "1,200,000", image: "monkey-big" },
    { rank: "20", name: "Big Raccoon", rarity: "Super", size: "Big", rainbow: false, exist: 53, odds: "940,000", image: "raccoon-big" },
    { rank: "21", name: "Big Bear", rarity: "Mythic", size: "Big", rainbow: false, exist: 69, odds: "720,000", image: "bear-big" },
    { rank: "22", name: "Rainbow Golden Dragonfly", rarity: "Mythic", size: "Normal", rainbow: true, exist: 73, odds: "680,000", image: "golden-dragonfly" },
    { rank: "23", name: "Mega Ice Serpent", rarity: "Super", size: "Mega", rainbow: false, exist: 75, odds: "670,000", image: "ice-serpent-huge" },
    { rank: "24", name: "Mega Rainbow Ice Serpent", rarity: "Super", size: "Mega", rainbow: true, exist: 76, odds: "660,000", image: "ice-serpent-huge" },
    { rank: "25", name: "Big Rainbow Ice Serpent", rarity: "Super", size: "Big", rainbow: true, exist: 106, odds: "470,000", image: "ice-serpent-big" }
];

let currentPetFilter = 'all';

function renderPets() {
    const list = document.getElementById('petsList');
    const empty = document.getElementById('petsEmpty');
    if (!list) return;
    list.innerHTML = '';

    let visibleCount = 0;

    PETS_DATA.forEach(pet => {
        let show = false;
        if (currentPetFilter === 'all') {
            show = true;
        } else if (currentPetFilter === 'normal') {
            show = (pet.size === 'Normal' && !pet.rainbow);
        } else if (currentPetFilter === 'rainbow') {
            show = pet.rainbow;
        } else if (currentPetFilter === 'big') {
            show = (pet.size === 'Big');
        } else if (currentPetFilter === 'mega') {
            show = (pet.size === 'Mega');
        }

        if (!show) return;

        visibleCount++;

        const row = document.createElement('li');
        const isLegendStyle = ['super', 'mythic', 'legendary'].includes(pet.rarity.toLowerCase());
        row.className = 'prp__row' + (isLegendStyle ? ' prp__row--legend' : '');
        row.style.setProperty('--rar', `var(--rar-${pet.rarity.toLowerCase()})`);

        let rankHtml = pet.rank === '✦'
            ? `<span class="prp__rank" style="font-size:1.2rem;">✦</span>`
            : `<span class="prp__rank">${pet.rank}</span>`;

        const avatarClass = 'prp__avatar' + (pet.rainbow ? ' is-rainbow' : '');
        const badgeHtml = pet.size === 'Mega'
            ? `<span class="prp__badge">MEGA</span>`
            : (pet.size === 'Big' ? `<span class="prp__badge">BIG</span>` : '');
        const imgSrc = `https://gag.gg/pets/${pet.image}.png`;
        const existHtml = pet.exist !== null ? `<span class="prp__count">${pet.exist} exist</span>` : '';

        const isZeroScore = pet.odds.includes('?');
        const scoreClass = 'prp__score' + (isZeroScore ? ' prp__score--zero' : '');

        row.innerHTML = `
            ${rankHtml}
            <div class="${avatarClass}">
                <img class="prp__img" src="${imgSrc}" alt="${pet.name}" loading="lazy">
                ${badgeHtml}
            </div>
            <div class="prp__body">
                <div class="prp__meta">
                    <div class="prp__name">${pet.name}</div>
                    <div class="prp__subline">
                        <span class="prp__rartag" style="--rar: var(--rar-${pet.rarity.toLowerCase()})">${pet.rarity}</span>
                        ${existHtml}
                    </div>
                </div>
                <div class="${scoreClass}">1 in ${pet.odds}</div>
            </div>
        `;

        list.appendChild(row);
    });

    if (visibleCount === 0) {
        empty.classList.remove('hidden');
    } else {
        empty.classList.add('hidden');
    }
}

// --------------------------------------------------------------------------
// DECOUPLED CONTROLLER OVERRIDES
// --------------------------------------------------------------------------

// Store references to the original controller functions
const originalSetTab = window.setTab;
const originalRender = window.render;
const originalTickGlobal = window.tickGlobal;

// Override Tab Switcher logic
window.setTab = function (tab) {
    window.TAB = tab; // Set global active tab tracker

    // Call original setTab to update script-scoped TAB and toggle standard classes
    if (originalSetTab) {
        originalSetTab(tab);
    }

    // Toggle active state for standard tabs using original elements
    const tSeeds = document.getElementById('tabSeeds');
    const tGears = document.getElementById('tabGears');
    const tWeather = document.getElementById('tabWeather');
    const tPets = document.getElementById('tabPets');

    if (tSeeds) tSeeds.classList.toggle('active', tab === 'seeds');
    if (tGears) tGears.classList.toggle('active', tab === 'gears');
    if (tWeather) tWeather.classList.toggle('active', tab === 'weather');
    if (tPets) tPets.classList.toggle('active', tab === 'pets');

    window.lastWKey = '';
    window.render();
    window.tickGlobal();
};

// Override Render loop to route layout components
window.render = function () {
    const gridSec = document.querySelector('.grid-section');
    const petsContainer = document.getElementById('petsContainer');
    const shopHead = document.getElementById('shopHead');
    const countdownVal = document.getElementById('globalCountdown');

    if (window.TAB === 'pets') {
        // Render pets page index elements
        if (gridSec) gridSec.classList.add('hidden');
        if (petsContainer) petsContainer.classList.remove('hidden');
        if (shopHead) {
            shopHead.classList.remove('hidden');
            shopHead.style.display = '';
            shopHead.classList.remove('gears', 'weather', 'pets');
            shopHead.classList.add('pets');
        }

        // Setup header titles and icons manually
        const shopTitle = document.getElementById('shopTitle');
        if (shopTitle) shopTitle.textContent = 'Rarest Pets';

        const headLabel = document.getElementById('headLabel');
        if (headLabel) headLabel.textContent = 'Data updated as of June 29, 2026';

        if (countdownVal) {
            countdownVal.textContent = 'Updated';
            countdownVal.style.color = '#10b981'; // Sleek green active color
        }

        const badge = document.getElementById('weatherPhaseBadge');
        if (badge) badge.style.display = 'none';

        const leaf = document.getElementById('leafIcon');
        const gi = document.getElementById('gearIcon');
        if (leaf) leaf.style.display = 'none';
        if (gi) {
            gi.style.display = '';
            gi.src = 'logo_raccoon.png';
        }

        renderPets();
        return;
    }

    // Switch layout components back to active predictor grids
    if (petsContainer) petsContainer.classList.add('hidden');
    if (gridSec) gridSec.classList.remove('hidden');
    if (shopHead) {
        shopHead.classList.remove('pets');
    }
    if (countdownVal) {
        countdownVal.style.color = ''; // Reset to default theme color
    }

    if (originalRender) {
        originalRender();
    }
};

// Override Global header timer loop
window.tickGlobal = function () {
    const badge = document.getElementById('weatherPhaseBadge');
    const countdownVal = document.getElementById('globalCountdown');

    if (window.TAB === 'pets') {
        // Keep header ticking updated text and updates sky backgrounds
        if (window.updateSkyBackground) {
            window.updateSkyBackground();
        }

        if (countdownVal) {
            countdownVal.textContent = 'Updated';
            countdownVal.style.color = '#10b981';
        }

        if (badge) badge.style.display = 'none';
        return;
    }

    if (countdownVal) {
        countdownVal.style.color = ''; // Reset to default theme color
    }

    if (originalTickGlobal) {
        originalTickGlobal();
    }
};

// Bind onclick event listeners on tab load
const tabPetsBtn = document.getElementById('tabPets');
if (tabPetsBtn) {
    tabPetsBtn.onclick = () => window.setTab('pets');
}

// Bind filter chip handlers
const filters = document.getElementById('petsFilters');
if (filters) {
    filters.querySelectorAll('.prp__chip').forEach(btn => {
        btn.onclick = () => {
            filters.querySelectorAll('.prp__chip').forEach(c => c.classList.remove('is-on'));
            btn.classList.add('is-on');
            currentPetFilter = btn.dataset.filter;
            renderPets();
        };
    });
}
