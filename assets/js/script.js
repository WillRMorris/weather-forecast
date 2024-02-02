//℉ for when we need fareheit

function fetchForcast(location){

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=a9909a5368cc548ae8f89a889fbd85c9`)
    .then((res) => res.json())
    .then(place = function(data) {
        var place = data[0];
       var lat = place.lat;
        var lon= place.lon;
        console.log(place);
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

                    //dates should change at midnight 0:00:00 intervals are in 3 hours, so four items ahead of the date change should be noon(12:00:00), which I think is a good time to give a general forcast for a future date as opposed to the temp at midnight.
                    var noon;
                    if(i+4 > list.length){
                        noon = 0;
                    }else{
                        noon = i+4; 
                    }
                    //checks to make sure that there is an object at index noon. the first and last items, depending on the time of day may not have an item, or that item may not be noon. If the var noon does not have a date equal to what noon on the current day should look like, creates an object with the current (so earliest avaible) time on that day. Not ideal, but should safely give a forcast for each day.
                    //UPDATE: does in fact throw an error, though the program runs regardless. In fact apprently, the way the system works, we have the start of a day 6 in our 5 day forcast at certain times during the day.

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
fetchForcast('Salt Lake City');

