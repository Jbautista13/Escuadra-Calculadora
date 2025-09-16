document.getElementById('calculate-btn').addEventListener('click', function() {
    const baseInput = document.getElementById('base').value;
    const altitudeInput = document.getElementById('altitude').value;
    const resultElement = document.getElementById('result');
    const copyBtn = document.getElementById('copy-btn');

    const a = parseFloat(baseInput); // Base
    const b = parseFloat(altitudeInput); // Altitude

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

    // Update the triangle visualization
    updateTriangleVisualization(a, b, hypotenuse);
});

function updateTriangleVisualization(base, altitude, hypotenuse = 0) {
    const triangleShape = document.getElementById('triangle-shape');
    const labelA = document.getElementById('label-a');
    const labelB = document.getElementById('label-b');
    const labelC = document.getElementById('label-c');

    const svgWidth = 300;
    const svgHeight = 200;
    const padding = 40; // Increased padding from 20 to 40

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

    labelA.textContent = `a = ${base.toFixed(2)}`;
    labelA.setAttribute('x', p1_x + scaledBase / 2);
    labelA.setAttribute('y', p1_y + 15);

    labelB.textContent = `b = ${altitude.toFixed(2)}`;
    labelB.setAttribute('x', p1_x - 25);
    labelB.setAttribute('y', p1_y - scaledAltitude / 2);

    if (hypotenuse > 0) {
        labelC.textContent = `c = ${hypotenuse.toFixed(2)}`;
        const midX_c = (p2_x + p3_x) / 2;
        const midY_c = (p2_y + p3_y) / 2;

        const angleRad = Math.atan2(p3_y - p2_y, p3_x - p2_x);
        const offsetX = Math.cos(angleRad + Math.PI / 2) * 15;
        const offsetY = Math.sin(angleRad + Math.PI / 2) * 15;

        labelC.setAttribute('x', midX_c + offsetX);
        labelC.setAttribute('y', midY_c + offsetY);
    } else {
        labelC.textContent = '';
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
    updateTriangleVisualization(3, 4, 5);
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('label-a').textContent = 'a';
    document.getElementById('label-b').textContent = 'b';
    document.getElementById('label-c').textContent = 'c';
});