import { getTheme, setTheme } from './storage.js';

export const showToast = (message) => {
    const existing = document.getElementById('toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl border border-gray-700 font-semibold z-50 transition-all duration-300 transform translate-y-2 opacity-0 flex items-center gap-2';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
};

// Restores saved theme from localStorage and toggles between Battery Saver and Performance Mode
export const initTheme = () => {
    const themeBtn = document.getElementById('theme-toggle');
    
    const applyCurrentTheme = (theme) => {
        if (theme === 'perf') {
            document.documentElement.style.setProperty('--color-bg-battery', '#0f172a');
            document.documentElement.style.setProperty('--color-text-battery', '#f8fafc');
            document.documentElement.style.setProperty('--color-accent-battery', '#f97316');
            if(themeBtn) themeBtn.innerHTML = '⚡ Performance';
        } else {
            document.documentElement.style.setProperty('--color-bg-battery', '#f8fafc');
            document.documentElement.style.setProperty('--color-text-battery', '#0f172a');
            document.documentElement.style.setProperty('--color-accent-battery', '#10b981');
            if(themeBtn) themeBtn.innerHTML = '🍃 Battery Saver';
        }
    };

    let currentTheme = getTheme();
    applyCurrentTheme(currentTheme);

    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'battery' ? 'perf' : 'battery';
            setTheme(currentTheme);
            applyCurrentTheme(currentTheme);
        });
    }

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
};

export const createLaptopCard = (laptop, isFavorite = false) => {
    return `
        <div class="laptop-card group flex flex-col h-full bg-white text-gray-900 rounded-2xl overflow-hidden shadow-md border border-gray-200 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-900/80 text-white backdrop-blur-sm z-10">
                ${laptop.category}
            </span>
            <button class="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 shadow-md hover:scale-110 active:scale-95 transition-transform z-10 fav-btn cursor-pointer" data-id="${laptop.id}" title="Toggle Favorite">
                ${isFavorite ? '❤️' : '🤍'}
            </button>
            <div class="h-48 w-full bg-gray-100 overflow-hidden relative">
                <img src="${laptop.image}" alt="${laptop.name}" class="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://via.placeholder.com/400x300?text=Laptop'">
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <span class="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-battery)] mb-1">${laptop.brand}</span>
                <h3 class="text-xl font-bold mb-1 truncate" title="${laptop.name}">${laptop.name}</h3>
                <p class="text-2xl font-black text-[var(--color-accent-battery)] mb-4">$${laptop.price}</p>
                <ul class="text-sm text-gray-600 mb-5 space-y-1.5 flex-grow border-t border-gray-100 pt-3">
                    <li class="truncate">💻 <span class="font-medium text-gray-800">${laptop.cpu}</span></li>
                    <li>⚡ ${laptop.ramGB}GB RAM • 💾 ${laptop.storageGB}GB SSD</li>
                    <li>🔋 ${laptop.batteryHours}h • ⚖️ ${laptop.weightKg} kg</li>
                </ul>
                <a href="details.html?id=${laptop.id}" class="mt-auto block text-center w-full bg-[var(--color-accent-battery)] text-white py-2.5 rounded-xl font-bold hover:opacity-90 transition shadow-sm">
                    View Details
                </a>
            </div>
        </div>
    `;
};