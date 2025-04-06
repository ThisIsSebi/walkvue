<script setup>
import {computed, watch} from "vue";
import {useCheckInStore} from "@/stores/checkIn.js";

/*
const props = defineProps({
  poiId: {
    type: Number
  }
})

const checkinStore = useCheckInStore();

watch(
    () => props.poiId,
    async (id) => {
      if (id) {
        await checkinStore.getCheckinByPoiId(id)
      }
    }
    // , {immediate: true} // nur falls Parent sofort die ID hat
);

const usernames = computed(() => checkinStore.checkins?.map(item => item.username) || [])

*/

</script>

<template>
  <!-- ALT:
  <v-container>
    <v-row>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title class="v-col-12">
          <h4>Hier waren vor dir:</h4>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col v-for="name in usernames" :key="name" class="v-col-4 text-center">
              {{ name }}
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
  </v-container>
  -->
</template>

<style scoped>

</style>