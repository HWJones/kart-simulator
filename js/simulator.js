document.addEventListener('DOMContentLoaded', function() {
    // Create charts on page load
    const speedCtx = document.getElementById('speedGraph').querySelector('canvas');
    const accelerationCtx = document.getElementById('accelerationGraph').querySelector('canvas');
    const engineSpeedCtx = document.getElementById('engineSpeedGraph').querySelector('canvas');
    
    const speedChart = new Chart(speedCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Speed (km/h)',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    const accelerationChart = new Chart(accelerationCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Acceleration (m/s²)',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    const engineSpeedChart = new Chart(engineSpeedCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Engine Speed (RPM)',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Get kart animation element
    const kartElement = document.getElementById('kartAnimation');
    const resetButton = document.getElementById('resetRace');

    // Simulation logic
    function simulateKart(params) {
        const data = {
            time: [],
            speed: [],
            acceleration: [],
            engineSpeed: [],
            maxSpeed: 0,
            maxAccel: 0,
            finalTime: 0
        };

        let currentSpeed = 0;
        let distance = 0;
        const timeStep = 0.1;

        for (let time = 0; distance < params.raceDistance; time += timeStep) {
            // Physics calculations
            const engineSpeed = (currentSpeed * 60 * params.gearRatio) / (2 * Math.PI * params.wheelRadius);
            const dragForce = 0.5 * 1.225 * params.dragCoef * 0.7 * currentSpeed * currentSpeed;
            
            const torque = 15 * Math.min(1, 3000 / (engineSpeed + 1));
            const force = (torque * params.gearRatio * 0.95) / params.wheelRadius - dragForce;
            const acceleration = force / params.mass;

            currentSpeed = Math.max(0, currentSpeed + acceleration * timeStep);
            distance += currentSpeed * timeStep;

            // Update maximum values
            data.maxSpeed = Math.max(data.maxSpeed, currentSpeed * 3.6);
            data.maxAccel = Math.max(data.maxAccel, acceleration);
            data.finalTime = time;

            // Store data points
            data.time.push(time.toFixed(1));
            data.speed.push((currentSpeed * 3.6).toFixed(1));
            data.acceleration.push(acceleration.toFixed(2));
            data.engineSpeed.push(engineSpeed.toFixed(0));

            if (distance >= params.raceDistance) break;
        }

        return data;
    }

    function resetSimulation() {
        // Reset charts
        speedChart.data.labels = [];
        speedChart.data.datasets[0].data = [];
        speedChart.update();

        accelerationChart.data.labels = [];
        accelerationChart.data.datasets[0].data = [];
        accelerationChart.update();

        engineSpeedChart.data.labels = [];
        engineSpeedChart.data.datasets[0].data = [];
        engineSpeedChart.update();

        // Reset kart position
        kartElement.classList.remove('racing');

        // Reset metrics
        document.getElementById('raceTime').textContent = '0.00s';
        document.getElementById('topSpeed').textContent = '0.0 km/h';
        document.getElementById('maxAccel').textContent = '0.0 m/s²';
    }

    // Handle reset button
    resetButton.addEventListener('click', resetSimulation);

    // Handle race button
    document.getElementById('startRace').addEventListener('click', function() {
        // Reset position first
        kartElement.classList.remove('racing');
        
        // Force reflow
        void kartElement.offsetWidth;
        
        // Start race animation
        kartElement.classList.add('racing');

        // Get all input values
        const params = {
            raceDistance: parseFloat(document.getElementById('raceDistance').value),
            gearRatio: parseFloat(document.getElementById('teeth2').value) / 
                      parseFloat(document.getElementById('teeth1').value),
            mass: parseFloat(document.getElementById('mass').value),
            dragCoef: parseFloat(document.getElementById('dragCoef').value),
            wheelRadius: parseFloat(document.getElementById('wheelRadius').value)
        };

        // Run simulation
        const simData = simulateKart(params);

        // Update metrics display
        document.getElementById('raceTime').textContent = simData.finalTime.toFixed(2) + 's';
        document.getElementById('topSpeed').textContent = simData.maxSpeed.toFixed(1) + ' km/h';
        document.getElementById('maxAccel').textContent = simData.maxAccel.toFixed(2) + ' m/s²';

        // Update charts
        speedChart.data.labels = simData.time;
        speedChart.data.datasets[0].data = simData.speed;
        speedChart.update();

        accelerationChart.data.labels = simData.time;
        accelerationChart.data.datasets[0].data = simData.acceleration;
        accelerationChart.update();

        engineSpeedChart.data.labels = simData.time;
        engineSpeedChart.data.datasets[0].data = simData.engineSpeed;
        engineSpeedChart.update();
    });
});