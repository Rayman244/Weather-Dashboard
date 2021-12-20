 const apiKey = '73f6da439500e5c6ba167934e0ca2bc8';
 var cityTxtEl = $('#cityText');
 var searchBtnEl = $('#subBtn');
 var unitSelector = $('#units');
 var searchCityEl = $('#cityTxtEl')
 var curTempEl = $('#tempEl');
 var curfeelsEl = $('#curfeelsEl')
 var curWindSpeedEl = $("#curWindSpeedEl")
 var curDescEl = $('#curDescriptionEl')
 var curWeatherImg = $('#weatherImg')
 var curUvIndexEl = $('#curUvIndexEl')
 var curHumidityEl = $('#curHumidityEl')
 var curCloudsEl = $('#curCloudsEl')
 var curVisibilityEl = $('#curVisibilityEl')
 var curRainEl = $('#curRainEl')
 var weekForecastContainer = $('.weekForecastContainer')
 var searchedContainer = $('#searchedContainer')
 var cityArr = ['Philadelphia','Cape May','Denver']

 var searchedCities = []
//  var searchedCities = localStorage.getItem('searchedCities') ? localStorage.getItem('searchedCities') : localStorage.setItem('searchedCities', cityArr)

 var selectedUnit;
 var selectedSpeed;
var curCityName

//  handles unit selection
 function unitChecker(unitName){
    var tempTypes = ['°F','°C','°K'];
    var speedTypes = ['mph','m/s']
   

     if(unitName === 'imperial'){
         selectedUnit = tempTypes[0]
         selectedSpeed = speedTypes[0]
         
     }else if(unitName === 'metric'){
         selectedUnit = tempTypes[1]
         selectedSpeed = speedTypes[1]
         
     }else{
        selectedUnit = tempTypes[2]
        selectedSpeed = speedTypes[1]
        

     }
     return selectedUnit, selectedSpeed
 }


 


function cityDetails(lat,lon){
    var units = unitSelector.val()
     var cityDetailsUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
     $.ajax({
         url:cityDetailsUrl,
         method:'GET',
     }).then(function(response){
         var currentTemp = response.current.temp
         var feelsLike = response.current.feels_like
         var windSpeed = response.current.wind_speed
         var curDesc = response.current.weather[0].main
         var curWeatherIcon = response.current.weather[0].icon
         var curClouds = response.current.clouds
         var curVisibility = response.current.visibility
         var curRain = response.current.rain ? response.current.rain : 0
     
         
         unitChecker(units)
        //  section1
         curTempEl.text(`Temp: ${currentTemp}${selectedUnit}`)
         curfeelsEl.text(`Feels Like: ${feelsLike}${selectedUnit}`)
         curWindSpeedEl.text(`Wind Speed: ${windSpeed} ${selectedSpeed}`)
         uvChecker(response.current.uvi)
       
        //  section2
         curWeatherImg.attr('src',getWeatherImage(curWeatherIcon))
         curDescEl.text(curDesc)
        //  section3
        curHumidityEl.text(`Humidity: ${response.current.humidity}%`)
        curCloudsEl.text(`Clouds: ${curClouds}%`)
        //default output is metric need to convert to miles if imperial is selected
        curVisibilityEl.text(`Visibility: ${curVisibility ? curVisibility : 0} m` )
        curRainEl.text(`Rain: ${curRain} mm`)
        // 7 day forecast
        handleWeekForecast(response.daily)

     })
}
 
function findCity(city){
    var findCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
    searchCityEl.text(`${city} ${moment().format('L')}`)
    $.ajax({
        url:findCityUrl,
        method:'GET'
    }).then(function(response){
        console.log(response[0].name);
        curCityName = response[0].name
        var cityLat = response[0].lat
     var cityLon = response[0].lon
     cityDetails(cityLat,cityLon)
    })
}


function showCurWeather(){
    navigator.geolocation.getCurrentPosition(success, error);

}
// Getting current location
function success(pos) {
    var crd = pos.coords;
    var curLat = crd.latitude
    var curLon = crd.longitude
    cityDetails(curLat,curLon)
    searchCityEl.text(`Current Location ${moment().format('L')}`)
    
  }
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  // getting the weather image
function getWeatherImage(imgId){
      var imgUrl =`https://openweathermap.org/img/wn/${imgId}@2x.png`
      return imgUrl
  }

function handleWeekForecast(weekArr){
    weekForecastContainer.empty()
    for(i=1; i<6; i++){
        // Creating Elements
        var cardEl = $('<div>').attr('class', 'card p-2 text-white bg-secondary m-1 p-4')
        var dateEl = $('<h5>').attr('class','text-center')
        var imgEl = $('<img>').attr('class','card-img-top')
        var descEl = $('<p>').attr('class','text-center text-capitalize')
        var tempEl = $('<p>')
        var windEl = $('<p>')
        var humidEl = $('<p>')
        // Assigning Data
        dateEl.text(getDate(weekArr[i].dt))
        imgEl.attr('src',getWeatherImage(weekArr[i].weather[0].icon))
        descEl.text(weekArr[i].weather[0].description)
        tempEl.text(`Temp: ${weekArr[i].temp.day} ${selectedUnit}`)
        windEl.text(`Wind: ${weekArr[i].wind_speed} ${selectedSpeed}`)
        humidEl.text(`Humidity: ${weekArr[i].humidity} %`)
        // Attaching elements together
        cardEl.append(dateEl,imgEl,descEl,tempEl,windEl, humidEl)
        weekForecastContainer.append(cardEl)
    }
}
function getSearchedCities(){
    searchedContainer.empty()
    searchedCities = localStorage.getItem('searchedCities')
    if(searchedCities != null){
        var searchedArr = searchedCities.split(',')
        // console.log(searchedArr);
    
    
    for(i=1; i<searchedArr.length;i++){
        var cityBtn = $('<button>').attr('class','col-12 btn btn-secondary mt-1 text-capitalize')
        cityBtn.text(searchedArr[i])
        searchedContainer.append(cityBtn)
        
    }
}
    
   
}

// UV Checker
function uvChecker(rating){
    if(rating<3){
        curUvIndexEl.text('Low')
        curUvIndexEl.attr('class','bg-success text-white p-1')
    }else if(rating>=3 && rating<=5){
        curUvIndexEl.text('Moderate')
        curUvIndexEl.attr('class','p-1') 
        curUvIndexEl.css('background-color','rgb(245,225,10)')  


    }else if(rating === 6 || rating === 7){
        curUvIndexEl.text('High')
        curUvIndexEl.attr('class','text-white p-1') 
        curUvIndexEl.css('background-color','orange')  


    }else if(rating>=8 && rating<=10){
        curUvIndexEl.text('Very High')
        curUvIndexEl.attr('class','text-white p-1') 
        curUvIndexEl.css('background-color','red') 

    }else{
        curUvIndexEl.text('Extreme')
        curUvIndexEl.attr('class','text-white p-1') 
        curUvIndexEl.css('background-color','purple') 
    }
}
function getDate(date){
    return moment.unix(date).format('L');
}
searchBtnEl.on('click',function(e){
    e.preventDefault()
    var newSearched = searchedCities + `,${cityTxtEl.val()}`
    console.log(newSearched);
    localStorage.setItem('searchedCities',newSearched )
    findCity(cityTxtEl.val())
    getSearchedCities()
    
})

searchedContainer.on('click',function(e){
    e.preventDefault()
    findCity(e.target.textContent)
})
showCurWeather()
getSearchedCities()