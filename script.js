// Mock data
const mockBins = [
    {
        id: 'BIN001',
        location: 'Sector 12, Block A',
        fillLevel: 78,
        weight: 15.4,
        lastClassification: 'Plastic Bottle',
        confidence: 0.94,
        status: 'online',
        coordinates: [28.5355, 77.3910],
        rewardPoints: 15
    },
    {
        id: 'BIN002', 
        location: 'Sector 15, Block C',
        fillLevel: 45,
        weight: 8.2,
        lastClassification: 'Food Waste',
        confidence: 0.87,
        status: 'online',
        coordinates: [28.5385, 77.3940],
        rewardPoints: 8
    },
    {
        id: 'BIN003',
        location: 'Sector 18, Block B', 
        fillLevel: 92,
        weight: 23.1,
        lastClassification: 'Mixed Paper',
        confidence: 0.91,
        status: 'maintenance',
        coordinates: [28.5425, 77.3880],
        rewardPoints: 12
    }
];

let bins = [...mockBins];
let mrfData = {
    status: 'active',
    throughput: 485,
    accuracy: 94.2,
    itemsProcessed: 1247,
    recyclablesSorted: 892
};

let rewardData = {
    totalRewards: 45850,
    activeUsers: 1238,
    redemptions: 234,
    complianceRate: 72.3
};

// Live feed data
const liveFeedEvents = [
    { time: '14:32:15', event: 'Plastic bottle classified (BIN001)', confidence: 94, type: 'success' },
    { time: '14:31:42', event: 'MRF conveyor sorted 15 items', confidence: null, type: 'info' },
    { time: '14:30:28', event: 'User ABC123 earned 12 reward points', confidence: null, type: 'reward' },
    { time: '14:29:15', event: 'Food waste detected (BIN002)', confidence: 87, type: 'success' },
    { time: '14:28:03', event: 'Low confidence item routed to manual review', confidence: 65, type: 'warning' },
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set up navigation
    setupNavigation();
    
    // Render initial content
    renderBins();
    renderLiveFeed();
    
    // Start real-time updates
    startRealTimeUpdates();
});

function setupNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Remove active class from all tabs and contents
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
        });
    });
}

