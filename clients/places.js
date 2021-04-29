window.onload = async () => {
    let places = await loadPlaces();
    renderPlaces(places);
};

async function loadPlaces() {
    const serverURL = "http://localhost:20127/"
    // const serverURL = "https://vr.myyaak.com/"
    const response = await fetch(`${serverURL}admin/tasks/getTasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const resultData = await response.json()
    if (resultData.session) {
        window.location.href = "./not-authrized.html"
    }
    if (resultData.status == true) {
        return resultData.data
    } else {
        return []
    }
}

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        console.log(`place`, place)
        // let latitude = place.task_position.lat;
        // let longitude = place.task_position.lng;

        // var asset = document.createElement('a-assets');
        // asset.setAttribute('id', 'myyaaklogo')
        // asset.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`)
        // asset.addEventListener('loadeddata', ()=>{
        //     window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        // })
        
        // var image = document.createElement('img');
        // image.setAttribute('src', './src/assets/icon.png')
        // image.addEventListener('click', ()=> {
        //     alert('Congratulations!')
        // })

        // asset.appendChild(image)
        // scene.appendChild(asset);
    });
}