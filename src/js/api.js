export const fetchLaptops = async () => {
  try {
    const response = await fetch('./data/laptops.json');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch laptops:', error);
    return [];
  }
};