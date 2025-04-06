<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import {storeToRefs} from "pinia";

const store = useAuthStore();
const router = useRouter();
const drawer = ref(false);
const { isLoggedIn, token } = storeToRefs(store);


const logout = () => {
store.logout();
router.push("/");
};


</script>
<template>
  <v-app-bar elevation="1">
    <v-app-bar-title>
      <RouterLink to="/">
        <img id="logo" src="../assets/img/Walkiepedia-Logo-Klein.png" />
      </RouterLink>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  </v-app-bar>

  <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      class="custom-drawer"
  >
    <v-list class="menu-list">
      <v-list-item @click="router.push('/')">Home</v-list-item>
      <v-list-item @click="router.push('/login')">Login</v-list-item>
      <v-list-item @click="router.push('/register')">Registrierung</v-list-item>
      <v-list-item @click="router.push('/about')">Über uns</v-list-item>
      <v-list-item v-if="isLoggedIn" @click="router.push('/dashboard')">
        Dashboard
      </v-list-item>
      <v-list-item v-if="isLoggedIn" @click="logout">Logout</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<style scoped>
#logo {
  max-width: 60px;
  margin-top: 15px;
}

.custom-drawer {
  overflow: hidden;
}

</style>
