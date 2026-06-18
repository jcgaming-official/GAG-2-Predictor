# Grow a Garden 2 Stock & Weather Predictor

[![GitHub stars](https://img.shields.io/github/stars/jcgaming-official/GAG-2-Predictor?style=social)](https://github.com/jcgaming-official/GAG-2-Predictor/stargazers)

A premium, modern, and fully responsive dashboard for predicting seed and gear stock restocks, weather schedules, and tracking the rarest pets in Roblox's **Grow a Garden 2**.

⭐ **Support the Project**: If you find this predictor tool helpful, please give the repository a star!

---

## Key Features

- **Live Seed & Gear Shop Predictors**: Displays accurate predictions for upcoming restocks with active countdown indicators for each item.
- **Dynamic CSS Day/Night Sky**: A simulated horizon backdrop matching the exact 600-second in-game server cycle (Day, Sunset, Night) with drifting clouds, twinkling stars, and automatic dark/light theme switching.
- **Rarest Pets Index**: A fully integrated index of the rarest pets (Rainbow, Big, Mega) ranked out of ~30 million gardeners with live filtering.
- **Advanced Sorting Options**: Dynamically sort seeds and gears by default indexing, active in-stock availability, price bounds, or rarity levels.
- **Seed Restock History Modal**: Real-time modal tracking elapsed time since rare seeds last appeared in-game, predicted automatically from the server anchor loops.

---

## Decoupled Architecture (Developer-Friendly & Modular)

The application separates core calculations from visual presentation to make updates painless without touching raw mathematical code:

1. **`script.js` (Pristine Predictor Core)**: Contains the 200KB database of items, anchor window parameters, weather schedules, and raw ticking algorithms. It is kept in its clean original state.
2. **`pets.js` (Rarest Pets Module)**: Standalone script managing the pet database, filtering buttons, and custom layout routing overlays.
3. **`sort.js` (Sorting and Card Ticking)**: Independent script coordinating sorting selections and overrides card ticking so that countdown badges are correctly synchronized with sorted rows.
4. **`restock.js` (Seed Restock History Modal)**: Decoupled logic managing modal state toggling, escape key listeners, dynamic data loading, and elapsed timer formatting.
5. **`style.css` (Premium Design Tokens)**: Global CSS custom properties, grid layouts, animations, and dark/light UI tokens.

---

## Local Setup & Deployment

1. Clone this repository to your local web root directory (e.g. Apache, Nginx, or XAMPP’s `htdocs`):
   ```bash
   git clone https://github.com/jcgaming-official/GAG-2-Predictor.git
   ```
2. Start your local development server. For example, using PHP's built-in server:
   ```bash
   php -S localhost:8080
   ```
3. Open your browser and navigate to `http://localhost:8080`.

---

## Rarity System Details

Items are categorized according to their in-game rarity tiers, styled with harmonic botanical colors:
- ⚪ **Common**
- 🟢 **Uncommon**
- 🔵 **Rare**
- 🟣 **Epic**
- 🟡 **Legendary**
- 🔴 **Mythic**
- 🟡 **Super**
- 🔘 **Divine**

---

## Contributing & Development

- **To update counts, odds, or pet listings**: Modify the dynamic `PETS_DATA` array in `pets.js`.
- **To update seed properties or anchors**: Variables like `DATA.seedAnchor` or item lists are stored inside `script.js`.
- **Styling modifications**: Can be made directly in `style.css`.
