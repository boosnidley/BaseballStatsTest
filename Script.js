// Function to aggregate player stats
function aggregatePlayerStats(players) {
    const playerMap = new Map();

    players.forEach(player => {
        const key = `${player['LAST NAME']}_${player['FIRST NAME']}_${player['TEAM']}`;
        
        if (!playerMap.has(key)) {
            playerMap.set(key, {
                ...player,
                totalABs: player.ABs || 0,
                totalRuns: player.Runs || 0,
                totalHits: player.Hits || 0,
                totalRBIs: player.RBIs || 0,
                total2B: player['2B'] || 0,
                total3B: player['3B'] || 0,
                totalAVG: player['AVG.'] ? parseFloat(player['AVG.']) : 0,
                avgCount: player['AVG.'] ? 1 : 0
            });
        } else {
            const aggregatedPlayer = playerMap.get(key);

            aggregatedPlayer.totalABs += player.ABs || 0;
            aggregatedPlayer.totalRuns += player.Runs || 0;
            aggregatedPlayer.totalHits += player.Hits || 0;
            aggregatedPlayer.totalRBIs += player.RBIs || 0;
            aggregatedPlayer.total2B += player['2B'] || 0;
            aggregatedPlayer.total3B += player['3B'] || 0;
            aggregatedPlayer.totalAVG += player['AVG.'] ? parseFloat(player['AVG.']) : 0;
            if (player['AVG.']) {
                aggregatedPlayer.avgCount += 1;
            }
        }
    });

    // Convert map to an array of aggregated players
    const aggregatedPlayers = Array.from(playerMap.values()).map(player => {
        return {
            'LAST NAME': player['LAST NAME'],
            'FIRST NAME': player['FIRST NAME'],
            'TEAM': player['TEAM'],
            'ABs': player.totalABs,
            'Runs': player.totalRuns,
            'Hits': player.totalHits,
            'RBIs': player.totalRBIs,
            '2B': player.total2B,
            '3B': player.total3B,
            'AVG.': (player.avgCount > 0) ? (player.totalAVG / player.avgCount).toFixed(3) : '0'
        };
    });

    return aggregatedPlayers;
}

// Function to populate the table with aggregated data
function populateTable(data) {
    const tableBody = document.querySelector('#stats-table tbody');
    tableBody.innerHTML = '';

    const aggregatedData = aggregatePlayerStats(data);

    aggregatedData.forEach(player => {
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
            <td>${player['AVG.']}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
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

document.addEventListener('DOMContentLoaded', () => {
    loadCSVData(); // Load CSV data
    addEventListeners();
});
