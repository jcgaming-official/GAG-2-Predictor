/* ==========================================================================
   SORTING LOGIC MODULE (DECOUPLED LOGIC)
   ========================================================================== */

(function() {
    // Local helper to get current unix timestamp
    const getNow = () => Math.floor(Date.now() / 1000);

    // Rarity ranking lookup for sorting
    const LOCAL_RANK = { 
        Common: 1, 
        Uncommon: 2, 
        Rare: 3, 
        Epic: 4, 
        Legendary: 5, 
        Mythic: 6, 
        Super: 7, 
        Divine: 8, 
        Prismatic: 9 
    };

    // Shared custom view arrays
    window.mySortedView = [];
    window.myLastWindow = 0;

    // Helper to highlight active stock cards
    function highlightActiveStock() {
        const rowsElements = document.querySelectorAll('#rows .row');
        if (rowsElements.length > 0 && window.mySortedView && window.evalItem) {
            rowsElements.forEach((row, idx) => {
                const item = window.mySortedView[idx];
                if (item) {
                    const ev = window.evalItem(item);
                    const inStock = ev && ev.cur && ev.cur.q > 0;
                    if (inStock) {
                        row.classList.add('in-stock-highlight');
                    } else {
                        row.classList.remove('in-stock-highlight');
                    }
                }
            });
        }
    }

    // Override Render function to support custom sorting
    const originalSortRender = window.render;
    window.render = function() {
        // Call original render first to allow it to initialize TAB, header state, and default UI
        if (originalSortRender) {
            originalSortRender();
        }

        // Only apply custom sorting for Seeds and Gears tabs
        if (window.TAB !== 'seeds' && window.TAB !== 'gears') {
            return;
        }

        const sortSelect = document.getElementById('sortSelect');
        const sortMode = sortSelect ? sortSelect.value : 'default';

        const list = window.DATA ? (window.DATA[window.TAB] || []) : [];
        if (!list.length) return;

        let sortedList = list.slice();

        // Sort data based on selected mode
        if (sortMode === 'default') {
            // Default sort: rarity rank (low to high), then price (low to high)
            sortedList.sort((a, b) => {
                const rankA = LOCAL_RANK[a.rarity] || 99;
                const rankB = LOCAL_RANK[b.rarity] || 99;
                if (rankA !== rankB) return rankA - rankB;
                return a.price - b.price;
            });
        } else if (sortMode === 'instock') {
            // In-stock items first, then fallback to default sort
            sortedList.sort((a, b) => {
                const evA = window.evalItem ? window.evalItem(a) : null;
                const evB = window.evalItem ? window.evalItem(b) : null;
                const inStockA = evA && evA.cur && evA.cur.q > 0 ? 1 : 0;
                const inStockB = evB && evB.cur && evB.cur.q > 0 ? 1 : 0;

                if (inStockA !== inStockB) {
                    return inStockB - inStockA; // in-stock (1) comes before out-of-stock (0)
                }

                // Fallback to default sort
                const rankA = LOCAL_RANK[a.rarity] || 99;
                const rankB = LOCAL_RANK[b.rarity] || 99;
                if (rankA !== rankB) return rankA - rankB;
                return a.price - b.price;
            });
        } else if (sortMode === 'rarity-asc') {
            // Rarity: Low to High
            sortedList.sort((a, b) => (LOCAL_RANK[a.rarity] || 99) - (LOCAL_RANK[b.rarity] || 99) || a.price - b.price);
        } else if (sortMode === 'rarity-desc') {
            // Rarity: High to Low
            sortedList.sort((a, b) => (LOCAL_RANK[b.rarity] || 99) - (LOCAL_RANK[a.rarity] || 99) || b.price - a.price);
        } else if (sortMode === 'price-asc') {
            // Price: Low to High
            sortedList.sort((a, b) => a.price - b.price || (LOCAL_RANK[a.rarity] || 99) - (LOCAL_RANK[b.rarity] || 99));
        } else if (sortMode === 'price-desc') {
            // Price: High to Low
            sortedList.sort((a, b) => b.price - a.price || (LOCAL_RANK[b.rarity] || 99) - (LOCAL_RANK[a.rarity] || 99));
        }

        window.mySortedView = sortedList;

        // Rebuild cards in rows container
        const rows = document.getElementById('rows');
        const empty = document.getElementById('empty');
        if (rows && window.buildRow) {
            rows.innerHTML = '';
            if (!window.mySortedView.length) {
                if (empty) empty.classList.remove('hidden');
            } else {
                if (empty) empty.classList.add('hidden');
                window.mySortedView.forEach(item => {
                    rows.appendChild(window.buildRow(item));
                });
            }
        }

        // Highlight stock items
        highlightActiveStock();
    };

    // Override tickCards function to read from custom mySortedView
    window.tickCards = function() {
        if (window.TAB === 'weather') {
            if (window.tickWeather) {
                window.tickWeather();
            }
            return;
        }

        const t = getNow();
        const period = (window.DATA && window.DATA.period) ? window.DATA.period : 300;
        const w = Math.floor(t / period);

        // Re-render when time window changes to update stock counts
        if (w !== window.myLastWindow) {
            window.myLastWindow = w;
            window.render();
            return;
        }

        // Tick countdowns for current sorted view
        const rowEls = document.querySelectorAll('#rows .row');
        if (rowEls.length > 0 && window.mySortedView && window.evalItem && window.shortDur) {
            rowEls.forEach((el, i) => {
                const item = window.mySortedView[i];
                if (!item) return;
                const ev = window.evalItem(item);
                const cd = el.querySelector('.cd');
                if (cd && ev.nxt) {
                    cd.textContent = window.shortDur(ev.nxt.t - t);
                }
            });
        }
    };

    // Initialize myLastWindow on load
    const initialPeriod = (window.DATA && window.DATA.period) ? window.DATA.period : 300;
    window.myLastWindow = Math.floor(getNow() / initialPeriod);

    // Bind event listeners to sort selection dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.onchange = () => {
            window.render();
        };
    }
})();
