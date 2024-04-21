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
        '9': '9'
    };

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
        switch (value) {
            case 'C':
                display.textContent = '0';
                operationDisplay.textContent = '';
                return;
            case '←':
                display.textContent = display.textContent.slice(0, -1) || '0';
                return;
            case '=':
                try {
                    const result = evaluate(operationDisplay.textContent);
                    display.textContent = result;
                    operationDisplay.textContent += ' = ' + result;
                } catch (error) {
                    display.textContent = 'Error';
                }
                return;
            default:
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
