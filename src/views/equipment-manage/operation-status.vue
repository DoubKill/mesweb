<template>
  <div>
    <!-- 设备运行现况 -->
    <div class="head-top">
      <img src="@/assets/logoHeard.png" alt="">
      <h2>中策橡胶安吉炼胶设备监控</h2>
      <h3>{{ currentTime }}</h3>
    </div>
    <div class="conter-style">
      <div v-for="item in 10" :key="item" class="conter-style-box">
        77
      </div>
    </div>
  </div>
</template>

<script>
import { setDate } from '@/utils'
export default {
  name: 'EquipmentHome',
  data() {
    return {
      currentTime: setDate(null, true)
    }
  },
  created() {
    setInterval(d => {
      this.currentTime = setDate(null, true)
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
  .head-top{
    display: flex;
    justify-content: space-between ;
     align-items: center;
  }
  .conter-style{
    text-align: center;
    margin-top:20px;
    // display: flex;
    // justify-content: space-between ;
    //  align-items: center;

      .conter-style-box{
        text-align: left;
        display: inline-block;
         margin-bottom:20px;
         box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
         width:23%;
         flex:1;
         height:200px;
         margin-right: 20px;
      }
  }
</style>
