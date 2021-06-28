<template>
  <v-app-bar
    app
    color="primary"
    dark
  >
    <div class="d-flex align-center">
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
import FastAuth from '@/components/FastAuth.vue';

@Component({
  components: { FastAuth },
})
export default class Navbar extends Vue {
  private fastAuthOpen = false;
}
</script>
