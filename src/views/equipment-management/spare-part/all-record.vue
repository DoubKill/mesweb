<template>
  <div>
    {{ currentRoute }}
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  created() {
    this.currentRoute = this.$route.meta.title === '备品备件出库履历' ? 1
      : this.$route.meta.title === '备品备件入库履历' ? 2 : 3
  },
  methods: {

  }
}
</script>

<style>

</style>
