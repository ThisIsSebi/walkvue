<script setup >
import LosImage from '@/assets/img/Los!.png';
import PfeilImage from '@/assets/img/Pfeil.png';
import GenerierePOIImage from '@/assets/img/GenerierePOI.png';
import NahDranImage from '@/assets/img/NahDran.png';
import SpeicherIhnImage from '@/assets/img/SpeicherIhn.png';
import TeilenImage from '@/assets/img/Teilen.png';
import Entdecken from '@/assets/img/Entdecken.png';

</script>

<template>
  <v-container class="d-flex flex-column align-center justify-center" >
    <!-- Header Section -->
    <v-row class="text-center" justify="center" align="center" no-gutters>
      <v-col cols="12">
        <h1>Über uns</h1>
      </v-col>
    </v-row>

    <!-- Introduction Section -->
    <v-row class="text-center" justify="center" align="center" no-gutters>
      <v-col cols="12">
        <h2 class="mt-10 mb-5">Einführung</h2>
      </v-col>
    </v-row>
    <v-row class="text-center" justify="center" align="center" no-gutters>
      <v-col cols="12">
        <p>
          Walkiepedia führt dich zu nahegelegenen Sehenswürdigkeiten (POIs) durch zufällig ausgewählte Wikipedia-Artikel. Ziel ist es, spielerisch zu lernen, Zeit draußen zu verbringen, Orte neu zu entdecken und versteckte Schätze zu finden.
          Die zufällige Auswahl hält die Nutzung spannend, während soziale Funktionen wie das Speichern von besuchten Orten und das Hinterlassen eines virtuellen „Ich war hier“-Check-ins jeden Spaziergang zu einem kleinen Abenteuer machen.
        </p>
      </v-col>
    </v-row>

    <!-- How it works Section -->
    <v-row class="text-center" justify="center" align="center" no-gutters>
      <v-col cols="12">
        <h2 class="mt-10">Wie funktioniert's?</h2>
      </v-col>
    </v-row>

    <!-- Image Sequence (Stacking images vertically) -->
    <v-row class="text-center smallerScreens" justify="center" align="center" >
      <v-col cols="12" class="d-flex justify-center mb-5">
        <v-img :src="LosImage" alt="Los!" max-width="250px" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <v-img :src="PfeilImage" alt="Pfeil" max-width="250px" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <v-img :src="GenerierePOIImage" alt="Generiere POI" max-width="250px" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <v-img :src="PfeilImage" alt="Pfeil" max-width="250px" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <v-img :src="NahDranImage" alt="Nah Dran" max-width="250px" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <v-img :src="PfeilImage" alt="Pfeil" max-width="250px" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <v-img :src="SpeicherIhnImage" alt="Speicher Ihn" max-width="250px" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <v-img :src="PfeilImage" alt="Pfeil" max-width="250px" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <v-img :src="TeilenImage" alt="Teilen" max-width="250px" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <v-img :src="PfeilImage" alt="Pfeil" max-width="250px" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <v-img :src="Entdecken" alt="Teilen" max-width="250px" to="/" />
      </v-col>
      <v-btn @click="$router.push('/')" class="startseiteButton">
          Zur Startseite
      </v-btn>

    </v-row>
  </v-container>
</template>

<style scoped>

.startseiteButton{
    background-color: #ff9900;
}
.text-center {
  text-align: center;
}

v-img {
  margin-bottom: 15px;
}

.mb-5 {
  margin-bottom: 20px;
}

@media (max-width: 600px) {
  .smallerScreens {
      max-width: 200px;
  }

}

</style>
