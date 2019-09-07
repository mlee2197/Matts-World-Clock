document.onreadystatechange = function() {
	if(document.readyState === "complete"){
		initApplication();
	}
}

function initApplication(){
	var MORNING = "linear-gradient(90deg, #89f7fe 0%,#66a6ff 100% )",
		AFTERNOON = "linear-gradient(90deg, #e96443 0%,#904e95 100% )",
		EVENING = "linear-gradient(90deg, #141e30 0%,#243b55 100% )";
	var baseUrl = "https://community-open-weather-map.p.rapidapi.com/weather?callback=test&id=2172797&units=imperial&mode=html&q=";
	var locations = {
		"New York": "USA",
		"California": "USA",
		"Tokyo": "JAP",
		"London": "UK",
		"Venice": "ITA"
	};

	function updateTime(){
		var today = new Date();
		var hour = today.getHours(),
		    min = today.getMinutes(),
		    sec = today.getSeconds(),
		    AM = true;
		var yesterday = false,
			tomorrow = false;

		// apply timezone difference
		var timeDif = Number(a.options[a.selectedIndex].value);
		hour += timeDif;

		// check for date change
		if(hour < 0){ // check if yesterday's date
			hour += 24;
			yesterday = true;
		} else if(hour >= 24){ // check if tmr's date
			hour -= 24;
			tomorrow = true;
		}
		//format time to 12-hour clock
		let time;

		if(hour > 12 && hour < 24){ //PM
			time = (hour - 12);
			AM = false;
		} else if (hour === 0){ //midnight
			time = (hour + 12);
		} else if (hour == 12){
			time = hour;
			AM = false;
		} else if (hour == 24) {
			time = (hour - 12);
		} else { //AM
			time = hour;
			AM = true;
		}

		//minute + second formatting for single digit
		(min >= 10) ?
			time += " : " + min :
			time += " : 0" + min;

		(sec >= 10) ?
			time += " : " + sec :
			time += " : 0" + sec;

		(AM) ?
			time += " AM" :
			time += " PM";
		
		// Change background based on time
		/* Morning: 4 - 12
		 * Afternoon: 12 - 18
		 * Evening: 18 - 4
		 */
		if(hour > 4 && hour <= 12){
			document.body.style.background = MORNING;
			document.getElementById("main-container").style.color = "black";
		} else if(hour > 12 && hour <= 18){
			document.body.style.background = AFTERNOON;
			document.getElementById("main-container").style.color = "white";
		} else {
			document.body.style.background = EVENING;
			document.getElementById("main-container").style.color = "white";
		}

		// update date if yesterday or tomorrow
		if(yesterday){
			today.setDate(today.getDate()-1);
		} else if(tomorrow){
			today.setDate(today.getDate()+1);
		}

		// update time, date, and clock
		document.getElementById('time').innerHTML = time;
		document.getElementById('date').innerHTML= today.toDateString();
		drawClock(hour, min, sec);
		setTimeout(updateTime, 1000);
	}

	function updateLocation(){
		var location = a.options[a.selectedIndex].innerHTML;
		document.getElementById('location').innerHTML = location;
		
		var endUrl = location.replace(/ /g,'%20');
		settings["url"] = baseUrl + endUrl;

		document.getElementById('country').innerHTML = locations[location];
		
		updateWeather();
	}

	function updateWeather(){
		$.ajax(settings).done(function (response) {
			// isolate weather data
			var weatherStart = response.indexOf("main"),
			    weatherEnd = response.indexOf("]") + 1,
			    weather = response.substring(weatherStart, weatherEnd);

			// extract weather
			var mainStart = weather.indexOf(":")+2,
			    mainEnd = weather.indexOf(",")-1,
			    main = weather.slice(mainStart, mainEnd);

			// isolate temp data
			var remainder = response.slice(weatherEnd);
			var tempStart = remainder.indexOf("temp"),
			    tempEnd = remainder.indexOf("}"),
			    temp = remainder.substring(tempStart, tempEnd);
			
			// extract temp
			var tempDataStart = temp.indexOf(":")+1,
				tempDataEnd = temp.indexOf(","),
				tempData = temp.substring(tempDataStart, tempDataEnd);
			temp = temp.slice(tempDataEnd);
			// extract temp_min
			var tempMinStart = temp.indexOf("min")+5,
				tempMinEnd = temp.indexOf("temp_max")-2,
				tempMin = temp.substring(tempMinStart, tempMinEnd);
			temp = temp.slice(tempMinEnd);	
			// extract temp_max
			var tempMaxStart = temp.indexOf(":")+1,
				tempMax = temp.substring(tempMaxStart);
			
			// set src image for weather
			switch(main) {
				case 'Clouds' :
					$("#weather-icon").attr("src","pics/cloudy.png");
					break;
				case 'Rain' :
					$("#weather-icon").attr("src","pics/rain.png");
					break;
				case 'Clear' :
					$("#weather-icon").attr("src","pics/sun-white.png");
					break;
				case 'Drizzle' :
					$("#weather-icon").attr("src","pics/drizzle.png");
					break;	
				case 'Snow' :
					$("#weather-icon").attr("src","pics/snow.png");
					break;
				case 'Thunderstorm' :
					$("#weather-icon").attr("src","pics/thunderstorm.png");
					break;
				case 'Thunder' :
					$("#weather-icon").attr("src","pics/Thunder.png");
					break;
				case 'Mist' :
					$("#weather-icon").attr("src","pics/rain.png");
					break;
			}
			
			// set weather text
			$("#weather").html(main);
			$("#temp").html(tempData);
			$("#temp-min").html(Math.floor(tempMin));
			$("#temp-max").html(Math.ceil(tempMax));
		});
	}

	function drawClock(hour, minute,second) {
		drawFace(ctx, radius);
		drawTime(ctx, radius, hour, minute, second);
	}

	function drawFace(ctx, radius) {
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2 * Math.PI);
		ctx.fillStyle = 'white';
		ctx.fill();

		ctx.strokeStyle = '#777';
		ctx.lineWidth = radius*0.1;
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
		ctx.fillStyle = '#777';
		ctx.fill();
	}

	function drawTime(ctx, radius, hour, minute, second){
		hour = hour%12;
		hour = (hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
		drawHand(ctx, hour, radius*0.5, radius*0.07);
		//minute
		minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
		drawHand(ctx, minute, radius*0.8, radius*0.07);
	}

	function drawHand(ctx, pos, length, width) {
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.lineCap = "round";
		ctx.moveTo(0,0);
		ctx.rotate(pos);
		ctx.lineTo(0, -length);
		ctx.stroke();
		ctx.rotate(-pos);
	}

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://community-open-weather-map.p.rapidapi.com/weather?callback=test&id=2172797&units=imperial&mode=html&q=new%20york",
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
			"x-rapidapi-key": "5f3438fa6emsh88f58077119921bp1d2f0ejsn5a0fa46f561d"
		}
	}

	$("#weather-btn").click(function(){
		$("#weather-container").fadeToggle();
	})

	var a = document.getElementById('location-list');
	var canvas = document.getElementById("clock");
	var ctx = canvas.getContext("2d");
	var radius = canvas.height / 2;
	ctx.translate(radius, radius);
	radius = radius * 0.90;

	updateWeather();
	updateTime();
}
	
