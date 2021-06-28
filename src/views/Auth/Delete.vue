<template>
  <div>
    <v-card>
      <v-card-title>Delete account</v-card-title>
      <v-card-subtitle>Delete your Busket account</v-card-subtitle>
      <v-card-text>
        Do you really want to delete your Busket account? Currently signed in as:
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient from '../../feathers-client';

@Component
export default class Delete extends Vue {
  submit (): void {
    feathersClient.service('users').delete();
  }
}
</script>

<style scoped>

</style>
