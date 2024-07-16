import { searchCharacters, getFilmsAndTvShows } from './api.js';

// This event listener waits for the DOM content to be fully loaded before executing the code inside
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the lists of films and TV shows from the API
        const { films, tvShows } = await getFilmsAndTvShows();
        
        // Populate the film and TV show dropdowns with the fetched data
        populateDropdown('film', films);
        populateDropdown('tvShow', tvShows);
    } catch (error) {
        // Log any errors encountered during the fetching process
        console.error('Error fetching films and TV shows:', error);
    }
});

// Function to handle the search logic
async function performSearch() {
    // Retrieve the search query and selected search criterion from the form
    const query = document.getElementById('search-input').value;
    const criterion = document.getElementById('search-criterion').value;

    try {
        // Call the API to search for characters based on the query and criterion
        const characters = await searchCharacters(query, criterion);

        // Check if any characters were returned and display the results
        if (characters && characters.length > 0) {
            displayResults(characters);  // Pass the array of characters to the displayResults function
        } else {
            // If no characters are found or if the API response format is incorrect, display an error message
            displayError('No characters found or API response format is incorrect.');
        }
    } catch (error) {
        // Catch any errors that occurred during the search and display an error message
        displayError(error.message);
    }
}

// Add event listener for the search button
document.getElementById('search-btn').addEventListener('click', performSearch);

// Add event listener for the Enter key press in the search input field
document.getElementById('search-input').addEventListener('keypress', (event) => {
    // Check if the pressed key is Enter
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the default form submission behavior when pressing Enter
        performSearch();  // Call the performSearch function to initiate the search
    }
});

// Function to populate dropdown menus with options
function populateDropdown(type, items) {
    // Get the dropdown element by ID based on the type (e.g., 'film-dropdown' or 'tvShow-dropdown')
    const dropdown = document.getElementById(`${type}-dropdown`);
    
    // Clear previous options and add a default placeholder option
    dropdown.innerHTML = '<option value="">Select an Option</option>';
    
    // Iterate over the list of items and create an option element for each
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);  // Append the option to the dropdown menu
    });
}

// Function to display search results
function displayResults(characters) {
    // Get the div element where the search results will be displayed
    const resultDiv = document.getElementById('result');
    
    // Clear previous results from the result div
    resultDiv.innerHTML = '';

    // Iterate over the array of characters and create a div for each character
    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.classList.add(
            'character', 
            'bg-white', 
            'p-4', 
            'rounded-lg', 
            'shadow-md', 
            'transition-transform', 
            'transform', 
            'hover:scale-105', 
            'flex', 
            'flex-col', 
            'items-center', 
            'text-center'
        );
        
        // Use fallback values if character details are missing
        const imageUrl = character.imageUrl || 'https://via.placeholder.com/150?text=No+Image';  // Fallback image
        const name = character.name || 'No Name';  // Fallback name
        const films = character.films ? character.films.join(', ') : 'No Films';  // Fallback films list
        const tvShows = character.tvShows ? character.tvShows.join(', ') : 'No TV Shows';  // Fallback TV shows list
        const sourceUrl = character.sourceUrl || '#';  // Fallback link

        // Set the HTML content for the character div
        characterDiv.innerHTML = `
            <img src="${imageUrl}" alt="${name}" class="w-32 h-32 object-cover rounded-full mb-4 shadow-lg" />
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${name}</h2>
            <p class="text-gray-600 mb-2">Films: ${films}</p>
            <p class="text-gray-600 mb-4">TV Shows: ${tvShows}</p>
            <a href="${sourceUrl}" target="_blank" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">More Info</a>
        `;
        resultDiv.appendChild(characterDiv);  // Append the character div to the result div
    });
}

// Function to display an error message
function displayError(errorMessage) {
    // Get the div element where the error message will be displayed
    const resultDiv = document.getElementById('result');
    
    // Set the HTML content to show the error message
    resultDiv.innerHTML = `<p class="text-red-500 font-semibold">${errorMessage}</p>`;
}
