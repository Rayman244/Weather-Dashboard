 const apiKey = '73f6da439500e5c6ba167934e0ca2bc8'
 const units = ['imperial','metric','standard']
 var cityTxtEl = $('#cityText')
 var saveBtnEl = $('#subBtn')
 
function cityDetails(lat,lon){
    var testUnits = units[0]
     var cityDetailsUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${testUnits}&appid=${apiKey}`
     $.ajax({
         url:cityDetailsUrl,
         method:'GET',
     }).then(function(response){
         console.log(response);
     })
    //  With fetch
    // fetch(cityDetailsUrl)
    // .then(function(response){
    //     console.log(response);
    //     return response.json()
    // }).then(function(data){
        
    //     console.log(data);
        
   
    // })
}
 
function findCity(city){
    var findCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
    $.ajax({
        url:findCityUrl,
        method:'GET'
    }).then(function(response){
        var cityLat = response[0].lat
     var cityLon = response[0].lon
     console.log(response);
    cityDetails(cityLat,cityLon)
    })
    // Fetch Method
//      fetch(findCityUrl)
//      .then(function(response){
//      console.log(response);
//      return response.json()
//  }).then(function(data){
//      var cityLat = data[0].lat
//      var cityLon = data[0].lon
//      console.log(data);
//     cityDetails(cityLat,cityLon)
//  })
}
saveBtnEl.on('click',function(e){
    e.preventDefault()
    findCity(cityTxtEl.val())
    

})


findCity('cape may')
// cityDetails(testlat,testLon)