<template>
    <div class= "w-full" :class="bg">
        <div class="container px-8 pt-14 mx-auto max-w-screen-xl md:px-0">
            <div class="flex">
                <img src="~/assets/icons/duck.svg" alt="Duck icon" class="self-center mr-2">
                <h2 class="self-center text-4xl font-semibold text-gray-300">Duck</h2>
            </div>
        </div>
        <div class="container px-8 mx-auto max-w-screen-xl md:px-0">
          <div class="flex flex-col py-8 md:flex-row space-4">
            <div class="flex flex-col space-y-4">
              <a class= "my-auto text-base text-gray-300" href="https://zilstream.com/tokens/duck">Zilstream</a>
              <a class= "my-auto text-base text-gray-300" href="https://viewblock.io/zilliqa/address/zil1c6akv8k6dqaac7ft8ezk5gr2jtxrewfw8hc27d">Viewblock</a>
            </div>
            <div class="flex flex-col mt-4 space-y-4 md:mt-0 md:ml-16">
              <a class= "my-auto text-base text-gray-300" href="https://coinmarketcap.com/currencies/duckduck/">Coingecko</a>
              <a class= "my-auto text-base text-gray-300" href="https://www.coingecko.com/en/coins/duckduck-token">CoinMarketCap</a>
            </div>
          </div>
        </div>
        <div style="border-top: 1px; border-style: solid;" :style="{'border-color': line}">
            <div class="container flex px-8 mx-auto max-w-screen-xl h-28 md:px-0">
                <a class= "self-center my-auto text-base text-gray-300">&copy; Duck Team {{ new Date().getFullYear() }}</a>
                <div class="flex flex-row self-center ml-auto space-x-6 md:space-x-2">
                    <IconDiscord />
                    <IconTwitter link="https://twitter.com/zilduck"/>
                    <IconTelegram />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      line: '#6b7280',
      bg: 'bg-gray-700'
    }
  },
  props: {
    background: {
      type: String
    }
  },
  mounted () {
    if (this.background === 'grass') {
      this.line = '#3C4B33'
      this.bg = 'bg-grass-footer'
    }
  }
}
</script>
