<template>
  <div class="text-center mt-3">
    <div class="text-h1">404</div>
    <div class="grey--text text-sm-h5">{{ $t('special.The requested page could not be found') }}.</div>
    <v-btn text min-width="20%" color="primary" class="mt-16 mx-auto" @click="$router.push({ name: 'home' })">{{ $t('special.Back home') }}</v-btn>
  </div>
</template>
