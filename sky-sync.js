/* ==========================================================================
   DAY/NIGHT BACKGROUND SIMULATION & HELPERS
   ========================================================================== */
const skyKeyframes = [
    { t: 0,   top: '#8fd6ef', bottom: '#cdeedd', sunL: 10, sunT: 60, sunO: 1, moonL: 90, moonT: 120, moonO: 0, stars: 0, glow: 0.2 },
    { t: 225, top: '#8fd6ef', bottom: '#cdeedd', sunL: 50, sunT: 15, sunO: 1, moonL: 50, moonT: 120, moonO: 0, stars: 0, glow: 0.5 },
    { t: 450, top: '#8fd6ef', bottom: '#cdeedd', sunL: 90, sunT: 60, sunO: 1, moonL: 10, moonT: 120, moonO: 0, stars: 0, glow: 0.2 },
    { t: 465, top: '#3a2d54', bottom: '#ff7e5f', sunL: 95, sunT: 75, sunO: 0.5, moonL: 20, moonT: 90,  moonO: 0, stars: 0.2, glow: 0.1 },
    { t: 480, top: '#0c1424', bottom: '#162136', sunL: 100, sunT: 100, sunO: 0, moonL: 10, moonT: 60,  moonO: 1, stars: 0.5, glow: 0 },
    { t: 540, top: '#06080e', bottom: '#111625', sunL: 50, sunT: 120, sunO: 0, moonL: 50, moonT: 15,  moonO: 1, stars: 1,   glow: 0 },
    { t: 600, top: '#0c1424', bottom: '#162136', sunL: 10, sunT: 100, sunO: 0, moonL: 90, moonT: 60,  moonO: 1, stars: 0.5, glow: 0 }
];

function parseColor(hex) {
    const num = parseInt(hex.slice(1), 16);
    return [num >> 16, (num >> 8) & 0xff, num & 0xff];
}
function fmtColor(rgb) {
    return `rgb(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])})`;
}
function lerpColor(c1, c2, f) {
    const r1 = parseColor(c1), r2 = parseColor(c2);
    return fmtColor([
        r1[0] + (r2[0] - r1[0]) * f,
        r1[1] + (r2[1] - r1[1]) * f,
        r1[2] + (r2[2] - r1[2]) * f
    ]);
}

window.updateSkyBackground = function() {
    if (typeof now !== 'function' || typeof DATA === 'undefined' || !DATA || !DATA.weather) return;
    const t = now();
    const W = DATA.weather; if(!W || !W.clen) return;
    const cyc = Math.floor(t / W.clen);
    const into = t - cyc*W.clen;
    
    // Find active keyframe segment
    let k1 = skyKeyframes[0], k2 = skyKeyframes[skyKeyframes.length - 1];
    for (let i = 0; i < skyKeyframes.length - 1; i++) {
        if (into >= skyKeyframes[i].t && into <= skyKeyframes[i+1].t) {
            k1 = skyKeyframes[i];
            k2 = skyKeyframes[i+1];
            break;
        }
    }
    
    const f = (into - k1.t) / (k2.t - k1.t || 1);
    
    const skyTop = lerpColor(k1.top, k2.top, f);
    const skyBottom = lerpColor(k1.bottom, k2.bottom, f);
    const sunL = k1.sunL + (k2.sunL - k1.sunL) * f;
    const sunT = k1.sunT + (k2.sunT - k1.sunT) * f;
    const sunO = k1.sunO + (k2.sunO - k1.sunO) * f;
    const moonL = k1.moonL + (k2.moonL - k1.moonL) * f;
    const moonT = k1.moonT + (k2.moonT - k1.moonT) * f;
    const moonO = k1.moonO + (k2.moonO - k1.moonO) * f;
    const stars = k1.stars + (k2.stars - k1.stars) * f;
    const glow = k1.glow + (k2.glow - k1.glow) * f;
    
    const grad = document.querySelector('[data-sky-grad]');
    if (grad) grad.style.background = `linear-gradient(180deg, ${skyTop} 0%, ${skyBottom} 100%)`;
    
    const sunEl = document.querySelector('[data-sky-sun]');
    if (sunEl) {
        sunEl.style.left = `${sunL}%`;
        sunEl.style.top = `${sunT}%`;
        sunEl.style.opacity = sunO;
    }
    
    const moonEl = document.querySelector('[data-sky-moon]');
    if (moonEl) {
        moonEl.style.left = `${moonL}%`;
        moonEl.style.top = `${moonT}%`;
        moonEl.style.opacity = moonO;
    }
    
    const starsEl = document.querySelector('[data-sky-stars]');
    if (starsEl) starsEl.style.opacity = stars;
    
    const glowEl = document.querySelector('[data-sky-glow]');
    if (glowEl) glowEl.style.opacity = glow;

    // Dynamically toggle dark/light theme based on active nightness
    if (typeof weatherAt === 'function') {
        const cur = weatherAt(t);
        if (cur) {
            const isNight = cur.phaseName === 'Night';
            const themeMode = isNight ? 'dark' : 'light';
            if (document.documentElement.dataset.ui !== themeMode) {
                document.documentElement.dataset.ui = themeMode;
            }
        }
    }
}

