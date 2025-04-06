import api from "@/services/api.js";
import { defineStore } from 'pinia';
import {usePoiStore} from "@/stores/poi.js";
import axios from "axios";



export const useCheckInStore = defineStore('checkIn', {
  state:() =>({
    checkins: [],
      personsPubliclyCheckedInAtPoi: [],
    updatedMessageCheckIn: "",
    successMessage: false
  }),
    actions:{
        checkinAtPoi(publicCheckin) {
            const poiStore = usePoiStore(); // Move it here
            console.log('Saving:', poiStore.poi);
            api.post('/api/checkin', {
                    latitude: poiStore.poi.latitude,
                    longitude: poiStore.poi.longitude,
                    note: "Checked in at " + poiStore.poi.title,
                    visible: publicCheckin,
                },
            )
                .then(result => {
                    console.log('Saved:', result.data);
                    result.data = this.checkIns;
                    this.updatedMessageCheckIn = "Saved!";
                })
                .catch(error => {
                    console.error('Error saving data:', error);
                });
        },
        saveNote(poiId, note) {
            api.patch(`/api/checkin/${poiId}`, {
                checkinNote : note
            })
                .then(result => {
                    console.log(result)
                    this.successMessage = true;
                })
                .catch(error => console.log(error))
            },
            getCheckinsByUser(){
            api.get('/api/checkin/user')
                .then(result => {
                    this.checkins = result.data;
                    console.log(this.checkins)
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
        getCheckinByPoiId(poiId){
            console.log(this.checkins)
            return this.checkins.find(checkin => checkin.checkinPoi.poiId === poiId);
        },
        deleteCheckin(poiId) {
            api.delete(`/api/checkin/${poiId}`)
                .then(result => {
                    this.checkins = this.checkins.filter(item => item.checkinPoi.poiId !== poiId);
                    window.location.reload()
                })
                .catch(error => {
                    console.error('Error deleting checkin:', error);
                })
        }
        /*
        ,
        getPersonsPubliclyCheckedInAtPoi(poiId) {
            axios.get(`/api/checkin/poi/${poiId}`)
                .then(result => {
                    console.log(result)
                    for (let item of result.data) {
                        this.personsPubliclyCheckedInAtPOI.push(item.username);
                    }
                })

        }

         */

    }
})


/*
loadPoi(lat, lon, radius = 200) {
            axios.get('/api/random', {
                params: {
                    lat: lat,
                    lon: lon,
                    radius: radius
                }
            })
                .then(result => {
                    this.poi = result.data;
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
 */
