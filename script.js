document.getElementById('calculate-btn').addEventListener('click', function() {
    const baseInput = document.getElementById('base').value;
    const altitudeInput = document.getElementById('altitude').value;
    const resultElement = document.getElementById('result');

    const a = parseFloat(baseInput); // Base
    const b = parseFloat(altitudeInput); // Altura

    const labelA = document.getElementById('label-a');
    const labelB = document.getElementById('label-b');
    const labelC = document.getElementById('label-c');

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
        resultElement.textContent = 'Por favor, introduce números positivos válidos para ambos lados.';
        resultElement.style.color = '#dc3545';
        labelA.textContent = 'a';
        labelB.textContent = 'b';
        labelC.textContent = 'c';
        return;
    }

    const hypotenuse = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    resultElement.textContent = `La hipotenusa (c) es: ${hypotenuse.toFixed(2)}`;
    resultElement.style.color = '#28a745';

    labelA.textContent = `a = ${a.toFixed(2)}`;
    labelB.textContent = `b = ${b.toFixed(2)}`;
    labelC.textContent = `c = ${hypotenuse.toFixed(2)}`;
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('label-a').textContent = 'a';
    document.getElementById('label-b').textContent = 'b';
    document.getElementById('label-c').textContent = 'c';
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