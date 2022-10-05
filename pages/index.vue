<template>
  <div class="flex overflow-hidden flex-col items-center mx-auto lg:max-w-none bg-grass-background">
    <Hero id="home" class="" />

    <div class="container grid grid-cols-1 mt-24 max-w-screen-xl md:grid-cols-2 lg:mt-48">
      <div class="p-4 md:p-8 xl:pl-0">
        <DuckGif />
      </div>

      <div class="p-4 md:p-8 xl:pr-0">
        <h4 class="mt-2 text-5xl font-extrabold text-grass-muted">
          Mint A Duck
        </h4>
        <p class="mt-5 text-xl text-justify text-gray-800">
          8192 Duck NFTs with varying rarity levels. Price starts from 1200 to a maximum of 2877 zil. $DUCK token holders are able to regenerate their NFDs. NFD holders can transfer ownership, share and rename their ducks. Additional features may be added as the project progresses.
        </p>
        <div class="flex flex-col mt-10 md:flex-row">
          <div class="flex flex-row gap-1 mb-2">
            <input v-model="numberOfDucks" type="number" aria-label="Number of ducks to buy" class="block items-center w-full h-16 text-2xl font-medium text-center text-gray-700 bg-gray-200 rounded-2xl appearance-none outline-none md:text-basecursor-default focus:outline-none hover:text-black focus:text-black">
            <div class="w-16">
              <button class="flex-grow-0 w-16 h-16 bg-gray-200 rounded-2xl outline-none focus:outline-none" @click="decrementNumberOfDucks">
                <span class="m-auto text-4xl font-thin">−</span>
              </button>
            </div>
            <div class="w-16">
              <button class="flex-grow-0 w-16 h-16 bg-gray-200 rounded-2xl outline-none focus:outline-none" @click="incrementNumberOfDucks">
                <span class="m-auto text-4xl font-thin">+</span>
              </button>
            </div>
          </div>
          <ConnectWallet v-if="!wallet.isConnected" class="inline-flex items-center mx-auto my-auto w-full h-16 text-xl font-medium rounded-3xl border-2 border-black md:ml-3 bg-sun" />
          <button v-if="wallet.isConnected" class="w-full h-16 text-xl font-medium rounded-3xl border-2 border-black md:ml-3 bg-sun" @click="buy">
            {{ `Mint (${zilToPay.zil} ZIL)` }}
          </button>
        </div>

        <div v-if="voucherIDs.length > 0" class="flex flex-col gap-2 p-4 mt-2 rounded-2xl bg-grass-card-900">
          <div class="flex flex-col">
            <h4 class="text-xl font-semibold">
              You have a voucher!
            </h4>
            <p>Go ahead, mint a duck without using up a single Zil</p>
          </div>
          <div class="flex flex-col gap-2 md:flex-row">
            <button :disabled="approvedVouchers" class="h-12 text-lg font-medium bg-gray-200 rounded-2xl border-2 border-black md:w-1/2 disabled:border-gray-200 disabled:text-gray-400" @click="approveClaim">
              {{ `1. Approve voucher` }}
            </button>

            <button :disabled="!approvedVouchers" class="h-12 text-lg font-medium bg-gray-200 rounded-2xl border-2 border-black md:w-1/2 disabled:border-gray-200 disabled:text-gray-400" @click="doClaimVoucher">
              {{ `2. Mint with voucher` }}
            </button>
          </div>
        </div>

        <h4 class="flex self-start mt-8 mb-2 text-xl font-bold text-left text-gray-900">
          Ducks hatched
        </h4>
        <DucksSold class="mb-8" :current-duck="currentDuck" />
      </div>
    </div>
    <div class="container items-start px-4 mt-8 max-w-screen-xl md:mt-16 md:px-0">
      <h2 class="flex self-start mb-8 text-2xl font-bold text-left text-gray-900">
        Fresh from the egg.
      </h2>
    </div>
    <NewlyMinted
      id="newly-minted"
      class="self-center mb-24 max-w-screen-xl"
    />
    <BlogPreview />
    <Team class="my-24" />

    <Footer background="grass" />
  </div>
</template>

<script>
import Big from 'big.js'
import { BN, Long } from '@zilliqa-js/util'
import { pollTx } from '@/zilpay/poll-tx'
const environment = require('@/helpers/environment')

