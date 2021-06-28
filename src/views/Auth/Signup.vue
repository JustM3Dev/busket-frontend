<template>
  <div>
    <v-card class="mt-16 ma-auto" width="40%" outlined elevation="2">
      <v-card-title>Signup</v-card-title>
      <v-card-subtitle>Create a new Busket account. Already have one? Click
        <router-link to="/auth/login">here</router-link>
        .
      </v-card-subtitle>
      <v-card-text>
        <Signup></Signup>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Signup from '@/components/Auth/Signup.vue';

@Component({
  components: {
    Signup,
  },
})
export default class SignupPage extends Vue {}
</script>
