//℉ for when we need fareheit
var lat;
var lon;

function fetchForcast(){

    fetch('https://api.openweathermap.org/geo/1.0/direct?q=Tokyo&limit=1&appid=a9909a5368cc548ae8f89a889fbd85c9')
    .then((res) => res.json())
    .then(place = function(data) {
        var place = data[0];
        lat = place.lat;
        lon= place.lon;
        console.log(place);
        //today
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=a9909a5368cc548ae8f89a889fbd85c9`)
        .then((res) => res.json())
        .then(function(data){
            var weather = data;
            let place = weather.name;
            console.log();
            let temp = weather.main.temp;
            let wind = weather.wind.speed;
            let hum = weather.main.humidity;
            let icon = weather.weather[0].icon;
            console.log(weather);
            renderToday(place, temp, wind, hum, icon);
        });

        //5 days
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=a9909a5368cc548ae8f89a889fbd85c9`)
        .then((res) => res.json())
        .then(function(data){
            console.log(data);
            var weather = data;
            handle5Day(weather);
        });
    });
    
};

//renders today im html given date, temp, wind, nad hum
function renderToday (place, temp, wind, hum, icon) {
    var wrapper = $('#today');
    var dateBlock = $('#today-date');
    var tempBlock = $('#today-temp');
    var windBlock = $('#today-wind');
    var humBlock = $('#today-humid');

    dateBlock.text(`${place}, Right Now `);
    tempBlock.text( `Temp: ${temp}℉`);
    windBlock.text(`Wind: ${wind} mph`);
    humBlock.text(`Humidity: ${hum} %`);

    wrapper.css('display', 'flex');




}


function handle5Day (weather) {
    var list = weather.list
            var currentDate = '';
            for(var i = 0; i<list.length; i++){
                tempDate = list[i].dt_txt.slice(0, 10);
                //only triggers when the day changes including the first day
                if(currentDate != tempDate){
                    currentDate = tempDate;

                    //dates should change at midnight 0:00:00 intervals are in 3 hours, so four items ahead of the date change should be noon(12:00:00), which I think is a good time to give a general forcast for a future date as opposed to the temp at midnight.
                    var noon = i+4;
                    //checks to make sure that there is an object at index noon. the first and last items, depending on the time of day may not have an item, or that item may not be noon if the var noon does not have a date equal to what noon on the current day should look like, creates an object with the current (earliest avaible) time on that day.
                    if(list[noon].dt_txt === `${currentDate} 12:00:00`){

                    } else{

                    }
                }
            }
}

//renders a day on the 5-day on the HTML given variables of date, temp, wind, hum
function renderDay (date, temp, wind, hum) {
    var wrapper = $('#five-day-wrapper');
    var card = $('<div class = "day-card card m-3">');
    var body = $('<div class = "card-body>');
    var dateBlock = $('<div class = "card-title">');
    var list = $('<ul class = "m-3">');
    var tempBlock = $('<li>');
    var windBlock = $('<li>');
    var humBlock = $('<li>');

    wrapper.append(card);
    card.append(body);
    body.append(dateBlock);
    body.append(list);
    list.append(tempBlock);
    list.append(windBlock);
    list.append(humBlock);

    dateBlock.text(`${date}`);
    tempBlock.text( `Temp: ${temp}℉`);
    windBlock.text(`Wind: ${wind} mph`);
    humBlock.text(`Humidity: ${hum} %`);

    
}

fetchForcast();

