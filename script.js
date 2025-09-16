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

    // Convert all values to a single unit (inches) for calculation
    const totalBaseInches = (baseFt * 12) + baseIn + baseFrac;
    const totalAltitudeInches = (altitudeFt * 12) + altitudeIn + altitudeFrac;

    if (totalBaseInches <= 0 || totalAltitudeInches <= 0) {
        resultElement.textContent = 'Por favor, introduce valores positivos válidos.';
        resultElement.style.color = '#dc3545';
        copyBtn.hidden = true;
        return;
    }

    const diagonalInches = Math.sqrt(Math.pow(totalBaseInches, 2) + Math.pow(totalAltitudeInches, 2));

    const formattedResult = convertToFtInFrac(diagonalInches);
    resultElement.textContent = `La diagonal (c) es: ${formattedResult}`;
    resultElement.style.color = '#28a745';
    copyBtn.hidden = false;
});


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