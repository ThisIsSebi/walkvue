<script setup>
import {ref, watch} from 'vue';
import {useAuthStore} from "@/stores/auth.js";
import router from "@/router/index.js";

  const store = useAuthStore();

  const visible = ref(false)

  const username = ref('')
  const password = ref('')

  function login() {
    store.login(username.value, password.value)
  }

  watch: {
    console.log("Ich war hier :)")
    if (true){
      setTimeout(() => {
        console.log("Ich war auch hier :)")
        store.errorMessage = ''
      }, 9000)
    }
}
</script>

<template>
    <v-main>
      <v-form @submit.prevent="login">
        <v-container class="containerLogin">
          <v-img
              class="mx-auto"
              width="300px"
              height="200px"
              src="./src/assets/img/Walkiepedia-Logo-Gross.png"
          ></v-img>
        </v-container>
        <v-card class="mx-auto" max-width="250" title="Login">
          <v-container>
            <v-text-field
                v-model="username"
                color="secondary"
                label="User-Name"
                variant="underlined"
            ></v-text-field>
            <v-text-field
                v-model="password"
                type="password"
                color="secondary"
                label="Passwort"
                placeholder="Bitte Passwort eingeben"
                variant="underlined"
            ></v-text-field>
            <p class="errorMessage">{{store.errorMessage}}</p>
          </v-container>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="secondary" type="submit">
              Login

              <v-icon icon="mdi-chevron-right" end></v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-main>
</template>

<style scoped>
.containerLogin {
  display: flex;
  justify-content: center; /* Centers horizontally */
  align-items: center; /* Centers vertically */
}

.errorMessage {
  color: red;
  text-align: center;
}

</style>