function renderBins() {
    const binsGrid = document.getElementById('bins-grid');
    if (!binsGrid) return;
    
    binsGrid.innerHTML = bins.map(bin => `
        <div class="bin-card">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800">${bin.id}</h3>
                <span class="status-badge ${getStatusClass(bin.status)}">
                    ${bin.status}
                </span>
            </div>
            
            <p class="text-sm text-gray-600 mb-3 flex items-center">
                <i data-lucide="map-pin" class="h-4 w-4 mr-1"></i>
                ${bin.location}
            </p>

            <div class="space-y-3">
                <div>
                    <div class="flex justify-between text-sm mb-1">
                        <span>Fill Level</span>
                        <span>${bin.fillLevel}%</span>
                    </div>
                    <div class="fill-level-bar">
                        <div class="fill-level-progress ${getFillLevelClass(bin.fillLevel)}" 
                             style="width: ${bin.fillLevel}%"></div>
                    </div>
                </div>

                <div class="flex justify-between text-sm">
                    <span>Weight:</span>
                    <span>${bin.weight.toFixed(1)} kg</span>
                </div>

                <div class="flex justify-between text-sm">
                    <span>Last Item:</span>
                    <span class="text-blue-600">${bin.lastClassification}</span>
                </div>

                <div class="flex justify-between text-sm">
                    <span>AI Confidence:</span>
                    <span class="font-medium ${getConfidenceClass(bin.confidence)}">
                        ${(bin.confidence * 100).toFixed(1)}%
                    </span>
                </div>

                <div class="flex justify-between text-sm bg-orange-50 p-2 rounded">
                    <span>Reward Points:</span>
                    <span class="font-bold text-orange-600">+${bin.rewardPoints}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Re-initialize Lucide icons for new content
    lucide.createIcons();
}

function renderLiveFeed() {
    const liveFeed = document.getElementById('live-feed');
    if (!liveFeed) return;
    
    liveFeed.innerHTML = liveFeedEvents.map(item => `
        <div class="live-feed-item">
            <div class="flex items-center space-x-3">
                <div class="feed-dot feed-${item.type}"></div>
                <span class="text-sm text-gray-700">${item.event}</span>
            </div>
            <div class="flex items-center space-x-2">
                ${item.confidence ? `
                    <span class="text-xs bg-gray-200 px-2 py-1 rounded">
                        ${item.confidence}% conf.
                    </span>
                ` : ''}
                <span class="text-xs text-gray-500">${item.time}</span>
            </div>
        </div>
    `).join('');
}

function getStatusClass(status) {
    switch(status) {
        case 'online': return 'status-online';
        case 'offline': return 'status-offline';
        case 'maintenance': return 'status-maintenance';
        default: return 'status-offline';
    }
}

function getFillLevelClass(fillLevel) {
    if (fillLevel > 80) return 'fill-high';
    if (fillLevel > 60) return 'fill-medium';
    return 'fill-low';
}

function getConfidenceClass(confidence) {
    if (confidence > 0.9) return 'text-green-600';
    if (confidence > 0.8) return 'text-yellow-600';
    return 'text-red-600';
}

function updateDashboardStats() {
    // Update compliance rate
    const complianceElement = document.getElementById('compliance-rate');
    if (complianceElement) {
        complianceElement.textContent = rewardData.complianceRate.toFixed(1);
    }
    
    // Update active users
    const activeUsersElement = document.getElementById('active-users');
    if (activeUsersElement) {
        activeUsersElement.textContent = rewardData.activeUsers;
    }
    
    // Update total rewards
    const totalRewardsElement = document.getElementById('total-rewards');
    if (totalRewardsElement) {
        totalRewardsElement.textContent = Math.floor(rewardData.totalRewards / 1000);
    }
    
    // Update MRF stats
    const throughputElement = document.getElementById('throughput');
    if (throughputElement) {
        throughputElement.textContent = mrfData.throughput;
    }
    
    const itemsProcessedElement = document.getElementById('items-processed');
    if (itemsProcessedElement) {
        itemsProcessedElement.textContent = mrfData.itemsProcessed;
    }
    
    const recyclablesSortedElement = document.getElementById('recyclables-sorted');
    if (recyclablesSortedElement) {
        recyclablesSortedElement.textContent = mrfData.recyclablesSorted;
    }
}

function startRealTimeUpdates() {
    setInterval(() => {
        // Update bin data
        bins = bins.map(bin => ({
            ...bin,
            fillLevel: Math.max(0, Math.min(100, bin.fillLevel + (Math.random() - 0.5) * 5)),
            weight: Math.max(0, bin.weight + (Math.random() - 0.5) * 2),
            confidence: Math.max(0.5, Math.min(1, bin.confidence + (Math.random() - 0.5) * 0.1)),
            rewardPoints: bin.rewardPoints + Math.floor(Math.random() * 3)
        }));
        
        // Update MRF data
        mrfData = {
            ...mrfData,
            throughput: Math.max(0, mrfData.throughput + Math.floor((Math.random() - 0.5) * 20)),
            itemsProcessed: mrfData.itemsProcessed + Math.floor(Math.random() * 5),
            recyclablesSorted: mrfData.recyclablesSorted + Math.floor(Math.random() * 3)
        };
        
        // Add new live feed event
        const newEvents = [
            { time: getCurrentTime(), event: 'New plastic item classified', confidence: Math.floor(Math.random() * 20) + 80, type: 'success' },
            { time: getCurrentTime(), event: 'MRF processing batch completed', confidence: null, type: 'info' },
            { time: getCurrentTime(), event: 'Reward points distributed', confidence: null, type: 'reward' },
            { time: getCurrentTime(), event: 'Bin maintenance scheduled', confidence: null, type: 'warning' }
        ];
        
        const randomEvent = newEvents[Math.floor(Math.random() * newEvents.length)];
        liveFeedEvents.unshift(randomEvent);
        
        // Keep only last 10 events
        if (liveFeedEvents.length > 10) {
            liveFeedEvents.pop();
        }
        
        // Re-render components
        renderBins();
        renderLiveFeed();
        updateDashboardStats();
        
    }, 3000);
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});