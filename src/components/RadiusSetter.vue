<script setup>
import {watch, onUnmounted, ref, computed} from 'vue';
import {usePoiStore, useCheckInStore, useAuthStore, usePictureStore, useGeoStore} from "@/stores";
import Drawer from "@/components/Drawer.vue";

const authStore = useAuthStore();
const geoStore = useGeoStore();
const poiStore = usePoiStore();
const pictureStore = usePictureStore();
const checkInStore = useCheckInStore();

const lat = ref(null);
const lon = ref(null);
const targetLat = ref(null)
const targetLon = ref(null)
const radius = ref(200);
const intervalId = ref(null);
const clickedSave = ref(false);
const publicCheckin = ref(false);
const emit = defineEmits(["update:modelValue"]);


// Watcher für den Radius, der an die Map und den Poi-Store übergeben wird.
// Sowie Watcher für die aktuellen Koordinaten (durch Geolocation oder Fallback).

watch(radius, (newRadius) => {
  emit("update:modelValue", newRadius);
});

watch(
    () => geoStore.fallback,
    (newVal) => {
      if (newVal && !lat.value && !lon.value) { // Nur setzen, wenn sie leer sind
        console.log(`Fallback aktiviert: lat=${geoStore.latitude}, lon=${geoStore.longitude}`);
        lat.value = geoStore.latitude;
        lon.value = geoStore.longitude;
      }
    }
);

watch(
    () => [targetLat.value, targetLon.value],
    ([lat, lon]) => {
      if (lat && lon && !intervalId.value) {
        console.log("🎯 Zielkoordinaten erhalten, starte Intervall!");

        intervalId.value = setInterval(() => {
          calculateDistanceToPoi();
        }, 1500);
      } else if (!lat || !lon) {
        // Falls kein POI mehr da ist → Intervall stoppen
        if (intervalId.value) {
          console.log("⏹️ Keine Zielkoordinaten mehr, stoppe Intervall!");
          clearInterval(intervalId.value);
          intervalId.value = null;
        }
      }
    }
);

// Funktionen zum Anzeigen und Speichern der POIs.

function loadPoi() {
  if (!lat.value || !lon.value) {
    console.error("🌍 Koordinaten fehlen, API-Request abgebrochen!");
    return;
  }

  poiStore.loadPoi(lat.value, lon.value, radius.value)
      .then(() => {
        targetLat.value = poiStore.poi.latitude;
        targetLon.value = poiStore.poi.longitude;
      })
      .catch(error => {
        console.error("⚠️ Fehler beim Laden der POIs:", error);
      });
}

// const poiImageUrl = computed(() =>
//     poiStore.poi.imageUrl || (poiStore.poi.imageId > 0
//         ? pictureStore.getImage(poiStore.poi.imageId)
//         : new URL("/img/Symbolbild.jpg", window.location.origin).href)
// );

function calculateDistanceToPoi() {
  if (!navigator.geolocation) {
    console.log("Distanzberechnung geht nicht.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
      (position) => {
        lat.value = position.coords.latitude;
        lon.value = position.coords.longitude;
        console.log(`lat=${lat.value}, lon=${lon.value}`);
        const distance = geoStore.calculateDistance(lat.value, lon.value, targetLat.value, targetLon.value);
        geoStore.isNear = distance < 500;
      },
      (error) => {
        console.error(error.message)
      });
}

function geoQuery(radius) {
  navigator.geolocation.getCurrentPosition(
      (position) => {
        lat.value = position.coords.latitude;
        lon.value = position.coords.longitude;
        console.log(`lat=${lat.value}, lon=${lon.value}`);
        loadPoi();
      },
      (error) => {
        loadPoi();
      }
  )
}

//
// function saveCheckin() {
//   checkInStore.checkinAtPoi(publicCheckin.value);
// }


// function handleSave() {
//   setTimeout(() =>
//   {
//     if (!isNear.value) {
//       alert("You have to be near the Point of Interest to check in!");
//       return
//     }
//     if (isNear.value === true) {
//       if (authStore.token) {
//         saveCheckin();
//         clickedSave.value = true;
//       } else if (authStore.token === null) {
//         if (confirm("Please log in to save a Point of Interest. Click OK to go to the login page.")) {
//           nextTick(() => {
//             console.log("Redirecting to login...");
//             router.push("/login").catch((error) => {
//               console.error("Navigation error:", error);
//             });
//           });
//         }
//       }
//     }
//   }, 1500
// )
// }

  onUnmounted(() => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null; // Interval-ID zurücksetzen
    }
  });
