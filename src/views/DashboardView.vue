<script setup>
import { usePoiStore, useCheckInStore, useAuthStore, useGeoStore } from "@/stores";
import {onMounted, ref, watch} from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import {usePictureStore} from "@/stores/picture.js";
import DashboardCarousel from "@/views/DashboardCarousel.vue";

const pictureStore = usePictureStore();
const poiStore = usePoiStore();
const map = ref(null);
const userLocation = ref({ latitude: null, longitude: null });
const url = "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png";
const checkInStore = useCheckInStore();

console.log(poiStore.poi);

onMounted(() => {
  checkInStore.getCheckinsByUser();
  mapLoader();

});

function mapLoader(){

  if (map.value){
    map.value.remove();
    map.value = null;
  }
  map.value = L.map("map").setView([48.184606, 16.420382], 15);

  L.tileLayer(url, {
    attribution: "&copy; Wikimedia contributors",
  }).addTo(map.value);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation.value.latitude = position.coords.latitude;
          userLocation.value.longitude = position.coords.longitude;
          map.value.setView([userLocation.value.latitude, userLocation.value.longitude], 15);
          L.marker([userLocation.value.latitude, userLocation.value.longitude])
              .addTo(map.value)
              .bindPopup("Ihr Standort")
              .openPopup();
        },
        (error) => {
          console.error("Fehler beim Abrufen der Position:", error.code, error.message);
        }
    );
  } else {
    console.error("Geolocation wird nicht unterstützt");
  }
  checkInStore.checkins.forEach((checkin) => {
    if (checkin.checkinPoi) {
      L.marker([checkin.checkinPoi.latitude, checkin.checkinPoi.longitude])
          .addTo(map.value)
          .bindPopup(checkin.checkinPoi.poiTitle);
    }
  });
}

watch(
    () => checkInStore.checkins,
    () => {
      if (!map.value) return;

      checkInStore.checkins.forEach((checkin) => {
        console.log(checkInStore.checkins)
        L.marker([checkin.checkinPoi.latitude, checkin.checkinPoi.longitude])
            .addTo(map.value)
            .bindPopup(checkin.checkinPoi.poiTitle)
            .openPopup();
      });
      mapLoader();
    },
    { deep: true }
);

function onFileChanged(event) {
  file.value = event.target.files[0];
}

const file = ref(null);
const fileInput = ref(null);
const dialogVisible = ref(false);
const checkinToEdit = ref();

async function submitFileInput(){
  const formData = new FormData();
  formData.append("file", file.value);
  console.log(formData)
  pictureStore.uploadPicture(formData, checkinToEdit.value.checkinPoi.poiId);

  //cancelWindow();
  //window.location.reload();
  console.log("Picturestore:" + pictureStore.pictures);

}

function openUploadDialog(checkin){
  checkinToEdit.value = checkin;
  console.log(checkinToEdit.value)
  dialogVisible.value = true;
}

function handleDelete(id){
  checkInStore.deleteCheckin(id)
  window.location.reload();
}

function cancelWindow(){
  fileInput.value.value = null; // Setzt das Datei-Input zurück
  dialogVisible.value = false;  // Schließt das Dialog
}

</script>

<template>
  <v-container>
    <v-row class="title">
      <h1>Dashboard</h1>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <div id="map" class="mapstyle"></div>

      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-card elevation="1" class="v-col-12 v-col-md-6" id="POIDashboard" rounded="lg">
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
              <v-list-item v-for="checkin in checkInStore.checkins"> <!-- ALT: v-for="(checkin, index) in checkInStore.checkins" :key="index"> -->
                <v-row class="d-flex align-center">
                  <v-col class="d-flex" style="flex-grow: 1; width: 100%;">
                    <RouterLink :to="'/checkin/' + checkin.checkinPoi.poiId" class="checkInPOITitle">{{checkin.checkinPoi.poiTitle}}</RouterLink>
                  </v-col>
                  <v-col cols="auto" class="d-flex justify-start button-group">
                    <v-btn color="primary" @click="handleDelete(checkin.checkinPoi.poiId)" class="mb-2 mb-md-0">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn color="secondary"  @click="openUploadDialog(checkin)" class="ml-1 mb-2 mb-md-0">
                      <v-icon>mdi-camera</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-list>
      </v-card>
      <DashboardCarousel/>
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
@media (max-width: 600px){
  .button-group{
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }
}

.checkInPOITitle {
  color: black;
  width: 100%;
}

.title h1{
  display: flex;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  margin-top: 20px;
}

#POIDashboard h2{
  margin-bottom: 20px;
}

.text-right{
  display: flex;
  justify-content: flex-end;
}

.mapstyle {
  height: 500px;  /* oder eine andere Höhe, die dir passt */
  width: 100%;
  border-radius: 20px;
}
.d-none {
  display: none;
}

.checkInPOITitle{
  color: black;
  text-align: left; /* Sicherstellen, dass der Titel immer links ausgerichtet ist */
  white-space: nowrap; /* Verhindert, dass der Text umbricht, falls zu lang */
  overflow: hidden; /* Verhindert Überlauf */
  text-overflow: ellipsis;
}
</style>