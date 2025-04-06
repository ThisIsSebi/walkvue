<template>
  <div>
    <!-- Button zum Öffnen des Dialogs -->
    <v-btn @click="openWikipedia" color="primary">Wikipedia öffnen</v-btn>

    <!-- Einbindung der WikipediaIframe-Komponente -->
    <WikipediaIframe
        v-if="isDialogOpen"
        :articleUrl="articleUrl"
        @close="isDialogOpen = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import WikipediaIframe from "./WikipediaIframe.vue";

const isDialogOpen = ref(false);
const articleUrl = ref("https://de.wikipedia.org/wiki/Wikipedia"); // Standard-Link

const openWikipedia = () => {
  articleUrl.value = articleUrl.value.includes("wikipedia.org")
      ? articleUrl.value.replace("wikipedia.org", "wikipedia.org") + "?useskin=minerva"
      : articleUrl.value;

  isDialogOpen.value = true;
};
</script>
