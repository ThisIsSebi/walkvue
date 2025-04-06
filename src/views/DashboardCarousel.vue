<script setup>
import {usePictureStore} from "@/stores/picture.js";
import {computed, onMounted, ref, watch} from "vue";

const pictureStore = usePictureStore()


const imageUrl = ref('');
const images = pictureStore.pictures
const allImages = ref([])

watch(() => pictureStore.pictures, (newVal) => {
  console.log("📷 Bilder aktualisiert:", newVal);
});

onMounted(async () => {
  console.log("🟡 Bilder werden geladen...");
  const result = await pictureStore.getAllImages();

  console.log("📡 API Response:", result);

  if (!result || !Array.isArray(result)) {
    console.error("❌ Fehler: API liefert keine Liste!", result);
    return;
  }

  allImages.value = result;
  console.log("✅ Gespeicherte Bilder (allImages):", allImages.value);

  setTimeout(() => {
    console.log("⏳ Nach 2 Sekunden: allImages =", allImages.value);
  }, 2000);
});


</script>

<template>
  <v-card elevation="1" class="v-col-12 v-col-md-6" rounded="lg">
    <h2>Gallerie</h2>

    <v-carousel v-if="allImages.length > 0">
      <v-carousel-item
          v-for="(image, index) in allImages"
          :key="index"
          :src="image"
          cover
      >
      </v-carousel-item>
    </v-carousel>

    <p v-else>Keine Bilder verfügbar</p>
  </v-card>
</template>

<style scoped>
@media (max-width: 600px) {
  v-carousel-item img{
    object-fit: contain;
    width: 100%;
    height: auto;
  }

}
</style>