// STORAGE KEY HANDLER
const keyValue = localStorage.getItem('localKey');
if (keyValue) {
  initializeGoogleMapsAPI(keyValue)
}

// MAP LOAD ASYNC
function initializeGoogleMapsAPI(key) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&libraries=drawing`;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

// NEW KEY HANDLER
const submitButton = document.querySelector('.input-button');
submitButton.addEventListener('click', inputButtonClickHandler);

function inputButtonClickHandler() {
  const userKey = document.getElementById('key').value;
  if (userKey){
    localStorage.setItem('localKey', userKey);
  }
  location.reload()
};

//===================
// MAP INITIALIZATION
//===================
function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: { lat: 59.329, lng: 18.07 },
  });

  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYLINE],
    },
  });
  drawingManager.setMap(map);

  let count = 0;
  google.maps.event.addListener(
    drawingManager,
    'overlaycomplete',
    function (event) {

      if (event.type === google.maps.drawing.OverlayType.POLYLINE) {
        count += 1;

        const polygon = event.overlay;
        const coordinates = polygon.getPath().getArray();
        const resultDiv = document.querySelector('.coord-results');
        const bounds = new google.maps.LatLngBounds();

        let subTitle = document.createElement('h4');
        subTitle.textContent = `polygon ${count}`;
        resultDiv.appendChild(subTitle);

        for (let i = 0; i < coordinates.length; i++) {
          bounds.extend(coordinates[i]);
          let child = document.createElement('div');
          child.classList.add('coord');
          child.textContent = `{lat: ${coordinates[i].lat()}, lng: ${coordinates[i].lng()}},`;
          resultDiv.appendChild(child);
        }

        const center = bounds.getCenter();
        const marker = new google.maps.Marker({
          position: center,
          map: map,
          label: count.toString(),
        });
      }
    }
  );
}

window.initMap = initMap;