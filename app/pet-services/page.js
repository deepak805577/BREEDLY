"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

export default function PetServices(){

const [location,setLocation] = useState(null);
const [places,setPlaces] = useState([]);

useEffect(()=>{

navigator.geolocation.getCurrentPosition(async(position)=>{

const lat = position.coords.latitude;
const lon = position.coords.longitude;

setLocation([lat,lon]);

const query = `
[out:json][timeout:25];
(
node["shop"="pet"](around:30000,${lat},${lon});
node["amenity"="veterinary"](around:30000,${lat},${lon});
node["amenity"="animal_shelter"](around:30000,${lat},${lon});
node["amenity"="clinic"](around:30000,${lat},${lon});
node["amenity"="hospital"](around:30000,${lat},${lon});
);
out body;
`;

try{

const response = await fetch(
"https://overpass-api.de/api/interpreter",
{
method:"POST",
headers:{
"Content-Type":"text/plain"
},
body:query
}
);

const data = await response.json();

const enriched = data.elements.map((place)=>{

const distance = getDistance(
lat,
lon,
place.lat,
place.lon
);

return{
...place,
distance:distance.toFixed(2)
};

});

setPlaces(enriched);

}catch(err){
console.error(err);
}

});

},[]);


// Distance calculation
function getDistance(lat1,lon1,lat2,lon2){

const R = 6371;

const dLat = (lat2-lat1)*Math.PI/180;
const dLon = (lon2-lon1)*Math.PI/180;

const a =
Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(lat1*Math.PI/180)*
Math.cos(lat2*Math.PI/180)*
Math.sin(dLon/2)*Math.sin(dLon/2);

const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

return R*c;

}

if(!location){
return <p>Getting your location...</p>;
}

return(

<div style={{height:"100vh"}}>

<h2 style={{textAlign:"center"}}>
Nearby Pet Services 🐶
</h2>

<MapContainer
center={location}
zoom={13}
style={{height:"90vh",width:"100%"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

{/* user marker */}

<Marker position={location}>
<Popup>
<b>You are here</b>
</Popup>
</Marker>

{/* search radius */}

<Circle
center={location}
radius={10000}
/>

{/* services */}

{places.map((place,index)=>{

let type="Pet Service";

if(place.tags?.shop==="pet") type="Pet Shop";
if(place.tags?.amenity==="veterinary") type="Veterinary Clinic";
if(place.tags?.amenity==="animal_shelter") type="Animal Shelter";

return(

<Marker
key={index}
position={[place.lat,place.lon]}
>

<Popup>

<b>{place.tags?.name || type}</b>

<br/>

Type: {type}

<br/>

Distance: {place.distance} km

</Popup>

</Marker>

);

})}

</MapContainer>

</div>

);
}