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
        <div style="display:flex">
          <div class="icon-fa-style">
            <i class="el-icon-truck icon-style" />
            <span>B01</span>
          </div>
          <div style="inline-block;flex:1;margin:6px;">
            <div style="display:flex;justify-content: space-around;margin-top:10px">
              <span>时间：</span>
              <span>温度：</span>
            </div>
            <div style="display:flex;justify-content: space-around;margin-top:10px">
              <span>时间：</span>
              <span>温度：</span>
            </div>
            <div style="display:flex;justify-content: space-around;margin-top:10px">
              <span>时间：</span>
              <span>温度：</span>
            </div>
          </div>
        </div>
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
    margin-top:20px;
    // text-align:center;
      .conter-style-box{
        text-align: left;
        display: inline-block;
         margin-bottom:20px;
         box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
         width:23%;
         height:200px;
         margin-right: 20px;
      }
  }
  .icon-fa-style{
    width:80px;
    height:80px;
    text-align: center;
    border:1px solid;
    margin:6px;
    display: inline-block;
    .icon-style{
      width: 100%;
      font-size: 60px;
    }
  }
</style>
