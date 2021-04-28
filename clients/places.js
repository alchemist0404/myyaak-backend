window.onload = () => {
    let places = loadPlaces();
    renderPlaces(places);
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
};

function geoSuccess(position) {
    setTimeout(()=> {
        var icon = document.getElementById('myyaaklogo');
        console.log(`position.coords.latitude`, position.coords.latitude)
        console.log(`position.coords.longitude`, position.coords.longitude)
        icon.setAttribute('gps-entity-place', `latitude: ${position.coords.latitude + 0.00005}; longitude: ${position.coords.longitude + 0.00005};`)
    }, 500)
}

function geoError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
    }
}

function loadPlaces() {
    return [
        {
            name: '',
            location: {
                lat: 0,
                lng: 0,
            }
        },
    ];
}

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        var asset = document.createElement('a-assets');
        asset.setAttribute('id', 'myyaaklogo')
        asset.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`)
        asset.addEventListener('loadeddata', ()=>{
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        })
        
        var image = document.createElement('img');
        image.setAttribute('src', './src/assets/icon.png')
        image.addEventListener('click', ()=> {
            alert('Congratulations!')
        })

        asset.appendChild(image)
        scene.appendChild(asset);
    });
}