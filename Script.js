let players = [];

// Function to populate the table with data
function populateTable(data) {
    const tableBody = document.querySelector('#stats-table tbody');
    tableBody.innerHTML = '';

    data.forEach(player => {
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
            <td>${player['AVG.'] || 'N/A'}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Function to populate the team and year filters
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
}

// Function to filter and sort the table data
function filterTable() {
    const teamFilter = document.getElementById('team-filter').value;
    const yearFilter = document.getElementById('year-filter').value;

    let filteredPlayers = players;

    // Filter by team
    if (teamFilter) {
        filteredPlayers = filteredPlayers.filter(player => player.TEAM === teamFilter);
    }

    // Filter by year
    if (yearFilter) {
        filteredPlayers = filteredPlayers.filter(player => player.YEAR == yearFilter);
    }

    // Sort by selected stat
    const sortStat = document.getElementById('sort-stat').value;
    if (sortStat) {
        filteredPlayers.sort((a, b) => b[sortStat] - a[sortStat]);
    }

    // Populate the table with the filtered and sorted data
    populateTable(filteredPlayers);
}

// Function to add event listeners to filters and sorting options
function addEventListeners() {
    document.getElementById('team-filter').addEventListener('change', filterTable);
    document.getElementById('year-filter').addEventListener('change', filterTable);
    document.getElementById('sort-stat').addEventListener('change', filterTable);
}

// Function to load and parse the CSV data
function loadCSVData() {
    Papa.parse('2024G1Stats.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            players = results.data;
            populateFilters();
            filterTable();
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadCSVData(); // Load CSV data
    addEventListeners(); // Add event listeners
});
