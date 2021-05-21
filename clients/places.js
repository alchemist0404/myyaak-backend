let firstLoc = true;

window.onload = () => {
    const camera = document.querySelector('a-camera');
    // window.addEventListener("gps-camera-update-position", e => {
    //     if(firstLoc) {
	// 		firstLoc = false;
    //         alert(`Got GPS: you are at: ${e.detail.position.longitude} ${e.detail.position.latitude}`);
    //         setPos(e.detail.position.longitude, e.detail.position.latitude);
    //     }
    // });
};
navigator.geolocation.getCurrentPosition(setPos, error)

function error() {
    alert("GPS Error!")
}

function setPos(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    alert("Your location is : " + latitude + ", " + longitude)
    const box = document.createElement("a-box");
    box.setAttribute('scale', {
        x: 10, 
        y: 10,
        z: 10
    });
    box.setAttribute('material', {
        color: 'red'
    });
    box.setAttribute("look-at", "[camera]")
    box.setAttribute('gps-entity-place', {
        latitude: -27.842117,
        longitude: 153.340257
    });
    const box2 = document.createElement("a-box");
    box2.setAttribute('scale', {
        x: 10, 
        y: 10,
        z: 10
    });
    box2.setAttribute('material', {
        color: 'yellow'
    });
    box.setAttribute("look-at", "[camera]")
    box2.setAttribute('gps-entity-place', {
        latitude: -27.842188,
        longitude: 153.339849
    });
    const sceneEl = document.querySelector("a-scene");
    sceneEl.appendChild(box);
    sceneEl.appendChild(box2);

    const distanceMsg = document.querySelector('[gps-entity-place]').getAttribute('distanceMsg');
    alert(distanceMsg)
}
