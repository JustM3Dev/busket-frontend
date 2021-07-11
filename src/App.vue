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
    </NavContainer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavContainer from '@/components/NavContainer.vue';
import EventBus from '@/eventbus';
import { isIE } from 'mobile-device-detect';
import feathersClient from '@/feathers-client';
import config from '../config';

interface Snack {
  message: string,
  duration?: number,
  show?: boolean
}

@Component({
  components: {
    NavContainer,
  },
})
export default class App extends Vue {
  // noinspection JSUnusedGlobalSymbols
  feathersClient = feathersClient;
  private snack: Snack = { message: '' };

  mounted (): void {
    EventBus.$on('snackbar', this.showSnack);

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
        message: 'This browser is not supported nor recommended!',
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
