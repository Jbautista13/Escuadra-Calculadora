document.getElementById('calculate-btn').addEventListener('click', function() {
    const baseInput = document.getElementById('base').value;
    const altitudeInput = document.getElementById('altitude').value;
    const resultElement = document.getElementById('result');
    const copyBtn = document.getElementById('copy-btn');

    const a = parseFloat(baseInput);
    const b = parseFloat(altitudeInput);

    const labelA = document.getElementById('label-a');
    const labelB = document.getElementById('label-b');
    const labelC = document.getElementById('label-c');

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
        resultElement.textContent = 'Por favor, introduce números positivos válidos para ambos lados.';
        resultElement.style.color = '#dc3545';
        copyBtn.hidden = true;
        labelA.textContent = 'a';
        labelB.textContent = 'b';
        labelC.textContent = 'c';
        return;
    }

    const hypotenuse = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    resultElement.textContent = `La hipotenusa (c) es: ${hypotenuse.toFixed(2)}`;
    resultElement.style.color = '#28a745';

    copyBtn.hidden = false;

    labelA.textContent = `a = ${a.toFixed(2)}`;
    labelB.textContent = `b = ${b.toFixed(2)}`;
    labelC.textContent = `c = ${hypotenuse.toFixed(2)}`;
});

document.getElementById('copy-btn').addEventListener('click', function() {
    const resultElement = document.getElementById('result');
    const resultText = resultElement.textContent;
    const copyBtn = document.getElementById('copy-btn');

    const valueToCopy = resultText.split(': ')[1];

    if (valueToCopy) {
        navigator.clipboard.writeText(valueToCopy)
            .then(() => {
                // Change button text and style for a few seconds to confirm copy
                const originalText = copyBtn.textContent;
                const originalBackground = copyBtn.style.background;
                
                copyBtn.textContent = '¡Copiado!';
                copyBtn.style.background = '#28a745'; // Green color for success
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = originalBackground;
                }, 2000); // Revert after 2 seconds
            })
            .catch(err => {
                console.error('Error al copiar el texto: ', err);
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Error';
                copyBtn.style.background = '#dc3545'; // Red color for error
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = originalBackground;
                }, 2000); // Revert after 2 seconds
            });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('label-a').textContent = 'a';
    document.getElementById('label-b').textContent = 'b';
    document.getElementById('label-c').textContent = 'c';
});