const configurations_school = {
    'brincar1': ['8:00', '8:15', 'chartreuse'],
    'pequeno almoco': ['7:45', '8:00', 'orange'],
    'escola1': ['09:00', '11:30', 'darkolivegreen'],
    'almoco': ['11:30', '12:00', 'orange'],
    'sesta': ['12:30', '15:00', 'purple'],
    'lanche': ['15:15', '15:45', 'orange'],
    'escola2': ['16:00', '16:30', 'darkolivegreen'],
    'brincar2': ['17:00', '18:30', 'chartreuse'],
    'jantar': ['18:30', '19:30', 'orange'],
    'banho': ['19:30', '20:30', 'blue'],
    'dormir': ['21:30', '7:30', 'purple']
}

const configurations_weekend = {
    'pequeno almoco': ['9:30', '10:00', 'orange'],
    'brincar1': ['10:00', '12:30', 'chartreuse'],
    'almoco': ['12:30', '13:30', 'orange'],
    'sesta': ['14:00', '15:00', 'purple'],
    'brincar2': ['15:00', '16:00', 'chartreuse'],
    'lanche': ['16:00', '16:30', 'orange'],
    'brincar3': ['16:30', '18:30', 'chartreuse'],
    'jantar': ['18:30', '19:30', 'orange'],
    'banho': ['19:30', '20:30', 'blue'],
    'dormir': ['21:30', '9:30', 'purple']
}

const configurations = configurations_weekend;

const canvas = document.getElementById('clockCanvas');
canvas.height = window.innerHeight;
canvas.width = window.innerHeight;
const ctx = canvas.getContext('2d');

// Clock dimensions
const clockRadius = (window.innerHeight - 40) / 2;
const clockCenterX = canvas.width / 2;
const clockCenterY = canvas.height / 2;
const degreesPerSecond = (Math.PI * 2) / 86400;

// Function to draw the clock dial
function drawClockDial() {
    // Draw the outer circle (clock face)
    ctx.beginPath();
    ctx.arc(clockCenterX, clockCenterY, clockRadius, 0, Math.PI * 2); // Full circle
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw hour markers and labels
    for (let hour = 0; hour < 24; hour++) {
        const angle = (Math.PI * 2 / 24) * hour - Math.PI / 2; // Calculate angle for each hour
        const outerX = clockCenterX + clockRadius * Math.cos(angle);
        const outerY = clockCenterY + clockRadius * Math.sin(angle);
        const innerX = clockCenterX + (clockRadius - 20) * Math.cos(angle);
        const innerY = clockCenterY + (clockRadius - 20) * Math.sin(angle);
        
        // Draw hour markers (lines)
        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(outerX, outerY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw hour labels (numbers)
        const labelX = clockCenterX + (clockRadius - 40) * Math.cos(angle);
        const labelY = clockCenterY + (clockRadius - 40) * Math.sin(angle);
        ctx.font = "16px Arial";
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(hour, labelX, labelY);
    }
}

// Function to draw clock hands (optional)
function drawClockHands() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Calculate the total seconds passed in the day (24-hour format)
    const totalSecondsInDay = hours * 3600 + minutes * 60 + seconds;
    
    // Calculate the rotation of the clock hand based on 24 hours (86400 seconds in a day)
    const rotation = (totalSecondsInDay * degreesPerSecond) - (Math.PI / 2);
    
    // Draw second hand
    drawHand(rotation, clockRadius - 40, 4, 'red');
}

// Function to draw individual clock hands
function drawHand(angle, length, width, color) {
    ctx.beginPath();
    ctx.moveTo(clockCenterX, clockCenterY);
    ctx.lineTo(
        clockCenterX + length * Math.cos(angle),
        clockCenterY + length * Math.sin(angle)
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

// Function to fill day "spaces"
function drawCone(start, finish, color) {
    ctx.beginPath();
    
    // Move to the apex of the cone
    ctx.moveTo(clockCenterX, clockCenterY);

    const startAngle = (start * degreesPerSecond) - (Math.PI / 2);
    const finishAngle = (finish * degreesPerSecond) - (Math.PI / 2);
    
    // Draw the left side of the cone
    ctx.lineTo(
        clockCenterX + clockRadius * Math.cos(startAngle),
        clockCenterY + clockRadius * Math.sin(startAngle)
    );

    // Draw the right side of the cone
    ctx.arc(clockCenterX, clockCenterY, clockRadius, startAngle, finishAngle);
    
    // Close the path
    ctx.closePath();

    // Set the fill color
    ctx.fillStyle = color;  // Change to any color you prefer
    ctx.fill();                // Fill the cone
}

function processConfigurations() {
    let cones = [];
    for (const [key, value] of Object.entries(configurations)) {
        let start = value[0].split(':');
        let finish = value[1].split(':');
        let color = value[2];

        const totalSecondsStart = start[0] * 3600 + start[1] * 60;
        const totalSecondsFinish = finish[0] * 3600 + finish[1] * 60;

        cones.push([totalSecondsStart, totalSecondsFinish, color]);
    }

    return cones;
}

// Function to clear the canvas and redraw the clock with updated hands
function updateClock() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let conf = processConfigurations()
    for (const i in conf){
        console.info(conf[i]);
        drawCone(conf[i][0], conf[i][1], conf[i][2]);
    }
    
    drawClockDial();
    drawClockHands();
}

// Initial clock rendering and update every second
setInterval(updateClock, 1000);
updateClock();
