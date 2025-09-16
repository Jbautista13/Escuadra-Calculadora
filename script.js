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

// Reusable function to handle the copy logic
function handleCopy(textToCopy, buttonElement) {
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                const originalText = buttonElement.textContent;
                const originalBackground = buttonElement.style.background;
                
                buttonElement.textContent = '¡Copiado!';
                buttonElement.style.background = '#28a745';
                
                setTimeout(() => {
                    buttonElement.textContent = originalText;
                    buttonElement.style.background = originalBackground;
                }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar el texto: ', err);
                const originalText = buttonElement.textContent;
                buttonElement.textContent = 'Error';
                buttonElement.style.background = '#dc3545';
                
                setTimeout(() => {
                    buttonElement.textContent = originalText;
                    buttonElement.style.background = originalBackground;
                }, 2000);
            });
    }
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
    const historyContainer = document.getElementById('history-container');
    const historyList = document.getElementById('history-list');

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

    // Add a new entry to the history
    const baseString = convertToFtInFrac(totalBaseInches);
    const altitudeString = convertToFtInFrac(totalAltitudeInches);
    const historyText = `${baseString} x ${altitudeString} = ${formattedResult}`;

    const newHistoryItem = document.createElement('li');
    
    const textSpan = document.createElement('span');
    textSpan.textContent = historyText;
    
    const historyCopyBtn = document.createElement('button');
    historyCopyBtn.className = 'copy-button';
    historyCopyBtn.textContent = 'Copiar';

    newHistoryItem.appendChild(textSpan);
    newHistoryItem.appendChild(historyCopyBtn);

    historyList.prepend(newHistoryItem);

    // Add event listener to the new history button
    historyCopyBtn.addEventListener('click', function() {
        const valueToCopy = historyText.split('= ')[1];
        handleCopy(valueToCopy, historyCopyBtn);
    });

    // Limit the history to a maximum of 5 items
    if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
    
    // Show the history container
    historyContainer.hidden = false;
});


// Main copy button event listener
document.getElementById('copy-btn').addEventListener('click', function() {
    const resultElement = document.getElementById('result');
    const resultText = resultElement.textContent;
    const copyBtn = document.getElementById('copy-btn');
    const valueToCopy = resultText.split(': ')[1];
    handleCopy(valueToCopy, copyBtn);
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