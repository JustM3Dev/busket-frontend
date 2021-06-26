<template>
  <div>
    <v-card class="mt-16 ma-auto" width="40%" outlined elevation="2">
      <v-card-title>Login</v-card-title>
      <v-card-subtitle>Login using your Busket account. Only available for members!</v-card-subtitle>
      <v-card-text>
        <v-text-field
          label="Username"
          :rules="rules"
          hide-details="auto"
          class="pb-3"
        ></v-text-field>
        <v-text-field
          label="Password"
          :rules="rules"
          hide-details="auto"
          @change="PasswordChange"
          ref="passwordField"
        ></v-text-field>
        <span ref="passwordHint" class="pt-1"></span>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block outlined>Login</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  private rules = [
    (value: string) => !!value || 'Required.',
    (value: string) => (value && value.length >= 3) || 'Min 3 characters',
  ];
  private tries = 0;

  PasswordChange (e: string): void {
    console.log(e);
    this.tries++;
    console.log(this.tries);
    if (this.tries > 3) (this.$refs.passwordHint as HTMLSpanElement).innerHTML = 'Forgot your password? Click <a href="/login/reset">here</a>.';
  }
}
</script>
