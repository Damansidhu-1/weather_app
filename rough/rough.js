console.log("Hello Jee ");

const API_KEY = "865b3bc19cd587f0453915e19acfc113" ;

async function renderWeatherInfo(data){
    let city = "goa";
    let newPara = document.createElement('p');
    newPara.textContent = `Temp of ${city} = ${data?.main?.temp?.toFixed(2)} °C`;

    document.body.appendChild(newPara);
}

async function fetchWeatherDetails() {
    // let latitude = 15.3333;
    // let longitude = 74.0833;

    let city = "goa";

    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        console.log("weather data -> " , data);

        // let newPara = document.createElement('p');
        // newPara.textContent = `Temp of ${city} = ${data?.main?.temp?.toFixed(2)} °C`;

        // document.body.appendChild(newPara);

        renderWeatherInfo(data);

    }
    catch(err){
        //handle the error here
    }

    

}

async function getCustomWeatherDetails() {
    try{
        let latitude = 16.6333;
        let longitude = 18.3333;
    
        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    
        let data = await result.json();
    
        console.log(data);
    }
    catch(err) {
        console.log("Errror Found" , err);
    }

}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log("No geoLocation Support");
    }
}

function showPosition(position) {
    let lat = position.coords.latitude;
    let longi = position.coords.longitude;

    console.log(lat);
    console.log(longi);
}