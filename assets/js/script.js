 const apiKey = '73f6da439500e5c6ba167934e0ca2bc8'
 const units = ['imperial','metric','standard']
 
function cityDetails(lat,lon){
    var testUnits = units[0]
     var reqUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${testUnits}&appid=${apiKey}`
    fetch(reqUrl)
    .then(function(response){
        console.log(response);
        return response.json()
    }).then(function(data){
        
        console.log(data);
        
   
    })
}
 
function findCity(city){
    city = city.toLowerCase()
    var findCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
     fetch(findCityUrl)
     .then(function(response){
     console.log(response);
     return response.json()
 }).then(function(data){
     var cityLat = data[0].lat
     var cityLon = data[0].lon
     console.log(data);
     console.log(cityLat);
     console.log(cityLon);
    cityDetails(cityLat,cityLon)
 })
}


findCity('philadelphia')
// cityDetails(testlat,testLon)