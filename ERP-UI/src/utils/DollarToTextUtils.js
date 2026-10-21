const NumberToDollar = (value) => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertLessThanOneThousand(number) {
    let text = "";
    if (number >= 100) {
      text += ones[Math.floor(number / 100)] + " Hundred ";
      number %= 100;
    }
    if (number >= 20) {
      text += tens[Math.floor(number / 10)];
      if (number % 10 !== 0) {
        text += "-" + ones[number % 10];
      }
    } else if (number >= 10) {
      text += teens[number - 10];
    } else if (number > 0) {
      text += ones[number];
    }
    return text;
  }

  if (value === 0) {
    return "Zero Dollars";
  }

  let dollar = Math.floor(value);
  const cents = Math.round((value - dollar) * 100);

  let text = "";
  let divisor = 1000000000; // For billions
  const labels = ["Billion", "Million", "Thousand", ""];

  for (let i = 0; i < labels.length; i++) {
    const currentPart = Math.floor(dollar / divisor);
    if (currentPart > 0) {
      text += convertLessThanOneThousand(currentPart) + " " + labels[i] + " ";
    }
    dollar %= divisor;
    divisor /= 1000;
  }

  if (cents > 0) {
    text += "and " + convertLessThanOneThousand(cents) + " Cents";
  }

  return "US DOLLAR " + text;
};

export default NumberToDollar;
