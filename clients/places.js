const serverURL = "https://vr.myyaak.com/"

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const session_token = urlParams.get("session_token")
const username = urlParams.get("username")
const password = urlParams.get("password")

const loadPlaces = async function(coords) {
    // COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY
    //const method = 'api';

    const PLACES = [];

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
        return Promise.resolve(resultData.data)
    } else {
        return Promise.resolve([])
    }
};


let latitude;
let longitude;

var ler = true;



window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // then use it to load from remote APIs some places nearby
      
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    
                    if(ler){
                        latitude = place.task_position.lat;
                        longitude = place.task_position.lng;
                    }
                    // add place icon
                    const icon = document.createElement('a-image');
                    icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                    icon.setAttribute('name', place.task_name);
                    //icon.setAttribute('src', '../assets/map-marker.png');
                    icon.setAttribute('src', `${serverURL}${place.task_file}`);
                    icon.setAttribute("look-at","[camera]");

                    // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
                    icon.setAttribute('scale', '20, 20');

                    icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

                    const clickListener = function(ev) {
                        ev.stopPropagation();
                        ev.preventDefault();

                        const name = ev.target.getAttribute('name');

                        const el = ev.detail.intersection && ev.detail.intersection.object.el;

                        if (el && el === ev.target) {
                            const label = document.createElement('span');
                            const container = document.createElement('div');
                            container.setAttribute('id', 'place-label');
                            label.innerText = name;
                            container.appendChild(label);
                            document.body.appendChild(container);

                            setTimeout(() => {
                                container.parentElement.removeChild(container);
                            }, 1500);
                        }
                    };

                    //icon.addEventListener('click', clickListener);
                    
                    scene.appendChild(icon);
                  
                  
                    // add place name
                            
                    let text = document.createElement('a-text');
                    text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                    text.setAttribute('value', place.task_name);
                    //text.setAttribute('href', 'http://www.example.com/');
                    text.setAttribute('width', '200');
                    text.setAttribute('height', '200');
                    
                    text.setAttribute("look-at","[camera]");
                    text.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(text);
                  
               
                  
                  
                  
                  
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};



document.addEventListener("touchend", myFunction);

function myFunction() {
  return navigator.geolocation.getCurrentPosition(function (position) {
    
    latitude = position.coords["latitude"];
    longitude = position.coords['longitude'];

    ler =false;
    
  });
  
} 