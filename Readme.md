# Setup TailwindCSS for Native with the below comands :-

1. yarn add nativewind
2. yarn add --dev tailwindcss
3. Run npx tailwindcss init to create a tailwind.config.js file
   Replace the content in tailwind.config.js with the below line of code.
   content: ['./App.{js,jsx,ts,tsx}', './<custom-folder>/**/*.{js,jsx,ts,tsx}'],
4. Modify your babel.config.js
   // babel.config.js
   module.exports = {
   presets: ['module:metro-react-native-babel-preset'],
   - plugins: ["nativewind/babel"],
     };

### For newly created folders that require styling make sure to mention those in tailwind.config.js and restart the server.

## Versions used in the app :-

node - v18.12.1
npm - 8.19.2
yarn - 1.22.19
