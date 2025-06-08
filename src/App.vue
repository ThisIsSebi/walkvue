<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from "@/components/NavBar.vue";
import {onMounted} from "vue";

</script>

<template>
   
  <v-app>
    <NavBar />
    <v-main>
      <RouterView/>
    </v-main>
    <v-container>
      <v-row justify="center">
        <v-footer color="#444" height="30px" app="app">©2025 Walkiepedia</v-footer>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>

</style>
