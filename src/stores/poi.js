import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import api from '@/services/api.js';



export const usePoiStore = defineStore('poi', {
    state: () => ({
        poi: {},
        drawer: false,
    }),
    actions: {
        loadPoi(lat, lon, radius = 200) {
            return api.get('/api/random', {
                params: {
                    lat: lat,
                    lon: lon,
                    radius: radius
                }
            })
                .then(result => {
                    this.poi = result.data;
                    console.log(this.poi)
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },

        emptyPoi() {
            this.poi = {};
        }
    }
})



/*
ALT:
fetch('/api/codersbay')
                .then(response => response.json())
                .then(result => {
                    this.poi = result
                })
                .catch(er => console.log(er))
                */




