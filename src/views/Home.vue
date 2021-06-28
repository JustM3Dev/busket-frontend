<template>
  <div class="text-center">
    <h1 v-if="auth !== null">Welcome to Busket, {{ auth.user.username }}!</h1>
    <h1 v-else>Welcome to Busket!</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient from '@/feathers-client';

@Component
export default class Home extends Vue {
  private auth = feathersClient.authentication.app.get('auth');
}
</script>
