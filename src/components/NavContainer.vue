<template>
  <div>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-app-bar-title>
        <v-btn @click="$route.name !== 'home' ? $router.push({ name: 'home' }) : ''" color="primary">
          <v-icon large>$vuetify.icons.logo</v-icon>
          Busket
        </v-btn>
      </v-app-bar-title>

      <v-spacer></v-spacer>
      <v-slide-y-transition>
        <v-btn color="accent" depressed v-if="auth === true && $route.name !== 'list overview'"
               @click="$router.push({ name: 'list overview' });">{{ $t('navbar.My lists') }}
        </v-btn>
      </v-slide-y-transition>
      <v-spacer v-if="!showIcons"></v-spacer>

      <v-fade-transition>
        <div v-show="!feathersClient.io.connected" class="mr-3">
          <div class="fake-btn">(Offline)</div>
        </div>
      </v-fade-transition>

      <v-fade-transition>
        <div v-show="isBeta" class="mr-3">
          <div class="fake-btn">(Beta)</div>
        </div>
      </v-fade-transition>

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
      >
        <v-list-item-group
          v-model="group"
          active-class="primary--text"
        >
          <v-list-item disabled dense>
            <v-list-item-icon>
              <v-icon>$vuetify.icons.logo</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Busket</v-list-item-title>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item @click="$route.name !== 'home' ? $router.push({ name: 'home' }) : ''">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t('navbar.Home') }}</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="auth === true && $route.name !== 'list overview'"
            @click="$router.push({ name: 'list overview' });">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t('navbar.My lists') }}</v-list-item-title>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item @click="fastAuthOpen = true;">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t('navbar.Account') }}</v-list-item-title>
          </v-list-item>

          <v-list-item @click="changeTheme">
            <v-list-item-icon>
              <v-icon>{{ $vuetify.theme.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t('navbar.Dark mode') }}</v-list-item-title>
          </v-list-item>

          <v-list-item target="_blank" href="https://github.com/JustM3Dev/busket-frontend/issues/new">
            <v-list-item-icon>
              <v-icon>mdi-bug</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t('navbar.Report a bug') }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <!--   PWA Promotion   -->
      <div v-show="pwaPromotion">
        <v-divider class="mb-2 mx-2"></v-divider>
        <div class="primary pa-3 white--text">
          <div class="mb-1">
            You also want to edit your shopping list even when you are offline?
          </div>
          <br>
          <v-btn rounded block outlined color="white" @click="installApp" v-if="!isFirefox">Install busket now</v-btn>
          <v-btn rounded block outlined color="white" @click="installGuide = true" v-else>Installation guide</v-btn>
        </div>
      </div>
    </v-navigation-drawer>

    <!--  Installation guide for FF  -->
    <v-dialog
      v-model="installGuide"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Firefox mobile installation guide
        </v-card-title>
        <v-card-text>
          <ol>
            <li>Click the three dots to your bottom right</li>
            <li>A context menu should open.</li>
            <li>Scroll down until you see 'Add to Home screen' and click it.</li>
            <li>A dialog is going to open: Click 'Add'</li>
            <li>Depending on your phone make, another dialog is going to appear: Click 'Add to Home screen'</li>
            <li>Now navigate to your Home screen. A new app called 'Busket' should be there.</li>
            <li>Your done! You can now open the app like any other!</li>
          </ol>
          <!--         -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary darken-1"
            text
            @click="installGuide = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <FastAuth :show="fastAuthOpen" @close="fastAuthOpen = false"></FastAuth>

    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FastAuth from '@/components/Auth/FastAuth.vue';
import feathersClient, { isLoggedIn } from '@/feathers-client';
import Responsive from '@/components/Responsive.vue';
import { isFirefox, isMobileOnly } from 'mobile-device-detect';
import config from '../../config';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;

  prompt (): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

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
  private feathersClient = feathersClient;
  private pwaPromotion = false;
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isFirefox = isFirefox;
  private installGuide = false;

  async mounted (): Promise<void> {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.pwaPromotion = true;
      console.log('\'beforeinstallprompt\' event was fired.');
    });

    window.addEventListener('resize', this.resizeEvent);
    this.resizeEvent();

    this.auth = await isLoggedIn();
  }

  async installApp (): Promise<void> {
    if (this.deferredPrompt === null) return;

    this.pwaPromotion = false;
    await this.deferredPrompt.prompt();

    const { outcome } = await this.deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    this.deferredPrompt = null;
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

<style scoped>
.fake-btn {
  font-weight: 500;
  letter-spacing: 0.0892857143em;
  text-indent: 0.0892857143em;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 45%;
  user-select: none;
}
</style>
