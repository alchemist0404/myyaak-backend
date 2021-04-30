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
    console.log(`resultData`, resultData)
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
        const { file_type } = place
        let latitude = place.task_position.lat;
        let longitude = place.task_position.lng;

        if (file_type == "image") {
            var asset = document.createElement('a-assets');
            asset.setAttribute('id', place._id)
            asset.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`)
            asset.addEventListener('loadeddata', ()=>{
                window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
            })
            
            var image = document.createElement('img');
            image.setAttribute('src', `${serverURL}${place.task_file}`)
            image.setAttribute('crossorigin', 'anonymous')
            image.addEventListener('click', ()=> {
                alert('Congratulations!')
            })
    
            asset.appendChild(image)
            scene.appendChild(asset);
        }
        if (file_type == "video") {
            var asset = document.createElement('a-assets');
            asset.setAttribute('timeout', "10000")
            asset.setAttribute('id', place._id)
            asset.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`)
            asset.addEventListener('loadeddata', ()=>{
                window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
            })
            
            var image = document.createElement('video');
            image.setAttribute('src', `${serverURL}${place.task_file}`)
            image.setAttribute('crossorigin', 'anonymous')
            image.setAttribute('autoplay', '')
            image.setAttribute('loop', 'true')
            image.addEventListener('click', ()=> {
                alert('Congratulations!')
            })
    
            asset.appendChild(image)
            scene.appendChild(asset);
        }
        if (file_type == "dae") {
            var entity = document.createElement("a-entity")
            entity.setAttribute('id', place._id)
            entity.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`)
            entity.addEventListener('loadeddata', ()=>{
                window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
            })
            
            entity.setAttribute('collada-model', `url(${serverURL}${place.task_file})`)

            scene.appendChild(entity)
        }
        if (file_type == "fbx") {
            var entity = document.createElement("a-entity")
            entity.setAttribute('id', place._id)
            entity.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`)
            entity.addEventListener('loadeddata', ()=>{
                window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
            })
            
            entity.setAttribute('fbx-model', `src: url(${serverURL}${place.task_file})`)

            scene.appendChild(entity)
        }
        if (file_type == "obj") {
            var entity = document.createElement("a-entity")
            entity.setAttribute('id', place._id)
            entity.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`)
            entity.addEventListener('loadeddata', ()=>{
                window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
            })
            
            entity.setAttribute('obj-model', `obj: url(${serverURL}${place.task_file});`)

            scene.appendChild(entity)
        }
        if (file_type == "gltf") {
            var entity = document.createElement("a-entity")
            entity.setAttribute('id', place._id)
            entity.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`)
            entity.addEventListener('loadeddata', ()=>{
                window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
            })
            
            entity.setAttribute('gltf-model', `url(${serverURL}${place.task_file})`)

            scene.appendChild(entity)
        }
    });
}