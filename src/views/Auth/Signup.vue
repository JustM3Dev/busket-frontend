<template>
  <div>
    <v-card class="mt-16 ma-auto" :width="width" outlined elevation="2">
      <v-card-title>{{ $t('auth.Signup') }}</v-card-title>
      <v-card-subtitle>
        {{ $t('auth.Create a new Busket account Already have one? Click') }}
        <router-link to="/auth/login">{{ $t('auth.here') }}</router-link>
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
import { isMobileOnly } from 'mobile-device-detect';
import Signup from '@/components/Auth/Signup.vue';

@Component({
  components: {
    Signup,
  },
})
export default class SignupPage extends Vue {
  private width = '40%';

  mounted (): void {
    window.addEventListener('resize', this.resizeEvent);
    this.resizeEvent();
  }

  resizeEvent (): void {
    if (window.innerWidth > 1024) {
      this.width = isMobileOnly ? '90%' : '40%';
      return;
    }
    this.width = '90%';
  }
}
</script>
