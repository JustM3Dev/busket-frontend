<template>
  <div>
    <input type="text" v-model="text" @input="change()">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SneakInput extends Vue {
  @Prop() private value: string | undefined;
  private text = '';

  mounted (): void {
    this.text = this.value || '';
  }

  change (): void {
    this.$emit('input', this.text);
  }
}
</script>

<style scoped lang="scss">
input {
  width: 90%;
  border-radius: 2px;
  padding: 2px;
  background: rgba(0, 0, 0, 0.08);

  transition: all .2s;

  &:hover {
    background: rgba(0, 0, 0, .13);
  }

  &:focus {
    outline: none;
    border: rgba(0, 0, 0, 0.45) solid 2px;
  }
}
</style>
