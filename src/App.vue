<template>
  <v-app>
    <NavContainer>
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
            <router-view/>
          </v-col>
          <v-col
            cols="12"
            sm="2"
          ></v-col>
        </v-row>
      </v-main>

      <v-dialog
        v-model="disconnectDialog"
        width="350"
      >
        <v-card>
          <v-card-title class="text-h5">
            {{ $t('special.Connection issues') }}
          </v-card-title>

          <v-card-text>
            {{ $t('special.Connection notice') }} <a href="mailto:busket@bux.at">busket@bux.at</a>.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="disconnectDialog = false"
            >
              {{ $t('Close') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
            {{ $t('Close') }}
          </v-btn>
        </template>
      </v-snackbar>

      <!--   Update notice   -->
      <v-dialog
        v-model="showUpdateNotice"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >
            <v-btn
              icon
              @click="showUpdateNotice = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ $t('update.Title') }}</v-toolbar-title>
          </v-toolbar>
          <Changelog></Changelog>
        </v-card>
      </v-dialog>
    </NavContainer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavContainer from '@/components/NavContainer.vue';
import EventBus from '@/eventbus';
import { isIE } from 'mobile-device-detect';
import feathersClient from '@/feathers-client';
import Changelog from '@/components/Changelog.vue';
import config from '../config';

interface Snack {
  message: string,
  duration?: number,
  show?: boolean
}

@Component({
  components: {
    NavContainer,
    Changelog,
  },
})
export default class App extends Vue {
  // noinspection JSUnusedGlobalSymbols
  feathersClient = feathersClient;
  private snack: Snack = { message: '' };
  private disconnectDialog = false;
  private showUpdateNotice = false;

  async mounted (): Promise<void> {
    EventBus.$on('snackbar', this.showSnack);

    // Update notice
    const v = window.localStorage.getItem('version') || '';
    if (v !== config.version) {
      // window.localStorage.setItem('version', config.version);
      this.showUpdateNotice = true;
    }

    // Dark mode
    let dark = window.localStorage.getItem('dark')?.includes('true');
    if (!dark) {
      window.localStorage.setItem('dark', 'false');
      dark = false;
    }

    this.$vuetify.theme.dark = dark;

    // PWA promotion
    window.addEventListener('appinstalled', () => {
      this.showSnack({ message: 'Thanks for installing Busket!' });
    });

    // Register disconnect and connect
    let conCount = 0;
    feathersClient.io.on('connect', () => {
      if (conCount === 0) return;
      console.log('Connection established!');
      this.showSnack({ message: this.$t('special.Connected').toString(), duration: 800 });
      conCount++;
    });

    // Handle disconnects
    let disCount = 0;
    feathersClient.io.on('disconnect', () => {
      if (disCount >= 3) this.disconnectDialog = true;
      this.showSnack({ message: this.$t('special.Disconnected from server').toString(), duration: 900 });
      disCount++;
    });

    // Set language
    const locale = window.localStorage.getItem('preferredLocale');
    if (locale) {
      this.$i18n.locale = locale;
    } else {
      window.localStorage.setItem('preferredLocale', this.$i18n.locale);
    }

    // Beta only
    if (config.isBeta) {
      this.showSnack({
        message: this.$t('special.Beta Notice').toString(),
        duration: 1200,
      });
    }

    // IE only
    if (isIE) {
      this.showSnack({
        message: this.$t('special.This browser is not supported nor recommended').toString(),
        duration: 1200,
      });
    }
  }

  showSnack (snack: Snack): void {
    const out = snack;
    if (!snack.show) out.show = true;
    this.snack = out;
  }
}
</script>
