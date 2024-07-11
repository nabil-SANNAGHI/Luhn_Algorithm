import React, { useState, useEffect } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles.css";

function App() {
  const [cardNumber, setCardNumber] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [cardType, setCardType] = useState('Unknown');
  const maxCardLength = 19; // Maximum credit card length including spaces
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    const inputElement = document.getElementById('credit-card-input');
    inputElement.setSelectionRange(cursorPosition, cursorPosition);
  }, [cardNumber, cursorPosition]);

  const luhnCheck = (cardNumber) => {
    cardNumber = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const formatCardNumber = (number) => {
    number = number.replace(/\D/g, '');
    const cardType = detectCardType(number);
    setCardType(cardType);
    let formattedNumber = '';

    if (cardType === 'American Express') {
      for (let i = 0; i < number.length; i++) {
        if (i === 4 || i === 10) {
          formattedNumber += ' ';
        }
        formattedNumber += number[i];
      }
    } else {
      for (let i = 0; i < number.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedNumber += ' ';
        }
        formattedNumber += number[i];
      }
    }

    return formattedNumber;
  };

  const detectCardType = (number) => {
    const cardPatterns = {
      'Visa': /^4/,
      'MasterCard': /^5[1-5]/,
      'American Express': /^3[47]/,
      'Discover': /^6(?:011|5)/,
      'Diners Club': /^3(?:0[0-5]|[68])/,
      'JCB': /^(?:2131|1800|35)/
    };

    for (const [card, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(number)) {
        return card;
      }
    }
    return 'Unknown';
  };

  const handleChange = (event) => {
    const inputElement = event.target;
    const cursorPosition = inputElement.selectionStart;
    let input = inputElement.value.replace(/\D/g, '');
    if (input.length > maxCardLength) {
      input = input.slice(0, maxCardLength);
    }
    const formattedNumber = formatCardNumber(input);

    // Calculate the new cursor position
    const spacesBefore = (inputElement.value.slice(0, cursorPosition).match(/ /g) || []).length;
    const spacesAfter = (formattedNumber.slice(0, cursorPosition).match(/ /g) || []).length;
    const adjustment = spacesAfter - spacesBefore;
    setCursorPosition(cursorPosition + adjustment);

    setCardNumber(formattedNumber);

    const cleanNumber = formattedNumber.replace(/\s/g, '');
    if (cleanNumber.length >= 13) {
      const valid = luhnCheck(cleanNumber);
      setIsValid(valid);
      if (!valid) {
        setCardType('Unknown');
      }
    } else {
      setIsValid(null);
      setCardType('Unknown');
    }
  };

  const handleKeyDown = (event) => {
    const allowedKeys = [
      'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Tab', 'Escape', 'Enter',
      'Home', 'End', 'PageUp', 'PageDown', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock',
      'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
    ];

    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const paste = (event.clipboardData || window.clipboardData).getData('text');
    const cleanPaste = paste.replace(/[^\d\s]/g, '');
    const input = event.target;
    const currentValue = input.value;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    const newValue = currentValue.substring(0, selectionStart) + cleanPaste + currentValue.substring(selectionEnd);
    setCardNumber(formatCardNumber(newValue));
    handleChange({ target: input });
  };

  const getCardTypeIcon = (cardType) => {
    switch (cardType) {
      case 'Visa':
        return <i className="fab fa-cc-visa card-type-icon"></i>;
      case 'MasterCard':
        return <i className="fab fa-cc-mastercard card-type-icon"></i>;
      case 'American Express':
        return <i className="fab fa-cc-amex card-type-icon"></i>;
      case 'Discover':
        return <i className="fab fa-cc-discover card-type-icon"></i>;
      case 'Diners Club':
        return <i className="fab fa-cc-diners-club card-type-icon"></i>;
      case 'JCB':
        return <i className="fab fa-cc-jcb card-type-icon"></i>;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Credit Card Validator</h1>
        <div className="input-container">
          <input
            type="text"
            id="credit-card-input"
            className="input-field"
            placeholder="Card Number"
            value={cardNumber}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            maxLength={maxCardLength + 3} // Allowing for spaces
          />
          {isValid && getCardTypeIcon(cardType)}
          {isValid === true && (
            <i className="fas fa-check-circle valid-icon"></i>
          )}
          {isValid === false && (
            <i className="fas fa-times-circle invalid-icon"></i>
          )}
        </div>
        <div className="luhn-algorithm">
          <h2>Luhn Algorithm</h2>
          <pre>
            {`
function luhnCheck(cardNumber) {
  cardNumber = cardNumber.replace(/\\D/g, '');
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
`}
          </pre>
        </div>
        <div className="footer">
          <p className="repo">repository: <a href="https://github.com/nabil-SANNAGHI/Luhn_Algorithm/" target="_blank" rel="noreferrer">https://github.com/nabil-SANNAGHI/Luhn_Algorithm/</a></p>
          <p>Created by: SANNAGHI Nabil</p>
        </div>
      </header>
    </div>
  );
}

export default App;
