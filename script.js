const toggles = document.querySelectorAll('.toggle');
const slider = document.querySelector('.slider');
const theme = localStorage.getItem('theme');
const keys = document.querySelectorAll('.key');
const display = document.querySelector('h1');
let resultsArray = display.innerHTML.split(' ');
let results = resultsArray.join('');
const setTheme = index => {
    localStorage.setItem('theme', index)
        document.documentElement.setAttribute('data-theme', 'theme' + index);
};
const moveSlider = index => {
    let translate = (+index - 1) * 20;
    slider.style.transform = `translateX(${translate}px)`;
};
const isOperation = val => {
    if (val === '+' || val === '*' || val === '-' || val === '/' || val === 'x') {
        return true;
    }
    return false;
};
const checkLastIndexOperation = () => {
    if (isOperation(results[results.length-2]) && results[results.length-1] === ' ') {
        const resultArray = results.split(' ');
        resultArray.splice(resultArray.length-2, 1);
        results = resultArray.join(' ');
    }
};
const evaluate = () => {
    let evaluateResult = results;
    evaluateResult = evaluateResult.replaceAll('x', '*');
    return (eval(evaluateResult)).toString();
};
setTheme(theme);
moveSlider(theme);
toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        setTheme(toggle.ariaValueText);
        moveSlider(toggle.ariaValueText);
    });
});
const validateInput = input => {
    if (input !== '.') return true;
    console.log(results);
    const resultArray = results.split(' ');
    if (resultArray[resultArray.length-1].indexOf('.') === -1) {
        return true;
    }
    return false;
};
const displayError = () => {
    results = ''
    const interval = setInterval(() => {
        if (display.innerHTML !== 'Error') {
            display.innerHTML = 'Error';
        } else {
            display.innerHTML = '';
        }
    }, 500);
    setTimeout(() => {
        clearInterval(interval);
        results = '';
        display.innerHTML = results;
    }, 3000);
};
const checkForErrors = result => {
    if (result === 'Infinity' || result === 'NaN') {
        displayError();
        return false;
    }
    return true;
};
const checkConditions = input => {
    if (((+input >= 0 && +input < 10) || input === '.') && validateInput(input)) {
        results += input;
    } else if (isOperation(input)) {
        if (results.length === 0) {
            results = 0;
        }
        let val = input;
        if (input === '*') {
            val = 'x';
        }
        checkLastIndexOperation()
        results += ` ${val} `;
    } else if (input.toLowerCase() === 'delete' || input.toLowerCase() === 'backspace' || input.toLowerCase() === 'del') {
        let endIndex = results.length - 1;
            if (isOperation(results[results.length - 2])) {
                endIndex = results.length - 3;
            }
            results = results.slice(0, endIndex);
    } else if (input === '=' || input.toLowerCase() === 'enter') {
        checkLastIndexOperation();
        results = evaluate();
    } else if (input.toLowerCase() === 'reset' || input.toLowerCase() === 'escape') {
        results = '';
    }
    if (checkForErrors(results)) {
        display.innerHTML = results;
    }
}
document.addEventListener('keydown', (e) => {
    checkConditions(e.key);
});
keys.forEach(key => {
    key.addEventListener('click', () => {
        checkConditions(key.innerHTML);
    });
});