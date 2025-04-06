<script setup>
import { useRoute } from "vue-router";
import {computed, onMounted} from "vue";
import { ref } from 'vue';
import { useCheckInStore } from "@/stores/checkIn.js";
import { usePictureStore } from "@/stores/picture.js";
import { usePublicCheckinsStore } from "@/stores/publicCheckins.js";

import { VFileUpload } from 'vuetify/labs/VFileUpload';
import {usePoiStore} from "@/stores/poi.js";

const route = useRoute();
const checkInStore = useCheckInStore();
const pictureStore = usePictureStore();
const publicCheckinsStore = usePublicCheckinsStore();

const poiId = computed(() => parseInt(route.params.poiId));

const checkin = checkInStore.getCheckinByPoiId(poiId.value);

//GET PUBLIC CHECKINS OF USERS BY POI ID (TO BE DISPLAYED IN EXPANSION PANEL):
publicCheckinsStore.getPublicCheckinsAtPoi(poiId.value);



//const userImage = pictureStore.getImageUrl(1);
//console.log("User-Image:", userImage);

const pictureUrl = ref(null);

onMounted(async () => {
  // Lade das Bild für diesen POI
  pictureUrl.value = await pictureStore.getCheckinImage(poiId.value);
});

async function saveNote(poiId, note) {
  await checkInStore.saveNote(poiId, note);
  checkInStore.successMessage = true;
  setTimeout(
      () => {
        checkInStore.successMessage = false;
      }, 60000
  )
}

//Bild-Upload:
const file = ref(null);
const fileInput = ref(null);
const picture = ref(null);

function onFileChanged(event) {
  file.value = event.target.files[0];
}

async function submitFileInput(){
  const formData = new FormData();
  formData.append("file", file.value);
  console.log(pictureStore.pictures)

  console.log("POI-ID:", poiId.value);
  await pictureStore.uploadPicture(formData, poiId.value);
}

//const pic = pictureStore.getImage(1);

</script>

<template>
  <v-container >
    <v-row justify="center" class="mt-7">
      <h1>Details</h1>
    </v-row>
    <v-row class="mt-7">
      <v-card class="v-col-12 v-col-md-8">
        <v-card-title>
          {{ checkin.checkinPoi.poiTitle }}
        </v-card-title>
        <v-card-text>
          {{ checkin.checkinPoi.poiBody }}
        </v-card-text>
      </v-card>
      <!-- Nachfolgende Card wird nur angezeigt, wenn poiImageUrl nicht 0: -->
      <v-card class="v-col-12 v-col-md-4" v-if="checkin">
        <v-img max-height="250" :src="checkin.checkinPoi.poiImageUrl"></v-img>
      </v-card>
    </v-row>
    <v-row class="pt-3">
      <v-card class="v-col-12 v-col-md-6">
        <v-textarea v-model="checkin.note" clearable></v-textarea>
        <v-btn @click="saveNote(poiId, checkin.note)">
          Speichern
        </v-btn>
        <span class="mdi mdi-check-outline" v-if="checkInStore.successMessage"></span>
      </v-card>
      <v-card class="v-col-12 v-col-md-6">
        <!--<v-form @submit.prevent="submitFileInput" v-if="!checkInStore.getCheckinByPoiId(poiId).imageId">
          <v-file-input label="Upload image" clearable type="file" ref="fileInput" @change="onFileChanged($event)" accept="image/*"></v-file-input>
          <v-btn type="submit">Save</v-btn>
        </v-form>-->
        <v-card v-if="pictureUrl">
          <v-img max-height="250" :src="pictureUrl"></v-img>
        </v-card>
      </v-card>
    </v-row>
    <v-container class="mt-10">
      <v-row>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title class="v-col-12">
              <h4>Hier waren vor dir:</h4>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col v-for="checkin in publicCheckinsStore.publicCheckins" class="v-col-md-4 v-col-6 text-center">
                  {{ (checkin.username).toUpperCase() }}
                  <!-- BILDAUSGABE NOCH NICHT FUNKTIONELL bzw MUSS AUF THUMBNAIL UMGESTELLT WERDEN: -->
                  <v-img src="{{ pictureStore.getImage(userImageId) }}">
                  </v-img>
                  <br>
                  <!-- ImageId: {{ checkin.userImageId }} -->
                </v-col>
              </v-row>
              <v-row>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-container>
    <v-row justify="center">
      <v-btn class="mt-7" to="/dashboard" color="primary" @click="checkInStore.deleteCheckin(poiId)">
        Check-Log Löschen
      </v-btn>
    </v-row>
    <v-row justify="center">
      <v-btn class="mt-7" to="/dashboard" color="secondary">
        Zurück
      </v-btn>
    </v-row>


    <!-- <CheckedinUsers :poiId="poiId" class="mt-10"></CheckedinUsers> -->


    <v-row>

      <!--
      <br>
      <h3>Hilfsansicht - ZU LÖSCHEN -Gesamter Checkin:</h3>
      {{ poiId }}
      {{ checkInStore.getCheckinByPoiId(poiId) }}
      -->

    </v-row>
  </v-container>


</template>

<style scoped>


</style>