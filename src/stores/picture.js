import {defineStore} from "pinia";
import axios from "axios";
import api from '@/services/api.js';

export const usePictureStore = defineStore('picture', {
    state: () => ({
        pictures: [],
    }),
    actions: {
        uploadPicture(formdata, poiId) {
            console.log("Upload Picture: " + formdata)
            api.post("/api/images/checkin/" + poiId, formdata, {
                headers: {"Content-Type": "multipart/form-data"},
            })
                .then((response) => {
                    console.log("Upload erfolgreich:", response.data);
                    console.log("Picturestore: " + this.pictures)
                    window.location.reload();
                    return response.data;
                })
                .catch((error) => {
                    console.error("Upload fehlgeschlagen:", error);
                });
        },
        getImage(imageId) {
            api.get("/api/images/" + imageId, {responseType: 'blob'})
                .then(response => {
                    const str = URL.createObjectURL(response.data)
                    this.pictures.push(str)
                    //console.log(this.pictures)
                })
                .catch((error) => {
                    console.error("Dingsbums:", error);
                });
        },

        getThumbnail(userId) {
            api.get("/api/images/thumbnails" + userId, {responseType: 'blob'})
                .then(response => {
                    const str = URL.createObjectURL(response.data)
                })
                .catch((error) => {
                    console.error("Fehler beim Thumbnail:", error);
                });
        },

        async getAllImages() {
            console.log("📡 API Request gestartet...");
            try {
                const response = await api.get("api/images/user");
                if (Array.isArray(response.data)) {
                    this.pictures = response.data;
                    return response.data;
                } else {
                    return [];
                }
            } catch (error) {
                return [];
            }
        },

        async getCheckinImage(poiId) {
            try {
                const response = await api.get("/api/images/checkin/" + poiId, { responseType: 'blob' });
                return URL.createObjectURL(response.data);
            } catch (error) {
                console.error("Dingsbums:", error);
                return null;
            }
        }
    }
})