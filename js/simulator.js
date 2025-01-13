document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const startButton = document.getElementById('startRace');
    const raceDistance = document.getElementById('raceDistance');
    const teeth1 = document.getElementById('teeth1');
    const teeth2 = document.getElementById('teeth2');

    startButton.addEventListener('click', function() {
        // Get input values
        const distance = parseFloat(raceDistance.value);
        const drivingTeeth = parseFloat(teeth1.value);
        const drivenTeeth = parseFloat(teeth2.value);

        // Basic validation
        if (isNaN(distance) || isNaN(drivingTeeth) || isNaN(drivenTeeth)) {
            alert('Please enter valid numbers for all fields');
            return;
        }

        // Calculate gear ratio
        const gearRatio = drivenTeeth / drivingTeeth;
        
        console.log(`Race started with:
            Distance: ${distance}m
            Gear ratio: ${gearRatio.toFixed(2)}
        `);
        
        // We'll add simulation logic here later
    });
});