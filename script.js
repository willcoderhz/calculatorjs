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
                    display.textContent = result.toFixed(4);
                    operationDisplay.textContent = result.toFixed(4);
                    lastResult = result;
                    isNewOperation = true;
                } catch (error) {
                    display.textContent = 'Error';
                    isNewOperation = true;
                }
                return;
            case '√':
                if (display.textContent !== '0' && display.textContent !== '') {
                    operationDisplay.textContent = `√(${display.textContent})`;
                    display.textContent = `√(${display.textContent})`;
                    try {
                        const sqrtResult = evaluate(operationDisplay.textContent);
                        display.textContent = sqrtResult.toFixed(4);
                        operationDisplay.textContent = sqrtResult.toFixed(4);
                        lastResult = sqrtResult;
                        isNewOperation = true;
                    } catch (error) {
                        display.textContent = 'Error';
                        isNewOperation = true;
                    }
                }
                return;
            case '.':
                if (!display.textContent.includes('.')) {
                    display.textContent += '.';
                    operationDisplay.textContent += '.';
                }
                return;
            case '0':
                if (display.textContent !== '0') {
                    display.textContent += '0';
                    operationDisplay.textContent += '0';
                }
                return;
            case '^':
                if (isNewOperation) {
                    display.textContent = lastResult.toString();
                    operationDisplay.textContent = lastResult.toString();
                    isNewOperation = false;
                }
                display.textContent += '^';
                operationDisplay.textContent += '^';
                break;
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
        sanitizedExpression = sanitizedExpression.replace(/√\(([^)]+)\)/g, (match, number) => `Math.sqrt(${number})`);

        const result = Function('"use strict";return (' + sanitizedExpression + ')')();
        return Number(result); // Ensure the result is a number
    }
});
