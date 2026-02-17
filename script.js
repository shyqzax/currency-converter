const currencyOne = document.getElementById("currencyOne");
const currencyTwo = document.getElementById("currencyTwo");
const searchOne = document.getElementById("searchCurrencyOne");
const searchTwo = document.getElementById("searchCurrencyTwo");
const inpt = document.querySelector(".sumInput");
const btnConvert = document.querySelector(".btn");
const btnSwap = document.querySelector(".swap-btn");
const resultConvert = document.querySelector(".result");
const userText = document.querySelector(".errorText");

let allCurrencies = [];
inpt.value = 1;

async function getData(one, two, value) {
  let load = true;
  userText.textContent = "";

  if (load) {
    resultConvert.textContent = "Загрузка, пожалуйста подождите";
  }

  try {
    const responce = await fetch(
      "https://v6.exchangerate-api.com/v6/823ccc099a0993044531bbbb/latest/" +
        one,
    );
    const data = await responce.json();
    const currentTo = data.conversion_rates[two];

    if (!currentTo) {
      resultConvert.textContent = "Result: 0";
      userText.textContent = "Ошибка: валюта не найдена";
      return;
    }

    if (one === two) {
      resultConvert.textContent = "Result: 0";
      userText.textContent = "А какой смысл? :)";
      return;
    }

    if (value < 0) {
      resultConvert.textContent = "Result: 0";
      userText.textContent =
        "Использование отрицательных значений не допустимо!";
      return;
    }

    const res = value * currentTo;
    resultConvert.textContent = `Result: ${+res.toFixed(2)} ${two}`;
  } catch (error) {
    userText.textContent = `Не удалось получить курс. Попробуйте еще раз`;
    console.log("Ошибка", error);
  }
  load = false;
}

async function newOptionsToSelect() {
  try {
    const responce = await fetch(
      "https://v6.exchangerate-api.com/v6/823ccc099a0993044531bbbb/latest/USD",
    );
    const data = await responce.json();
    allCurrencies = Object.keys(data.conversion_rates);

    for (let key in data.conversion_rates) {
      const option1 = new Option(key, key);
      currencyOne.add(option1);
      const option2 = new Option(key, key);
      currencyTwo.add(option2);
      currencyOne.value = "USD";
      currencyTwo.value = "RUB";
    }
  } catch (error) {
    console.log("ошибка!", error);
  }
}
newOptionsToSelect();

function filtration(text, select) {
  select.innerHTML = "";

  let currienciesToShow;
  if (!text || text.trim() === "") {
    currienciesToShow = allCurrencies;
  } else {
    currienciesToShow = allCurrencies.filter((currency) =>
      currency.startsWith(text.toUpperCase()),
    );
  }

  currienciesToShow.forEach((currency) => {
    const option = new Option(currency, currency);
    select.appendChild(option);
  });
}

searchOne.addEventListener("input", function (e) {
  filtration(e.target.value, currencyOne);
});

searchTwo.addEventListener("input", function (e) {
  filtration(e.target.value, currencyTwo);
});

document.querySelectorAll(".currency").forEach((section) => {
  section.addEventListener("change", function (event) {
    if (event.target) {
      getData(currencyOne.value, currencyTwo.value, inpt.value);
    }
  });
});

btnConvert.addEventListener("click", function () {
  const fromCurrency = currencyOne.value;
  const toCurrency = currencyTwo.value;
  const inptValue = inpt.value;
  getData(fromCurrency, toCurrency, inptValue);
});

btnSwap.addEventListener("click", function () {
  let temp = currencyOne.value;
  currencyOne.value = currencyTwo.value;
  currencyTwo.value = temp;

  getData(currencyOne.value, currencyTwo.value, inpt.value);
});
