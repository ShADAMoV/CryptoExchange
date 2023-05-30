<script setup>
import CryptoExchanger from '@/components/2widgets/CryptoExchanger.vue';
</script>

<template>
  <main>
    <div class="container">
      <section class="crypto-exchange">
        <h1 class="crypto-exchange__title">
          Crypto Exchange
        </h1>
        <h2 class="crypto-exchange__subtitle">
          Exchange fast and easy
        </h2>
        <CryptoExchanger />
      </section>
    </div>
  </main>
</template>

<style lang="scss">
.crypto-exchange {
  &__title {
     margin-bottom: 0;
  }
  &__subtitle {
    margin-bottom: 60px;
  }
}
</style>
