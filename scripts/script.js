window.addEventListener('load', function () {
    let display = document.getElementById('display');
    let buttons = document.querySelectorAll('.buttons button');

    // Add the audio element
    let buttonClickSound = document.getElementById('buttonClickSound');

    // Flag to track whether the sound has been played during the current click event
    let soundPlayed = false;

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            handleClick(button);
        });

        // Reset the soundPlayed flag when the mouse is released
        button.addEventListener('mouseup', function () {
            soundPlayed = false;
        });
    });

    function handleClick(button) {
        // Play the button click sound only if it hasn't been played in this click event
        if (!soundPlayed) {
            playButtonClickSound();
            soundPlayed = true; // Set the flag to true to indicate that the sound has been played
        }

        let buttonText = button.textContent;
        handleButtonClick(buttonText);
    }

    function playButtonClickSound() {
        // Play the sound
        buttonClickSound.currentTime = 0; // Reset the sound to the beginning (important for rapid button clicks)
        buttonClickSound.play();
    }

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
        // Check if the value is one of the buttons to exclude
        if (value !== 'AC' && value !== 'Del' && value !== '⚡') {
            display.innerHTML += `<span class="elevator-font">${value}</span>`;
        }
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

    let acButton = document.querySelector('.ac');
    acButton.addEventListener('click', function () {
        resetCalculator();
    });

    let delButton = document.querySelector('.del');
    delButton.addEventListener('click', function () {
        deleteLastCharacter();
    });

    let thunderButton = document.querySelector('.meme');
    thunderButton.addEventListener('click', function () {
        showModal();
    });

    function resetCalculator() {
        // Reset the display
        display.innerHTML = '<span class="elevator-font"></span>';

        // Reset any other state variables or history as needed
        // For example, you might want to reset any stored values or flags

        // Toggle operator buttons to their default state
        toggleOperatorButtons(true);
    }

    function deleteLastCharacter() {
        let displayContent = display.innerHTML;

        // Remove the last character from the content
        if (displayContent.length > 0) {
            let lastCharElement = display.lastElementChild;
            lastCharElement.parentNode.removeChild(lastCharElement);
        }

        // Toggle operator buttons based on the new content
        let lastChar = getLastChar();
        toggleOperatorButtons(lastChar === '' || !isOperator(lastChar));
    }

    function showModal() {
        // Create the modal container
        let modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container');

        // Create the video element
        let videoElement = document.createElement('video');
        videoElement.src = 'https://raw.githubusercontent.com/VivekNeer/Calculator/main/scripts/car.mp4'; // Replace with the actual video file path
        videoElement.type = 'video/mp4'; // Specify the MIME type
        videoElement.autoplay = true;
        videoElement.controls = true;
        videoElement.loop = false;

        // Append the video element to the modal container
        modalContainer.appendChild(videoElement);

        // Append the modal container to the body
        document.body.appendChild(modalContainer);

        setTimeout(function () {
            closeModal(modalContainer);
        }, 11000);
    }

    function closeModal(modalContainer) {
        // Remove the modal container from the body
        document.body.removeChild(modalContainer);
    }
});
