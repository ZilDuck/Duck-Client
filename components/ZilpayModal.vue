
<template>
  <div
    v-if="show"
    class="
      modal
      fixed
      w-full
      h-full
      top-0
      left-0
      flex
      items-center
      justify-center
    "
  >
    <div
      @click.self="close_modal()"
      class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
    ></div>

    <div
      class="
        modal-container
        bg-white
        w-11/12
        md:max-w-md
        mx-auto
        rounded-xl
        shadow-lg
        z-50
        overflow-y-auto
      "
    >
      <div class="modal-content text-left px-6">
        <div class="my-6">
          <h4 class="align-middle mr-2 text-xl font-extrabold text-gray-600 ml-2">Zilpay not found</h4>

          <div class="flex flex-row my-2">
            <h4 class="align-middle mr-2 text-lg font-semibold text-gray-800 ml-2">
               Ensure your selected network is <a class="text-blue-400">{{ network }}</a>
               and you have the <a href="https://zilpay.io/" class="underline">extension</a> installed
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    wallet() {
      return this.$store.state.wallet.wallet;
    },
    zilPay() {
      if (process.browser) {
        if (window.zilPay) return window.zilPay;
      }
    },
    network () {
      if (process.browser) {
        return process.env.current_network
      }
    }
  },
  methods: {
    close_modal() {
      this.$emit("close");
    },
  },
  props: {
    show: Boolean,
  }
}
</script>
