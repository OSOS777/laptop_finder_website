import { fetchLaptops } from './api.js';
import { initTheme } from './ui.js';
import { getFavorites } from './storage.js';

initTheme();

const loadHomePageStats = async () => {
    const laptops = await fetchLaptops();
    const favorites = getFavorites();

    if (!laptops || laptops.length === 0) return;

    const lowestPrice = laptops.reduce((min, laptop) => laptop.price < min ? laptop.price : min, laptops[0].price);

    document.getElementById('stat-total').textContent = laptops.length;
    document.getElementById('stat-price').textContent = `$${lowestPrice}`;
    document.getElementById('stat-favs').textContent = favorites.length;
};

document.addEventListener('DOMContentLoaded', loadHomePageStats);