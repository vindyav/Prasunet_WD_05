const API_KEY = "YOUR_API_KEY";

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

async function fetchForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return null;
  }
}

async function searchByCity() {
  const city = document.getElementById("input").value;
  const weatherData = await fetchWeather(city);
  const forecastData = await fetchForecast(city);

  if (weatherData && forecastData) {
    updateWeather(weatherData);
    updateForecast(forecastData);
  } else {
    alert("City not found!");
  }
}

function updateWeather(data) {
  document.getElementById(
    "city"
  ).textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("temperature").textContent = `${Math.round(
    data.main.temp
  )} °C`;
  document.getElementById("clouds").textContent = data.weather[0].description;
  document.getElementById(
    "img"
  ).src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function updateForecast(data) {
  const templist = document.querySelector(".templist");
  templist.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const forecast = data.list[i];
    const time = new Date(forecast.dt * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const forecastDiv = document.createElement("div");
    forecastDiv.classList.add("next");

    forecastDiv.innerHTML = `
            <div>
                <p class="time">${time}</p>
                <p>${Math.round(forecast.main.temp_min)} °C / ${Math.round(
      forecast.main.temp_max
    )} °C</p>
            </div>
            <p class="desc">${forecast.weather[0].description}</p>
        `;

    templist.appendChild(forecastDiv);
  }

  const weekForecastHeader = document.createElement("p");
  weekForecastHeader.classList.add("cast-header");
  weekForecastHeader.textContent = "Next 3 days forecast";

  templist.appendChild(weekForecastHeader);

  for (let i = 8; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const forecastDiv = document.createElement("div");
    forecastDiv.classList.add("next");

    forecastDiv.innerHTML = `
            <div>
                <p class="date">${date}</p>
                <p>${Math.round(forecast.main.temp_min)} °C / ${Math.round(
      forecast.main.temp_max
    )} °C</p>
            </div>
            <p class="desc">${forecast.weather[0].description}</p>
        `;

    templist.appendChild(forecastDiv);
  }
}

document.getElementById("search").addEventListener("click", searchByCity);
