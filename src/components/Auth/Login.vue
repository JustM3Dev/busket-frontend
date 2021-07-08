<template>
  <div>
    <v-text-field
      :label="$t('auth.Email')"
      :rules="emailRules"
      hide-details="auto"
      class="pb-3"
      type="email"
      v-model="email"
    ></v-text-field>
    <v-text-field
      ref="passwordField"
      :label="$t('auth.Password')"
      hide-details="auto"
      :rules="passwordRules"
      :append-icon="showPsw ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
      :type="showPsw ? 'text' : 'password'"
      @click:append="showPsw = !showPsw"
      @blur="passwordBlur"
      v-model="password"
    ></v-text-field>
    <span class="pt-1" v-show="forgetHint">
      {{ $t('auth.Forgot your password? Contact me at') }} <a href="mailto:busket@bux.at">busket@bux.at</a>!
    </span>

    <v-btn color="primary" block outlined @click="submit" ref="loginBtn" :disabled="btnDisabled"
           :loading="btnLoading" class="mt-6">{{ $t('auth.Login') }}
    </v-btn>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import feathersClient from '@/feathers-client';
import EventBus from '@/eventbus';

@Component
export default class Login extends Vue {
  private passwordRules = [
    (value: string) => !!value || `${this.$t('auth.Required')}.`,
    (value: string) => (value && value.length >= 3) || this.$t('auth.Min x characters', { x: 3 }),
  ];
  private emailRules = [
    (value: string) => !!value || `${this.$t('auth.Required')}.`,
    (value: string) => (value && value.length >= 3) || this.$t('auth.Min x characters', { x: 3 }),
    (value: string) => (value && value.includes('@') && value.includes('.')) || this.$t('auth.Must be an email'),
  ];
  private tries = 0;
  private showPsw = false;
  private password = '';
  private email = '';
  private forgetHint = false;
  private btnDisabled = true;
  private btnLoading = false;

  mounted (): void {
    this.validateInfo();
  }

  @Watch('email')
  @Watch('password')
  validateInfo (): void {
    this.emailRules.some((r) => {
      const c = r(this.email) !== true;
      this.btnDisabled = c;
      return c;
    });

    this.passwordRules.some((r) => {
      const c = r(this.password) !== true;
      this.btnDisabled = c;
      return c;
    });
  }

  passwordBlur (): void {
    this.tries++;
    if (this.tries >= 3) this.forgetHint = true;
  }

  async submit (): Promise<void> {
    this.btnLoading = true;

    feathersClient.authentication.authenticate({
      strategy: 'local',
      email: this.email,
      password: this.password,
    }).then(() => {
      this.btnLoading = false;
      this.$emit('finished');
    }).catch((err) => {
      console.warn('[ERROR] Error while trying to authenticate/login:', err);
      if (err.code === 401) {
        EventBus.$emit('snackbar', { message: this.$t('auth.Wrong email or password!') });
        this.password = '';
        return;
      }
      EventBus.$emit('snackbar', { message: this.$t('auth.Something went wrong Please try again later') });
    }).finally(() => {
      // this.email = '';
      // this.password = '';
      this.tries++;
      this.btnLoading = false;
    });
  }
}
</script>
