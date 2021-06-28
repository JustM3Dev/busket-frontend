<template>
  <v-btn outlined color="red" @click="logout" @finished="reload();">Logout</v-btn>
</template>

<script lang="ts">
import feathersClient from '@/feathers-client';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Logout extends Vue {
  async logout (): Promise<void> {
    await feathersClient.authentication.logout();
    await this.$router.push({ name: 'home' });
    window.location.reload();
  }

  reload (): void {
    window.location.reload();
  }
}
</script>
