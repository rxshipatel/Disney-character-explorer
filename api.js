const URL = 'https://api.disneyapi.dev';

// Function to search characters by name, movie, or TV show
async function searchCharacters(query, criterion) {
    try {
        let url;

        // Construct the URL based on the search criterion
        switch (criterion) {
            case 'name':
                // Search by character name
                url = `${URL}/character?name=${encodeURIComponent(query)}`;
                break;
            case 'film':
                // Search by movie title
                url = `${URL}/character?films=${encodeURIComponent(query)}`;
                break;
            case 'tvShow':
                // Search by TV show title
                url = `${URL}/character?tvShows=${encodeURIComponent(query)}`;
                break;
            default:
                // Throw an error for invalid criteria
                throw new Error('Invalid search criterion.');
        }

        // Fetch data from the constructed URL
        const response = await fetch(url);

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error("Network response was not ok!");
        }

        // Convert the response to JSON format
        const data = await response.json();

        // Check if the response data contains the character objects
        if (data && data.data) {
            // Ensure data.data is an array; if it's a single object, convert it to an array
            return Array.isArray(data.data) ? data.data : [data.data];
        } else {
            // Throw an error if no characters are found or the response format is incorrect
            throw new Error('No characters found or API response format is incorrect.');
        }
    } catch (error) {
        // Log any errors that occur during the fetch process
        console.log("Error searching characters!", error);
        throw error;  // Re-throw the error to be handled by the calling function
    }
}

// Function to get character details by id
async function getCharacterDetails(id) {
    try {
        // Fetch data for a specific character using the character ID
        const response = await fetch(`${URL}/character/${id}`);

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error("Network response was not ok!");
        }

        // Convert the response to JSON format
        const data = await response.json();
        return data;  // Return the character details
    } catch (error) {
        // Log any errors that occur during the fetch process
        console.log("Error fetching character details!", error);
        throw error;  // Re-throw the error to be handled by the calling function
    }
}

// Function to get all films and TV shows
async function getFilmsAndTvShows() {
    try {
        // Fetch a list of all characters to extract films and TV shows
        const response = await fetch(`${URL}/character`);

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error("Network response was not ok!");
        }

        // Convert the response to JSON format
        const data = await response.json();
        const films = new Set();  // Use a Set to avoid duplicate film titles
        const tvShows = new Set();  // Use a Set to avoid duplicate TV show titles

        // Iterate over each character to extract films and TV shows
        data.data.forEach(character => {
            if (character.films) {
                // Add each film to the films Set
                character.films.forEach(film => films.add(film));
            }
            if (character.tvShows) {
                // Add each TV show to the tvShows Set
                character.tvShows.forEach(show => tvShows.add(show));
            }
        });

        // Convert Sets to arrays and return as an object
        return { films: Array.from(films), tvShows: Array.from(tvShows) };
    } catch (error) {
        // Log any errors that occur during the fetch process
        console.log("Error fetching films and TV shows!", error);
        throw error;  // Re-throw the error to be handled by the calling function
    }
}

// Export functions to be used in other modules
export {
    searchCharacters,
    getCharacterDetails,
    getFilmsAndTvShows
};
