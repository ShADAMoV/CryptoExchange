import { defineStore } from 'pinia';
// Import axios to make HTTP requests
import axios from 'axios';
export const useCurrenciesStore = defineStore('currencies', {
  state: () => ({
    currency: [],
    minimalExchange: null,
    currencyCost: null,
    searchCurrencies: '',
    visibleItems: 10,
    fromAmount: '',
    toAmount: '',
  }),
  getters: {
    filteredCurrencies: (state) => {
      return state.currency.filter((item) => {
        return item.name.toLowerCase().includes(state.searchCurrencies.toLowerCase())
          ||
          item.legacyTicker.toLowerCase().includes(state.searchCurrencies.toLowerCase());
      });
    },

    slicedCurrencies: (state) => {
      return state?.filteredCurrencies.slice(0, state.visibleItems);
    },
  },
  actions: {
    swapAmounts() {
      const swapAmount = this.fromAmount;
      this.fromAmount = this.toAmount;
      this.toAmount = swapAmount;
    },

    async fetchCurrencies() {
      axios
        .get('https://api.changenow.io/v2/exchange/currencies?active=&flow=standard&buy=&sell=&x-changenow-api-key=c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd')
        .then(response => (this.currency = response.data))
        .then();
    },

    async fetchMinimumExchange(from, to) {
      from = from.toLowerCase();
      to = to.toLowerCase();
      axios
        .get(`https://api.changenow.io/v2/exchange/min-amount?fromCurrency=${from}&toCurrency=usdt&fromNetwork=${from}&toNetwork=${to}&flow=standard&x-changenow-api-key=c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd`)
        .then(response => (this.minimalExchange = response.data.minAmount));
    },

    async fetchCurrencyCost(currency, to) {
      to = to.toUpperCase();
      axios
        .get(`https://min-api.cryptocompare.com/data/price?fsym=${currency.toUpperCase()}&tsyms=${to}`)
        .then(response => (this.currencyCost = response.data[to]));
    },
  },
});