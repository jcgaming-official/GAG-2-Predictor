/* ==========================================================================
   SEED RESTOCK HISTORY MODULE (DECOUPLED LOGIC)
   ========================================================================== */

// Initialize window.TAB if not already set
if (!window.TAB) {
    window.TAB = 'seeds';
}

// Dynamically extract DATA from script.js since let variables are not exposed on window
if (!window.DATA) {
    window.DATA = null;
    fetch('script.js')
        .then(response => response.text())
        .then(code => {
            const startIdx = code.indexOf('let DATA = ');
            if (startIdx !== -1) {
                const endIdx = code.indexOf(';', startIdx);
                if (endIdx !== -1) {
                    const jsonStr = code.substring(startIdx + 11, endIdx);
                    window.DATA = JSON.parse(jsonStr);
                    // Dynamically correct the price of Super Sprinkler to 3,000,000 (3M)
                    if (window.DATA && window.DATA.gears) {
                        const superSprinkler = window.DATA.gears.find(g => g.name === 'Super Sprinkler');
                        if (superSprinkler) {
                            superSprinkler.price = 3000000;
                            console.log("Seed Restock Module: Corrected Super Sprinkler price to 3,000,000.");
                        }
                    }
                    console.log("Seed Restock Module: Successfully loaded local database.");
                    // Force refresh layout now that DATA is loaded
                    if (window.render) window.render();
                    if (window.tickGlobal) window.tickGlobal();
                }
            }
        })
        .catch(err => console.error("Seed Restock Module: Failed to extract DATA:", err));
}


const RESTOCK_SEEDS = [
    { name: "Tulip", slug: "tulip", rarity: "Uncommon" },
    { name: "Tomato", slug: "tomato", rarity: "Uncommon" },
    { name: "Apple", slug: "apple", rarity: "Uncommon" },
    { name: "Bamboo", slug: "bamboo", rarity: "Rare" },
    { name: "Corn", slug: "corn", rarity: "Rare" },
    { name: "Cactus", slug: "cactus", rarity: "Rare" },
    { name: "Pineapple", slug: "pineapple", rarity: "Rare" },
    { name: "Mushroom", slug: "mushroom", rarity: "Epic" },
    { name: "Green Bean", slug: "green-bean", rarity: "Epic" },
    { name: "Banana", slug: "banana", rarity: "Epic" },
    { name: "Grape", slug: "grape", rarity: "Epic" },
    { name: "Coconut", slug: "coconut", rarity: "Epic" },
    { name: "Mango", slug: "mango", rarity: "Epic" },
    { name: "Dragon Fruit", slug: "dragon-fruit", rarity: "Legendary" },
    { name: "Acorn", slug: "acorn", rarity: "Legendary" },
    { name: "Cherry", slug: "cherry", rarity: "Legendary" },
    { name: "Sunflower", slug: "sunflower", rarity: "Legendary" },
    { name: "Venus Fly Trap", slug: "venus-fly-trap", rarity: "Mythic" },
    { name: "Pomegranate", slug: "pomegranate", rarity: "Mythic" },
    { name: "Poison Apple", slug: "poison-apple", rarity: "Mythic" },
    { name: "Venom Spitter", slug: "venom-spitter", rarity: "Mythic" },
    { name: "Moon Bloom", slug: "moon-bloom", rarity: "Super" },
    { name: "Hypno Bloom", slug: "hypno-bloom", rarity: "Super" },
    { name: "Dragon's Breath", slug: "dragons-breath", rarity: "Super" }
];

const RARITY_COLORS = {
    Common: "#9aa6a0",
    Uncommon: "#5ad15a",
    Rare: "#2f95ff",
    Epic: "#9a55f0",
    Legendary: "#f0a81e",
    Mythic: "#ff5c8a",
    Super: "#27e0c8"
};

