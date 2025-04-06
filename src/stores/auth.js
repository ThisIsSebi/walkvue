import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import router from "@/router/index.js";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: [],
        error: null,
        loading: false,
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
        updatedMessage: "",
        errorMessage:""
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
        isAdmin: (state) => state.role === 'ADMIN'
    },
    actions: {
        register(username, email, password) {
            this.loading = true;
            this.error = null;

            return axios.post("/api/auth/register", { username, email, password }) // Return the promise
                .then((response) => {
                    this.user = response.data;
                    console.log('Erfolgreich registriert:', this.user);

                    if (response.data.jwt && response.data.role) {
                        this.token = response.data.jwt;
                        this.role = response.data.role;
                        localStorage.setItem('token', this.token);
                        localStorage.setItem('role', this.role);
                        console.log("Token gespeichert:", localStorage.getItem('token'));
                        console.log("Rolle gespeichert:", localStorage.getItem('role'));
                    }
                })
                .catch((error) => {
                    this.error = error.response ? error.response.data : 'Es gab einen Fehler';
                    console.error('Fehler bei der Registrierung:', this.error);
                    throw error; // Ensure errors are propagated
                })
                .finally(() => {
                    this.loading = false;
                });
        }
        ,
        login(username, password) {
            axios.post("https://walkspring-cuh1.onrender.com:8080/api/auth/login", {
                username: username,
                password: password
            })
                .then(response => {
                    const data = response.data;
                    console.log("Empfangene Daten:", data); // Debugging

                    if (data.jwt && data.role) {
                        this.token = data.jwt;
                        this.role = data.role;
                        localStorage.setItem('token', this.token);
                        localStorage.setItem('role', this.role);
                        console.log("Token gespeichert:", localStorage.getItem('token'));
                        console.log("Rolle gespeichert:", localStorage.getItem('role'));

                        if (data.role === 'Administrator') {
                            console.log("Navigiere zu Admin...");
                            console.log("Das ist in meinem Store " + this.user);
                            router.push({ name: 'admin' });
                        } else {
                            console.log("Navigiere zu Dashboard...");
                            router.push({ name: 'dashboard' });
                        }
                    } else {
                        console.log("Fehler: JWT oder Rolle fehlt in der Antwort");
                    }
                })
                .catch(error => {
                    this.errorMessage = "Login fehlgeschlagen!";
                    console.error("Fehler beim Einloggen:", error);
                            });
        },
        logout() {
            this.token = null;
            this.role = null;
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        },
        getAllUsers() {
            axios.get("https://walkspring-cuh1.onrender.com:8080/api/auth/allUsers")
                .then(response => {
                    const data = response.data;
                    console.log("Empfangene Daten:", data); // Debugging

                    // Sicherstellen, dass `data` ein Array ist, bevor es in `this.user` gepusht wird
                    if (Array.isArray(data)) {
                        this.user.push(...data);
                    } else {
                        console.error("Fehler: Erwartetes Array, aber erhalten:", data);
                    }
                })
                .catch(error => {
                    console.error("Fehler beim Abrufen der Benutzer:", error);
                });
        },
        deleteUser(userId) {
            console.log(userId);

            axios.delete(`https://walkspring-cuh1.onrender.com:8080/api/auth/deleteUser/${userId}`)
                .then(response => {
                    console.log("Benutzer erfolgreich gelöscht:", response.data);

                    // Benutzer aus der Liste entfernen
                    const deletedUserIndex = this.user.findIndex(user => user.userId === userId);
                    if (deletedUserIndex !== -1) {
                        this.user.splice(deletedUserIndex, 1);
                    }
                })
                .catch(error => {
                    console.error("Fehler beim Löschen des Benutzers:", error);
                });
        },
        editUser(id, updatedUser) {
            console.log(updatedUser);

            axios.put(`https://walkspring-cuh1.onrender.com:8080/api/auth/editUser/${id}`, updatedUser, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    this.updatedMessage = "User is edited!";
                    console.log("Empfangene Daten:", response.data); // Debugging
                })
                .catch(error => {
                    console.error("Fehler beim Bearbeiten des Benutzers:", error);
                });
        }
    }
})
