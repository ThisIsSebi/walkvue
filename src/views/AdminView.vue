<script setup>
  import {useAuthStore} from "@/stores/auth.js";
  import { useRouter } from "vue-router";
  import router from "@/router/index.js";

  const authStore = useAuthStore();

    authStore.user = [];
    authStore.getAllUsers();

    function deleteUser(userId) {
      authStore.deleteUser(userId);
    }

    function editUser(userId) {
      router.push(`/users/${userId}`);
    }

</script>

<template>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
        <v-card elevation="0">
          <h1>Administration</h1>
          <v-responsive>
          <v-table class="custom-table">
            <thead>
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>E-Mail</td>
              <td></td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in authStore.user">
                <td> {{ user.userId }}</td>
                <td> {{ user.username }}</td>
              <td> {{ user.email }}</td>
              <td class="button-container">
                <v-btn color="blue-lighten-2" :to="'/users/' + user.id" @click="editUser(user.userId)" class="button-spacing" ><v-icon>mdi-pencil</v-icon></v-btn>
                <v-btn color="orange-darken-3" @click="deleteUser(user.userId)"><v-icon>mdi-delete</v-icon></v-btn>
              </td>
            </tr>
            </tbody>
          </v-table>
          </v-responsive>
        </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<style scoped>
.custom-table td{
  padding: 1px 1px !important;
}

.button-spacing{
  margin-right: 10px;
}

.button-container{
  display: flex;
  justify-content: flex-end;
}
</style>