window.getPhaseIcon = function(name) {
    if (name === 'Day') {
        return `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="2"/></svg>`;
    } else if (name === 'Sunset') {
        return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 17a4 4 0 0 0-8 0"/><path d="M2 20h20"/><path d="M12 3v6l-3-3m6 0l-3 3"/><path d="M4 13h2m12 0h2"/></svg>`;
    } else {
        return `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;
    }
}

// Generate stars
const starContainer = document.querySelector('[data-sky-stars]');
if (starContainer) {
    function q(t){let e=t+1;return()=>(e=e*1103515245+12345&2147483647,e/2147483647)}
    const t=q(42),e=document.createDocumentFragment();
    for(let s=0;s<36;s++){
        const o=document.createElement("span"),c=1+t()*2;
        o.className="star",o.style.left=`${t()*100}%`,o.style.top=`${t()*55}%`,o.style.width=`${c}px`,o.style.height=`${c}px`,o.style.setProperty("--tw",`${1.8+t()*2.4}s`);
        e.appendChild(o);
    }
    starContainer.appendChild(e);
}

// Hook into window.tickGlobal to sync sky background and update the weather phase badge
const oldTickGlobal = window.tickGlobal;
window.tickGlobal = function() {
    if (oldTickGlobal) oldTickGlobal();
    if (typeof window.updateSkyBackground === 'function') {
        window.updateSkyBackground();
    }
    
    const activeTab = window.TAB || (typeof TAB !== 'undefined' ? TAB : 'seeds');
    const badge = document.getElementById('weatherPhaseBadge');
    if (activeTab === 'weather') {
        if (typeof weatherAt === 'function' && typeof now === 'function') {
            const cur = weatherAt(now());
            if (badge && cur) {
                badge.style.display = 'inline-flex';
                const nextMap = { 'Day': 'Sunset', 'Sunset': 'Night', 'Night': 'Day' };
                const nextName = nextMap[cur.phaseName] || 'Day';
                const phaseTextEl = document.getElementById('phaseText');
                const phaseIconEl = document.getElementById('phaseIcon');
                if (phaseTextEl && typeof clock === 'function') {
                    phaseTextEl.innerHTML = `${cur.phaseName} &bull; ${nextName} in ${clock(cur.secsLeft)}`;
                }
                if (phaseIconEl && typeof window.getPhaseIcon === 'function') {
                    phaseIconEl.innerHTML = window.getPhaseIcon(cur.phaseName);
                }
            }
        }
    } else if (activeTab !== 'pets') {
        if (badge) badge.style.display = 'none';
    }
};

// Also trigger updateSkyBackground initially once
if (typeof window.updateSkyBackground === 'function') {
    window.updateSkyBackground();
}
