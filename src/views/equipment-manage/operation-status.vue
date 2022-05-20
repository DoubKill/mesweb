<template>
  <div v-loading="loading" :style="{padding:this.$route.path === '/operation-status'?'15px':0}">
    <!-- 设备运行现况 -->
    <div class="head-top">
      <img src="@/assets/logoHeard.png" alt="">
      <h2>中策橡胶安吉准备分厂 设备监控系统</h2>
      <h3>{{ currentTime }}</h3>
    </div>
    <el-divider content-position="left">密炼设备</el-divider>
    <div class="conter-style">
      <div
        v-for="item in Bequip"
        :key="item.equip_no"
        class="conter-style-box"
      >
        <div style="display:flex">
          <div class="icon-fa-style">
            <span
              class="icon-style"
              :style="{border:'5px solid'
                       ,borderColor:item.state==='运行中'?normalColor:item.state==='设备故障'?faultColor:haltColor}"
            >
              <div style="position: relative;">
                <img src="@/assets/mixerEquipment.png" alt="" srcset="">
                <img v-if="item.is_repairing" class="underRepairImg" src="@/assets/underRepair.png" alt="" srcset="">
              </div>
            </span>
            <span style="font-size:19px;font-weight:700">{{ item.equip_no }}</span>
          </div>
          <div style="inline-block;flex:1;margin:0px;">
            <div class="right-font-style">
              <span style="width:95px">停机时间(分)：</span><span class="setFont">{{ item.downtime }}</span>
            </div>
            <div class="right-font-style">
              <span style="width:95px">当日产量：</span><span class="setFont">{{ item.plan_actual_data }}</span>
            </div>
            <div class="right-font-style">
              <span style="width:95px">工单处理：</span><span class="setFont">{{ item.apply_orders }}</span>
            </div>
            <div class="right-font-style">
              <span style="width:95px">设备状态：</span><span
                class="setFont"
                :style="{color:item.state==='运行中'?normalColor:item.state==='设备故障'?faultColor:haltColor}"
              >{{ item.state }}</span>
            </div>
          </div>
        </div>
        <div>
          <div class="bottom-font-style">
            <span style="width:95px">异常信息：</span><span class="setFont" :style="{color:item.state==='运行中'?normalColor:item.state==='设备故障'?faultColor:haltColor}">{{ item.error_reason }}</span>
          </div>
        </div>
      </div>
    </div>

    <el-divider content-position="left">称量设备</el-divider>
    <div class="conter-style">
      <div
        v-for="item in Wequip"
        :key="item.equip_no"
        class="conter-style-box"
      >
        <div style="display:flex">
          <div class="icon-fa-style">
            <span
              class="icon-style"
              :style="{border:'5px solid'
                       ,borderColor:item.state==='运行中'?normalColor:item.state==='设备故障'?faultColor:haltColor}"
            >
              <div style="position: relative;width:100%;height:100%">
                <img v-if="item.equip_no[0]==='S'" src="@/assets/S-equipment.png" alt="" srcset="">
                <img v-else src="@/assets/F-equipment.png" alt="" srcset="">
                <img v-if="item.is_repairing" class="underRepairImg" src="@/assets/underRepair.png" alt="" srcset="">
              </div>
            </span>
            <span style="font-size:19px;font-weight:700">{{ item.equip_no }}</span>
          </div>
          <div style="inline-block;flex:1;margin:0px;">
            <div class="right-font-style">
              <span style="width:95px">停机时间(分)：</span><span class="setFont">{{ item.downtime }}</span>
            </div>
            <div class="right-font-style">
              <span style="width:95px">当日产量：</span><span class="setFont">{{ item.plan_actual_data }}</span>
            </div>
            <div class="right-font-style">
              <span style="width:95px">工单处理：</span><span class="setFont">{{ item.apply_orders }}</span>
            </div>
            <div class="right-font-style">
              <span style="width:95px">设备状态：</span><span
                class="setFont"
                :style="{color:item.state==='运行中'?normalColor:item.state==='设备故障'?faultColor:haltColor}"
              >{{ item.state }}</span>
            </div>
          </div>
        </div>
        <div>
          <div class="bottom-font-style">
            <span style="width:95px">异常信息：</span><span class="setFont" :style="{color:item.state==='运行中'?normalColor:item.state==='设备故障'?faultColor:haltColor}">{{ item.error_reason }}</span>
          </div>
        </div>
      </div>
    </div>

    <el-divider content-position="left">值班人员</el-divider>
    <h3 style="display:inline-block;margin-left:20px">当班负责人：{{ options.incharge_user }}</h3>
    <h3 style="display:inline-block;margin-left:50px">当班维修人员：{{ options.repair_user }}</h3>
    <h3 style="display:inline-block;margin-left:50px">当班包干人员：{{ options.responsor_user }}</h3>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import { equipmentIndex } from '@/api/base_w_five'
export default {
  name: 'EquipmentHome',
  data() {
    return {
      currentTime: setDate(null, true),
      loading: true,
      options: {},
      Wequip: [],
      Bequip: [],
      faultColor: 'red',
      haltColor: 'rgb(245, 154, 35)',
      normalColor: 'rgb(56, 215, 72)'
    }
  },
  created() {
    setInterval(d => {
      this.currentTime = setDate(null, true)
    }, 1000)
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipmentIndex('get')
        this.options = data || []
        this.Wequip = this.options.equip_data.filter(d => d.equip_catetory === '称量设备')
        this.Bequip = this.options.equip_data.filter(d => d.equip_catetory === '密炼设备')
      } catch (e) {
        //
      }
      this.loading = false
    }
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
         height:166px;
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
      height:73px;
      display: inline-block;
      img{
         width: 100%;
         height: 100%;
      }
    }
  }
    .right-font-style{
      margin-left:10px;
      margin-top:10px;
      display:flex;
      // justify-content: space-around;
    }
    .bottom-font-style{
      margin-left:16px;
      margin-top:10px;
    }

    .el-divider--horizontal{
          height:3px;
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
      word-wrap: break-word;
    word-break: normal;
    }
    .fault-color{
      color: red;
    }
    .halt-color{
      color: rgb(245,154,35);
    }
    .normal-color{
      color: rgb(56, 215, 72);
    }
    .underRepairImg{
      position: absolute;
      width: 60% !important;
      height: 60% !important;
      bottom:50%;
      top:50%;
      left:50%;
       transform: translate(-50%,-50%);
    }
</style>
