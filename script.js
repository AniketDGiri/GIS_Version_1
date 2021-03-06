window.onload = () => {
    let method = 'dynamic';

    // if you want to statically add places, de-comment following line
    //method = 'static';

    if (method === 'static') {
        let places = staticLoadPlaces();
        renderPlaces(places);
    }
    
    if (method !== 'static') {

        // first get current user location
        return navigator.geolocation.getCurrentPosition(function (position) {

            // than use it to load from remote APIs some places nearby
            console.log("In dynamic ");
            
             dynamicLoadPlaces(position.coords)
                .then((places) => {
                    renderPlaces(places,position.coords);
                })
        },
            (err) => console.error('Error in retrieving position', err),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
};

function staticLoadPlaces() {
    return [
        {
            name: "Your place name",
            location: {
                lat: 0, // add here latitude if using static data
                lng: 0, // add here longitude if using static data
            }
        },
        {
            name: 'Another place name',
            location: {
                lat: 0,
                lng: 0,
            }
        }
    ];
}

  AFRAME.registerComponent('clickhandler', {
        init: function() {
            this.el.addEventListener('touchstart', () => {
                alert('HELLO')
            });
            //aframe over
        }});

/*AFRAME.registerComponent('clickhandler', {
        init: function() {
            this.el.addEventListener('click', () => {
                alert(latitude)
            });
            //aframe over
        }});*/
            
 function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
        
    function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      var d = d.toFixed(2);
      return d;
    }

// getting places from REST APIs
function dynamicLoadPlaces(position) {
    let params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'CWD4TKLPKVYFPKDV5ZP4QIO5OL41IQOJGQETAVR5YKZKTXN1',   // add your credentials here
        clientSecret: 'WMI044EDI4CKGBLOVYUCGP00ISJK0QVJKXDIKKAA1DFRY4NB',   // add your credentials here
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    let corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    let endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};

function renderPlaces(places,position) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        const latitude = place.location.lat;
        const longitude = place.location.lng;
        
         console.log(latitude);
         console.log(longitude);
        
        //USER's LOCATION
        console.log('User locatoqqoooooqpn');
        //console.log(position.latitude);
         //console.log(position.longitude);
        
        
        
        
        // NEW DISTANCE CODE ADDED
        answer=calcCrow(latitude,longitude,position.latitude,position.longitude);
        console.log(answer);
        
        var str=answer+"\n"+place.name
        console.log(str);
     
        
       

    // Converts numeric degrees to radians
    
        
        // NEW DISTANCE CODE FINISHED..
        
         console.log("Text is set");
        // add place name
        let text = document.createElement('a-link');
        text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        //text.setAttribute('title', place.name);
        text.setAttribute('title', str);
        
        text.setAttribute('href', 'http://www.example.com/');
        text.setAttribute('scale', '25 25 25');

        text.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });
        console.log("Text is set");
        scene.appendChild(text);
        
        

        // add place icon
        console.log(place.name);
        const icon = document.createElement('a-image');
        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
        //icon.setAttribute('name', place.name);
        icon.setAttribute('name', str);
        icon.setAttribute('src', './marker.jpg');
        icon.setAttribute('href', 'https://stackoverflow.com/questions/13674031/how-to-get-the-top-10-values-in-postgresql');
        
        console.log("Image Displayedd");

        // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
        icon.setAttribute('scale', '30, 30');

        icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

        const clickListener = function (ev) {
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
        
        
   
        
        console.log("before ccclcicking.....");
        icon.addEventListener('click',clickListener);
        
        scene.appendChild(icon);
    });
}