// Formats elapsed duration (exactly like the source site)
function formatElapsed(seconds) {
    const t = Math.max(0, Math.floor(seconds));
    const d = Math.floor(t / 86400);
    const h = Math.floor((t % 86400) / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function renderRestockHistory() {
    const list = document.getElementById('restockList');
    if (!list || !window.DATA || !window.DATA.seeds) return;
    list.innerHTML = '';
    
    const nowTimestamp = Math.floor(Date.now() / 1000);
    const anchor = window.DATA.seedAnchor || 0;
    const period = window.DATA.period || 300;
    const currentWindowIdx = Math.floor((nowTimestamp - anchor) / period);
    
    // Create a seed data lookup map from the primary DATABASE
    const dataSeedsMap = new Map(window.DATA.seeds.map(s => [s.name, s]));
    
    RESTOCK_SEEDS.forEach(seed => {
        const item = dataSeedsMap.get(seed.name);
        if (!item || !item.q) return;
        
        // Check if currently in stock
        const inStock = (currentWindowIdx >= 0 && currentWindowIdx < item.q.length) 
            ? (item.q[currentWindowIdx] > 0) 
            : false;
            
        let statusText = '';
        let isStockedClass = '';
        
        if (inStock) {
            statusText = `In stock now ×${item.q[currentWindowIdx]}`;
            isStockedClass = ' is-stocked';
        } else {
            // Find when it was last in stock by scanning backwards
            let lastIdx = -1;
            for (let k = currentWindowIdx - 1; k >= 0; k--) {
                if (item.q[k] > 0) {
                    lastIdx = k;
                    break;
                }
            }
            
            if (lastIdx !== -1) {
                const lastStockedTime = anchor + lastIdx * period;
                const elapsed = nowTimestamp - lastStockedTime;
                statusText = `${formatElapsed(elapsed)} ago`;
            } else {
                statusText = 'Not seen recently';
            }
        }
        
        const row = document.createElement('li');
        row.className = 'srm__row' + isStockedClass;
        row.style.setProperty('--rar', RARITY_COLORS[seed.rarity] || '#9aa6a0');
        
        const imgSrc = `https://gag.gg/seeds/${seed.slug}.png`;
        const rarityCol = RARITY_COLORS[seed.rarity] || '#9aa6a0';
        
        row.innerHTML = `
            <img class="srm__img" src="${imgSrc}" width="42" height="42" alt="${seed.name}" loading="lazy">
            <span class="srm__meta">
                <span class="srm__name">${seed.name}</span>
                <span class="srm__rar" style="color: ${rarityCol};">${seed.rarity}</span>
            </span>
            <span class="srm__timing">
                <span class="srm__since">${statusText}</span>
            </span>
        `;
        
        list.appendChild(row);
    });
}

// Variable to track if modal is open
let restockModalOpen = false;

function openRestockModal() {
    const modal = document.getElementById('restockModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.documentElement.classList.add('srm-modal-open');
        restockModalOpen = true;
        renderRestockHistory();
    }
}

function closeRestockModal() {
    const modal = document.getElementById('restockModal');
    if (modal) {
        modal.classList.add('hidden');
        document.documentElement.classList.remove('srm-modal-open');
        restockModalOpen = false;
    }
}

function tickRestockCountdown() {
    const triggerTimeEl = document.getElementById('restockTriggerTime');
    const modalTimeEl = document.getElementById('restockNextCountdown');
    if (!window.DATA) return;
    
    const nowTimestamp = Math.floor(Date.now() / 1000);
    const anchor = window.DATA.seedAnchor || 0;
    const period = window.DATA.period || 300;
    
    const elapsedInWindow = (nowTimestamp - anchor) % period;
    const secondsLeft = period - elapsedInWindow;
    
    let timeText = '';
    // Reuse original helper formats
    if (window.clock) {
        timeText = window.clock(secondsLeft);
    } else {
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        timeText = `${m}:${s.toString().padStart(2, '0')}`;
    }
    
    if (triggerTimeEl) {
        triggerTimeEl.textContent = timeText;
    }
    if (modalTimeEl) {
        modalTimeEl.textContent = timeText;
    }
}

// --------------------------------------------------------------------------
// DECOUPLED MODULE HOOKS
// --------------------------------------------------------------------------

// Chained Render Override
const originalPetsRender = window.render;
window.render = function() {
    if (originalPetsRender) {
        originalPetsRender();
    }
    
    const triggerBtn = document.getElementById('restockTriggerBtn');
    const sortContainer = document.getElementById('sortControlsContainer');
    const footerControls = document.getElementById('consoleFooterControls');
    
    if (window.TAB === 'seeds') {
        if (footerControls) footerControls.classList.remove('hidden');
        if (triggerBtn) triggerBtn.classList.remove('hidden');
        if (sortContainer) sortContainer.classList.remove('hidden');
        tickRestockCountdown();
    } else if (window.TAB === 'gears') {
        if (footerControls) footerControls.classList.remove('hidden');
        if (triggerBtn) triggerBtn.classList.add('hidden');
        if (sortContainer) sortContainer.classList.remove('hidden');
        closeRestockModal();
    } else {
        if (footerControls) footerControls.classList.add('hidden');
        if (triggerBtn) triggerBtn.classList.add('hidden');
        if (sortContainer) sortContainer.classList.add('hidden');
        closeRestockModal();
    }
};

// Chained tickGlobal Override
const originalPetsTickGlobal = window.tickGlobal;
window.tickGlobal = function() {
    if (originalPetsTickGlobal) {
        originalPetsTickGlobal();
    }
    
    if (window.TAB === 'seeds') {
        tickRestockCountdown();
        if (restockModalOpen) {
            renderRestockHistory(); // Keeps elapsed timers updated in real time inside the modal
        }
    }
};

// Bind Event Listeners
const triggerBtn = document.getElementById('restockTriggerBtn');
if (triggerBtn) {
    triggerBtn.onclick = openRestockModal;
}

const closeBtn = document.getElementById('restockModalCloseBtn');
if (closeBtn) {
    closeBtn.onclick = closeRestockModal;
}

const backdrop = document.getElementById('restockModalCloseBackdrop');
if (backdrop) {
    backdrop.onclick = closeRestockModal;
}

// Support Escape key closure
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && restockModalOpen) {
        closeRestockModal();
    }
});

// Initialize page layout and timers on script load
window.render();
window.tickGlobal();
