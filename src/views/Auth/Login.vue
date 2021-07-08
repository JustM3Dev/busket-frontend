<template>
  <div>
    <v-card class="mt-16 ma-auto" :width="width" outlined elevation="2">
      <v-card-title>{{ $t('auth.Login') }}</v-card-title>
      <v-card-subtitle>{{ $t('auth.Login using your Busket account You can create one') }}
        <router-link to="/auth/signup">{{ $t('auth.here') }}</router-link>
        .
      </v-card-subtitle>
      <v-card-text>
        <Login @finished="finished();"></Login>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Login from '@/components/Auth/Login.vue';
import { isMobileOnly } from 'mobile-device-detect';

@Component({
  components: {
    Login,
  },
})
export default class LoginPage extends Vue {
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

  finished (): void {
    if (!this.$route.query.redirect) {
      this.$router.push({ name: 'home' });
      window.location.reload();
      return;
    }
    this.$router.push(decodeURI(this.$route.query.redirect[0] || ''));
    window.location.reload();
  }
}
</script>
