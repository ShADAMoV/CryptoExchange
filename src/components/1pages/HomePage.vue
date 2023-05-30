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
.container {
  @media (max-width: 1000px) {
    max-width: 650px;
  }
}

.crypto-exchange {
  @media (max-width: 1000px) {
    padding: 0 40px;
  }

  &__title {
     margin-bottom: 0;

    @media (max-width: 1000px) {
      font-size: 32px;
    }
  }
  &__subtitle {
    margin-bottom: 60px;

    @media (max-width: 1000px) {
      font-size: 20px;
    }
  }
}
</style>
