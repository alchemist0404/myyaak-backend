// const serverURL = "http://localhost:20127/"
const serverURL = "https://vr.myyaak.com/"

window.onload = async () => {
    let places = await loadPlaces();
    renderPlaces(places);
};

async function loadPlaces() {
    const response = await fetch(`${serverURL}player/tasks/getTasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User': JSON.stringify({token: { session_token }}),
            'LogIn': JSON.stringify({username, password})
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
    const scene = document.querySelector('a-scene');
    console.log(`places`, places)

    places.forEach((place) => {
        const { file_type } = place
        const latitude = place.task_position.lat;
        const longitude = place.task_position.lng;

        if (file_type == "image") {
            // const asset = document.createElement('a-assets');
            // asset.setAttribute('look-at', `[gps-projected-camera]`)
            // asset.setAttribute('scale', `0.5 0.5 0.5`)
            // asset.setAttribute('position', `0 20.1 0`)
            // asset.setAttribute('gps-projected-entity-place', `latitude: ${latitude}; longitude: ${longitude};`)
            
            // const image = document.createElement('img');
            // image.setAttribute('src', `${serverURL}${place.task_file}`)
            // image.setAttribute('crossorigin', 'anonymous')
            // image.addEventListener('click', ()=> {
            //     alert('Congratulations!')
            // })
    
            // asset.appendChild(image)
            // scene.appendChild(asset);
            const icon = document.createElement("a-image");
            icon.setAttribute('src', `${serverURL}${place.task_file}`)
            icon.setAttribute('look-at', `[gps-projected-camera]`)
            icon.setAttribute('scale', `1 1 1`)
            icon.setAttribute('position', `0 20.1 0`)
            icon.setAttribute('gps-projected-entity-place', `latitude: ${latitude}; longitude: ${longitude};`)
            icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-projected-entity-place-loaded')));
            icon.addEventListener('click', () => {
                alert("You found a logo!")
            });

            scene.appendChild(icon);
        }
    });
}