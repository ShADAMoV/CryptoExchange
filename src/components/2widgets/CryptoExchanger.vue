<script setup>
import { computed, onMounted, ref } from 'vue';
import { useCurrenciesStore } from '@/stores/currencies';
import { storeToRefs } from 'pinia';
const currenciesStore = useCurrenciesStore();
const { minimalExchange, currencyCost, searchCurrencies, slicedCurrencies, fromAmount, toAmount, fromSearchVisibility, toSearchVisibility, isValidPair } = storeToRefs(currenciesStore);
onMounted(() => {
  currenciesStore.fetchCurrencies();
});
currenciesStore.fetchCurrencyCost('btc', 'eth');

const fromSearch = ref(null);
setTimeout(() => {
  console.log(fromSearch.value);
});
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

const minimalExchangeValid = computed(() => {
  return +minimalExchange.value > +fromAmount.value;
});

function minimalExchangeInput() {
  setTimeout(() => fromAmount.value = minimalExchange.value, 300);
}
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
  <div class="flex items-center flex-wrap justify-end lg:justify-normal">
    <div
      v-click-outside="currenciesStore.hideFromSearch"
      class="flex items-center relative lg:max-w-452 w-full"
    >
      <div
        class="absolute -top-6"
      >
        <p
          v-show="minimalExchangeValid && isValidPair !== true"
          class="text-red-700 mb-2"
        >
          Minimal exchange amount is {{ minimalExchange }}
        </p>
        <p
          v-show="isValidPair"
          class="text-red-700"
        >
          This pair is disabled now
        </p>
      </div>
      <input
        id="leftInput"
        v-model="fromAmount"
        name="leftInput"
        class="outer-spin box-border text-base text-gray-800 pt-2.5 pr-37.5 pb-2.5 pl-4 bg-neutral-100 border border-neutral-200 rounded-md outline-none w-full h-12"
        type="number"
        :class="[minimalExchangeValid ? 'text-red-700' : 'text-gray-800']"
        @input="calculateFromTo"
      >
      <div
        class="absolute flex w-32 items-center right-2.5 cursor-pointer"
        @click="currenciesStore.showFromSearch()"
      >
        <div class="w-0.5 h-8 bg-neutral-200 mr-6 select-none" />
        <div class="w-5 h-5 mr-4 select-none">
          <img
            class="w-full h-full"
            :src="fromCurrency.image"
            alt="Icon"
          >
        </div>
        <div class="uppercase select-none text-base text-slate-800 mr-6">
          {{ fromCurrency.abbreviation }}
        </div>
        <div class="select-none w-4 h-4">
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
        class="w-full absolute top-0 z-10"
      >
        <input
          id="fromSearch"
          ref="fromSearch"
          v-model="searchCurrencies"
          name="fromSearch"
          class="outer-spin box-border text-base text-gray-800 pt-2.5 pr-10 pb-2.5 pl-4 bg-neutral-100 border border-neutral-200 rounded-t-md outline-none w-full h-12"
          type="text"
          placeholder="Search"
        >
        <div
          class="absolute w-2.5 h-2.5 right-5 top-4 cursor-pointer"
          @click="cleanInput(); currenciesStore.hideFromSearch()"
        >
          <div class="absolute right-1 w-0.5 h-3 rotate-45 bg-gray-500" />
          <div class="absolute right-1 w-0.5 h-3 -rotate-45 bg-gray-500" />
        </div>
        <div class="border broder-t-0 rounded-b-md max-h-36 overflow-y-auto custom-scrollbar">
          <div
            v-for="filteredCurrency in slicedCurrencies"
            :key="filteredCurrency.id"
            class="box-border p-4 flex items-center w-full bg-neutral-100 cursor-pointer"
            @click="minimalExchangeInput(); fromCurrency.abbreviation = filteredCurrency.ticker; fromCurrency.image = filteredCurrency.image; currenciesStore.hideFromSearch(); calculateFromTo()"
          >
            <div class="w-5 h-5 mr-2.5">
              <img
                class="w-full h-full"
                :src="filteredCurrency.image"
                alt="coinIcon"
              >
            </div>
            <div class="uppercase text-base text-slate-800 mr-4">
              {{ filteredCurrency.ticker }}
            </div>
            <div class="text-base text-gray-500">
              {{ filteredCurrency.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex align-center direction-col justify-center flex-wrap mt-4 mb-4 cursor-pointer select-none w-8 rotate-90 lg:rotate-0 lg:mr-3 lg:ml-3 lg:mr-0 lg:mb-0 lg:mt-0"
      @click="minimalExchangeInput(); swapCurrency(); calculateFromTo()"
    >
      <div class="text-3xl leading-3 text-sky-500">
        →
      </div>
      <div class="text-3xl leading-3 text-sky-500">
        ←
      </div>
    </div>

    <div
      v-click-outside="currenciesStore.hideToSearch"
      class="flex items-center relative lg:max-w-452 w-full"
    >
      <div
        v-show="minimalExchangeValid"
        class="absolute text-base text-gray-800 bg-neutral-100 w-full max-w-210 lg:max-w-xs h-10 left-3.5 top-1 flex items-center"
      >
        -
      </div>
      <input
        id="rightInput"
        ref="rightInput"
        v-model="toAmount"
        name="rightInput"
        class="outer-spin box-border text-base text-gray-800 pt-2.5 pr-37.5 pb-2.5 pl-4 bg-neutral-100 border border-neutral-200 rounded-md outline-none w-full h-12"
        type="number"
        readonly
      >

      <div
        class="absolute flex w-32 items-center right-2.5 cursor-pointer"
        @click="currenciesStore.showToSearch()"
      >
        <div class="w-0.5 h-8 bg-neutral-200 mr-6 select-none" />
        <div class="w-5 h-5 mr-4 select-none">
          <img
            class="w-full h-full"
            :src="toCurrency.image"
            alt="Icon"
          >
        </div>
        <div class="uppercase select-none text-base text-slate-800 mr-6">
          {{ toCurrency.abbreviation }}
        </div>
        <div class="select-none w-4 h-4">
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
        class="w-full absolute top-0 z-10"
      >
        <input
          id="toSearch"
          ref="toSearch"
          v-model="searchCurrencies"
          name="toSearch"
          class="outer-spin box-border text-base text-gray-800 pt-2.5 pr-10 pb-2.5 pl-4 bg-neutral-100 border border-neutral-200 rounded-t-md outline-none w-full h-12"
          type="text"
          placeholder="Search"
        >
        <div
          class="absolute w-2.5 h-2.5 right-5 top-4 cursor-pointer"
          @click="cleanInput(); currenciesStore.hideToSearch()"
        >
          <div class="absolute right-1 w-0.5 h-3 rotate-45 bg-gray-500" />
          <div class="absolute right-1 w-0.5 h-3 -rotate-45 bg-gray-500" />
        </div>
        <div class="border broder-t-0 rounded-b-md max-h-36 overflow-y-auto custom-scrollbar">
          <div
            v-for="filteredCurrency in slicedCurrencies"
            :key="filteredCurrency.id"
            class="box-border p-4 flex items-center w-full bg-neutral-100 cursor-pointer"
            @click="minimalExchangeInput(); toCurrency.abbreviation = filteredCurrency.ticker; toCurrency.image = filteredCurrency.image; currenciesStore.hideToSearch(); calculateFromTo()"
          >
            <div class="w-5 h-5 mr-2.5">
              <img
                class="w-full h-full"
                :src="filteredCurrency.image"
                alt="coinIcon"
              >
            </div>
            <div class="uppercase text-base text-slate-800 mr-4">
              {{ filteredCurrency.ticker }}
            </div>
            <div class="text-base text-gray-500">
              {{ filteredCurrency.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-end w-full mt-8 flex-wrap lg:flex-nowrap">
      <label
        for="walletAddress"
        class="text-basic text-gray-500 max-w-720 w-full lg:mr-8 mb-4 lg:mb-0"
      >Your Ethereum address
        <input
          id="walletAddress"
          name="walletAddress"
          class="outer-spin box-border text-base text-gray-800 pt-2.5 pr-37.5 pb-2.5 pl-4 bg-neutral-100 border border-neutral-200 rounded-md outline-none w-full h-12"
          type="text"
        >
      </label>
      <button
        class="text-white bg-sky-500 hover:bg-sky-700 rounded-md border-0 uppercase py-4 box-border h-12 max-w-none lg:max-w-210 w-full text-black cursor-pointer"
      >
        Exchange
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.outer-spin::-webkit-outer-spin-button, .outer-spin::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.crypto-exchanger__input {
  padding-right: 40px;
}

.custom-scrollbar {
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
}
</style>