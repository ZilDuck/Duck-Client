<template>
  <div class="grid grid-cols-1 my-8 w-full bg-orange-100 rounded-xl divide-yellow-50 h-90 lg:grid-cols-2 sm:divide-y lg:divide-y-0 lg:divide-x">
    <div class="p-4 md:p-12">
      <h1 class="text-xl font-bold">NFD migration</h1>
      <p class="mt-4 font-medium text-md">
        Here you can migrate your old ZRC-1 ducks to the new ZRC-6 standard. This
        process will convert every one of your NFDs to be compatible with the new
        future of zilliqa NFT dapps. The cost for performing this action is zero,
        with gas fees on us! Voucher migration coming soon.
        
      </p>
    </div>
    <div class="relative p-4 md:p-12" >
      <h4 v-if="!wallet.isConnected" class="absolute top-1/2 left-1/2 z-20 text-xl font-semibold text-center -translate-x-1/2 -translate-y-1/2">Connect Wallet</h4>
      <div v-bind:class="{ 'blur-md': !wallet.isConnected }">
        <div class="mb-4">
          <p>You will be migrating {{ oldOwnedIDs.length}} duck<a v-if="oldOwnedIDs.length > 1">s</a>, with us <a class="fond-bold">offsetting {{  oldOwnedIDs.length * 4 }} ZIL</a> worth of transaction fees</p>
        </div>
        <div class="mb-4" v-if="tooManyDucks">
          <p class="font-semibold">You will be asked to make {{ Math.ceil(oldOwnedIDs.length / 5) }} transactions. Please send all of them as rejecting may cause errors with the order of transactions.</p>
        </div>
        <div class="mb-4" v-if="walletBalance < oldOwnedIDs.length * 4">
          <p class="font-semibold text-red-600">You do not have enough zil ({{ walletBalance }}) to cover the required gas fees ({{ oldOwnedIDs.length * 4 }} zil)</p>
        </div>
        <div class="flex flex-col gap-2 mt-auto w-full lg:flex-row pl-auto">
          <button :disabled="approved" @click="approve" class="flex justify-center items-center py-4 w-full font-semibold text-center bg-orange-200 rounded-xl shadow-sm disabled:shadow-none px-auto disabled:opacity-50">1. Approve</button>
          <button :disabled="!approved" @click="migrate" class="flex justify-center items-center py-4 w-full font-semibold text-center bg-orange-200 rounded-xl shadow-sm disabled:shadow-none px-auto disabled:opacity-50">2. Migrate</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pollTx } from '@/zilpay/poll-tx'
import { BN, Long } from '@zilliqa-js/util'
const environment = require('@/helpers/environment')

