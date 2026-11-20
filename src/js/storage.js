export const getTheme = () => localStorage.getItem('appTheme') || 'battery';
export const setTheme = (theme) => localStorage.setItem('appTheme', theme);
export const getFavorites = () => JSON.parse(localStorage.getItem('laptopFavs')) || [];
export const setFavorites = (favs) => localStorage.setItem('laptopFavs', JSON.stringify(favs));