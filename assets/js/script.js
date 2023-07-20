let apiKey = '035982364306e049bd6861ace6539b28';
let cityInput = document.getElementById('cityInput');
let searchButton = document.getElementById('searchButton');
let searchHistoryEl = document.getElementById('searchHistory');

let historyList = JSON.parse(localStorage.getItem('storedCitiesArray')) || [];
searchButton.addEventListener('click', () => {
    let citySearch = cityInput.value;
    getWeather(citySearch);
    historyList.push(citySearch);
    localStorage.setItem('storedCitiesArray', JSON.stringify(historyList));
    renderSavedData();
});

// Renders local storage as searchable history buttons
const renderSavedData = () => {
    searchHistoryEl.innerHTML = '';
    for (let i = 0; i < historyList.length; i++) {
        let button = document.createElement('button');
        button.className = 'location-card';
        button.textContent = historyList[i];
        button.addEventListener('click', () => {
            getWeather(historyList[i]);
        });
        searchHistoryEl.appendChild(button);
    }
};

// Uses API to get current weather and 5-day forecast
const getWeather = (city) => {
    let urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(urlCurrent)
        .then((response) => response.json())
        .then((data) => {
            // Update top card
            document.getElementById('top-card-city').textContent = data.name;
            let date = new Date(data.dt * 1000);
            document.getElementById('top-card-city-date').textContent =
                date.toUTCString();
            document.getElementById('top-card-temp').textContent =
                data.main.temp + '\u00B0F';
            document.getElementById('top-card-wind').textContent =
                data.wind.speed + ' MPH';
            document.getElementById('top-card-humidity').textContent =
                data.main.humidity + ' %';
        })
        .catch((error) => {
            console.error('Error fetching current weather:', error);
        });

    let urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(urlForecast)
        .then((response) => response.json())
        .then((data) => {
            // Update forecast cards
            let forecastCards = document.querySelectorAll('.card');
            for (let i = 0; i < 5; i++) {
                let forecastData = data.list[i * 8];
                let card = forecastCards[i];
                card.querySelector('.card-five-day-forecast-date').textContent =
                    forecastData.dt_txt;
                card.querySelector(
                    '.card-icon'
                ).src = `http://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;
                card.querySelector('.card-temp').textContent =
                    forecastData.main.temp + '\u00B0F';
                card.querySelector('.card-wind').textContent =
                    forecastData.wind.speed + ' MPH';
                card.querySelector('.card-humidity').textContent =
                    forecastData.main.humidity + ' %';
            }
        })
        .catch((error) => {
            console.error('Error fetching forecast:', error);
        });
};

let clearHistoryButton = document.getElementById('clearHistory');
clearHistoryButton.addEventListener('click', () => {
    localStorage.clear();
    historyList = [];
    renderSavedData();
});

// Fires function to load local storage upon page load
renderSavedData();