$('#location').keypress(function(e){
   if(e.keyCode === 13 || e.which === 13){
      getWeather();
   }
});

var getWeather = function(){
   // Retrive User Input
   var input = $('#location').val();

   // Push input through google geocoder and retrieve lat and lng
   $.ajax({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + input + '&key=AIzaSyAb4AI5F1gewlQOeBv4hAhOPG8_m0ZK4Pg',
      data: {format: 'json'},
      // Hnadle Error
      error: function(data, textStatus, xhr){
         if(data.status != 200){
            $('#weather-submit').append('<h5>Cannot Get Weather -- Please Make Sure Location Is Accurate</h5>');
         }
      },
      dataType: 'json',
      // Handle Success
      success: function(data){
         // Define Lat and Lng
         var lng = data['results'][0]['geometry']['location']['lng'];
         var lat = data['results'][0]['geometry']['location']['lat'];
         var coordinates = lat + ',' + lng;

         $('#site').html('<h1>' + data['results'][0]['formatted_address'] + '</h1>');
         
         // Send Coordinates Through Dark Sky API and Retrieve Weather Info
         $.ajax({
            url: 'https://api.darksky.net/forecast/379c15beaf1957c0afaca05bd48f9423/' + coordinates,
            data: {format: 'json'},
            // Hnadle Error
            error: function(data, textStatus, xhr){
               if(data.status != 200){
                  $('#weather-submit').append('<h5>Cannot Get Weather -- Please Make Sure Location Is Accurate</h5>'); 
               }
            },
            dataType: 'jsonp',
            // Handle Success
            success: function(data){
               // Create Date Using MomentJS
               var timezone = data['timezone'];
               var date = moment.tz(timezone).format('dddd | MMMM Do');
   
               // Update HTML With Appropriate Data
               $('#date').html('<h2>' + date + '</h2>');
               $('#temp').html('<h2>Currently: ' + Math.round(data['currently']['temperature']) + '</h2>');
               $('#max-temp').html('<h3>High: ' + Math.round(data['daily']['data'][0]['temperatureMax']) + '</h3>');
               $('#min-temp').html('<h3>Low: ' + Math.round(data['daily']['data'][0]['temperatureMin']) + '</h3>');
               $('#location').val('');
            },
            type: 'GET'
         }); // End Dark Sky API
      },
      type: 'GET'
   }); // End Google Geocode API
};