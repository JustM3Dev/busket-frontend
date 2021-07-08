<template>
  <div>
    <v-text-field
      label="Username"
      :rules="usernameRules"
      hide-details="auto"
      class="pb-3"
      type="text"
      v-model="username"
    ></v-text-field>
    <v-text-field
      label="Email"
      :rules="emailRules"
      hide-details="auto"
      class="pb-3"
      type="email"
      v-model="email"
    ></v-text-field>
    <v-text-field
      ref="passwordField"
      label="Password"
      hide-details="auto"
      :rules="passwordRules"
      :append-icon="!showPsw ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
      :type="showPsw ? 'text' : 'password'"
      @click:append="showPsw = !showPsw"
      v-model="password"
    ></v-text-field>
    <span ref="passwordHint" class="pt-1"></span>

    <v-btn color="primary" block outlined @click="submit" ref="loginBtn" :disabled="btnDisabled" :loading="btnLoading"
           class="mt-4">
      {{ $t('auth.Signup') }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import feathersClient from '@/feathers-client';
import EventBus from '@/eventbus';
import { v4 as uuidv4 } from 'uuid';

@Component
export default class Signup extends Vue {
  private usernameRules = [
    (value: string) => !!value || `${this.$t('auth.Required')}.`,
    (value: string) => (value && value.length >= 3) || this.$t('auth.Min x characters', { x: 3 }),
    (value: string) => /^[A-z 0-9.]+$/.exec(value) !== null || this.$t('auth.Only Characters from A-z, 0-9, spaces and dots are allowed'),
  ];
  private passwordRules = [
    (value: string) => !!value || `${this.$t('auth.Required')}.`,
    (value: string) => (value && value.length >= 8) || this.$t('auth.Min x characters', { x: 8 }),
  ];
  private emailRules = [
    (value: string) => !!value || `${this.$t('auth.Required')}.`,
    (value: string) => (value && value.length >= 3) || this.$t('auth.Min x characters', { x: 3 }),
    (value: string) => (value && value.includes('@') && value.includes('.')) || this.$t('auth.Must be an email'),
  ];
  private showPsw = false;
  private password = '';
  private email = '';
  private username = '';
  private btnDisabled = true;
  private btnLoading = false;

  mounted (): void {
    this.validateInfo();
  }

  @Watch('username')
  @Watch('email')
  @Watch('password')
  validateInfo (): void {
    this.usernameRules.some((r) => {
      const c = r(this.username) !== true;
      this.btnDisabled = c;
      return c;
    });

    this.passwordRules.some((r) => {
      const c = r(this.password) !== true;
      this.btnDisabled = c;
      return c;
    });

    this.emailRules.some((r) => {
      const c = r(this.email) !== true;
      this.btnDisabled = c;
      return c;
    });
  }

  async submit (): Promise<void> {
    this.btnLoading = true;

    await feathersClient.service('users').create({
      username: this.username,
      email: this.email,
      password: this.password,
      uuid: uuidv4(),
    }).then(async () => {
      EventBus.$emit('snackbar', { message: this.$t('Created account email successfully', { email: this.email }) });

      await feathersClient.authenticate({
        strategy: 'local',
        email: this.email,
        password: this.password,
      });
      this.email = '';
      this.password = '';
      window.location.reload();
      this.$emit('finished');
    }).catch((err: unknown) => {
      console.warn(err);
      EventBus.$emit('snackbar', { message: this.$t('An account with the email email already exists', { email: this.email }) });
    })
      .finally(() => {
        this.btnLoading = false;
      });
  }
}
</script>

<style scoped>

</style>
