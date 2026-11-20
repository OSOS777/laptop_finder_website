import { fetchLaptops } from './api.js';
import { initTheme } from './ui.js';
import { getFavorites } from './storage.js';

initTheme();

const initHome = async () => {
    const laptops = await fetchLaptops();
    if (!laptops || laptops.length === 0) return;
    
    const lowestPrice = laptops.reduce((min, l) => (l.price < min ? l.price : min), laptops[0].price);
    const totalFavs = getFavorites().length;

    document.getElementById('stat-laptops').textContent = laptops.length;
    document.getElementById('stat-lowest').textContent = `$${lowestPrice}`;
    document.getElementById('stat-favs').textContent = totalFavs;
};

document.addEventListener('DOMContentLoaded', initHome);