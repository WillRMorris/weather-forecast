var cityInput = $('#city-input');
var form = $('#form');
var submit = $('submit');
//℉ for when we need fareheit

function fetchForcast(location){
    
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=a9909a5368cc548ae8f89a889fbd85c9`)
    .then((res) => res.json())
    .then(place = function(data) {
        var place = data[0];
        var lat = place.lat;
        var lon= place.lon;
        console.log(place);
        toLocalStorage(place.name);
        loadHistory();
        //today
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=a9909a5368cc548ae8f89a889fbd85c9`)
        .then((res) => res.json())
        .then(function(data){
            var weather = data;
            console.log(weather);
            renderToday(weather);
        });
        
        //5 days
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=a9909a5368cc548ae8f89a889fbd85c9`)
        .then((res) => res.json())
        .then(function(data){
            console.log(data);
            var weather = data;
            clear5Day();
            handle5Day(weather);
        });
    });
    
};

//renders today im html given date, temp, wind, nad hum
function renderToday (weather) {
    let place = weather.name;
    let temp = weather.main.temp;
    let wind = weather.wind.speed;
    let hum = weather.main.humidity;
    let icon = weather.weather[0].icon;
    let alt = weather.weather[0].description;

    var wrapper = $('#today');
    var dateBlock = $('#today-date');
    var image = $('#today-icon');
    var tempBlock = $('#today-temp');
    var windBlock = $('#today-wind');
    var humBlock = $('#today-humid');
    image.attr(`src` , `https://openweathermap.org/img/wn/${icon}.png`);
    image.attr(`alt` , `${alt}`);


    dateBlock.text(`${place}, Right Now `);
    tempBlock.text( `Temp: ${temp}℉`);
    windBlock.text(`Wind: ${wind}mph`);
    humBlock.text(`Humidity: ${hum}%`);

    wrapper.css('display', 'flex');




}


function handle5Day (weather) {
    var list = weather.list
            var currentDate = '';
            for(var i = 0; i<list.length; i++){
                tempDate = list[i].dt_txt.slice(0, 10);
                var blockCount = 0;
                //only triggers when the day changes including the first day
                if(currentDate != tempDate){
                    currentDate = tempDate;

                    //dates should change at midnight 0:00:00. Items are in 3hour intervals, so four items ahead of the date change should be noon(12:00:00), which I think is a good time to give a general forcast for a future date as opposed to at midnight.
                    var noon;
                    if(i+4 > list.length){
                        //prevents out of array error will cause the block to contain the earliest possible time of that day instead
                        noon = 0;
                    }else{
                        noon = i+4; 
                    }
                    //checks to make sure that there is an object at index noon. the first and last days, depending on the time of day fetched may not have a list item for noon, or that item may not be noon. If the var noon does not have a date equal to what noon on the current day should look like, creates an object with the current (so earliest avaible) time on that day. Not ideal, but should safely give a forcast for each day.

                    //NOTE: for whatever reason, OpenWeather considers 12:00:00 (noon) to be at night. Thus even with a sucessful call of noon, we still get the nighttime icons.
                    if(list[noon].dt_txt ==`${currentDate} 12:00:00`){
                        let temp = list[noon].main.temp;
                        let wind = list[noon].wind.speed;
                        let hum = list[noon].main.humidity;
                        let icon = list[noon].weather[0].icon;
                        let alt = list[noon].weather[0].description;
                        console.log("noon forcast"+ i);
                        renderDay(currentDate, temp, wind, hum, icon, alt );
                    } else{
                        let temp = list[i].main.temp;
                        let wind = list[i].wind.speed;
                        let hum = list[i].main.humidity;
                        let icon = list[i].weather[0].icon;
                        let alt = list[i].weather[0].description;
                        console.log('earliest forcast'+ i);

                        renderDay(currentDate, temp, wind, hum, icon, alt );
                    }
                    //ensuring that the 5 day forcast is just five days to protect against the odd occurance of 6 days in the fetch
                    if( blockCount< 5){
                        blockCount++;
                    }else{
                        return;
                    }

                }
            }
}

//renders a day on the 5-day on the HTML given variables of date, temp, wind, hum
function renderDay (date, temp, wind, hum, icon, alt) {
    var wrapper = $('#five-day-wrapper');
    var headingWrapper = $('fiveDay-heading-wrapper');
    var card = $('<div class = "day-card card rounded flex-wrap col-12 col-md-12 col-lg-2 justify-content-between border px-1 py-3 mx-0 my-3 my-lg-0"> </div>');
    var dateBlock = $('<div class = "card-title h6">');
    var imgWrapper = $('<div class="my-2">')
    var img = $(`<img src = "https://openweathermap.org/img/wn/${icon}.png" alt = "${alt}" class = fiveDayIcon>`);
    var list = $('<ul class= "mr-1 my-2 list-unstyled">');
    var tempBlock = $('<li>');
    var windBlock = $('<li>');
    var humBlock = $('<li>');

    headingWrapper.css('display' , 'flex');

    wrapper.append(card);
    card.append(dateBlock);
    card.append(imgWrapper);
    imgWrapper.append(img);
    card.append(list);
    list.append(tempBlock);
    list.append(windBlock);
    list.append(humBlock);

    dateBlock.text(`${date}`);
    tempBlock.text( `Temp: ${temp}℉`);
    windBlock.text(`Wind: ${wind}mph`);
    humBlock.text(`Humidity: ${hum}%`);

    
}

function clear5Day(){
    var fiveDayForcast = $('#five-day-wrapper');
    fiveDayForcast.empty();

    var headingWrapper = $('fiveDay-heading-wrapper');
    headingWrapper.css('display' , 'none');
}


function toLocalStorage(city) {
    var array = getLocalStorage ();
    var searchHistory = [];
    if (array){
        var searchHistory = array;
    }
    if( array.includes(`${city}`)){

        array.splice(array.indexOf(`${city}`), 1)
    }
    searchHistory.push(city);
    searchHistory = JSON.stringify(searchHistory);
    localStorage.setItem('weatherPastSaved', searchHistory);
    console.log(localStorage);
}

function getLocalStorage () {
    if(localStorage.getItem('weatherPastSaved')){

        var array = localStorage.getItem('weatherPastSaved');
        array = JSON.parse(array);
        return array;
    }
    else{
        var array =[];
        return array;
    }
}

function grabLast5 (array) {
    var lastFive = [];
    var count = 0;
    for( let i = array.length -1; i > 0; i--){
        lastFive.push(array[i]);
        count++;
        if(count == 5 || i <= 1){
            return lastFive;
        }
    }
}
function loadHistory(){
    var historyWrapper = $('#history');
    historyWrapper.empty();
    var storage = getLocalStorage();
    var history = grabLast5(storage);
    console.log(localStorage);
    if(history != undefined){

        for( let i = 0; i< history.length; i++){
            let place = $('<button class="btn btn-info m-1"> </button>');
            place.text(history[i]);
            historyWrapper.append(place);
        }
        historyWrapper.on('click', '.btn', function(event){
            clear5Day();
            var text = $(this);
            console.log(text.text());
            fetchForcast(text.text());
        })
    }
}

loadHistory();
form.on('submit', function (event) {
    clear5Day();
    event.preventDefault();
    var city = cityInput.val();
    fetchForcast(city);
}); 