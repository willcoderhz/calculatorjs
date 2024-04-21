document.addEventListener('DOMContentLoaded', function() {
    const operationDisplay = document.querySelector('.operation-display');
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('button');
    const keyMap = {
        'Enter': '=',
        'Backspace': '←',
        ' ': 'C',
        '+': '+',
        '-': '-',
        '*': 'x',
        '/': '÷',
        '(': '(',
        ')': ')',
        '.': '.',
        '^': '^',
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        'r': '√' 
    };

    let lastResult = 0;
    let isNewOperation = true;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            processInput(value);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (keyMap[e.key] !== undefined) {
            processInput(keyMap[e.key]);
            e.preventDefault();
        }
    });

    function processInput(value) {
        if (isNewOperation && '0123456789'.includes(value)) {
            display.textContent = '';
            operationDisplay.textContent = '';
            isNewOperation = false;
        }
    
        switch (value) {
            case 'C':
                display.textContent = '0';
                operationDisplay.textContent = '';
                isNewOperation = true;
                return;
            case '←':
                display.textContent = display.textContent.slice(0, -1) || '0';
                return;
            case '=':
                try {
                    const result = evaluate(operationDisplay.textContent);
                    display.textContent = result;
                    operationDisplay.textContent = result;
                    lastResult = result;
                    isNewOperation = true;
                } catch (error) {
                    display.textContent = 'Error';
                    isNewOperation = true;
                }
                return;
            case '√':
                if (display.textContent === '0') return;  // Avoid computing square root of zero display
                display.textContent = Math.sqrt(parseFloat(display.textContent)).toString();
                operationDisplay.textContent = `√(${display.textContent})`;
                isNewOperation = true;
                return;
            default:
                if (isNewOperation && '+-x÷'.includes(value)) {
                    display.textContent = lastResult;
                    operationDisplay.textContent = lastResult;
                    isNewOperation = false;
                }
                if (display.textContent === '0') display.textContent = '';
                display.textContent += value;
                operationDisplay.textContent += value;
        }
    }
    

    function evaluate(expression) {
        let sanitizedExpression = expression.replace(/x/g, '*').replace(/÷/g, '/');
        sanitizedExpression = sanitizedExpression.replace(/\^/g, '**');
        return Function('"use strict";return (' + sanitizedExpression + ')')();
    }
});
