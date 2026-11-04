const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button"),
form = document.querySelector("form");

for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in countryList){
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "INR" ? "selected" : "";
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target);
    });
}

function loadFlag(element){
    for(let code in countryList){
        if(code == element.value){
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagsapi.com/${countryList[code]}/flat/64.png`;
        }
    }
}

window.addEventListener("load", ()=>{
    getExchangeRate();
});

form.addEventListener("submit", e =>{
    e.preventDefault();
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault();
    getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

function getExchangeRate(){
    const amount = document.querySelector(".amount input");
    const exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Getting exchange rate...";

    if (fromCurrency.value === toCurrency.value) {
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${amountVal} ${toCurrency.value}`;
        return;
    }

    let url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`;
    
    fetch(url).then(response => response.json()).then(result =>{
        let exchangeRate = result.rates[toCurrency.value];
        let totalExRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    }).catch(() =>{
        exchangeRateTxt.innerText = "Something went wrong";
    });
}