export default {
  data () {
    return {
      numberOfDucks: 1,
      zilToPay: {
        ducks: 1
      }
    }
  },
  computed: {
    currentDuck () {
      return this.$store.state.ducks.currentDuck
    },
    wallet () {
      return this.$store.state.wallet.wallet
    },
    voucherIDs () {
      const pairs = this.$store.state.ducks.voucherOwners
      const owned = pairs.filter(x => x.address.toLowerCase() === this.wallet.base16.toLowerCase())
      const arrayOfIDs = owned.map(pair => pair.id)
      return arrayOfIDs
    },
    approvedVouchers () {
      const map = this.$store.state.ducks.voucherState

      if (!map) { return false }

      const contract = environment.getContractAddress('PROXY_CONTRACT')
      const addressExistsOuter = this.wallet.base16.toLowerCase() in map

      if (addressExistsOuter) {
        const approved = contract in map[this.wallet.base16.toLowerCase()]
        return approved
      }
      return addressExistsOuter
    }
  },
  watch: {
    numberOfDucks () {
      if ((parseInt(this.numberOfDucks) + this.currentDuck) > 8192) { this.numberOfDucks = 8192 - this.currentDuck }
      if (this.numberOfDucks > 100) { this.numberOfDucks = 100 }
      this.integrateBetweenLimits(this.currentDuck + 1, parseInt(this.numberOfDucks) + this.currentDuck)
    },
    currentDuck () {
      this.integrateBetweenLimits(this.currentDuck + 1, parseInt(this.numberOfDucks) + this.currentDuck)
    }
  },
  mounted () {
    this.$store.dispatch('ducks/getAttributeCounts')
    this.integrateBetweenLimits(this.currentDuck + 1, parseInt(this.numberOfDucks) + this.currentDuck)

    console.log(this.getPriceAtX(4341))
    console.log(this.getPriceAtX(4342))
    console.log(this.getPriceAtX(4343))
    console.log(this.getPriceAtX(4344))
  },
  beforeMount () {
    this.$store.dispatch('ducks/mainGetBlock')
  },
  methods: {
    incrementNumberOfDucks () {
      this.numberOfDucks++
    },
    decrementNumberOfDucks () {
      if (this.numberOfDucks > 1) {
        this.numberOfDucks--
      }
    },
    buy () {
      const numDucks = this.zilToPay.ducks
      const amount = new Big(this.zilToPay.qa).plus((new Big(10).pow(12)).mul(numDucks))

      const arrayOfIDs = Array.from({ length: numDucks }, (e, i) => String(i + 1))

      this.doProxyBatchMint(String(amount), arrayOfIDs)
    },
    getPriceAtX (x) {
      const bx = new Big(x)
      const zil = (bx.pow(2).div(40000)).plus(1200)
      const qa = zil.mul(new Big(10).pow(12))
      return {
        zil: zil.toFixed(2),
        qa: qa.toFixed(0)
      }
    },
    getPricesBetweenXandY (x, y) {
      let btotal = new Big(0)
      for (let i = x; i <= y; i++) {
        const thisQa = this.getPriceAtX(i).qa
        btotal = btotal.plus(thisQa)
      }
      return Number(btotal)
    },
    integrateBetweenLimits (min, max) {
      if (max > 8192) { max = 8192 }

      const qa = this.getPricesBetweenXandY(min, max)
      const bqa = new Big(qa)
      const zil = bqa.div(new Big(10).pow(12))

      const rt = {
        qa: qa.toFixed(0),
        zil: zil.toFixed(2) + 2,
        ducks: max - min + 1
      }

      this.zilToPay = rt
      return rt
    },
    async doProxyBatchMint (amount, dummy_list_count) {
      console.log(`ProxyBatchMint ${amount} ${dummy_list_count}`)

      const gasLimit = Long.fromString('5000')
      const gasPrice = new BN('200000000')
      let contract

      if (process.browser) {
        contract = window.zilPay.contracts.at(environment.getContractAddress('PROXY_CONTRACT'))
      }

      const tx = await contract.call('ProxyBatchMint',
        [
          {
            vname: 'dummy_list_count',
            type: 'List Uint256',
            value: dummy_list_count
          }
        ],
        {
          amount,
          gasPrice,
          gasLimit
        })

      let txToast = this.$toast.success('TX sending')
      txToast = this.$styleToast(txToast, tx, 'Minting', 'pending')

      await pollTx(tx)
        .then((res) => {
          console.log(res)
          txToast = this.$styleToast(txToast, tx, 'Confirmed', 'success')
          txToast.goAway(20000)
        })
        .catch((err) => {
          console.log(err)
          txToast = this.$styleToast(txToast, tx, 'Failed', 'failed')
          txToast.goAway(20000)
        })
    },
    async approveClaim () {
      const amount = new BN('0')
      const gasLimit = Long.fromString('5000')
      const gasPrice = new BN('200000000')
      let contract
      if (process.browser) {
        contract = window.zilPay.contracts.at(environment.getContractAddress('VOUCHER_CONTRACT'))
      }

      try {
        const tx = await contract.call('AddOperator',
          [
            {
              vname: 'operator',
              type: 'ByStr20',
              value: environment.getContractAddress('PROXY_CONTRACT')
            }
          ],
          {
            amount,
            gasPrice,
            gasLimit
          })

        let txToast = this.$toast.success('TX sending')
        txToast = this.$styleToast(txToast, tx, 'Approving voucher spend', 'pending')

        await pollTx(tx)
          .then((res) => {
            console.log(res)
            txToast = this.$styleToast(txToast, tx, 'Confirmed', 'success')
            this.approved = true
            txToast.goAway(20000)
          })
          .catch((err) => {
            console.log(err)
            txToast = this.$styleToast(txToast, tx, 'Approve failed', 'failed')
            txToast.goAway(20000)
          })
      } catch (err) {
        console.log(err)
      }
    },
    async doClaimVoucher () {
      const gasLimit = Long.fromString('5000')
      const gasPrice = new BN('200000000')
      let contract
      const amount = 0

      try {
        if (process.browser) {
          contract = window.zilPay.contracts.at(environment.getContractAddress('PROXY_CONTRACT'))
        }

        const tx = await contract.call('ProxyVoucher',
          [
            {
              vname: 'this_exchangeable_token_id',
              type: 'Uint256',
              value: String(this.voucherIDs[0])
            }
          ],
          {
            amount,
            gasPrice,
            gasLimit
          })

        let txToast = this.$toast.success('TX sending')
        txToast = this.$styleToast(txToast, tx, 'Minting', 'pending')

        await pollTx(tx)
          .then((res) => {
            console.log(res)
            txToast = this.$styleToast(txToast, tx, 'Confirmed', 'success')
            txToast.goAway(20000)
          })
          .catch((err) => {
            console.log(err)
            txToast = this.$styleToast(txToast, tx, 'Failed', 'failed')
            txToast.goAway(20000)
          })
      } catch (err) {
        console.log(err)
      }
    }

  }
}
</script>

<style>
input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .custom-number-input input:focus {
    outline: none !important;
  }

  .custom-number-input button:focus {
    outline: none !important;
  }
</style>
