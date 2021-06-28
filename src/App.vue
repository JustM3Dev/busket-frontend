<template>
  <v-app>
    <Navbar></Navbar>
    <v-main>
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="2"
        >
          <v-card
            class="pa-2"
            outlined
            tile
          >
            One of three columns
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="8"
        >
          <router-view />
        </v-col>
        <v-col
          cols="12"
          sm="2"
        >
          <v-card
            class="pa-2"
            outlined
            tile
          >
            One of three columns
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/Navbar.vue';

@Component({
  components: {
    Navbar,
  },
})
export default class App extends Vue {}
</script>
