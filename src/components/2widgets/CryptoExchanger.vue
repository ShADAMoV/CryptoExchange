<script setup>
import { computed, onMounted, ref } from 'vue';
import { useCurrenciesStore } from '@/stores/currencies';
import { storeToRefs } from 'pinia';
const currenciesStore = useCurrenciesStore();
const { minimalExchange, currencyCost, searchCurrencies, slicedCurrencies, fromAmount, toAmount, fromSearchVisibility, toSearchVisibility } = storeToRefs(currenciesStore);
onMounted(() => {
  currenciesStore.fetchCurrencies();
});
currenciesStore.fetchCurrencyCost('btc', 'eth');

const fromSearch = ref(null);
const toSearch = ref(null);
const fromCurrency = ref({
  image: 'https://content-api.changenow.io/uploads/btc_d8db07f87d.svg',
  abbreviation: 'BTC',
});
const toCurrency = ref({
  image: 'https://content-api.changenow.io/uploads/eth_f4ebb54ec0.svg',
  abbreviation: 'ETH',
});
function swapCurrency() {
  const swapCurrency = {
    image: fromCurrency.value.image,
    abbreviation: fromCurrency.value.abbreviation,
  };

  fromCurrency.value.image = toCurrency.value.image;
  fromCurrency.value.abbreviation = toCurrency.value.abbreviation;
  toCurrency.value.image = swapCurrency.image;
  toCurrency.value.abbreviation = swapCurrency.abbreviation;
}

const minimalExchangeCheck = computed(() => {
  return +minimalExchange.value > +fromAmount.value;
});
function calculateFromTo() {
  currenciesStore.fetchCurrencyCost(fromCurrency.value.abbreviation, toCurrency.value.abbreviation);
  setTimeout(() => toAmount.value = currencyCost.value, 100);
  currenciesStore.fetchMinimumExchange(fromCurrency.value.abbreviation, toCurrency.value.abbreviation);
}

function cleanInput() {
  searchCurrencies.value= '';
}
</script>

<template>
  <div class="crypto-exchanger">
    <div
      v-click-outside="currenciesStore.hideFromSearch"
      class="crypto-exchanger__wrapper"
    >
      <label
        v-show="minimalExchangeCheck"
        class="crypto-exchanger__input-warning"
      >
        Minimal exchange count is <span>{{ minimalExchange }}</span>
      </label>
      <input
        id="leftInput"
        v-model="fromAmount"
        name="leftInput"
        class="crypto-exchanger__input"
        type="number"
        @input="calculateFromTo"
      >
      <div
        class="crypto-exchanger__select"
        @click="currenciesStore.showFromSearch()"
      >
        <div class="crypto-exchanger__separator" />
        <div class="crypto-exchanger__icon">
          <img
            :src="fromCurrency.image"
            alt="Icon"
          >
        </div>
        <div class="crypto-exchanger__abbreviation">
          {{ fromCurrency.abbreviation }}
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
      <div
        v-show="fromSearchVisibility"
        class="crypto-exchanger__search"
      >
        <input
          id="fromSearch"
          ref="fromSearch"
          v-model="searchCurrencies"
          name="fromSearch"
          class="crypto-exchanger__input"
          type="text"
          placeholder="Search"
        >
        <div
          class="clean-input"
          @click="cleanInput(); currenciesStore.hideFromSearch()"
        >
          <div class="clean-input__line-one" />
          <div class="clean-input__line-two" />
        </div>
        <div class="crypto-exchanger__dropdown dropdown">
          <div
            v-for="filteredCurrency in slicedCurrencies"
            :key="filteredCurrency.id"
            class="dropdown__item"
            @click="fromCurrency.abbreviation = filteredCurrency.ticker; fromCurrency.image = filteredCurrency.image; currenciesStore.hideFromSearch(); calculateFromTo()"
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
    </div>

    <div
      class="swapper"
      @click="swapCurrency(); calculateFromTo()"
    >
      <div class="swapper__right-arrow">
        →
      </div>
      <div class="swapper__left-arrow">
        ←
      </div>
    </div>

    <div
      v-click-outside="currenciesStore.hideToSearch"
      class="crypto-exchanger__wrapper"
    >
      <input
        id="rightInput"
        ref="rightInput"
        v-model="toAmount"
        name="rightInput"
        class="crypto-exchanger__input"
        type="number"
        readonly
      >

      <div
        class="crypto-exchanger__select"
        @click="currenciesStore.showToSearch()"
      >
        <div class="crypto-exchanger__separator" />
        <div class="crypto-exchanger__icon">
          <img
            :src="toCurrency.image"
            alt="Icon"
          >
        </div>
        <div class="crypto-exchanger__abbreviation">
          {{ toCurrency.abbreviation }}
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
      <div
        v-show="toSearchVisibility"
        class="crypto-exchanger__search"
      >
        <input
          id="toSearch"
          ref="toSearch"
          v-model="searchCurrencies"
          name="toSearch"
          class="crypto-exchanger__input"
          type="text"
          placeholder="Search"
        >
        <div
          class="clean-input"
          @click="cleanInput(); currenciesStore.hideToSearch()"
        >
          <div class="clean-input__line-one" />
          <div class="clean-input__line-two" />
        </div>
        <div class="crypto-exchanger__dropdown dropdown">
          <div
            v-for="filteredCurrency in slicedCurrencies"
            :key="filteredCurrency.id"
            class="dropdown__item"
            @click="toCurrency.abbreviation = filteredCurrency.ticker; toCurrency.image = filteredCurrency.image; currenciesStore.hideToSearch(); calculateFromTo()"
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
    </div>
    <div class="crypto-exchanger__wallet">
      <label for="walletAddress">Your Ethereum address
        <input
          id="walletAddress"
          name="walletAddress"
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
</template>

<style lang="scss">


.crypto-exchanger {
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 1000px) {
    justify-content: flex-end;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    position: relative;
    max-width: 440px;
    width: 100%;

    @media (max-width: 1000px) {
      max-width: unset;
    }
  }

  &__input-warning {
    position: absolute;
    top: -20px;
    left: 0;

    span {
      color: #c10b0b;
    }
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

    @media (max-width: 1000px) {
      flex-wrap: wrap;
    }

    label {
      font-size: 16px;
      color: #282828;
      max-width: 720px;
      width: 100%;
      margin-right: 30px;

      @media (max-width: 1000px) {
        margin-right: 0;
        margin-bottom: 15px;
      }
    }
  }

  #walletAddress {
    padding: 10px 16px;
  }

  &__button {

    @media (max-width: 1000px) {
      max-width: unset;
    }

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
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 1;

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

  @media (max-width: 1000px) {
    transform: rotate(90deg);
    margin: 15px 0;
  }

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