import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles.css";

export default function App() {
  const [cardNumber, setCardNumber] = useState("");
  const [isValid, setIsValid] = useState(null);
  const maxCardLength = 19; // Maximum credit card length

  const luhnCheck = (cardNumber) => {
    cardNumber = cardNumber.replace(/\D/g, "");
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
    return number.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleChange = (event) => {
    let input = event.target.value.replace(/\D/g, "");
    if (input.length > maxCardLength) {
      input = input.slice(0, maxCardLength);
    }
    const formattedNumber = formatCardNumber(input);
    setCardNumber(formattedNumber);

    const cleanNumber = formattedNumber.replace(/\s/g, "");
    if (cleanNumber.length >= 13) {
      setIsValid(luhnCheck(cleanNumber));
    } else {
      setIsValid(null);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Credit Card Validator</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter card number"
            value={cardNumber}
            onChange={handleChange}
            maxLength={maxCardLength + 3} // Allowing for spaces
          />
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
        <p>Created by: SANNAGHI Nabil</p>
      </header>
    </div>
  );
}
