<script setup>
import { computed } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {useAuthStore} from "@/stores/auth.js";
import { RouterLink } from 'vue-router';
import {watch} from "vue";

const store = useAuthStore();
const route = useRoute();

const userId = Number(route.params.userId);

const user = computed(() => store.user.find((u) => u.userId === userId));

const username = ref('');
const email = ref('');

watch(user, (newUser) => {
  if (newUser) {
    username.value = newUser.username;
    email.value = newUser.email;
  }
}, { immediate: true });

const editUser = () => {
  const updatedUser = {
    username: username.value,
    email: email.value,
  };
  store.editUser(userId, updatedUser);
};
</script>

 <template>
    <v-container>
      <v-form ref="form" @submit.prevent="editUser">
      <v-row justify="center">
            <v-card elevation="1">
                <v-card-title>Edit User ID {{ userId }} </v-card-title>
                <v-card-text>
                        <v-text-field hint="Name" v-model="username" /><br>
                        <v-text-field hint="E-Mail-Addresse" v-model="email"/>
                        <v-btn type="submit" color="blue-lighten-2">Save</v-btn>
                  <p>{{store.updatedMessage}}</p>
                </v-card-text>
            </v-card>
        </v-row>
      </v-form>
    </v-container>
 </template>

 <style scoped>

 </style>