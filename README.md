# Student Laptop Finder

A responsive web application built with Vanilla JavaScript (ES Modules) and Tailwind CSS v4 to help students browse, search, filter, save, and compare laptops side by side.

## Key Features

- 5 Connected Pages: Seamless navigation across Home (index.html), Catalogue (laptops.html), Details (details.html), Favorites (favorites.html), and Compare (compare.html).
- Dynamic Data Rendering: Loads 20 laptops asynchronously from data/laptops.json using fetch() and async/await with animated loading skeletons.
- Live Search, Filtering & Sorting: Instant search by name or brand, combined with category, minimum RAM, and maximum price filters, plus sorting by price, battery life, and weight.
- Custom Dual Themes: Switch between Battery Saver Mode (light) and Performance Mode (dark), persisted via localStorage.
- Favorites & Comparison: Save favorites with total and average price calculations, and compare 2 to 4 selected favorites with automatic highlighting for the best specifications.

## Installation & Build Commands

1. Install dependencies:
npm install

2. Build Tailwind CSS:
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css

3. Run the application:
Open index.html using a local server such as VS Code Live Server.