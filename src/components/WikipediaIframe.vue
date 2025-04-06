<template>
  <v-dialog v-model="isOpen" width="80vw" height="100vh">
    <v-card>
      <v-card-title class="d-flex justify-end">
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 100vh; padding: 0; overflow: hidden;">
        <iframe
            :src="articleUrl"
            width="100%"
            height="100%"
            sandbox="allow-scripts allow-same-origin"
            frameborder="0"
            style="border: none;"
        ></iframe>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  articleUrl: String
});

const emit = defineEmits(["close"]);
const isOpen = ref(true);

const closeDialog = () => {
  isOpen.value = false;
  emit("close");
};
</script>
