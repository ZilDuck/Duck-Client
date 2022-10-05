<template>
    <div>
        <button @click="handleClick" class="px-2 font-medium flex items-center justify-center text-center w-full">
            {{ zilPay ? wallet.bech32 ? `${wallet.bech32.slice(0, 6)}...${wallet.bech32.slice(wallet.bech32.length-6, wallet.bech32.length)}` : 'Connect wallet' : 'Zilpay not found' }}
        </button>
        <slot />
        <ConnectWalletModal :show="showModal" @close="showModal = false"> </ConnectWalletModal>
        <ZilpayModal :show="zilpayModal" @close="zilpayModal = false"/>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      wallet: (state) => state.wallet.wallet
    }),
    zilPay() {
      if (process.browser) {
        if (window.zilPay) return window.zilPay
      }
      return
    },
    network () {
      if (process.browser) {
        return process.env.current_network
      }
    }
  },
  data() {
    return {
      showModal: false,
      zilpayModal: false
    }
  },
  mounted () {
    /** this breaks if not connected previously
    console.log(this.zilPay)
    if (this.zilPay.wallet.isEnable && typeof window.zilPay !== 'undefined') {
      const networkStreamChanged = window
      .zilPay
      .wallet
      .observableNetwork()
      .subscribe(net => {
        if (this.zilPay.wallet.net.toLowerCase() !== this.network) {
          this.zilpayModal = true
        } else {
          this.zilpayModal = false
        }
      })
    }
    */
   console.log('mounted wallet component')
   this.checkIfWalletConnected()
  },
  methods: {
    async checkIfWalletConnected() {
      if (this.zilPay) {
        const localStorageAddress = localStorage.getItem('wallet')

        if (localStorageAddress == this.zilPay.wallet.defaultAccount.base16) {
          const isConnect = await window.zilPay.wallet.connect()
          if (isConnect) {
            this.$store.dispatch("wallet/setWallet", {
              bech32: window.zilPay.wallet.defaultAccount.bech32,
              base16: window.zilPay.wallet.defaultAccount.base16,
              isConnected: true,
            })
            this.$store.dispatch('wallet/fetchBalance', this.$store.state.wallet.wallet.bech32)
            this.$nuxt.$emit("walletConnected") 
          }
        }
      }
    },
    handleClick () {
      if (!this.zilPay) {
        this.zilpayModal = true
      } else {
        if (this.zilPay.wallet.net.toLowerCase() === this.network) {
          this.showModal = true
        } else {
          this.zilpayModal = true
          const networkStreamChanged = window
            .zilPay
            .wallet
            .observableNetwork()
            .subscribe(net => {
              this.zilpayModal = false
              this.showModal = true
            })
        }
      }
    }
  }
}
</script>
