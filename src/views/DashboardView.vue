<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { usePoiStore, useCheckInStore, useAuthStore, useGeoStore } from "@/stores";
import { usePictureStore } from "@/stores/picture.js";
import DashboardCarousel from "@/views/DashboardCarousel.vue";

const poiStore = usePoiStore();
const checkInStore = useCheckInStore();
const pictureStore = usePictureStore();

const map = ref(null);
const markers = ref([]);
const userLocation = ref({ latitude: null, longitude: null });

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

onMounted(async () => {
  await checkInStore.getCheckinsByUser();
  nextTick(() => {
    initMap();
  });
});

function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.warn("🛑 Map container not found!");
    return;
  }

  if (map.value) {
    map.value.remove();
    map.value = null;
  }

  map.value = L.map("map").setView([48.184606, 16.420382], 15);

  L.tileLayer(url, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ["a", "b", "c"],
  }).addTo(map.value);

  setTimeout(() => {
    map.value.invalidateSize();
  }, 100);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value.latitude = position.coords.latitude;
        userLocation.value.longitude = position.coords.longitude;

        const { latitude, longitude } = userLocation.value;
        map.value.setView([latitude, longitude], 15);
        L.marker([latitude, longitude])
          .addTo(map.value)
          .bindPopup("Ihr Standort")
          .openPopup();

        addCheckinMarkers();
      },
      (error) => {
        console.error("Fehler beim Abrufen der Position:", error.code, error.message);
        addCheckinMarkers(); // Still add checkins
      }
    );
  } else {
    console.error("Geolocation wird nicht unterstützt");
    addCheckinMarkers(); // Still add checkins
  }
}

function addCheckinMarkers() {
  if (!map.value || typeof map.value.addLayer !== "function") {
    console.warn("🚫 map.value is not a valid Leaflet map instance");
    return;
  }

  // Remove existing markers first
  markers.value.forEach((m) => map.value.removeLayer(m));
  markers.value = [];

  checkInStore.checkins.forEach((checkin) => {
    if (checkin.checkinPoi) {
      const marker = L.marker([checkin.checkinPoi.latitude, checkin.checkinPoi.longitude])
        .addTo(map.value)
        .bindPopup(checkin.checkinPoi.poiTitle);
      markers.value.push(marker);
    }
  });
}

watch(
  () => checkInStore.checkins,
  () => {
    if (map.value && typeof map.value.addLayer === "function") {
      addCheckinMarkers();
    }
  },
  { deep: true }
);

// === Picture Upload + Dialog Handling ===

const file = ref(null);
const fileInput = ref(null);
const dialogVisible = ref(false);
const checkinToEdit = ref();

function onFileChanged(event) {
  file.value = event.target.files[0];
}

async function submitFileInput() {
  if (!file.value || !checkinToEdit.value) return;
  const formData = new FormData();
  formData.append("file", file.value);
  await pictureStore.uploadPicture(formData, checkinToEdit.value.checkinPoi.poiId);
  cancelWindow();
}

function openUploadDialog(checkin) {
  checkinToEdit.value = checkin;
  dialogVisible.value = true;
}

function cancelWindow() {
  if (fileInput.value) fileInput.value.value = null;
  dialogVisible.value = false;
}

function handleDelete(id) {
  checkInStore.deleteCheckin(id);
  window.location.reload();
}
</script>


<template>
  <v-container>
    <v-row class="title">
      <h1>Dashboard</h1>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <div
          id="map"
          class="mapstyle"
          style="height: 500px; width: 100%; margin: 20px auto"
        ></div>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-card
        elevation="1"
        class="v-col-12 v-col-md-6"
        id="POIDashboard"
        rounded="lg"
      >
        <h2>Meine besuchten Orte</h2>
        <!-- TEST - zu löschen:
          <table>
            <tr v-for="checkin in checkInStore.checkins">
              <td>{{ checkin.checkinPoi.poiTitle}}</td>
              <td><RouterLink :to="'/checkin/' + checkin.checkinPoi.poiId">Details</RouterLink></td>
            </tr>
          </table>
        -->

        <v-list activatable="activatable">
          <v-list>
            <v-list-item v-for="checkin in checkInStore.checkins">
              <!-- ALT: v-for="(checkin, index) in checkInStore.checkins" :key="index"> -->
              <v-row class="d-flex align-center">
                <v-col class="d-flex" style="flex-grow: 1; width: 100%">
                  <RouterLink
                    :to="'/checkin/' + checkin.checkinPoi.poiId"
                    class="checkInPOITitle"
                    >{{ checkin.checkinPoi.poiTitle }}</RouterLink
                  >
                </v-col>
                <v-col cols="auto" class="d-flex justify-start button-group">
                  <v-btn
                    color="primary"
                    @click="handleDelete(checkin.checkinPoi.poiId)"
                    class="mb-2 mb-md-0"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    color="secondary"
                    @click="openUploadDialog(checkin)"
                    class="ml-1 mb-2 mb-md-0"
                  >
                    <v-icon>mdi-camera</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-list>
      </v-card>
      <DashboardCarousel />
    </v-row>
  </v-container>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Lade ein Bild hoch</span>
      </v-card-title>
      <v-card-text>
        <input
          type="file"
          ref="fileInput"
          @change="onFileChanged($event)"
          accept="image/*"
          capture
        />
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="cancelWindow">Abbrechen</v-btn>
        <v-btn color="primary" @click="submitFileInput">Absenden</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
#map {
  height: 500px !important;
  min-height: 300px;
  width: 100%;
  display: block;
}

@media (max-width: 600px) {
  .button-group {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }
}

.checkInPOITitle {
  color: black;
  width: 100%;
}

.title h1 {
  display: flex;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  margin-top: 20px;
}

#POIDashboard h2 {
  margin-bottom: 20px;
}

.text-right {
  display: flex;
  justify-content: flex-end;
}

.mapstyle {
  height: 500px;
  min-height: 300px;
  width: 100%;
}
.d-none {
  display: none;
}

.checkInPOITitle {
  color: black;
  text-align: left; /* Sicherstellen, dass der Titel immer links ausgerichtet ist */
  white-space: nowrap; /* Verhindert, dass der Text umbricht, falls zu lang */
  overflow: hidden; /* Verhindert Überlauf */
  text-overflow: ellipsis;
}
</style>
