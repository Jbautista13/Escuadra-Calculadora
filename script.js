// Function to convert a decimal value (in inches) to a string with feet, inches, and fractions
function convertToFtInFrac(totalInches) {
    if (isNaN(totalInches) || totalInches < 0) return 'Error';

    // Round the total inches to the nearest 1/16th of an inch
    const roundedInches = Math.round(totalInches * 16) / 16;

    const ft = Math.floor(roundedInches / 12);
    const remainingInches = roundedInches % 12;
    const wholeInches = Math.floor(remainingInches);
    const fractionalPart = remainingInches - wholeInches;

    const fractions = {
        '0': 0, '1/16': 0.0625, '1/8': 0.125, '3/16': 0.1875, '1/4': 0.25,
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
    } else {
        closestFrac = '0';
    }

    let resultString = '';
    if (ft > 0) resultString += `${ft}' `;
    if (wholeInches > 0) resultString += `${wholeInches}" `;
    if (closestFrac && closestFrac !== '0') resultString += `${closestFrac}"`;
    if (resultString.trim() === '' && totalInches > 0) {
        resultString = '0"';
    }

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

// Global variables to hold the last calculated values
let lastBaseInches = 0;
let lastAltitudeInches = 0;
let lastDiagonalInches = 0;


// Function to add the last result to the history list
function addResultToHistory() {
    if (lastDiagonalInches > 0) {
        const historyContainer = document.getElementById('history-container');
        const historyList = document.getElementById('history-list');

        const baseString = convertToFtInFrac(lastBaseInches);
        const altitudeString = convertToFtInFrac(lastAltitudeInches);
        const formattedResult = convertToFtInFrac(lastDiagonalInches);
        const totalInchesRounded = parseFloat(Math.round(lastDiagonalInches * 16) / 16);

        const historyText = `${baseString} x ${altitudeString} = ${formattedResult} (${totalInchesRounded} in)`;
    
        const newHistoryItem = document.createElement('li');
        
        const textSpan = document.createElement('span');
        textSpan.textContent = historyText;
        
        const historyCopyBtn = document.createElement('button');
        historyCopyBtn.className = 'copy-button';
        historyCopyBtn.textContent = 'Copiar';
        // Store the value directly on the button using a data attribute
        historyCopyBtn.dataset.valueToCopy = totalInchesRounded;
    
        newHistoryItem.appendChild(textSpan);
        newHistoryItem.appendChild(historyCopyBtn);
    
        historyList.prepend(newHistoryItem);
    
        // Add event listener to the new history button
        historyCopyBtn.addEventListener('click', function() {
            // Retrieve the value from the data attribute
            const valueToCopy = this.dataset.valueToCopy;
            handleCopy(valueToCopy, this);
        });
    
        // Limit the history to a maximum of 5 items
        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
        
        // Show the history container
        historyContainer.hidden = false;
        
        // Reset last calculated values
        lastBaseInches = 0;
        lastAltitudeInches = 0;
        lastDiagonalInches = 0;
    }
}


document.getElementById('calculate-btn').addEventListener('click', function() {
    const baseFt = document.getElementById('base-ft');
    const baseIn = document.getElementById('base-in');
    const baseFrac = document.getElementById('base-frac');

    const altitudeFt = document.getElementById('altitude-ft');
    const altitudeIn = document.getElementById('altitude-in');
    const altitudeFrac = document.getElementById('altitude-frac');
    
    const resultElement = document.getElementById('result');
    const resultInchesElement = document.getElementById('result-inches');
    const copyBtn = document.getElementById('copy-btn');

    // Add previous result to history before calculating a new one.
    addResultToHistory();

    // Convert all values to a single unit (inches) for calculation
    const totalBaseInches = (parseFloat(baseFt.value) * 12) + (parseFloat(baseIn.value) || 0) + (parseFloat(baseFrac.value) || 0);
    const totalAltitudeInches = (parseFloat(altitudeFt.value) * 12) + (parseFloat(altitudeIn.value) || 0) + (parseFloat(altitudeFrac.value) || 0);

    if (totalBaseInches <= 0 || totalAltitudeInches <= 0) {
        resultElement.textContent = 'Por favor, introduce valores positivos válidos.';
        resultElement.style.color = '#dc3545';
        resultInchesElement.textContent = '';
        copyBtn.hidden = true;
        return;
    }

    const diagonalInches = Math.sqrt(Math.pow(totalBaseInches, 2) + Math.pow(totalAltitudeInches, 2));

    const formattedResult = convertToFtInFrac(diagonalInches);
    const totalInchesRounded = parseFloat(Math.round(diagonalInches * 16) / 16);

    resultElement.textContent = `La diagonal (c) es: ${formattedResult}`;
    resultElement.style.color = '#28a745';
    resultInchesElement.textContent = `(${totalInchesRounded} pulgadas)`;
    copyBtn.hidden = false;

    // Store the last calculated values
    lastBaseInches = totalBaseInches;
    lastAltitudeInches = totalAltitudeInches;
    lastDiagonalInches = diagonalInches;

    // Clear the inputs
    baseFt.value = '';
    baseIn.value = '';
    baseFrac.selectedIndex = 0;
    
    altitudeFt.value = '';
    altitudeIn.value = '';
    altitudeFrac.selectedIndex = 0;
    
    // Call the history function again to immediately add the NEW result
    addResultToHistory();
});


// Main copy button event listener
document.getElementById('copy-btn').addEventListener('click', function() {
    const resultInchesElement = document.getElementById('result-inches');
    const copyBtn = document.getElementById('copy-btn');
    const valueToCopy = resultInchesElement.textContent.replace('(', '').replace(' pulgadas)', '');
    handleCopy(valueToCopy, copyBtn);
});


// Event listeners to clear the result text on input change
const inputs = document.querySelectorAll('.input-row input, .input-row select');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        const resultElement = document.getElementById('result');
        const resultInchesElement = document.getElementById('result-inches');
        const copyBtn = document.getElementById('copy-btn');
        
        if (resultElement.textContent !== '') {
            resultElement.textContent = '';
            resultInchesElement.textContent = '';
            copyBtn.hidden = true;
        }
    });
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