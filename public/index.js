const KEY = 'ad352b1da2bbf3001136c1ce1b93f775';

//получить прогноз погоды по кординатам
const weatherForecastByCoords = (l, lo, cb) => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${l}&lon=${lo}&lang=ru&appid=${KEY}&units=metric`)
            .then(res => res.json())
            .then(json => {
                cb(json);
            })
            .catch(err => {
                console.log(err);
            });

    }
    //получить текущую погоду по координатам
const weatherByCoords = (l, lo, cb) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${l}&lon=${lo}&lang=ru&appid=${KEY}&units=metric`)
            .then(res => res.json())
            .then(json => {
                cb(json);
            })
            .catch(err => {
                console.log(err);
            });

    }
    //получить прогноз по населенному пункту
const weatherForecastByLocation = (cityCd, countryCd, cb) => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityCd},${countryCd}&lang=ru&appid=${KEY}&units=metric`)
            .then(data => data.json())
            .then(json => {
                cb(json);
            }).catch(err => console.log(err));
    }
    //получить текущую погоду по населенному пункту
const weatherByLocation = (cityCd, countryCd, cb) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityCd},${countryCd}&lang=ru&appid=${KEY}&units=metric`)
        .then(data => data.json())
        .then(json => {
            cb(json);
        }).catch(err => console.log(err));
}

//получение дня недели по дате
const getDayOfWeek = (date) => {
        var d = new Date(date);
        let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return weekday[d.getDay()];
    }
    //проверка если день - сегодня
const isToday = (date) => {

        return getDayOfWeek(date) === getDayOfWeek((new Date()).toISOString());

    }
    // установка значений полей для раздела прогноза погоды(в html, то, что помещается в div class="future")
const setForecast = (json) => {
        let i = 0;
        // сначало нам надо попустить все предсказания относящиеся к сегодня, так как результат приходит для каждых 3 часа
        for (; i < json.list.length; i++)
            if (!isToday(json.list[i].dt_txt)) break
                // как только попали не в сегодня, начинаем искать что будем выводить в прогнозе,
                // учитывая что данные идут каждые 3 часа, получается, мы должны брать каждый 8 элемент массива,
                // чтоб попасть раз в сутки
        for (let j = 0; j < 3; j++, i += 8) {
            // заполняем поля html
            document.querySelector(`.day-${j}-name`).innerText = getDayOfWeek(json.list[i].dt_txt);
            document.querySelector(`.day-${j}-temp`).innerText = json.list[i].main.temp + ' ℃';
            document.getElementById(`day-${j}-icon`).src = `http://openweathermap.org/img/wn/${json.list[i].weather[0].icon}@2x.png`;
        }
    }
    // состояние переключателя
let city_show = false;
// прячем вводы для координат
document.getElementById('long-lat').style.display = "none";
// прячем окно вывода погоды
document.querySelector('.weather').style.display = "none";
// видим только поля ввода города и кода страны
document.getElementById('city').style.display = "block";
// получаем переключатель
const switcher = document.getElementById('getWeatherSwitcher');
const switcherTexts = ['Ввести широту и долготу', 'Ввести название и код города'];
switcher.innerText = switcherTexts[0];
// назначаем переключателю обработчик события на клик
switcher.addEventListener('click', () => {
    // прячем окно вывода погоды
    document.querySelector('.weather').style.display = "none";

    if (city_show) {
        switcher.innerText = switcherTexts[0];
        document.getElementById('long-lat').style.display = "none";
        document.getElementById('city').style.display = "block";
    } else {
        switcher.innerText = switcherTexts[1];
        document.getElementById('long-lat').style.display = "block";
        document.getElementById('city').style.display = "none";
    }
    city_show = !city_show;
});
const lat = document.getElementById('lat-input');
const long = document.getElementById('long-input');
const cityNm = document.getElementById('city-input');
const countryCd = document.getElementById('countryCd-input');
const cityEl = document.querySelector('.city');
const tempel = document.querySelector('.temp');
const windel = document.querySelector('.wind');

document.getElementById('long-lat-btn').addEventListener('click', () => {
    document.querySelector('.weather').style.display = 'block';
    console.log('lat : ' + lat.value);
    console.log('long : ' + long.value);
    weatherByCoords(lat.value, long.value, (json) => {

        console.log(json);
        cityEl.innerHTML = json.name == undefined ? 'Current coordinates does not belong to any location' : `<small><small>CITY:</small></small> ${json.name}`;

        tempel.innerHTML = `${json.main.temp}<small>℃</small>`;
        windel.innerHTML = `<small><small>WIND:</small></small> ${json.wind.speed} m/sec`;
        document.getElementById('icon').src = `http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;

    });
    weatherForecastByCoords(lat.value, long.value, (json) => {
        setForecast(json);
    });
});

document.getElementById('city-btn').addEventListener('click', () => {
    document.querySelector('.weather').style.display = 'block';

    console.log('город : ' + cityNm.value);
    cityEl.innerHTML = `<small><small>CITY:</small></small> ${cityNm.value}`;
    console.log('код страны : ' + countryCd.value);
    weatherByLocation(cityNm.value, countryCd.value, (json) => {

        console.log(json);
        tempel.innerHTML = `${json.main.temp}<small>℃</small>`;
        windel.innerHTML = `<small><small>WIND:</small></small> ${json.wind.speed} m/sec`;

        document.getElementById('icon').src = `http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;

    });
    weatherForecastByLocation(cityNm.value, countryCd.value, (json) => {
        setForecast(json);
    });
});