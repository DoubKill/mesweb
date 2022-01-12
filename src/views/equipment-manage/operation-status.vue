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
    <el-divider content-position="left">密炼设备</el-divider>
    <div class="conter-style">
      <div
        v-for="item in 10"
        :key="item"
        class="conter-style-box"
      >
        <div style="display:flex">
          <div class="icon-fa-style">
            <!-- <i class="equipment icon-style" /> -->
            <span class="icon-style" style="border:5px solid red">
              <!-- <svg-icon icon-class="equipment" /> -->
              <img src="@/assets/mixerEquipment.png" alt="" srcset="">
            </span>
            <span style="font-size:19px;font-weight:700">B01</span>
          </div>
          <div style="inline-block;flex:1;margin:0px;">
            <div class="right-font-style">
              <span>停机时间(分)：<span class="setFont">656565</span></span>
            </div>
            <div class="right-font-style">
              <span>当日产量：</span>
            </div>
            <div class="right-font-style">
              <span>工单处理：</span>
            </div>
            <div class="right-font-style">
              <span>设备状态：</span>
            </div>
          </div>
        </div>
        <div>
          <div class="bottom-font-style">异常信息:</div>
        </div>
      </div>
    </div>

    <el-divider content-position="left">称量设备</el-divider>
    <div class="conter-style">
      <div
        v-for="item in 10"
        :key="item"
        class="conter-style-box"
      >
        <div style="display:flex">
          <div class="icon-fa-style">
            <!-- <i class="equipment icon-style" /> -->
            <span class="icon-style" :style="{border:'5px solid #30c030'}">
              <!-- <svg-icon icon-class="equipment" /> -->
              <img src="@/assets/S-equipment.png" alt="" srcset="">
            </span>
            <span style="font-size:19px;font-weight:700">B01</span>
          </div>
          <div style="inline-block;flex:1;margin:0px;">
            <div class="right-font-style">
              <span>时间：222</span>
            </div>
            <div class="right-font-style">
              <span>时间：</span>
            </div>
            <div class="right-font-style">
              <span>时间：</span>
            </div>
            <div class="right-font-style">
              <span>时间：</span>
            </div>
          </div>
        </div>
        <div>
          <div class="bottom-font-style">异常信息:</div>
        </div>
      </div>
    </div>

    <el-divider content-position="left">值班人员</el-divider>
    <h3 style="display:inline-block;margin-left:20px">当班负责人：汪玉琼</h3>
    <h3 style="display:inline-block;margin-left:50px">当班负责人：汪玉琼</h3>
    <h3 style="display:inline-block;margin-left:50px">当班负责人：汪玉琼</h3>
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
         border-radius: 15px;
         box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
         width:19%;
         height:172px;
         margin-right: 14px;
      }
  }
  .icon-fa-style{
    width:90px;
    // height:100px;
    text-align: center;
    border-radius: 15px;
    border:1px solid #999;
    margin:6px;
    padding-top:10px;
    padding-bottom:5px;
    display: inline-block;
    overflow: hidden;
    .icon-style{
      width: 80%;
      height:80px;
      display: inline-block;
      img{
         width: 100%;
         height: 100%;
      }
    }
  }
    .right-font-style{
      margin-left:10px;
      margin-top:15px;
      display:flex;
      // justify-content: space-around;
    }
    .bottom-font-style{
      margin-left:16px;
      margin-top:10px;
    }

    .el-divider--horizontal{
          height:4px;
    }
    .el-divider{
      background-color: rgb(0,0,255);
    }
    .el-divider__text.is-left{
      left:0;
      font-size: 18px;
      font-weight: 700;
    }
    .setFont{
      font-size: 18px;
      font-weight:700;
    }
</style>
