<template>
  <div>
    <!-- 设备运行现况 -->
    <div class="head-top">
      <img
        src="@/assets/logoHeard.png"
        alt=""
      >
      <h2>中策橡胶安吉炼胶设备监控</h2>
      <h3>{{ currentTime }}</h3>
    </div>
    <div class="conter-style">
      <div
        v-for="item in 10"
        :key="item"
        class="conter-style-box"
      >
        <div style="display:flex">
          <div class="icon-fa-style">
            <!-- <i class="equipment icon-style" /> -->
            <span class="icon-style">
              <svg-icon icon-class="equipment" />
            </span>
            <span>B01</span>
          </div>
          <div style="inline-block;flex:1;margin:0px;">
            <div class="right-font-style">
              <span>时间：</span>
              <span>温度：</span>
            </div>
            <div class="right-font-style">
              <span>时间：</span>
              <span>温度：</span>
            </div>
            <div class="right-font-style">
              <span>时间：</span>
              <span>温度：</span>
            </div>
          </div>
        </div>
        <div>
          <div class="bottom-font-style">时间：</div>
          <div class="bottom-font-style">温度：</div>
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
    margin-left:10px;
    margin-top:20px;
      .conter-style-box{
        text-align: left;
        display: inline-block;
         margin-bottom:15px;
         box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
         width:24%;
         height:180px;
         margin-right: 14px;
      }
  }
  .icon-fa-style{
    width:80px;
    height:90px;
    text-align: center;
    border-radius: 15px;
    border:1px solid;
    margin:6px;
    display: inline-block;
    .icon-style{
      width: 100%;
      font-size: 60px;
    }
  }
    .right-font-style{
      display:flex;
      justify-content: space-around;
      margin-top:10px
    }
    .bottom-font-style{
      margin-left:6px;
      margin-top:10px;
    }
</style>
