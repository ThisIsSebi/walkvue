<script setup>
import { onMounted, watch, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePoiStore, useGeoStore } from "@/stores";
import "leaflet-routing-machine";
import StandortIcon from "@/assets/img/Standort.png";


const props = defineProps({
  radius: {
    type: Number,
    required: true,
  },
});
const geoStore = useGeoStore();
const poiStore = usePoiStore();
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

let map;
let poiMarker;
let routingControl = null;
let userLocation = ref({ latitude: null, longitude: null });
let radiusCircle = null;

const redIcon = L.icon({
  iconUrl: new URL(StandortIcon, import.meta.url).href,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function drawRadiusCircle(lat, lng) {
  if (!map) return;

  if (radiusCircle) {
    map.removeLayer(radiusCircle);
  }

  radiusCircle = L.circle([lat, lng], {
    color: "black",
    fillColor: "#ff9900",
    fillOpacity: 0.2,
    radius: props.radius, // Dynamischer Radius
    weight: 1,
  }).addTo(map);
}

// Funktion für das Setzen der Karte

function setMapAndRadius(lat, lon) {
  map.setView([lat, lon], 15);
  L.marker([lat, lon]).addTo(map).openPopup();
  drawRadiusCircle(lat, lon);
}

function handleFallback() {
  const useFallback = window.confirm(
    "Deine Standortbestimmung ist nicht möglich. Möchtest du zufällige Koordinaten verwenden?"
  );
  if (useFallback) {
    userLocation.value = geoStore.generateFallbackCoordinates();
    console.log(
      `📍 Zufällige Nutzerposition: lat=${userLocation.value.latitude}, lon=${userLocation.value.longitude}`
    );
    setMapAndRadius(userLocation.value.latitude, userLocation.value.longitude);
  }
}

onMounted(() => {
  console.log("🚀 Map wird initialisiert...");
  map = L.map("map").setView([48.184606, 16.420382], 15);

  L.tileLayer(url, {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: ['a', 'b', 'c']
}).addTo(map);

  // Let the DOM settle, then fix map rendering
  setTimeout(() => {
    map.invalidateSize();
  }, 100);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value.latitude = position.coords.latitude;
        userLocation.value.longitude = position.coords.longitude;
        console.log(
          `📍 Nutzerposition: lat=${userLocation.value.latitude}, lon=${userLocation.value.longitude}`
        );
        setMapAndRadius(
          userLocation.value.latitude,
          userLocation.value.longitude
        );
      },
      (error) => {
        console.error(
          "Fehler beim Abrufen der Position:",
          error.code,
          error.message
        );
        handleFallback();
      }
    );
  } else {
    console.error("Geolocation wird nicht unterstützt");
    handleFallback();
  }
});

function removeRouting() {
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
  }
}

watch(
  () => poiStore.poi,
  () => {
    console.log("Watcher ausgelöst", poiStore.poi);

    if (poiMarker) {
      map.removeLayer(poiMarker);
    }

    poiMarker = L.marker([poiStore.poi.latitude, poiStore.poi.longitude], {
      icon: redIcon,
    })
      .addTo(map)
      .bindPopup(poiStore.poi.title)
      .openPopup();

    map.setView([poiStore.poi.latitude, poiStore.poi.longitude], 15);

    if (
      userLocation.value.latitude !== null &&
      userLocation.value.longitude !== null
    ) {
      removeRouting();

      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.value.latitude, userLocation.value.longitude),
          L.latLng(poiStore.poi.latitude, poiStore.poi.longitude),
        ],
        routeWhileDragging: true,
      }).addTo(map);

      routingControl.getContainer().style.display = "none";
    }
  },
  { deep: true }
);

watch(
  () => props.radius,
  () => {
    if (userLocation.value.latitude && userLocation.value.longitude) {
      drawRadiusCircle(
        userLocation.value.latitude,
        userLocation.value.longitude
      );
    }
  }
);
</script>

<template>
  <div id="map" class="mapstyle"></div>
</template>

<style scoped>
.mapstyle {
  height: 500px;
  width: 100%;
}
</style>
