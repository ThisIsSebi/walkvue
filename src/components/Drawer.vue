<script setup>
import { computed, onUnmounted, ref, defineEmits, watch, nextTick } from "vue";
import {
  usePoiStore,
  useCheckInStore,
  useGeoStore,
  useAuthStore,
} from "@/stores";
import router from "@/router/index.js";
import WikipediaIframe from "@/components/WikipediaIframe.vue";
import CheckedinUsers from "@/components/CheckedinUsers.vue";

const poiStore = usePoiStore();
const checkInStore = useCheckInStore();
const geoStore = useGeoStore();
const authStore = useAuthStore();
const publicCheckin = ref(false);
const clickedSave = ref(false);
const isDialogOpen = ref(false);

const formattedUrl = computed(() => {
  // Falls URL vorhanden, hänge ?useskin=minerva an
  return poiStore.poi.url
    ? poiStore.poi.url.replace("wikipedia.org", "wikipedia.org") +
        "?useskin=minerva"
    : "";
});

const openWeblink = () => {
  if (formattedUrl.value) {
    isDialogOpen.value = true;
  }
  console.log(formattedUrl.value);
};

const poiImageUrl = computed(
  () =>
    poiStore.poi.imageUrl ||
    (poiStore.poi.imageId > 0
      ? pictureStore.getImage(poiStore.poi.imageId)
      : new URL("/img/Symbolbild.jpg", window.location.origin).href)
);

watch(
  () => poiStore.poi,
  (newValue) => {
    console.log("Watcher ausgelöst", newValue);
  }
);

function saveCheckin() {
  checkInStore.checkinAtPoi(publicCheckin.value);
}

function handleSave() {
  if (!geoStore.isNear) {
    alert("You have to be near the Point of Interest to check in!");
    return;
  }

  if (authStore.token) {
    saveCheckin();
    clickedSave.value = true;
    return;
  }

  const wantsToLogin = confirm(
    "Please log in to save a Point of Interest. Click OK to go to the login page."
  );

  if (wantsToLogin) {
    router.push("/login").catch(console.error);
  }
}

function cancelAndEmptyPoi() {
  poiStore.drawer = !poiStore.drawer;
  poiStore.emptyPoi();
}
</script>

<template>
  <v-container max-width="600px">
    <!-- Slide-in Panel von LINKS -->
    <v-navigation-drawer
      v-model="poiStore.drawer"
      temporary
      left
      class="custom-drawer"
      width="500"
    >
      <!-- Ziehbare Lasche (RELATIV zum Drawer) -->
      <div class="drawer-handle" @click="poiStore.drawer = !poiStore.drawer">
        <v-icon>{{
          poiStore.drawer ? "mdi-chevron-left" : "mdi-chevron-right"
        }}</v-icon>
      </div>

      <div class="pa-4">
        <v-img :src="poiImageUrl" height="250px" cover class="mb-3" />

        <div class="px-0">
          <h2 class="text-h6 font-weight-bold text-left">
            {{ poiStore.poi.title }}
          </h2>
        </div>

        <div class="text-left px-0">
          <p>{{ poiStore.poi.body }}</p>

          <!-- Wikipedia Iframe Dialog -->
          <WikipediaIframe
            v-if="isDialogOpen"
            :articleUrl="formattedUrl"
            @close="isDialogOpen = false"
          />
        </div>
        <div class="text-left mt-4 mb-2">
          <p v-show="!geoStore.isNear" class="hint-text">
            Du bist noch zu weit entfernt, um dich einzuchecken.
          </p>
        </div>

        <CheckedinUsers
          v-if="poiStore.poi.poiId"
          :poi-id="poiStore.poi.poiId"
        />

        <v-switch
          v-model="publicCheckin"
          color="blue"
          label="Öffentlich einchecken"
          hide-details
          density="compact"
          class="mb-3"
        ></v-switch>

        <div class="d-flex w-100">
          <v-btn
            color="green"
            size="large"
            class="flex-grow-1 mr-2"
            @click="handleSave"
            :disabled="!geoStore.isNear"
          >
            Check-in
          </v-btn>

          <v-btn
            color="blue"
            size="large"
            class="flex-grow-1"
            variant="outlined"
            @click="openWeblink"
          >
            Mehr lesen
          </v-btn>
        </div>

        <p v-if="clickedSave" class="updateMessage mt-3">
          {{ checkInStore.updatedMessageCheckIn }}
        </p>

        <p v-if="clickedSave" class="w-100">
          <router-link to="/dashboard">
            <v-btn color="secondary" size="large" block variant="tonal">
              Go to Dashboard
            </v-btn>
          </router-link>
        </p>
      </div>
    </v-navigation-drawer>
  </v-container>
</template>

<style scoped>
/* 🔥 Sidebar kommt leicht raus (10px sichtbar) */
.custom-drawer {
  background: white;
  z-index: 1500;
  box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  transform: translateX(-10px); /* Immer ein kleines Stück sichtbar */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Wenn offen, dann ganz sichtbar */
.v-navigation-drawer.v-navigation-drawer--active {
  transform: translateX(0);
}

/* 🏆 Große, runde Lasche, die am Drawer hängt */
.drawer-handle {
  position: absolute;
  top: 50%;
  right: -30px; /* Direkt am Drawer */
  transform: translateY(-50%);
  background: white; /* Gleich wie Drawer */
  color: #1976d2;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1601;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2); /* 3D-Effekt */
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid rgba(0, 0, 0, 0.1); /* Leichter Rand für noch mehr 3D-Feeling */
}

/* Hover- und Klick-Effekt */
.drawer-handle:hover {
  background: #f0f0f0;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.3);
}

/* Klick-Animation */
.drawer-handle:active {
  transform: translateY(-50%) scale(0.95);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}
</style>

<style scoped>
/* 🔥 Sidebar jetzt breiter */
.custom-drawer {
  background: white;
  z-index: 1500;
  box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* 🏆 Lasche bewegt sich mit dem Drawer */
.drawer-handle {
  position: absolute;
  top: 50%;
  right: -40px; /* Die Lasche steht direkt außerhalb des Drawers */
  transform: translateY(-50%);
  background: #ff9900;
  color: white;
  padding: 10px;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  z-index: 1601;
  transition: background 0.3s ease, right 0.3s ease;
}

/* Hover-Effekt */
.drawer-handle:hover {
  background: #1565c0;
}

@media (max-width: 600px) {
  .custom-drawer {
    transform: translateX(
      -100%
    ) !important; /* Drawer startet außerhalb des Bildschirms */
  }

  .v-navigation-drawer--active {
    transform: translateX(0) !important; /* Wenn geöffnet, sichtbar machen */
  }
}
</style>
