import { initTheme, showToast } from './ui.js';
import { getFavorites, getCompareList, setCompareList } from './storage.js';

initTheme();

const initComparePage = () => {
    const favorites = getFavorites();
    let compareList = getCompareList();

    if (compareList.length === 0 && favorites.length > 0) {
        compareList = favorites.slice(0, 4);
        setCompareList(compareList);
    }

    renderFavoriteChips(favorites, compareList);
    renderCompareTable(compareList);
};

const renderFavoriteChips = (favorites, compareList) => {
    const chipsContainer = document.getElementById('fav-chips');
    const warningEl = document.getElementById('compare-warning');

    if (favorites.length === 0) {
        chipsContainer.innerHTML = `<p class="opacity-70">No saved favorites found. <a href="laptops.html" class="underline text-[var(--color-accent-battery)] font-bold">Add some from the catalogue first!</a></p>`;
        return;
    }

    chipsContainer.innerHTML = favorites.map(laptop => {
        const isSelected = compareList.some(c => c.id === laptop.id);
        const btnStyle = isSelected 
            ? 'bg-[var(--color-accent-battery)] text-white border-transparent' 
            : 'bg-white text-gray-900 border-gray-300 hover:border-[var(--color-accent-battery)]';
        return `
            <button class="chip-btn px-4 py-2 rounded-full border-2 font-semibold text-sm transition cursor-pointer ${btnStyle}" data-id="${laptop.id}">
                ${isSelected ? '✓ ' : '+ '}${laptop.name}
            </button>
        `;
    }).join('');

    document.querySelectorAll('.chip-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.currentTarget.dataset.id);
            let currentCompare = getCompareList();
            const exists = currentCompare.some(c => c.id === id);

            warningEl.classList.add('hidden');

            if (exists) {
                currentCompare = currentCompare.filter(c => c.id !== id);
            } else {
                if (currentCompare.length >= 4) {
                    warningEl.textContent = '⚠️ You can compare a maximum of 4 laptops at once. Remove one first.';
                    warningEl.classList.remove('hidden');
                    showToast('Maximum 4 laptops allowed!');
                    return;
                }
                const laptopToAdd = favorites.find(f => f.id === id);
                if (laptopToAdd) currentCompare.push(laptopToAdd);
            }

            setCompareList(currentCompare);
            renderFavoriteChips(favorites, currentCompare);
            renderCompareTable(currentCompare);
        });
    });
};

// Calculates best values (lowest price/weight, highest RAM/storage/battery) and highlights winners
const renderCompareTable = (compareList) => {
    const container = document.getElementById('compare-container');

    if (compareList.length < 2) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 text-center bg-white/5 rounded-2xl border border-gray-400/20">
                <span class="text-5xl mb-3">⚖️</span>
                <h2 class="text-2xl font-bold mb-2">Select at least 2 laptops to compare</h2>
                <p class="opacity-70">Pick between 2 and 4 favorites above to view their specs side-by-side.</p>
            </div>
        `;
        return;
    }

    const bestPrice = Math.min(...compareList.map(l => l.price));
    const bestRam = Math.max(...compareList.map(l => l.ramGB));
    const bestStorage = Math.max(...compareList.map(l => l.storageGB));
    const bestBattery = Math.max(...compareList.map(l => l.batteryHours));
    const bestWeight = Math.min(...compareList.map(l => l.weightKg));

    const highlightClass = (condition) => condition ? 'bg-emerald-500/20 text-emerald-700 font-black px-2 py-0.5 rounded' : 'font-semibold';

    const columnsHtml = compareList.map(laptop => `
        <div class="w-72 md:w-80 bg-white text-gray-900 rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden relative shrink-0">
            <div class="bg-gray-50 p-4 flex items-center justify-center h-44 border-b border-gray-200">
                <img src="${laptop.image}" alt="${laptop.name}" class="max-h-full object-contain rounded-lg" onerror="this.src='https://via.placeholder.com/300x200?text=Laptop'">
            </div>
            
            <div class="p-6 flex-grow flex flex-col">
                <h3 class="text-xl font-bold mb-2 h-14 overflow-hidden">${laptop.name}</h3>
                <div class="mb-6">
                    <span class="text-2xl font-black text-[var(--color-accent-battery)] ${laptop.price === bestPrice ? 'underline decoration-2' : ''}">$${laptop.price}</span>
                    ${laptop.price === bestPrice ? '<span class="ml-2 text-xs bg-emerald-500/20 text-emerald-700 font-bold px-2 py-0.5 rounded">Best Price</span>' : ''}
                </div>
                
                <div class="space-y-4 text-sm flex-grow">
                    <div class="border-b border-gray-100 pb-2">
                        <span class="font-bold text-gray-400 block text-xs uppercase mb-1">Brand & Category</span>
                        <span class="font-semibold">${laptop.brand} • ${laptop.category}</span>
                    </div>
                    <div class="border-b border-gray-100 pb-2">
                        <span class="font-bold text-gray-400 block text-xs uppercase mb-1">Processor</span>
                        <span class="font-semibold">${laptop.cpu}</span>
                    </div>
                    <div class="border-b border-gray-100 pb-2">
                        <span class="font-bold text-gray-400 block text-xs uppercase mb-1">RAM</span>
                        <span class="${highlightClass(laptop.ramGB === bestRam)}">${laptop.ramGB} GB ${laptop.ramGB === bestRam ? '🏆' : ''}</span>
                    </div>
                    <div class="border-b border-gray-100 pb-2">
                        <span class="font-bold text-gray-400 block text-xs uppercase mb-1">Storage</span>
                        <span class="${highlightClass(laptop.storageGB === bestStorage)}">${laptop.storageGB} GB SSD ${laptop.storageGB === bestStorage ? '🏆' : ''}</span>
                    </div>
                    <div class="border-b border-gray-100 pb-2">
                        <span class="font-bold text-gray-400 block text-xs uppercase mb-1">Battery Life</span>
                        <span class="${highlightClass(laptop.batteryHours === bestBattery)}">${laptop.batteryHours} Hours ${laptop.batteryHours === bestBattery ? '🏆' : ''}</span>
                    </div>
                    <div class="border-b border-gray-100 pb-2">
                        <span class="font-bold text-gray-400 block text-xs uppercase mb-1">Weight</span>
                        <span class="${highlightClass(laptop.weightKg === bestWeight)}">${laptop.weightKg} kg ${laptop.weightKg === bestWeight ? '🏆' : ''}</span>
                    </div>
                    <div class="pt-1">
                        <span class="font-bold text-gray-400 block text-xs uppercase mb-1">Screen</span>
                        <span class="font-semibold">${laptop.screenInches} Inches</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `<div class="flex gap-6 min-w-max">${columnsHtml}</div>`;
};

document.addEventListener('DOMContentLoaded', initComparePage);