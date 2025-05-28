<script setup>
import { ref } from "vue";
import {useAuthStore} from "@/stores/auth.js";
import {useRouter} from "vue-router";

const router = useRouter();
const store = useAuthStore();

const username = ref("");
const email = ref("");
const password = ref("");

function register() {
  form.value.validate().then(result => {
    if (!result.valid) {
      alert("Please enter valid inputs.");
      return;
    }

    store.register(username.value, email.value, password.value)
  .then(() => {
    if (store.token) {
      router.push("/dashboard");

      setTimeout(() => {
        username.value = "";
        email.value = "";
        password.value = "";
      }, 3000);
    }
    })
        .catch(error => {
          console.error("Registration error:", error);
          alert("Registration failed. Please try again.");
        });
  });
}

const form = ref(null)

const usernameRules = [
    v => !!v || "Field is required"
]

const emailRules = [
    v => !!v || "Field is required",
  v => /.+@.+\..+/.test(v) || "E-mail must be valid"
]

const passwordRules = [
    v => !!v || "Field is required",
  v => v.length >= 6 || "Password must be at least 6 characters"
]
</script>
<template>
    <v-main class="container">
      <v-container class="d-flex flex-column align-center">
        <v-form ref="form" @submit.prevent="register">
        <img
            src="../assets/img/Walkiepedia-Logo-Gross.png"
            lazy-src="https://example.com/placeholder.jpg"
            width="300px"
            height="200px"
            class="rounded-lg"
        ></img>
          <v-card class="mx-auto mt-4" max-width="450" title="Registrierung">
            <v-container>
              <v-text-field
                  v-model="username"
                  color="secondary"
                  label="User-Name"
                  variant="underlined"
                  :rules="usernameRules">
              </v-text-field>

              <v-text-field
                  v-model="email"
                  color="secondary"
                  label="E-Mail"
                  variant="underlined"
                  :rules="emailRules"
              ></v-text-field>

              <v-text-field
                  v-model="password"
                  type="password"
                  color="secondary"
                  label="Passwort"
                  placeholder="Bitte Passwort eingeben"
                  variant="underlined"
                  :rules="passwordRules"
              ></v-text-field>
            </v-container>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="#64B5F6" type="submit">
                Absenden
                <v-icon icon="mdi-chevron-right" end></v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-container>
    </v-main>
</template>
<style>
.container {
  display: flex;
  justify-content: center;

}
</style>
