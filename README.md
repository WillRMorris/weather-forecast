# weather-forecast

## description

This website allows for clients to search for weather in their, or any area by the name of the city
using Open Weather API. When a valid response (name of a city) is entered, both a current forcast,
and a forcast for the next 5 days should appear for the user to reference.

### functionality

- website corectly calls OpenWeather API and uses its built in geocoding API to convert city names to coordinates.
- both the current forcast, and the five day forcast function of Open Weather API are used and correctly display on the screen.
- searches, if they make a valid call to the API, are logged in a local storage object, and the five most recent searches are displayed in a list of buttons under the search bar.
- using these buttons will call the current information from the location previously searched and display it on the page. 

![gif of functioing site](assets/images/Weather%20Forcast.gif)

