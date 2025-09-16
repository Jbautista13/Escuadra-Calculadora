// Function to convert a decimal value (in inches) to a string with feet, inches, and fractions
function convertToFtInFrac(totalInches) {
    if (isNaN(totalInches) || totalInches < 0) return 'Error';

    const ft = Math.floor(totalInches / 12);
    const remainingInches = totalInches % 12;
    const wholeInches = Math.floor(remainingInches);
    const fractionalPart = remainingInches - wholeInches;

    const fractions = {
        '1/16': 0.0625, '1/8': 0.125, '3/16': 0.1875, '1/4': 0.25,
        '5/16': 0.3125, '3/8': 0.375, '7/16': 0.4375, '1/2': 0.5,
        '9/16': 0.5625, '5/8': 0.625, '11/16': 0.6875, '3/4': 0.75,
        '13/16': 0.8125, '7/8': 0.875, '15/16': 0.9375
    };

    let closestFrac = '';
    let minDiff = Infinity;

    // Find the closest common fraction
    if (fractionalPart > 0) {
        for (const frac in fractions) {
            const diff = Math.abs(fractions[frac] - fractionalPart);
            if (diff < minDiff) {
                minDiff = diff;
                closestFrac = frac;
            }
        }
    }

    let resultString = '';
    if (ft > 0) resultString += `${ft}' `;
    if (wholeInches > 0) resultString += `${wholeInches}" `;
    if (closestFrac) resultString += `${closestFrac}"`;

    return resultString.trim();
}


document.getElementById('calculate-btn').addEventListener('click', function() {
    const baseFt = parseFloat(document.getElementById('base-ft').value) || 0;
    const baseIn = parseFloat(document.getElementById('base-in').value) || 0;
    const baseFrac = parseFloat(document.getElementById('base-frac').value) || 0;

    const altitudeFt = parseFloat(document.getElementById('altitude-ft').value) || 0;
    const altitudeIn = parseFloat(document.getElementById('altitude-in').value) || 0;
    const altitudeFrac = parseFloat(document.getElementById('altitude-frac').value) || 0;
    
    const resultElement = document.getElementById('result');
    const copyBtn = document.getElementById('copy-btn');
    const labelA = document.getElementById('label-a');
    const labelB = document.getElementById('label-b');
    const labelC = document.getElementById('label-c');

    // Convert all values to a single unit (inches) for calculation
    const totalBaseInches = (baseFt * 12) + baseIn + baseFrac;
    const totalAltitudeInches = (altitudeFt * 12) + altitudeIn + altitudeFrac;

    if (totalBaseInches <= 0 || totalAltitudeInches <= 0) {
        resultElement.textContent = 'Por favor, introduce valores positivos válidos.';
        resultElement.style.color = '#dc3545';
        copyBtn.hidden = true;
        labelA.textContent = 'a';
        labelB.textContent = 'b';
        labelC.textContent = 'c';
        return;
    }

    const hypotenuseInches = Math.sqrt(Math.pow(totalBaseInches, 2) + Math.pow(totalAltitudeInches, 2));

    const formattedResult = convertToFtInFrac(hypotenuseInches);
    resultElement.textContent = `La hipotenusa (c) es: ${formattedResult}`;
    resultElement.style.color = '#28a745';
    copyBtn.hidden = false;

    // Update labels with original ft/in/frac values
    const baseString = convertToFtInFrac(totalBaseInches);
    const altitudeString = convertToFtInFrac(totalAltitudeInches);
    
    labelA.textContent = `a = ${baseString}`;
    labelB.textContent = `b = ${altitudeString}`;
    labelC.textContent = `c = ${formattedResult}`;

    // Update the triangle visualization
    updateTriangleVisualization(totalBaseInches, totalAltitudeInches, hypotenuseInches);
});

// The visualization logic now works with inches
function updateTriangleVisualization(base, altitude, hypotenuse = 0) {
    const triangleShape = document.getElementById('triangle-shape');
    const labelA = document.getElementById('label-a');
    const labelB = document.getElementById('label-b');
    const labelC = document.getElementById('label-c');

    const svgWidth = 300;
    const svgHeight = 200;
    const padding = 50;

    if (base === 0 || altitude === 0) {
        triangleShape.setAttribute('points', `0,${svgHeight} 0,${svgHeight} 0,${svgHeight}`);
        labelA.textContent = '';
        labelB.textContent = '';
        labelC.textContent = '';
        return;
    }

    const maxDimension = Math.max(base, altitude);
    let scaleFactor = 1;
    if (maxDimension > 0) {
        const availableWidth = svgWidth - 2 * padding;
        const availableHeight = svgHeight - 2 * padding;
        scaleFactor = Math.min(availableWidth / base, availableHeight / altitude);
        if (scaleFactor > 20) scaleFactor = 20;
        if (scaleFactor < 0.1) scaleFactor = 0.1;
    }

    const scaledBase = base * scaleFactor;
    const scaledAltitude = altitude * scaleFactor;

    const p1_x = padding;
    const p1_y = svgHeight - padding;

    const p2_x = padding + scaledBase;
    const p2_y = svgHeight - padding;

    const p3_x = padding;
    const p3_y = svgHeight - padding - scaledAltitude;

    triangleShape.setAttribute('points', `${p1_x},${p1_y} ${p2_x},${p2_y} ${p3_x},${p3_y}`);

    labelA.setAttribute('x', p1_x + scaledBase / 2);
    labelA.setAttribute('y', p1_y + 20);

    labelB.setAttribute('x', p1_x - 15);
    labelB.setAttribute('y', p1_y - scaledAltitude / 2);
    labelB.setAttribute('text-anchor', 'end');

    if (hypotenuse > 0) {
        const midX_c = (p2_x + p3_x) / 2;
        const midY_c = (p2_y + p3_y) / 2;

        const angleRad = Math.atan2(p3_y - p2_y, p3_x - p2_x);
        const offsetX = Math.cos(angleRad + Math.PI / 2) * 20;
        const offsetY = Math.sin(angleRad + Math.PI / 2) * 20;

        labelC.setAttribute('x', midX_c + offsetX);
        labelC.setAttribute('y', midY_c + offsetY);
    }
}


document.getElementById('copy-btn').addEventListener('click', function() {
    const resultElement = document.getElementById('result');
    const resultText = resultElement.textContent;
    const copyBtn = document.getElementById('copy-btn');

    const valueToCopy = resultText.split(': ')[1];

    if (valueToCopy) {
        navigator.clipboard.writeText(valueToCopy)
            .then(() => {
                const originalText = copyBtn.textContent;
                const originalBackground = copyBtn.style.background;
                
                copyBtn.textContent = '¡Copiado!';
                copyBtn.style.background = '#28a745';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = originalBackground;
                }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar el texto: ', err);
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Error';
                copyBtn.style.background = '#dc3545';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = originalBackground;
                }, 2000);
            });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Initial state with a default triangle that fits
    updateTriangleVisualization(3 * 12, 4 * 12, 5 * 12);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered! Scope:', registration.scope);
      })
      .catch(err => {
        console.log('Service Worker registration failed:', err);
      });
  });
}