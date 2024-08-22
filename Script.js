let currentPage = 1;
const pageSize = 100; // Number of players per page
let players = [];

// Function to populate the table with data
function populateTable(data) {
    const tableBody = document.querySelector('#stats-table tbody');
    tableBody.innerHTML = '';

    console.log('Full data:', players);

    // Log the current page and data being displayed
    console.log(`Populating table for page: ${currentPage}`);
    console.log('Data to be displayed:', data);

    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    paginatedData.forEach(player => {
        // Log each player object to check its structure
        console.log('Player data:', player);

        // Format the AVG. value
        let avg = player['AVG.'];
        if (typeof avg === 'string') {
            if (avg === '#DIV/0!' || avg.trim() === '') {
                avg = '0';
            } else {
                avg = parseFloat(avg).toFixed(3);
            }
        } else if (typeof avg === 'number') {
            avg = avg === 0 ? '0' : avg.toFixed(3);
        } else {
            avg = '0';
        }

        const row = `<tr>
            <td>${player['LAST NAME'] || 'N/A'}</td>
            <td>${player['FIRST NAME'] || 'N/A'}</td>
            <td>${player['TEAM'] || 'N/A'}</td>
            <td>${player['ABs'] !== undefined ? player['ABs'] : 'N/A'}</td>
            <td>${player['Runs'] !== undefined ? player['Runs'] : 'N/A'}</td>
            <td>${player['Hits'] !== undefined ? player['Hits'] : 'N/A'}</td>
            <td>${player['RBIs'] !== undefined ? player['RBIs'] : 'N/A'}</td>
            <td>${player['2B'] !== undefined ? player['2B'] : 'N/A'}</td>
            <td>${player['3B'] !== undefined ? player['3B'] : 'N/A'}</td>
            <td>${avg}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    // Show or hide the Load More button
    const loadMoreButton = document.getElementById('load-more');
    if (loadMoreButton) {
        loadMoreButton.style.display = currentPage * pageSize >= data.length ? 'none' : 'block';
    }
}


function populateFilters() {
    const teamFilter = document.getElementById('team-filter');
    const yearFilter = document.getElementById('year-filter');

    // Clear existing options
    teamFilter.innerHTML = '<option value="">All Teams</option>';
    yearFilter.innerHTML = '<option value="">All Years</option>';

    // Populate team filter options
    const teams = [...new Set(players.map(player => player.TEAM))];
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
    });

    // Populate year filter options
    const years = [...new Set(players.map(player => player.YEAR))];
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    // Log filter options for debugging
    console.log('Available teams:', teams);
    console.log('Available years:', years);
}

function addEventListeners() {
    document.getElementById('team-filter').addEventListener('change', filterTable);
    document.getElementById('year-filter').addEventListener('change', filterTable);
    document.getElementById('sort-stat').addEventListener('change', filterTable);
}

function filterTable() {
    const team = document.getElementById('team-filter').value;
    const year = document.getElementById('year-filter').value;
    let filteredPlayers = players;

    if (team) {
        filteredPlayers = filteredPlayers.filter(player => player.TEAM === team);
    }
    if (year) {
        filteredPlayers = filteredPlayers.filter(player => player.Year === parseInt(year));
    }

    // Log the filtered players to check if filtering works correctly
    console.log('Filtered players:', filteredPlayers);

    // Sort and populate the table with filtered data
    sortTable(filteredPlayers);
}

function sortTable(data) {
    const sortBy = document.getElementById('sort-stat').value;
    const sortedPlayers = [...data].sort((a, b) => {
        if (typeof a[sortBy] === 'string') {
            return a[sortBy].localeCompare(b[sortBy]);
        } else {
            return b[sortBy] - a[sortBy];
        }
    });

    // Log the sorted data to verify correctness
    console.log('Sorted players:', sortedPlayers);

    populateTable(sortedPlayers);
}

// Function to read and parse the CSV file
function loadCSVData() {
    Papa.parse('2024G1Stats.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            // Log the entire parsed CSV results for debugging
            console.log('Parsed CSV results:', results);

            players = results.data;
            console.log('Players data:', players); // Log the players array

            populateFilters();
            filterTable();
        },
        error: function(error) {
            // Log errors if parsing fails
            console.error('Error parsing CSV:', error);
        }
    });
}



// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadCSVData(); // Load CSV data
    addEventListeners();
    addLoadMoreButton();
});
