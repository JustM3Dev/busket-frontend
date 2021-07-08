<template>
  <div>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-app-bar-title>
        <v-btn @click="$route.name !== 'home' ? $router.push({ name: 'home' }) : ''" color="primary">Busket</v-btn>
      </v-app-bar-title>

      <v-spacer></v-spacer>
      <v-slide-y-transition>
        <v-btn color="accent" depressed v-if="auth === true && $route.name !== 'list overview'"
               @click="$router.push({ name: 'list overview' });">My lists
        </v-btn>
      </v-slide-y-transition>
      <v-spacer v-if="!showIcons"></v-spacer>

      <div v-if="!showIcons">
        <v-btn text outlined class="mr-3" target="_blank" href="https://github.com/JustM3Dev/busket-frontend/issues/new"
               v-if="isBeta">
          <v-icon>mdi-bug</v-icon>
        </v-btn>

        <v-btn text outlined class="mr-3" @click="changeTheme()">
          <v-icon>{{ $vuetify.theme.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
        <v-btn
          @click="fastAuthOpen = true"
          text
          outlined
        >
          <Responsive :screen="['tablet', 'desktop']">
            <div class="mr-2">FastAuth</div>
          </Responsive>
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-btn>

      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="text--primary"
        >
          <v-list-item @click="$route.name !== 'home' ? $router.push({ name: 'home' }) : ''" color="primary">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item color="primary"
                       v-if="auth === true && $route.name !== 'list overview'"
                       @click="$router.push({ name: 'list overview' });">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>My Lists</v-list-item-title>
          </v-list-item>

          <v-list-item @click="fastAuthOpen = true;">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>

          <v-list-item target="_blank" href="https://github.com/JustM3Dev/busket-frontend/issues/new">
            <v-list-item-icon>
              <v-icon>mdi-bug</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Report a bug</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <FastAuth :show="fastAuthOpen" @close="fastAuthOpen = false"></FastAuth>

    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FastAuth from '@/components/Auth/FastAuth.vue';
import { isLoggedIn } from '@/feathers-client';
import Responsive from '@/components/Responsive.vue';
import { isMobileOnly } from 'mobile-device-detect';
import config from '../../config';

@Component({
  components: { Responsive, FastAuth },
})
export default class Navbar extends Vue {
  private fastAuthOpen = false;
  private auth = false;
  private isBeta = config.isBeta;
  private drawer = false;
  private group = null;
  private showIcons = false;

  async mounted (): Promise<void> {
    window.addEventListener('resize', this.resizeEvent);
    this.resizeEvent();

    this.auth = await isLoggedIn();

    const dark = window.localStorage.getItem('dark')?.includes('true');
    if (!dark) {
      window.localStorage.setItem('dark', 'false');
      return;
    }

    this.$vuetify.theme.dark = dark;
  }

  resizeEvent (): void {
    if (window.innerWidth > 1024) {
      this.showIcons = isMobileOnly;
      return;
    }
    this.showIcons = true;
  }

  changeTheme (): void {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;

    window.localStorage.setItem('dark', this.$vuetify.theme.dark.toString());
  }
}
</script>
