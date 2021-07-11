<template>
  <div class="text-center mt-2">
    <div v-if="auth !== null">
      <h1>{{ $t('Welcome to Busket, user!', {user: auth.user.username}) }}</h1>
      <div class="grey--text mb-4">{{ $t('What do you wanna do today?') }}</div>
      <v-sheet width="25rem" rounded="lg" outlined class="ma-auto pa-2">
        <v-btn color="primary" block text @click="$router.push({ name: 'list overview' })">{{
            $t('View my lists')
          }}
        </v-btn>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="green" block text v-on="on" v-bind="attrs">{{ $t('Switch language') }}</v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(lang, i) in langs"
              :key="i"
              ripple
            >
              <v-list-item-title @click="setLang(lang.short)">{{ lang.name }} ({{
                  lang.short
                }})
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn color="warning" block text href="https://github.com/JustM3Dev/busket-frontend/issues/new">
          {{ $t('Report a bug') }}
        </v-btn>
        <v-btn color="red" block text @click="logOut">{{ $t('Logout') }}</v-btn>
      </v-sheet>
    </div>
    <div v-else>
      <h1>{{ $t('Welcome to Busket') }}!</h1>
      <div class="grey--text">{{ $t('You are currently not signed in.') }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient from '@/feathers-client';

@Component
export default class Home extends Vue {
  private auth = feathersClient.authentication.app.get('auth');
  private langs: { short: string, name: string }[] = [{
    short: 'en',
    name: 'English',
  }, {
    short: 'de',
    name: 'Deutsch',
  }, {
    short: 'test',
    name: 'test',
  }];

  async logOut (): Promise<void> {
    await feathersClient.logout();
    window.location.reload();
  }

  setLang (short: string): void {
    this.$i18n.locale = short;
    window.localStorage.setItem('preferredLocale', short);
  }
}
</script>
