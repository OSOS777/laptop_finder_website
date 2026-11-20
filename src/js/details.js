import { fetchLaptops } from './api.js';
import { initTheme } from './ui.js';
import { getFavorites, setFavorites, getCompareList, setCompareList } from './storage.js';

initTheme();

const initDetails = async () => {
    const container = document.getElementById('details-container');
    
    const urlParams = new URLSearchParams(window.location.search);
    const laptopId = Number(urlParams.get('id'));

    if (!laptopId) {
        container.innerHTML = `<div class="text-center py-20"><h2 class="text-3xl font-bold text-red-500 mb-4">Oops!</h2><p class="text-xl">No laptop ID provided in the URL.</p></div>`;
        return;
    }

    container.innerHTML = `
        <div class="animate-pulse flex flex-col md:flex-row gap-8 mb-8">
            <div class="w-full md:w-1/2 h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div class="w-full md:w-1/2 space-y-4 py-8">
                <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div class="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full mt-8"></div>
            </div>
        </div>
    `;

    const laptops = await fetchLaptops();
    const laptop = laptops.find(l => l.id === laptopId);

    if (!laptop) {
        container.innerHTML = `<div class="text-center py-20"><h2 class="text-3xl font-bold text-red-500 mb-4">Laptop Not Found</h2><p class="text-xl text-gray-900 dark:text-white">We couldn't find a laptop with this ID.</p></div>`;
        return;
    }

    renderLaptopDetails(laptop, container);
};

const renderLaptopDetails = (laptop, container) => {
    let favorites = getFavorites();
    let isFav = favorites.some(fav => fav.id === laptop.id);

    let compareList = getCompareList();
    let isCompared = compareList.some(c => c.id === laptop.id);

    const compareBtnClass = isCompared 
        ? 'bg-gray-500 hover:bg-gray-600' 
        : 'bg-[var(--color-accent-battery)] hover:opacity-90';
    
    const compareBtnText = isCompared 
        ? '⚖️ Remove from Compare' 
        : '⚖️ Add to Compare';

    container.innerHTML = `
        <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row mb-12">
            <div class="w-full md:w-1/2 bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
                <img src="${laptop.image}" alt="${laptop.name}" class="max-w-full h-auto object-contain rounded-xl hover:scale-105 transition-transform duration-300" onerror="this.src='https://via.placeholder.com/500x400?text=No+Image'">
            </div>
            
            <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
                <span class="text-sm font-bold uppercase tracking-wider text-[var(--color-accent-battery)] mb-2">${laptop.brand} • ${laptop.category}</span>
                <h1 class="text-3xl md:text-5xl font-extrabold mb-4">${laptop.name}</h1>
                <p class="text-4xl font-black text-[var(--color-accent-battery)] mb-6">$${laptop.price}</p>
                <p class="text-lg opacity-80 mb-10 leading-relaxed">${laptop.description}</p>
                
                <div class="flex flex-wrap gap-4 mt-auto">
                    <button id="btn-fav" class="btn-action flex-1 border-2 border-[var(--color-accent-battery)] text-[var(--color-accent-battery)] hover:bg-[var(--color-accent-battery)] hover:text-white flex items-center justify-center gap-2">
                        ${isFav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                    </button>
                    <button id="btn-compare" class="btn-action flex-1 text-white flex items-center justify-center gap-2 ${compareBtnClass}">
                        ${compareBtnText}
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <h2 class="text-2xl font-bold p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">Full Specifications</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <tbody>
                        <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <th class="py-4 px-6 font-bold w-1/3">Processor (CPU)</th>
                            <td class="py-4 px-6">${laptop.cpu}</td>
                        </tr>
                        <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <th class="py-4 px-6 font-bold w-1/3">RAM</th>
                            <td class="py-4 px-6">${laptop.ramGB} GB</td>
                        </tr>
                        <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <th class="py-4 px-6 font-bold w-1/3">Storage</th>
                            <td class="py-4 px-6">${laptop.storageGB} GB SSD</td>
                        </tr>
                        <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <th class="py-4 px-6 font-bold w-1/3">Battery Life</th>
                            <td class="py-4 px-6">${laptop.batteryHours} Hours</td>
                        </tr>
                        <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <th class="py-4 px-6 font-bold w-1/3">Weight</th>
                            <td class="py-4 px-6">${laptop.weightKg} kg</td>
                        </tr>
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <th class="py-4 px-6 font-bold w-1/3">Screen Size</th>
                            <td class="py-4 px-6">${laptop.screenInches} Inches</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const btnFav = document.getElementById('btn-fav');
    btnFav.addEventListener('click', () => {
        favorites = getFavorites();
        const existingIndex = favorites.findIndex(fav => fav.id === laptop.id);
        
        if (existingIndex > -1) {
            favorites.splice(existingIndex, 1);
            btnFav.innerHTML = '🤍 Add to Favorites';
        } else {
            favorites.push(laptop);
            btnFav.innerHTML = '❤️ Remove from Favorites';
        }
        setFavorites(favorites);
    });

    const btnCompare = document.getElementById('btn-compare');
    btnCompare.addEventListener('click', () => {
        compareList = getCompareList();
        const existingIndex = compareList.findIndex(c => c.id === laptop.id);
        
        if (existingIndex > -1) {
            compareList.splice(existingIndex, 1);
            setCompareList(compareList);
            btnCompare.innerHTML = '⚖️ Add to Compare';
            btnCompare.classList.remove('bg-gray-500', 'hover:bg-gray-600');
            btnCompare.classList.add('bg-[var(--color-accent-battery)]', 'hover:opacity-90');
        } else {
            if(compareList.length >= 4) {
                alert('You can only compare up to 4 laptops at a time!');
            } else {
                compareList.push(laptop);
                setCompareList(compareList);
                btnCompare.innerHTML = '⚖️ Remove from Compare';
                btnCompare.classList.remove('bg-[var(--color-accent-battery)]', 'hover:opacity-90');
                btnCompare.classList.add('bg-gray-500', 'hover:bg-gray-600');
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', initDetails);