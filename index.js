const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initial variables needed?
let oldTab = userTab;
const API_KEY = "865b3bc19cd587f0453915e19acfc113";
oldTab.classList.add("current-tab");

// ik km hor rehnda??
// initially ik wari function call krni pau 
// kyuki eh ho skda kee system kol pehla toh hee lat and lon di value pae howe
getfromSessionStorage();


function switchTab(newTab) {

    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            // but before making it visibe make this sure that only serach walla option is visible
            // for this make them invisible
            // them = grantaccesscontainer and userinfocontainer
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            
            searchForm.classList.add("active");

        }
        else{
            //mai pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            //ab mai your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage(); 

        }

    }

}

userTab.addEventListener("click" , () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click" , () => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
});


// check if co-ordinates are already present in session storage
function getfromSessionStorage(){
    
    let localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        // agar local coordinates nhi mile
        // then not saved 
        // then show grantAccess waali window
        grantAccessContainer.classList.add("active");

    }
    else{
        // local coordinates is present in session storage
        // then use them to call API
        // why converted from json ?
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherDetails(coordinates);
    }

}

async function fetchWeatherDetails(coordinates){
    const {lat ,lon} = coordinates;
    // to get data we need to show loader
    // to show loader grant location nu invisible krna paina
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");
    
    // then api call
    try{
        let response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        // converted to json
        const data = await response.json();

        // hun data aa gea loader nu hta do 
        loadingScreen.classList.remove("active");
        // weather aale ui nu dikhauna paina hun
        userInfoContainer.classList.add ("active");
        // hun interface tah aa gea 
        // next is ode ch appropriate values paunia hun
        // means render data
        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
        // throw error 
        // H/W
    }


}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch info from weatherInfo element and put it in UI elements

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}
function getLocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // HW 
        // show an alert for no geolocation support available
    }

}

function showPosition(position){

    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    // now storing lat and lon in session storage
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchWeatherDetails(userCoordinates);
    
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
// when clicked call a function to get location
grantAccessButton.addEventListener("click", getLocation);

//now writing for search walla page
const searchInput = document.querySelector("[data-searchInput]");

// adding event listner to search form 
// telling when submited then something should happen

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }

}