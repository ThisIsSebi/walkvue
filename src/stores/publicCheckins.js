import { defineStore } from "pinia";
import axios from "axios";

export const usePublicCheckinsStore = defineStore("publicCheckins", {
    state: () => ({
        publicCheckins: []
    }),
    actions: {
       getPublicCheckinsAtPoi(poiId) {
           axios.get(`/api/checkin/poi/${poiId}`)
               .then((response) => {
                   this.publicCheckins = response.data;
                   console.log(this.publicCheckins);
               })
       }
    }
})