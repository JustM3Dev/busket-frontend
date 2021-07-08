<template>
  <div>
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="show"
      persistent
    >
      <v-card :loading="loading">
        <v-card-title>
          <v-btn text small icon color="primary"
                 @click="currentScreen = screenHistory[screenHistory.length === 0 || currentScreen === 'pick' ? $emit('close') : screenHistory.length - 2]">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          FastAuth | {{ currentScreen !== 'pick' ? $t(`auth.${currentScreen[0].toUpperCase() + currentScreen.slice(1)}`) : 'Home' }}
        </v-card-title>
        <v-card-subtitle>{{ $t('auth.The fastest way to auth on Busket') }}.</v-card-subtitle>
        <v-card-text>
          <div v-if="currentScreen === 'pick'">
            <div class="mb-2" v-if="auth !== null">{{ $t('auth.Signed in as') }} {{ auth.user.username }}.
            </div>
            <v-btn outlined block color="primary" class="mb-2" @click="logOut" v-if="loggedIn">{{ $t('auth.Logout') }}</v-btn>
            <v-btn outlined block color="primary" class="mb-2" @click="currentScreen = 'login'" v-else>{{ $t('auth.Login') }}</v-btn>
            <v-btn outlined block color="blue" class="mb-2" @click="currentScreen = 'signup'">{{ $t('auth.Signup') }}</v-btn>
            <v-btn outlined block color="red" class="mb-4" v-show="loggedIn">{{ $t('auth.Delete') }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn text block color="primary" @click="$emit('close')">{{ $t('Close') }}</v-btn>
          </div>
          <div v-else-if="currentScreen === 'login'">
            <Login @finished="reload();"></Login>
          </div>
          <div v-else-if="currentScreen === 'signup'">
            <Signup @finished="currentScreen = 'pick'"></Signup>
          </div>
          <div v-else>{{ $t('Something went wrong') }}...</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import feathersClient, { isLoggedIn } from '@/feathers-client';
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import Login from '@/components/Auth/Login.vue';
import Signup from '@/components/Auth/Signup.vue';

@Component({
  components: {
    Login,
    Signup,
  },
})
export default class FastAuth extends Vue {
  @Prop({ required: true }) private show: boolean | undefined;
  @Prop({ required: false, default: 'pick' }) private start: string | undefined;
  protected screenHistory: string[] = [];
  private currentScreen = 'pick';
  private loading = false;
  private loggedIn = false;
  private auth = feathersClient.authentication.app.get('auth');

  async mounted (): Promise<void> {
    this.loggedIn = await isLoggedIn();
    this.currentScreen = this.start || 'pick';
  }

  @Watch('show')
  watchShow (): void {
    this.currentScreen = this.start || 'pick';
    this.screenHistory = [];
    this.screenHistory.push(this.currentScreen);
  }

  @Watch('currentScreen')
  watchCurrentScreen (): void {
    this.screenHistory.push(this.currentScreen);
  }

  async logOut (): Promise<void> {
    this.loading = true;
    feathersClient.authentication.logout().then(() => {
      this.loading = false;
      window.location.reload();
    });
  }

  reload (): void {
    window.location.reload();
  }
}
</script>

<style scoped>

</style>
