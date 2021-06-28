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
      :append-icon="showPsw ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
      :type="showPsw ? 'text' : 'password'"
      @click:append="showPsw = !showPsw"
      v-model="password"
    ></v-text-field>
    <span ref="passwordHint" class="pt-1"></span>

    <v-btn color="primary" block outlined @click="submit" ref="loginBtn" :disabled="btnDisabled"
           :loading="btnLoading" class="mt-4">Login
    </v-btn>

    <v-snackbar
      v-model="snackbar"
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import feathersClient from '@/feathers-client';

@Component
export default class Signup extends Vue {
  private usernameRules = [
    (value: string) => !!value || 'Required.',
    (value: string) => (value && value.length >= 3) || 'Min 3 characters',
    (value: string) => /[A-z 0-9.]+$/.exec(value) !== null || 'Only Characters from A-z, 0-9, spaces and dots are allowed',
  ];
  private passwordRules = [
    (value: string) => !!value || 'Required.',
    (value: string) => (value && value.length >= 3) || 'Min 3 characters',
  ];
  private emailRules = [
    (value: string) => !!value || 'Required.',
    (value: string) => (value && value.length >= 3) || 'Min 3 characters',
    (value: string) => (value && value.includes('@') && value.includes('.')) || 'Must be an email! (eg. example@example.com)',
  ];
  private showPsw = false;
  private password = '';
  private email = '';
  private username = '';
  private btnDisabled = true;
  private btnLoading = false;
  private snackbar = false;
  private snackbarText = '';

  @Watch('email')
  @Watch('password')
  validateInfo (): void {
    if (this.password.length >= 3 && this.email.includes('@') && this.email.includes('.')) {
      this.btnDisabled = false;
      return;
    }
    this.btnDisabled = true;
  }

  async submit (): Promise<void> {
    this.btnLoading = true;

    await feathersClient.service('users').create({
      username: this.username,
      email: this.email,
      password: this.password,
    }).then(() => {
      this.snackbarText = `Created account ${this.email} successfully.`;
      this.snackbar = true;
      this.$emit('finished');
    }).catch(() => {
      this.snackbarText = `An account with the email '${this.email}' already exists.`;
      this.snackbar = true;
    });
  }
}
</script>

<style scoped>

</style>
