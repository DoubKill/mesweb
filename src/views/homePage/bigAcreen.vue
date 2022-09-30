
<template>
  <div>{{ route===1?'MES首页大屏':route===2?'设备运行现况':route===3?'混炼胶库运行综合看板':route===4?'终炼胶库运行综合看板':'' }}</div>
</template>
<script>
export default {
  name: 'HomePageMainScreen1',
  created() {
    this.route = this.$route.meta.type
    const id = this.$route.meta.type
    const _url = id === 1 ? '/homePage/index' : id === 2 ? '/operation-status' : id === 3 ? '/Outbound-Kanban/2' : id === 4 ? '/Outbound-Kanban/1' : ''
    const { href } = this.$router.resolve({
      path: _url,
      query: {}
    })
    window.open(href, '_blank')
  }
}
</script>

<style>

</style>
