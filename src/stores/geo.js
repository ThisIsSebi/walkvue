import {defineStore} from "pinia";

export const useGeoStore = defineStore('geo', {
    state: () => ({
        latitude: null,
        longitude: null,
        fallback: false,
        isNear: false,
    }),
    actions: {
        generateFallbackCoordinates() {
            if (this.fallback === false) {
                const minLat = 48.11;
                const maxLat = 48.32;
                const minLon = 16.17;
                const maxLon = 16.58;
                this.latitude = Number((Math.random() * (maxLat - minLat) + minLat).toFixed(6));
                this.longitude = Number((Math.random() * (maxLon - minLon) + minLon).toFixed(6));
                this.fallback = true;
            }
            return {latitude: this.latitude, longitude: this.longitude};
        },

        resetFallback() {
            this.fallback = false;
            this.latitude = null;
            this.longitude = null;
        },

        haversine(val) {
            return Math.pow(Math.sin(val / 2), 2);
        },

        toRadians(degrees) {
            return degrees * (Math.PI / 180);
        },

        calculateDistance(startLat, startLong, endLat, endLong) {
            const R = 6371; // Erdradius in km
            const dLat = this.toRadians(endLat - startLat);
            const dLong = this.toRadians(endLong - startLong);

            startLat = this.toRadians(startLat);
            endLat = this.toRadians(endLat);

            const a = this.haversine(dLat) + Math.cos(startLat) * Math.cos(endLat) * this.haversine(dLong);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c * 1000;
        }
    }
});