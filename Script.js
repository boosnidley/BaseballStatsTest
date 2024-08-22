let currentPage = 1;
const pageSize = 100; // Number of players per page
let players = [];
let aggregatedPlayers = [];

// Function to aggregate stats by season or all-time
function aggregateStats(data, term) {
    const aggregatedData = {};

    data.forEach(player => {
        const key = term === 'season' ? `${player['LAST NAME']}-${player['FIRST NAME']}-${player['YEAR']}` : `${player['LAST NAME']}-${player['FIRST NAME']}`;

        if (!aggregatedData[key]) {
            aggregatedData[key] = {
                'LAST NAME': player['LAST NAME'],
                'FIRST NAME': player['FIRST NAME'],
                'TEAM': player['TEAM'],
                'YEAR': player['YEAR'],
                'ABs': player['ABs'] || 0,
                'Runs': player['Runs'] || 0,
                'Hits': player['Hits'] || 0,
                'RBIs': player['RBIs'] || 0,
                '2B': player['2B'] || 0,
                '3B': player['3B'] || 0,
                'Games': 1,
            };
        } else {
            aggregatedData[key]['ABs'] += player['ABs'] || 0;
            aggregatedData[key]['Runs'] += player['Runs'] || 0;
            aggregatedData[key]['Hits'] += player['Hits'] || 0;
            aggregatedData[key]['RBIs'] += player['RBIs'] || 0;
            aggregatedData[key]['2B'] += player['2B'] || 0;
            aggregatedData[key]['3B'] += player['3B'] || 0;
            aggregatedData[key]['Games'] += 1;
        }
    });

    // Calculate AVG. for each player
    Object.values(aggregatedData).forEach(player => {
        player['AVG.'] = player['Hits'] / (player['ABs'] || 1); // Avoid division by zero
    });

    return Object.values(aggregatedData);
}

// Function to populate the table with data
function populateTable(data) {
    const tableBody = document.querySelector('#stats-table tbody');
    tableBody.innerHTML = '';

    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    paginatedData.forEach(player => {
        let avg = player['AVG.'];
        avg = avg ? avg.toFixed(3) : '0.000';

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

function filterTable() {
    const team = document.getElementById('team-filter').value;
    const year = document.getElementById('year-filter').value;
    const term = document.getElementById('term-filter').value;

    let filteredPlayers = players;

    if (team) {
        filteredPlayers = filteredPlayers.filter(player => player.TEAM === team);
    }
    if (year) {
        filteredPlayers = filteredPlayers.filter(player => player.YEAR === parseInt(year));
    }

    // Aggregate stats based on the selected term (season or all-time)
    aggregatedPlayers = aggregateStats(filteredPlayers, term);

    // Sort and populate the table with filtered data
    sortTable(aggregatedPlayers);
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

    populateTable(sortedPlayers);
}

// Function to read and parse the CSV file
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
    loadCSVData();
    addEventListeners();
});