export default {
  computed: {
    walletBalance() {
      return this.$store.state.wallet.balance
    },
    wallet() {
      return this.$store.state.wallet.wallet
    },
    oldOwnedIDs () {
      let pairs = this.$store.state.ducks.zrc1owners
      let owned = pairs.filter(x => x.address.toLowerCase() === this.wallet.base16.toLowerCase())
      let arrayOfIDs = owned.map(pair => pair.id)
      return arrayOfIDs
    },
    approved () {
      let map = this.$store.state.ducks.zrc1operators 
      let contract = environment.getContractAddress('MIGRATOR_CONTRACT')
      let bool = this.wallet.base16.toLowerCase() in map 
      if (bool) {
        let approved = contract in map[this.wallet.base16.toLowerCase()]
        return approved
      }
      return bool 
    },
    tooManyDucks () {
      return this.oldOwnedIDs.length > 5
    },
    zilPay() {
      if (process.browser) {
        if (window.zilPay) return window.zilPay;
      }
    },
  },
  methods: {
    async getWalletBalance () {
      const { result } = await zilPay.blockchain.getBalance(this.wallet.bech32)  
      const zilInQa = zilPay.utils.units.toQa(1, zilPay.utils.units.Units.Zil)
      console.log(result.balance, zilInQa)
      console.log(result.balance / zilInQa)
      return result.balance / zilInQa
    },
    async approve() {
      let amount = new BN('0')
      const gasLimit = Long.fromString('5000')
      const gasPrice = new BN('200000000')
      let contract
      if (process.browser) {
        contract = window.zilPay.contracts.at(environment.getContractAddress('zrc1_contract')) 
      }

 
      try {
        const tx = await contract.call('SetApprovalForAll',
          [
            {
              vname: "to",
              type: "ByStr20",
              value: environment.getContractAddress('MIGRATOR_CONTRACT')
            }
          ],
          {
            amount,
            gasPrice,
            gasLimit
          })


        let txToast = this.$toast.success("TX sending") 
        txToast = this.$styleToast(txToast, tx,   "Approving token spend", 'pending')

        await pollTx(tx)
          .then(res => {
            console.log(res)
            txToast = this.$styleToast(txToast, tx, "Confirmed", 'success')
            this.approved = true
            txToast.goAway(20000)
          })
          .catch(err => {
            console.log(err)
            txToast = this.$styleToast(txToast, tx, "Approve failed", 'failed')
            txToast.goAway(20000)
          })


      } catch (err) {
        console.log(err)
      }
    },
    async migrate() {
      const tokenArray = this.oldOwnedIDs
      console.log(`Migrate  ${tokenArray}`)

      const amount = new BN('0')
      const gasLimit = Long.fromString('25000')
      const gasPrice = new BN('200000000')
      let contract
      if (process.browser) {
        contract = window.zilPay.contracts.at(environment.getContractAddress('MIGRATOR_CONTRACT')) 
      }

      const call = async (nonce, start, n) => {
        console.log(nonce, start, n)
        console.log(tokenArray.slice(start, start + n))
     
        const tx = await contract.call('Claim',
          [
            {
              vname: "claim_list",
              type: "List Uint256",
              value: tokenArray.slice(start, start + n)
            }
          ],
          {
            amount,
            gasPrice,
            gasLimit,
            nonce
          })
          

        let txToast = this.$toast.success("TX sending") 
        txToast = this.$styleToast(txToast, tx, `Migrating ${tokenArray.slice(start, start + n)}`, 'pending')

        await pollTx(tx)
          .then(res => {
            console.log(res)
            txToast = this.$styleToast(txToast, tx, "Confirmed", 'success')
            txToast.goAway(20000)
          })
          .catch(err => {
            console.log(err)
            txToast = this.$styleToast(txToast, tx, "Failed", 'failed')
            txToast.goAway(20000)
          })
          
      }

      
        // nonce stuff
        const { result } = await zilPay.blockchain.getBalance(this.wallet.bech32)  
        let originalNonce
        if (result) {
          originalNonce = result.nonce 
        } else {
          originalNonce = 0
        }
        let nonce = originalNonce

        //batch txs
        const leftToMigrate = tokenArray.length
        const numInBatch = 5
        console.log(`${leftToMigrate} left to migrate`)

        const callsOfBatch = Math.floor(leftToMigrate / numInBatch)
        console.log(`${callsOfBatch} callsOf ${numInBatch}`)
        console.log(`starting nonce: ${nonce}`)

        let arrayPosition = 0

        for (let i = 1; i <= callsOfBatch; i++) {
          console.log(`nonce: ${nonce + i}`)
          call(nonce + i , arrayPosition, numInBatch)
          arrayPosition = arrayPosition + numInBatch
        }

        console.log(`nonce: ${nonce + callsOfBatch + 1 }`)
        call(nonce + callsOfBatch + 1, arrayPosition, leftToMigrate % numInBatch)
    }
  },
  beforeMount() {
    if (!this.$store.state.ducks.zrc1owners.length) {
      this.$store.dispatch('ducks/fetchZRC1Owners')
      this.$store.dispatch('ducks/fetchZRC1Operators')
    }
  }
}
</script>
 
