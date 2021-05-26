<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- :include="cachedViews" -->
      <div v-if="key === '/homePage'">
        <router-view :key="key" />
      </div>
      <el-card v-else class="box-card">
        <keep-alive>
          <router-view :key="key" />
        </keep-alive>
      </el-card>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.box-card{
  margin: 10px;
}
.app-main {
  /*50 = navbar  */
  /* min-height: calc(100vh - 200px); */
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  /* padding-top: 200px; */
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.el-card{
    border-top: none !important;
}
.box-card{
    margin: 14px !important;
    margin-top: 2px !important;
}
</style>
