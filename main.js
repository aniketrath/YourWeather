//Day Date and time from html:

let curr_time = document.getElementById('time');
let amOrpm = document.getElementById('am_pm');
let dayDate = document.getElementById('day_date')
let currentForecast = document.getElementById('coming_forecast')

//Timezone Details:

let currentLocation = document.getElementById('timezone_location');
let coordinates = document.getElementById('timezone_coord');

//API key:
const api_key = '45e1b87b1a45cfd491c4639068752a34';

// Day % Months Array:
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Change Time:
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const timeIn12hr = hour >= 13 ? hour % 12 : hour;
    const amorpm = hour >= 12 ? 'PM' : 'AM';

    curr_time.innerHTML = timeIn12hr + ':' + minutes;
    amOrpm.innerHTML = amorpm;
    dayDate.innerHTML = days[day] + ' , ' + date + ' ' + months[month];
}, 1000)



//Get lat and lon:
navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;
    setBasicTimeDetails(latitude, longitude);
    getWeatherData(latitude, longitude);
})

//Change Coords:
function setBasicTimeDetails(latitude, longitude) {
    coordinates.innerHTML = latitude.toFixed(5) + ' E, ' + longitude.toFixed(5) + ' N'
}

//Get data from API
function getWeatherData(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${api_key}`)
        .then(response => response.json()).then(data => {
            console.log(data)
            currentLocation.innerHTML = data.timezone;
            setCurrentDetails(data);
            todaysForecast(data);
        })
}

//Change current weather details:
let currentHumidity = document.getElementById('current_humidity')
let currentPressure = document.getElementById('current_pressure')
let currentWindSpeed = document.getElementById('current_windspeed')
let currentSunrise = document.getElementById('current_sunrise')
let currentSunset = document.getElementById('current_sunset')

function setCurrentDetails(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
    currentHumidity.innerHTML = humidity + " %";
    currentPressure.innerHTML = pressure
    currentWindSpeed.innerHTML = wind_speed
    currentSunrise.innerHTML = window.moment(sunrise * 1000).format('HH:mm a')
    currentSunset.innerHTML = window.moment(sunset * 1000).format('HH:mm a')
}
// Adding coming Forecasts: 

let eachForecast = ` `;
function todaysForecast(data) {
    let currentTemp = data.current.feels_like;
    data.daily.forEach((day, idx) => {

        if (idx == 0) {
            eachForecast = `
            <div id="current_day" ; class="h-64 w-72
            bg-slate-900/25
            pt-3
            flex-shrink-0  flex flex-col justify-center align-center
            outline outline-1 outline-zinc-200 rounded-xl">

                <div class="flex justify-center">
                    <span class="bg-slate-600
                    rounded-full
                    px-3 pt-1 pb-2 h-min 
                    text-zinc-200 text-xl  font-semibold ">
                    ${window.moment(day.dt * 1000).format('dddd')}
                    </span>
                </div>

                <div class="flex h-56">
                    <!-- Weather Icon -->
                    <div class="w-1/2 mt-6 ml-3">
                        <img class="ml-4"; src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather_Image">
                        <h1 id="current_temp" ; class="text-zinc-200 mt-1 text-3xl text-center "> ${currentTemp} &#8451; </h1>
                    </div>
                    <div class="w-1/2 py-4 px-5">

                        <h1 class="text-zinc-200 text-2xl my-1 underline  ">
                            <img class="w-8 my-2 mx-8" src="./svg/night.svg" alt="day_icon">
                        </h1>
                        <h1 id="current_daytemp" ; class="text-zinc-200 text-2xl my-1  ">${day.temp.night} &#8451;</h1>
                        <h1 class="text-zinc-200 text-2xl my-1 underline  ">
                            <img class="w-6 my-2 mx-8" src="./svg/day.svg" alt="day_icon">
                        </h1>
                        <h1 id="current_daytemp" ; class="text-zinc-200 text-2xl my-1  ">${day.temp.day} &#8451;</h1>

                    </div>

                </div>
            </div>
        
        `
        }
        else {
            eachForecast += `
            <div id="other_days" ; class="h-60 w-40 
                bg-slate-900/25
                my-2 pt-3
                flex flex-col align-center
                flex-shrink-0
                outline outline-1 outline-zinc-200 rounded-xl">

                    <div class="flex justify-center">
                        <span class="bg-slate-600
                        rounded-full
                        px-3 pt-1 pb-2 h-min 
                        text-zinc-200 text-xl  font-semibold ">
                        ${window.moment(day.dt * 1000).format('ddd')}
                        </span>
                    </div>
                    <img class="px-8" ; src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather_Image">

                    <div class="flex justify-center">
                        <img class="w-8" src="./svg/night.svg" alt="day_icon">
                        <h1 id="other_nighttemp" ; class="text-zinc-200 text-xl mx-2">
                        ${day.temp.night} &#8451;
                        </h1>
                    </div>

                    <div class="flex justify-center my-4">
                        <img class="w-6" src="./svg/day.svg" alt="day_icon">
                        <h1 id="other_daytemp" ; class="text-zinc-200 text-xl mx-2">
                        ${day.temp.day} &#8451;
                        </h1>
                    </div>
                </div>
            `

        }
        currentForecast.innerHTML = eachForecast;
    })
    

}



