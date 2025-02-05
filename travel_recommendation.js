document.addEventListener('DOMContentLoaded', () => {
    let travelData = [];
    
    // Fetch data from JSON
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            travelData = data;
            console.log('Data loaded:', travelData);
        })
        .catch(error => console.error('Error:', error));

    // Search functionality
    document.getElementById('search-btn').addEventListener('click', () => {
        const searchTerm = document.getElementById('search-input').value
            .toLowerCase()
            .trim()
            .replace(/s$/, ''); // Remove trailing 's'

        const results = getRecommendations(searchTerm);
        displayResults(results);
    });

    // Clear functionality
    document.getElementById('clear-btn').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('results').innerHTML = '';
    });

    function getRecommendations(term) {
        if (!term) return [];
        
        // Check for country match
        const countryMatch = travelData.countries.find(c => 
            c.name.toLowerCase() === term
        );
        
        if (countryMatch) return countryMatch.cities;

        // Check for category matches
        const category = {
            'beach': ['beach', 'coast', 'island'],
            'temple': ['temple', 'shrine', 'pagoda']
        }[term];

        if (category) {
            return travelData.countries.flatMap(country => 
                country.cities.filter(city =>
                    category.some(keyword => 
                        city.description.toLowerCase().includes(keyword)
                    )
                )
            );
        }

        return [];
    }

    function displayResults(results) {
        const container = document.getElementById('results');
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = '<p class="no-results">No results found. Try different keywords!</p>';
            return;
        }

        results.forEach(place => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <img src="${place.imageUrl}" alt="${place.name}">
                <div class="card-content">
                    <h3>${place.name}</h3>
                    <p>${place.description}</p>
                </div>
            `;
            container.appendChild(card);
        });
    }
});