//
// async function closeDialogAndEmptyPoi(isActive) {
//   await poiStore.emptyPoi();
//   isActive.value = false;
// }
</script>

<template>
  <v-container max-width="600px">
    <v-row class="mt-16 mb-10" justify="center">
Wie weit möchtest du wandern?
    </v-row>
    <v-row>
      <v-slider
          v-model="radius"
          :max="2000"
          :min="0"
          :step="10"
          thumb-label="always"
      >
        <template v-slot:thumb-label="{ modelValue }">
          {{ modelValue }}m
        </template>
      </v-slider>
    </v-row>
    <v-row justify="center">
          <v-btn @pointerdown="geoQuery(radius); poiStore.drawer = true" elevation="1" color="primary">Auf geht's!</v-btn>


<!--      <v-dialog max-width="500" variant="elevated">-->
<!--        <template v-slot:activator="{ props: activate }">-->
<!--          <v-btn @pointerdown="geoQuery(radius); poiStore.drawer = true" v-bind="activate" elevation="1" color="primary" class="">Go!</v-btn>-->
<!--        </template>-->

<!--        <template v-slot:default="{ isActive }">-->
<!--          <v-card>-->
<!--            <v-img :src="poiImageUrl"/>-->
<!--            <v-card-item>-->
<!--              <v-card-title>-->
<!--                <v-text-field variant="underlined" loading v-if="!poiStore.poi.title">Please wait, your Point of-->
<!--                  Interest is loading...-->
<!--                </v-text-field>-->
<!--                {{ poiStore.poi.title }}-->
<!--              </v-card-title>-->
<!--            </v-card-item>-->
<!--            <v-card-text>-->
<!--              {{ poiStore.poi.body }}<br><br>-->
<!--              <strong v-if="poiStore.poi.title"><a target="_blank" :href="poiStore.poi.url">Read More</a></strong>-->
<!--            </v-card-text>-->
<!--            <v-switch-->
<!--                v-model="publicCheckin"-->
<!--                color="blue"-->
<!--                label="public"-->
<!--                hide-details-->
<!--                class="switchButton"-->
<!--            ></v-switch>-->
<!--            &lt;!&ndash;-->
<!--            <v-btn color="blue-lighten-2" class="saveButton" @click="handleSave">-->
<!--              <v-icon>mdi-book</v-icon>-->
<!--            </v-btn>&ndash;&gt;-->
<!--            &lt;!&ndash; :disabled="!isNear"&ndash;&gt;-->
<!--            <v-btn color="green" @click="handleSave">-->
<!--              Check-in-->
<!--            </v-btn>-->
<!--            <v-btn display="block" @pointerdown="closeDialogAndEmptyPoi(isActive)">Cancel</v-btn>-->
<!--            <p v-if="clickedSave" class="updateMessage">{{ checkInStore.updatedMessageCheckIn }}</p>-->
<!--            <p v-if="clickedSave">-->
<!--              <a>-->
<!--                <router-link to="/dashboard" class="goToDashboardMessage">Go to Dashboard</router-link>-->
<!--              </a>-->
<!--            </p>-->
<!--          </v-card>-->
<!--        </template>-->

<!--      </v-dialog>-->


    </v-row>
  </v-container>

  <drawer />

</template>

<style scoped>

.colorButtonPOI {
  background-color: #ff9900;
  font-size: 1.0rem;
}

.switchButton {
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
}

.updateMessage {
  color: #ff9900;
  font-size: 1.2rem;
  font-weight: normal;
  text-align: center;
  padding: 10px;
}

.goToDashboardMessage {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 10px;
  display: flex;
  justify-content: center;
}
</style>