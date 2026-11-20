import { fetchLaptops } from './api.js';
import { initTheme, createLaptopCard, showToast } from './ui.js';
import { getFavorites, setFavorites } from './storage.js';

let allLaptops = [];
let favorites = [];

initTheme();

const initCatalogue = async () => {
    const container = document.getElementById('laptops-container');
    
    container.innerHTML = `
        <div class="animate-pulse flex flex-col h-[400px] bg-gray-300/30 rounded-2xl"></div>
        <div class="animate-pulse flex flex-col h-[400px] bg-gray-300/30 rounded-2xl"></div>
        <div class="animate-pulse flex flex-col h-[400px] bg-gray-300/30 rounded-2xl"></div>
        <div class="animate-pulse flex flex-col h-[400px] bg-gray-300/30 rounded-2xl"></div>
    `;

    allLaptops = await fetchLaptops();
    favorites = getFavorites();

    if (allLaptops.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-red-500 font-bold text-xl py-12">Failed to load laptop data. Make sure you are running via Live Server.</p>';
        return;
    }

    renderLaptops(allLaptops);
    setupEventListeners();
};

const renderLaptops = (laptopsToRender) => {
    const container = document.getElementById('laptops-container');
    const resultCount = document.getElementById('result-count');
    
    resultCount.textContent = laptopsToRender.length;

    if (laptopsToRender.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-16">
                <p class="text-5xl mb-4">🔍</p>
                <p class="text-2xl font-bold mb-2">No laptops match your filters</p>
                <p class="opacity-70">Try adjusting your filters or clearing the search box.</p>
            </div>
        `;
        return;
    }

    const htmlString = laptopsToRender.map(laptop => {
        const isFav = favorites.some(fav => fav.id === laptop.id);
        return createLaptopCard(laptop, isFav);
    }).join('');

    container.innerHTML = htmlString;
    attachFavoriteEvents();
};

const applyFilters = () => {
    const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();
    const category = document.getElementById('filter-category').value;
    const minRam = Number(document.getElementById('filter-ram').value);
    const maxPrice = Number(document.getElementById('filter-price').value);
    const sortBy = document.getElementById('sort-select').value;

    let filtered = allLaptops.filter(laptop => {
        const matchSearch = 
            laptop.name.toLowerCase().includes(searchTerm) || 
            laptop.brand.toLowerCase().includes(searchTerm);
        const matchCategory = category === 'all' || laptop.category === category;
        const matchRam = laptop.ramGB >= minRam;
        const matchPrice = laptop.price <= maxPrice;
        
        return matchSearch && matchCategory && matchRam && matchPrice;
    });

    if (sortBy !== 'default') {
        filtered = [...filtered].sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'battery-desc') return b.batteryHours - a.batteryHours;
            if (sortBy === 'battery-asc') return a.batteryHours - b.batteryHours;
            if (sortBy === 'weight-asc') return a.weightKg - b.weightKg;
            if (sortBy === 'weight-desc') return b.weightKg - a.weightKg;
            return 0;
        });
    }

    renderLaptops(filtered);
};

const setupEventListeners = () => {
    document.getElementById('search-input').addEventListener('input', applyFilters);
    document.getElementById('filter-category').addEventListener('change', applyFilters);
    document.getElementById('filter-ram').addEventListener('change', applyFilters);
    document.getElementById('sort-select').addEventListener('change', applyFilters);
    
    const priceSlider = document.getElementById('filter-price');
    const priceValue = document.getElementById('price-value');
    priceSlider.addEventListener('input', (e) => {
        priceValue.textContent = e.target.value;
        applyFilters();
    });

    document.getElementById('reset-filters').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-category').value = 'all';
        document.getElementById('filter-ram').value = '0';
        document.getElementById('sort-select').value = 'default';
        priceSlider.value = 3000;
        priceValue.textContent = '3000';
        applyFilters();
        showToast('Filters reset!');
    });
};

const attachFavoriteEvents = () => {
    const favButtons = document.querySelectorAll('.fav-btn');
    favButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const laptopId = Number(e.currentTarget.dataset.id);
            const laptopObj = allLaptops.find(l => l.id === laptopId);
            
            const existingIndex = favorites.findIndex(fav => fav.id === laptopId);
            if (existingIndex > -1) {
                favorites.splice(existingIndex, 1);
                e.currentTarget.textContent = '🤍';
                showToast(`Removed ${laptopObj.name} from Favorites`);
            } else {
                favorites.push(laptopObj);
                e.currentTarget.textContent = '❤️';
                showToast(`Added ${laptopObj.name} to Favorites`);
            }
            
            setFavorites(favorites);
        });
    });
};

document.addEventListener('DOMContentLoaded', initCatalogue);