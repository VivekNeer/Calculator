document.addEventListener('DOMContentLoaded', function () {
    let display = document.getElementById('display');
    let buttons = document.querySelectorAll('.buttons button');

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            let buttonText = button.textContent;
            handleButtonClick(buttonText);
        });
    });

    function handleButtonClick(buttonText) {
        if (buttonText !== '=') {
            if (isOperator(buttonText) && isOperator(getLastChar())) {
                return;
            }

            toggleOperatorButtons(!isOperator(buttonText));

            // Update the display
            updateDisplay(buttonText);
        } else {
            // Evaluate the expression and update the display
            evaluateExpression();
        }
    }

    function getLastChar() {
        return display.textContent.slice(-1);
    }

    function updateDisplay(value) {
        display.innerHTML += `<span class="elevator-font">${value}</span>`;
    }

    function evaluateExpression() {
        let expression = display.innerText;

        try {
            // Use custom functions for evaluation
            let result = calculateResult(expression);

            // Update the display with the result
            display.innerHTML = `<span class="elevator-font">${result}</span>`;
        } catch (error) {
            // Handle error if the expression is invalid
            display.innerHTML = `<span class="elevator-font">Error</span>`;
        }
    }

    function isOperator(value) {
        return value === '+' || value === '-' || value === '*' || value === '/';
    }

    function toggleOperatorButtons(enable) {
        buttons.forEach(function (button) {
            let buttonText = button.textContent;
            if (isOperator(buttonText)) {
                button.disabled = !enable;
            }
        });
    }

    // Custom calculation functions
    function calculateResult(expression) {
        // Split the expression into operands and operator
        let parts = expression.match(/(\d+(\.\d*)?|[+\-*/])/g);

        if (!parts) {
            throw new Error("Invalid expression");
        }

        // Convert the array of strings to an array of numbers and operators
        let numbers = parts.map(part => isOperator(part) ? part : parseFloat(part));

        // Handle multiplication and division
        for (let i = 1; i < numbers.length; i += 2) {
            let operator = numbers[i];
            if (operator === '*' || operator === '/') {
                let prevOperand = numbers[i - 1];
                let nextOperand = numbers[i + 1];

                if (isNaN(prevOperand) || isNaN(nextOperand)) {
                    throw new Error("Invalid operands");
                }

                numbers.splice(i - 1, 3, operator === '*' ? prevOperand * nextOperand : prevOperand / nextOperand);
                i -= 2; // Adjust index for the next iteration
            }
        }

        // Handle addition and subtraction
        let result = numbers[0];
        for (let i = 1; i < numbers.length; i += 2) {
            let operator = numbers[i];
            let nextOperand = numbers[i + 1];

            if (isNaN(nextOperand)) {
                throw new Error("Invalid operand");
            }

            result = operator === '+' ? result + nextOperand : result - nextOperand;
        }

        return result;
    }
});
