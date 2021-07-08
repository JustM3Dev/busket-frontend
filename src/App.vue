<template>
  <v-app>
    <Navbar></Navbar>
    <v-main>
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="2"
        >
        </v-col>
        <v-col
          cols="12"
          sm="8"
        >
          <v-slide-x-transition>
            <router-view/>
          </v-slide-x-transition>
        </v-col>
        <v-col
          cols="12"
          sm="2"
        ></v-col>
      </v-row>
    </v-main>

    <v-snackbar
      ref="snack"
      v-model="snack.show"
      :timeout="snack.duration || 2500"
      transition="slide-y-reverse-transition"
    >
      {{ snack.message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snack.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/Navbar.vue';
import EventBus from '@/eventbus';
import feathersClient from '@/feathers-client';
import config from '../config';

interface Snack {
  message: string,
  duration?: number,
  show?: boolean
}

@Component({
  components: {
    Navbar,
  },
})
export default class App extends Vue {
  // noinspection JSUnusedGlobalSymbols
  feathersClient = feathersClient;
  private snack: Snack = { message: '' };

  mounted (): void {
    EventBus.$on('snackbar', this.showSnack);

    // Beta only
    if (config.isBeta) {
      this.showSnack({ message: 'You are currently testing a beta version of Busket', duration: 1200 });
    }
  }

  showSnack (snack: Snack): void {
    const out = snack;
    if (!snack.show) out.show = true;
    this.snack = out;
  }
}
</script>
