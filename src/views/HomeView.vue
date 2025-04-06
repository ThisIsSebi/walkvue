<script setup>
import Map from "@/components/Map.vue";
import RadiusSetter from "@/components/RadiusSetter.vue";
import {ref, onMounted} from "vue";

const radius = ref(200);

const showOverlay = ref(false);

onMounted(() => {
  if (!localStorage.getItem("visited")) {
    showOverlay.value = true;
  }
});

const hideOverlay = () => {
  localStorage.setItem("visited", "true");
  showOverlay.value = false;
};

</script>

<template>

    <v-dialog v-model="showOverlay" persistent max-width="400">
      <v-card>
        <v-card-title>Willkommen!</v-card-title>
        <v-card-text>So funktioniert die Seite...</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="hideOverlay">Verstanden</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  <v-container class="containerstyle">
    <v-row justify="center">
      <v-card class="v-col-12" elevation="0">
        <Map class="map" :radius="radius"></Map>
      </v-card>
    </v-row>
  </v-container>
  <v-container class="radiusSetter">
      <RadiusSetter v-model="radius"></RadiusSetter>
  </v-container>

</template>

<style scoped>
.containerstyle {
  width: 100vw;
  padding-top: 20px;
}

.radiusSetter{
  margin-top: -80px;
}
.map{
  border-radius: 10px;
}
</style>
