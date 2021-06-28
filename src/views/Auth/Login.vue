<template>
  <div>
    <v-card class="mt-16 ma-auto" width="40%" outlined elevation="2">
      <v-card-title>Login</v-card-title>
      <v-card-subtitle>Login using your Busket account. You can create one
        <router-link to="/auth/signup">here</router-link>
        .
      </v-card-subtitle>
      <v-card-text>
        <Login @finished="reload();"></Login>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Login from '@/components/Auth/Login.vue';

@Component({
  components: {
    Login,
  },
})
export default class LoginPage extends Vue {
  reload (): void {
    window.location.reload();
  }
}
</script>
