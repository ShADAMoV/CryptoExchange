<script setup>
import { ref } from 'vue';
import { useCurrenciesStore } from '@/stores/currencies';
import { storeToRefs } from 'pinia';
const currenciesStore = useCurrenciesStore();
const { currency, searchCurrencies, slicedCurrencies, fromAmount, toAmount } = storeToRefs(currenciesStore);

currenciesStore.fetchCurrencies();
currenciesStore.fetchMinimumExchange('btc', 'eth');
currenciesStore.fetchCurrencyCost('btc', 'usd');

setTimeout(() => {
  console.log(currency);
  console.log(currenciesStore.minimalExchange);
  console.log(currenciesStore.currencyCost);
}, 1000);

const search = ref(null);

function cleanInput(elem) {
  elem.value= '';
}
</script>

<template>
  <div class="crypto-exchanger">
    <div class="crypto-exchanger__wrapper">
      <input
        id="leftInput"
        v-model="fromAmount"
        name="leftInput"
        class="crypto-exchanger__input"
        type="number"
      >
      <div class="crypto-exchanger__select">
        <div class="crypto-exchanger__separator" />
        <div class="crypto-exchanger__icon">
          <img
            src="https://content-api.changenow.io/uploads/btc_d8db07f87d.svg"
            alt="Icon"
          >
        </div>
        <div class="crypto-exchanger__abbreviation">
          BTC
        </div>
        <div class="crypto-exchanger__arrow">
          <svg
            id="Layer_1"
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="Down_Arrow_3_"
              d="m64 88c-1.023 0-2.047-.391-2.828-1.172l-40-40c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l37.172 37.172 37.172-37.172c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656l-40 40c-.781.781-1.805 1.172-2.828 1.172z"
              fill="#000000"
              style="fill: #80A2B6;"
            />
          </svg>
        </div>
      </div>
    </div>

    <div
      class="swapper"
      @click="currenciesStore.swapAmounts"
    >
      <div class="swapper__right-arrow">
        →
      </div>
      <div class="swapper__left-arrow">
        ←
      </div>
    </div>

    <div class="crypto-exchanger__wrapper">
      <input
        id="rightInput"
        v-model="toAmount"
        name="rightInput"
        class="crypto-exchanger__input"
        type="number"
      >

      <div class="crypto-exchanger__select">
        <div class="crypto-exchanger__separator" />
        <div class="crypto-exchanger__icon">
          <img
            src="https://content-api.changenow.io/uploads/btc_d8db07f87d.svg"
            alt="Icon"
          >
        </div>
        <div class="crypto-exchanger__abbreviation">
          BTC
        </div>
        <div class="crypto-exchanger__arrow">
          <svg
            id="Layer_1"
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="Down_Arrow_3_"
              d="m64 88c-1.023 0-2.047-.391-2.828-1.172l-40-40c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l37.172 37.172 37.172-37.172c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656l-40 40c-.781.781-1.805 1.172-2.828 1.172z"
              fill="#000000"
              style="fill: #80A2B6;"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="crypto-exchanger__wallet">
      <label for="rightInput">Your Ethereum address
        <input
          id="rightInput"
          name="rightInput"
          class="crypto-exchanger__input"
          type="text"
        >
      </label>
      <button
        class="crypto-exchanger__button"
      >
        Exchange
      </button>
    </div>
  </div>

  <div class="crypto-exchanger__search ">
    <input
      id="search"
      ref="search"
      v-model="searchCurrencies"
      name="search"
      class="crypto-exchanger__input"
      type="text"
      placeholder="Search"
    >
    <div
      class="clean-input"
      @click="cleanInput(search)"
    >
      <div class="clean-input__line-one" />
      <div class="clean-input__line-two" />
    </div>
    <div class="crypto-exchanger__dropdown dropdown">
      <div
        v-for="filteredCurrency in slicedCurrencies"
        :key="filteredCurrency.id"
        class="dropdown__item"
      >
        <div class="dropdown__image">
          <img
            :src="filteredCurrency.image"
            alt="coinIcon"
          >
        </div>
        <div class="dropdown__abbreviation">
          {{ filteredCurrency.ticker }}
        </div>
        <div class="dropdown__name">
          {{ filteredCurrency.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.crypto-exchanger {
  display: flex;
  flex-wrap: wrap;

  &__wrapper {
    display: flex;
    align-items: center;
    position: relative;
    max-width: 440px;
    width: 100%;
  }

  &__select {
    position: absolute;
    display: flex;
    width: 135px;
    align-items: center;
    right: 10px;
    cursor: pointer;
  }

  &__separator {
    width: 2px;
    height: 30px;
    background: #E3EBEF;
    margin-right: 25px;
    user-select: none;
  }

  &__icon {
    width: 20px;
    height: 20px;
    margin-right: 15px;
    user-select: none;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &__abbreviation {
    text-transform: uppercase;
    user-select: none;
    font-size: 16px;
    color: #282828;
    line-height: 100%;
    margin-right: 25px;
  }

  &__arrow {
    user-select: none;
    width: 18px;
    height: 18px;
  }

  &__input {
    position: relative;
    box-sizing: border-box;
    font-weight: 400;
    font-size: 16px;
    color: #282828;
    padding: 10px 150px 10px 16px;
    background: #F6F7F8;
    border: 1px solid #E3EBEF;
    border-radius: 5px 5px 0 0;
    outline:none;
    width: 100%;
    height: 50px;
  }

  &__input::-webkit-outer-spin-button, &__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &__wallet {
    display: flex;
    align-items: flex-end;
    width: 100%;
    margin-top: 30px;

    label {
      font-size: 16px;
      color: #282828;
      max-width: 720px;
      width: 100%;
      margin-right: 30px;
    }
  }

  &__button {

    &:hover {
      background-color: #0095E0;
    }

    background-color: #11B3FE;
    border-radius: 5px;
    border: none;
    text-transform: uppercase;
    padding: 0 60px;
    box-sizing: border-box;
    height: 50px;
    max-width: 210px;
    width: 100%;
    color: #FFFFFF;
    cursor: pointer;
  }

  &__search {
    position: relative;

    .crypto-exchanger__input {
      padding-right: 40px;
    }
  }
}

.swapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 25px;
  margin-left: 25px;
  cursor: pointer;
  user-select: none;
  width: 30px;

  .swapper__right-arrow, .swapper__left-arrow {
    font-size: 30px;
    line-height: 35%;
    color: #11B3FE;
  }
}

.clean-input {
  position: absolute;
  width: 10px;
  height: 10px;
  right: 20px;
  top: 20px;
  cursor: pointer;

  &__line-one {
    position: absolute;
    right: 4px;
    width: 2px;
    height: 12px;
    transform: rotate(45deg);
    background-color: #80A2B6;
  }

  &__line-two {
    position: absolute;
    right: 4px;
    width: 2px;
    height: 12px;
    transform: rotate(-45deg);
    background-color: #80A2B6;
  }
}

.dropdown {
  border: 1px solid #E3EBEF;
  border-top: none;
  border-radius: 0 0 5px 5px;
  max-height: 150px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
    background-color: #f9f9fd;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #11B3FE;
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2);
    background-color: #f9f9fd;
  }

  &__item {
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    align-items: center;
    width: 100%;
    background: #F6F7F8;
    cursor: pointer;
  }

  &__image {
    width: 20px;
    height: 20px;
    margin-right: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &__abbreviation {
    text-transform: uppercase;
    font-size: 16px;
    color: #282828;
    margin-right: 16px;
  }

  &__name {
    font-size: 16px;
    color: #80A2B6;
  }
}
</style>