const display = document.querySelector(".display");
const buttonNumbers = document.querySelectorAll(".number");
const buttonAlgorithm = document.querySelectorAll(".algorithm");
const buttonClear = document.querySelector(".clear");
const buttonEqual = document.querySelector(".equal");
const displayMaxLength = 10;
let hasDecimal = false;

const updateDisplay = () => {
  if (display.textContent.length > displayMaxLength) {
    display.textContent = display.textContent.slice(0, displayMaxLength);
  }
};

buttonNumbers.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonPressed = button.textContent;

    if (display.textContent === "0") {
      display.textContent = buttonPressed;
    } else if (buttonPressed === "." && hasDecimal) {
    } else {
      display.textContent += buttonPressed;
      if (buttonPressed === ".") {
        hasDecimal = true;
      }
      updateDisplay();
    }
  });
});

buttonAlgorithm.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonPressed = button.textContent;
    const lastOperator = display.textContent.slice(-1);
    const lastNumberIndex = display.textContent.lastIndexOf(/[+\-*/]/);

    if (buttonPressed === "√") {
      let numberToRoot = parseFloat(
        display.textContent.slice(lastNumberIndex + 1)
      );
      if (isNaN(numberToRoot)) {
        return;
      }

      const result = Math.sqrt(numberToRoot).toFixed(
        Number.isInteger(Math.sqrt(numberToRoot)) ? 0 : 3
      );

      display.textContent =
        display.textContent.slice(0, lastNumberIndex + 1) + result;
    } else if (display.textContent === "0") {
      return;
    } else if (/[\+\-\*\/]/.test(lastOperator)) {
      display.textContent = display.textContent.slice(0, -1) + buttonPressed;
    } else {
      display.textContent += buttonPressed;
      hasDecimal = false;
      updateDisplay();
    }
  });
});

buttonClear.addEventListener("click", () => {
  display.textContent = "0";
  hasDecimal = false;
  lastOperator = null;
});

const calculate = (mathOperation) => {
  let result = 0;
  let operation = "";
  let operands = [];

  const mathExpressionRegex =
    /(\d+(\.\d+)?|\.)|([\+\-\*\/])|(\u221A\d+(\.\d+)?)/g;

  let currentExpressionMatch = mathExpressionRegex.exec(mathOperation);
  while (currentExpressionMatch !== null) {
    if (/[\+\-\*\/]/.test(currentExpressionMatch[0])) {
      operands.push(Number(result));
      operation = currentExpressionMatch[0];
      result = 0;
    } else if (/\u221A/.test(currentExpressionMatch[0])) {
      result = parseFloat(currentExpressionMatch[0]);
    } else {
      result = parseFloat(currentExpressionMatch[0]);
    }
    currentExpressionMatch = mathExpressionRegex.exec(mathOperation);

    if (
      currentExpressionMatch === null ||
      /[\+\-]/.test(currentExpressionMatch[0])
    ) {
      operands.push(Number(result));
      if (operands.includes(0) && operation === "/") {
        return "Error";
      }
      switch (operation) {
        case "+":
          result = operands.reduce((accumulator, item) => accumulator + item);
          break;
        case "-":
          result = operands.reduce((accumulator, item) => accumulator - item);
          break;
        case "*":
          result = operands.reduce((accumulator, item) => accumulator * item);
          break;
        case "/":
          result = operands.reduce((accumulator, item) => accumulator / item);
          break;
        case "√":
          result = Math.sqrt(operands[0]);
          break;
        default:
      }

      if (
        currentExpressionMatch !== null &&
        /[\+\-]/.test(currentExpressionMatch[0])
      ) {
        return (
          result +
          calculate(mathOperation.substring(currentExpressionMatch.index))
        );
      }

      if (Number.isInteger(result)) {
        return result;
      } else {
        return Math.round(result * 1000) / 1000;
      }
    }
  }
};

buttonEqual.addEventListener("click", () => {
  const result = calculate(display.textContent);
  display.textContent = result;
  hasDecimal = display.textContent.includes(".");
  updateDisplay();
});
