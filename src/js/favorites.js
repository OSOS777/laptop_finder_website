import { initTheme, createLaptopCard, showToast } from './ui.js';
import { getFavorites, setFavorites } from './storage.js';

initTheme();

const renderFavorites = () => {
    const container = document.getElementById('favorites-container');
    const summaryBox = document.getElementById('fav-summary');
    const clearBtn = document.getElementById('clear-favs-btn');
    const favorites = getFavorites();

    if (favorites.length === 0) {
        summaryBox.classList.add('hidden');
        summaryBox.classList.remove('grid');
        clearBtn.classList.add('hidden');
        container.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <span class="text-6xl mb-4">📭</span>
                <h2 class="text-2xl font-bold mb-2">No favorites yet!</h2>
                <p class="opacity-70 mb-6">Go to the catalogue and heart some laptops to see them here.</p>
                <a href="laptops.html" class="btn-action bg-[var(--color-accent-battery)] text-white px-6 py-2 hover:opacity-90">Browse Laptops</a>
            </div>
        `;
        return;
    }

    const totalPrice = favorites.reduce((sum, item) => sum + item.price, 0);
    const avgPrice = Math.round(totalPrice / favorites.length);

    document.getElementById('fav-total-price').textContent = `$${totalPrice}`;
    document.getElementById('fav-avg-price').textContent = `$${avgPrice}`;
    
    summaryBox.classList.remove('hidden');
    summaryBox.classList.add('grid');
    clearBtn.classList.remove('hidden');

    container.innerHTML = favorites.map(laptop => createLaptopCard(laptop, true)).join('');
    attachRemoveEvents();
};

const attachRemoveEvents = () => {
    const favButtons = document.querySelectorAll('.fav-btn');
    favButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const laptopId = Number(e.currentTarget.dataset.id);
            let favorites = getFavorites();
            favorites = favorites.filter(fav => fav.id !== laptopId);
            setFavorites(favorites);
            showToast('Removed from Favorites');
            renderFavorites();
        });
    });
};

document.getElementById('clear-favs-btn').addEventListener('click', () => {
    setFavorites([]);
    showToast('All favorites cleared');
    renderFavorites();
});

document.addEventListener('DOMContentLoaded', renderFavorites);