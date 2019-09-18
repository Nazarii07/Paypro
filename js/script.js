window.addEventListener('load', async () => {
    let long;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationTimezone = document.querySelector('.location-timezone');
    let articul;
    let articulWord;
    let newsInfo = document.querySelector('.articlNews');
    let moneyCurrent = document.querySelector('.moneyValue');








    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = `https://cors-anywhere.herokuapp.com/`;

            let api = `${proxy}https://api.darksky.net/forecast/c51dbf6ff989576e40ef102f360260f2/${lat},${long}`;

            let cityUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=true&key=AIzaSyBwZW4DXGbqHQK4evfOlk7TrdZcPDD21gc`;



            let mapOptions = {
                zoom: 16,
                center: new google.maps.LatLng(lat, long),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            let map = new google.maps.Map(document.getElementById("map"), mapOptions);
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const { temperature, summary, icon } = data.currently;
                    temperatureDegree.textContent = Math.floor((temperature - 32) / 1.8);
                    temperatureDescription.textContent = summary;
                    locationTimezone.textContent = data.timezone;
                    setIcons(icon, document.querySelector('.icon'));
                });



            fetch(cityUrl)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);

                    articul = data.results[0].formatted_address;
                    let articulArr = articul.split(', ');
                    articulWord = articulArr[2];
        
                })
            let newsUrl = `https://newsapi.org/v2/top-headlines?q=${articulWord}&category=sports&apiKey=8f8feefb207d4b60ab19089804362ac6`;

            fetch(newsUrl)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    let output = "";
                    let news = data.articles;
                    for (var i in news) {

                        output += (`<div class="newsBox"><h2> ${news[i].title} </h2>
                                  <img src="${news[i].urlToImage}">
                                  <p>${news[i].description}</p>
                                  <a href="${news[i].url}">Перейти</a></div>`);
                    }
                    newsInfo.innerHTML = output;
                });

        });


        const allInfoApi = `https://api.ipgeolocation.io/ipgeo?apiKey=af48e020c60c4c7fbce1756e0e9ef2eb`;
        let currencyValue;
        await fetch(allInfoApi)
            .then(response => {
                return response.json();
            })
            .then(data => {
                currencyValue = data.currency.code;
                return currencyValue;
            });



        const babkiApi = `http://data.fixer.io/api/latest?access_key=891b48a65c055225fc367e775e044f1a`;
        fetch(babkiApi)
            .then(response => {
                return response.json();
            })
            .then(data => {
                let moneyOut = "";
                let money = data.rates[currencyValue];
                moneyOut = (`<div>1 EUR = ${money} UAH</div>`);
                moneyCurrent.innerHTML = moneyOut;
                return data.rates;

            });


    }

    function setIcons(icon, iconID) {
        const skycons = new Skycons({ color: 'black' });
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});





