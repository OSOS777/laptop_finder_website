import { getTheme, setTheme } from './storage.js';

export const initTheme = () => {
    const themeBtn = document.getElementById('theme-toggle');
    
    const applyCurrentTheme = (theme) => {
        if (theme === 'perf') {
            document.documentElement.style.setProperty('--color-bg-battery', '#0f172a');
            document.documentElement.style.setProperty('--color-text-battery', '#f8fafc');
            document.documentElement.style.setProperty('--color-accent-battery', '#f97316');
            if(themeBtn) themeBtn.innerHTML = '⚡ Performance Mode';
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
};