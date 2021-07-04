<template>
  <v-app-bar
    app
    color="primary"
    dark
  >
    <div class="d-flex align-center" @click="$router.push({ name: 'home' });">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"
      />

      <v-img
        alt="Vuetify Name"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        min-width="100"
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
        width="100"
      />
    </div>

    <v-spacer></v-spacer>
    <v-slide-y-transition>
      <v-btn color="accent" depressed v-if="auth === true && $route.name !== 'list overview'" @click="$router.push({ name: 'list overview' });">My lists</v-btn>
    </v-slide-y-transition>
    <v-spacer></v-spacer>

    <v-btn text outlined class="mr-3" @click="changeTheme()">
      <v-icon>{{ $vuetify.theme.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>
    <v-btn
      @click="fastAuthOpen = true"
      text
      outlined
    >
      <div class="mr-2">FastAuth</div>
      <v-icon>mdi-account-circle-outline</v-icon>
    </v-btn>

    <FastAuth :show="fastAuthOpen" @close="fastAuthOpen = false"></FastAuth>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FastAuth from '@/components/Auth/FastAuth.vue';
import feathersClient, { isLoggedIn } from '@/feathers-client';

@Component({
  components: { FastAuth },
})
export default class Navbar extends Vue {
  private fastAuthOpen = false;
  private auth = false;

  async mounted (): Promise<void> {
    this.auth = await isLoggedIn();

    const dark = window.localStorage.getItem('dark')?.includes('true');
    if (!dark) {
      window.localStorage.setItem('dark', 'false');
      return;
    }

    this.$vuetify.theme.dark = dark;
  }

  changeTheme (): void {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;

    window.localStorage.setItem('dark', this.$vuetify.theme.dark.toString());
  }
}
</script>
