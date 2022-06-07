<template>
  <div v-loading="loading" :style="{padding:this.$route.path === '/operation-status'?'15px':0}" :class="['operation-status',bigScreen?'bigScreen':'']">
    <!-- 设备运行现况 -->

    <div class="head-top">
      <img src="@/assets/logoHeard.png" alt="">
      <!-- <h2>中策橡胶安吉准备分厂 设备监控系统</h2> -->
      <div v-if="bigScreen" class="host-body">
        <div class="d-flex jc-center">
          <dv-decoration-10 style="width:500px;height:.0625rem;" />
          <div class="d-flex jc-center">
            <dv-decoration-8 :color="['#568aea', '#000000']" style="width:80px;height:70px" />
            <div class="title">
              <h2>中策橡胶安吉准备分厂 设备监控系统</h2>
              <dv-decoration-6
                class="title-bototm"
                style="height:65px"
                :reverse="true"
                :color="['#50e3c2', '#67a1e5']"
              />
            </div>
            <dv-decoration-8
              :reverse="true"
              :color="['#568aea', '#000000']"
              style="width:80px;height:70px"
            />
          </div>
          <dv-decoration-10 style="width:500px;height:.05rem; transform: rotateY(180deg);" />
        </div>
      </div>
      <h2 v-else>中策橡胶安吉准备分厂 设备监控系统</h2>
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
                       ,borderImage:item.state==='运行中'?normalColorB:item.state==='生产停机'?haltColorB:faultColorB}"
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
              <span style="width:95px">停机时间(分)：</span><span class="setFont">{{ item.breakdown_time }}/{{ item.halt_time }}</span>
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
                :style="{color:item.state==='运行中'?normalColor:item.state==='生产停机'?haltColor:faultColor}"
              >{{ item.state }}</span>
            </div>
          </div>
        </div>
        <div class="bottom-font-style" style="cursor: pointer;" @click="showDialog(item)">
          <span class="setFont" :style="{color:item.state==='运行中'?normalColor:item.state==='生产停机'?haltColor:faultColor}">
            <span v-if="item.state==='运行中'" style="width:95px">{{ item.current_product }}</span>
            <span v-else style="width:95px">({{ item.error_minutes }}分钟)
              {{ item.error_reason }}
            </span>
          </span>
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
                       ,borderImage:item.state==='运行中'?normalColorB:item.state==='生产停机'?haltColorB:faultColorB}"
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
              <span style="width:95px">停机时间(分)：</span><span class="setFont">{{ item.breakdown_time }}/{{ item.halt_time }}</span>
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
                :style="{color:item.state==='运行中'?normalColor:item.state==='生产停机'?haltColor:faultColor}"
              >{{ item.state }}</span>
            </div>
          </div>
        </div>
        <div class="bottom-font-style" style="cursor: pointer;" @click="showDialog(item)">
          <span class="setFont" :style="{color:item.state==='运行中'?normalColor:item.state==='生产停机'?haltColor:faultColor}">
            <span v-if="item.state==='运行中'" style="width:95px">{{ item.current_product }}</span>
            <span v-else style="width:95px">({{ item.error_minutes }})
              {{ item.error_reason }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- <el-divider content-position="left">值班人员</el-divider>
    <h3 style="display:inline-block;margin-left:20px">当班负责人：{{ options.incharge_user }}</h3>
    <h3 style="display:inline-block;margin-left:50px">当班维修人员：{{ options.repair_user }}</h3>
    <h3 style="display:inline-block;margin-left:50px">当班包干人员：{{ options.responsor_user }}</h3> -->

    <el-dialog
      title="设备故障维修详情"
      width="80%"
      :visible.sync="dialogVisible"
    >
      <repair :rule-form="ruleForm" :is-home="true" @showMaintenanceRecords="showMaintenanceRecords" @showAcceptanceRecords="showAcceptanceRecords" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="验收记录"
      :visible.sync="dialogVisibleResult"
      width="500"
    >
      <el-form
        :model="resultForm"
        label-width="150px"
      >
        <el-form-item label="验收说明">
          <el-input
            v-model="resultForm.result_accept_desc"
            disabled
            style="width:250px"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <template v-for="(item, index) in resultForm.result_accept_graph_url">
            <el-image
              v-if="resultForm.result_accept_graph_url.length>0"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            />
          </template>
          <div v-if="resultForm.result_accept_graph_url.length===0">
            暂无图片
          </div>
        </el-form-item>
        <el-form-item label="上传视频">
          <template v-for="(item, index) in resultForm.result_accept_video_url">
            <video
              v-if="resultForm.result_accept_video_url.length>0"
              :key="index"
              style="width:600px;height:300px"
              controls="controls"
              :src="item"
            />
          </template>
          <div v-if="resultForm.result_accept_video_url.length===0">
            暂无视频
          </div>
        </el-form-item>
        <el-form-item label="验收结论" prop="result_accept_result">
          <el-radio-group v-model="resultForm.result_accept_result" disabled>
            <el-radio label="合格">合格</el-radio>
            <el-radio label="不合格">不合格</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleResult=false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="查看处理记录"
      :visible.sync="dialogVisible1"
      width="50%"
    >
      <el-form
        ref="ruleFormHandle"
        :model="creatOrder1"
        label-width="150px"
      >
        <el-form-item label="计划/报修名称">
          <el-input
            v-model="creatOrder1.plan_name"
            style="width:250px"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="工单编号">
          <el-input
            v-model="creatOrder1.work_order_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="机台">
          <el-input
            v-model="creatOrder1.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="维修标准/故障原因">
          <el-input
            v-if="creatOrder1.equip_maintenance_standard"
            v-model="creatOrder1.equip_maintenance_standard_name"
            :disabled="true"
            style="width:250px"
          />
          <el-input
            v-if="creatOrder1.equip_repair_standard"
            v-model="creatOrder1.equip_repair_standard_name"
            :disabled="true"
            style="width:250px"
          />
          <el-input
            v-if="creatOrder1.result_fault_cause"
            v-model="creatOrder1.result_fault_cause_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="故障详情描述" prop="note">
          <el-input
            v-model="creatOrder1.result_fault_desc"
            :disabled="true"
            type="textarea"
            style="width:250px"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="实际维修标准">
          <el-input
            v-if="creatOrder1.work_type==='维修'"
            v-model="creatOrder1.result_repair_standard_name"
            style="width:250px"
            :disabled="true"
          />
          <el-input
            v-if="creatOrder1.work_type!=='维修'"
            v-model="creatOrder1.result_maintenance_standard_name"
            style="width:250px"
            :disabled="true"
          />

          <el-table
            :data="creatOrder1.work_content"
            border
            style="width: 651px"
          >
            <el-table-column
              label="序号"
              prop="job_item_sequence"
              width="50"
            />
            <el-table-column
              prop="job_item_content"
              label="作业明细"
              width="200"
            />
            <el-table-column
              prop="job_item_check_standard"
              label="判断标准"
              width="200"
            />
            <el-table-column
              prop="operation_result"
              label="处理结果"
              width="200"
            />
          </el-table>
        </el-form-item>
        <el-form-item label="维修备注">
          <el-input
            v-model="creatOrder1.result_repair_desc"
            :disabled="true"
            style="width:250px"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <template v-for="(item, index) in creatOrder1.result_repair_graph_url ">
            <el-image
              v-if="creatOrder1.result_repair_graph_url.length>0"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            />
          </template>
          <div v-if="creatOrder1.result_repair_graph_url.length===0">
            暂无图片
          </div>
        </el-form-item>
        <el-form-item label="上传视频">
          <template v-for="(item, index) in creatOrder1.result_repair_video_url">
            <video
              v-if="creatOrder1.result_repair_video_url.length>0"
              :key="index"
              style="width:600px;height:300px"
              controls="controls"
              :src="item"
            />
          </template>
          <div v-if="creatOrder1.result_repair_video_url.length===0">
            暂无视频
          </div>
        </el-form-item>
        <el-form-item label="最终故障原因" prop="result_final_fault_cause">
          <el-input
            v-model="creatOrder1.result_final_fault_cause"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="物料申请">
          <el-radio-group v-model="creatOrder1.result_material_requisition" :disabled="true">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
          <el-checkbox v-model="creatOrder1.wait_material" :disabled="true" style="margin-left:30px">等待物料</el-checkbox>
          <el-button v-if="creatOrder1.is_applyed" type="primary" style="marginLeft:30px" @click="dialogMaterial">查看物料列表</el-button>
        </el-form-item>
        <el-form-item label="是否需要外协">
          <el-radio-group v-model="creatOrder1.result_need_outsourcing" :disabled="true">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
          <el-checkbox v-model="creatOrder1.wait_outsourcing" :disabled="true" style="margin-left:30px">等待外协维修</el-checkbox>
        </el-form-item>
        <el-form-item label="维修结论" prop="result_repair_final_result">
          <el-radio-group v-model="creatOrder1.result_repair_final_result" :disabled="true">
            <el-radio label="完成">完成</el-radio>
            <el-radio label="等待">等待</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1=false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="维修物料申请"
      :visible.sync="dialogVisibleMaterial"
      width="70%"
    >
      <el-form :inline="true">
        <el-form-item label="领料申请单号">
          <el-input v-model="creatOrder1.warehouse_out_no" disabled />
        </el-form-item>
        <el-form-item label="单据状态">
          <el-input v-model="creatOrder1.out_record_status" disabled />
        </el-form-item>
      </el-form>
      <el-table
        :data="tableDataView"
        border
      >
        <el-table-column
          prop="spare_code"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="spare_name"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="equip_component_type_name"
          label="备件分类"
          min-width="20"
        />
        <el-table-column
          prop="specification"
          label="规格型号"
          min-width="20"
        />
        <el-table-column
          prop="technical_params"
          label="用途"
          min-width="20"
        />
        <el-table-column
          prop="unit"
          label="标准单位"
          min-width="20"
        />
        <el-table-column
          prop="inventory_quantity"
          label="库存数量"
          min-width="20"
        />
        <el-table-column
          prop="apply"
          label="领料数量"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model="row.apply"
              disabled
              size="small"
              :min="1"
              :max="row.inventory_quantity"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="submit_old_flag"
          label="是否交旧"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-checkbox v-model="row.submit_old_flag" disabled />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMaterial=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import { equipmentIndex } from '@/api/base_w_five'
import repair from './components/repair-dialog'
import { equipApplyRepair, equipApplyOrder, materialReq } from '@/api/jqy'
export default {
  name: 'EquipmentHome',
  components: { repair },
  data() {
    return {
      currentTime: setDate(null, true),
      loading: false,
      options: {},
      Wequip: [],
      Bequip: [],
      //   '    ;
      // border-image: linear-gradient(to bottom right, #da4242, #a25e67) 10;'
      faultColorB: 'linear-gradient(to right bottom, rgb(218, 66, 66), rgb(228 155 165)) 10 / 1 / 0 stretch',
      haltColorB: 'linear-gradient(to right bottom, rgb(245, 154, 35), rgb(183, 181, 58)) 10 / 1 / 0 stretch',
      normalColorB: 'linear-gradient(to right bottom, rgb(71 231 22), rgb(148 186 109)) 10 / 1 / 0 stretch',
      faultColor: 'red',
      haltColor: 'rgb(245, 154, 35)',
      normalColor: 'rgb(56, 215, 72)',
      dialogVisible: false,
      plan_id: null,
      list_id: null,
      ruleForm: {},
      resultForm: { result_accept_graph_url: [], result_accept_video_url: [] },
      dialogVisibleResult: false,
      dialogVisible1: false,
      creatOrder1: { result_repair_graph_url: [], result_repair_video_url: [] },
      tableDataView: [],
      dialogVisibleMaterial: false
    }
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.fullPath === '/equipment-home' || this.$route.fullPath === '/operation-status') {
          this.getList()
          this._setInterval = setInterval(d => {
            this.getList()
          }, 60000)
        } else {
          window.clearInterval(this._setInterval)
        }
      },
      deep: true, // 深度监听
      immediate: true // 第一次初始化渲染就可以监听到
    }
  },
  created() {
    this.bigScreen = this.$route.fullPath === '/operation-status'
    setInterval(d => {
      this.currentTime = setDate(null, true)
    }, 1000)
  },
  destroyed() {
    window.clearInterval(this._setInterval)
  },
  methods: {
    async getList() {
      try {
        // this.loading = true
        const data = await equipmentIndex('get')
        this.options = data || []
        this.Wequip = this.options.equip_data.filter(d => d.equip_catetory === '称量设备')
        this.Bequip = this.options.equip_data.filter(d => d.equip_catetory === '密炼设备')
        // const a = localStorage.getItem('operationList')
        // const storageObj = a ? JSON.parse(a) : null
        // if (storageObj) {
        //   this.options.equip_data.forEach(d => {
        //     if (d.halt_time < storageObj[d.equip_no]) {
        //       d.halt_time = storageObj[d.equip_no]
        //     }
        //   })
        // }
        // const obj = {}
        // this.options.equip_data.forEach(d => {
        //   this.$set(obj, d.equip_no, d.halt_time)
        // })
        // localStorage.setItem('operationList', JSON.stringify(obj))
      } catch (e) {
        //
      }
      this.loading = false
    },
    showDialog(val) {
      if (!val.repair_plan_id || this.bigScreen) {
        return
      }
      this.plan_id = val.repair_plan_id[1]
      this.list_id = val.repair_plan_id[0]
      this.dialogVisible = true
      this.repairDialog()
    },
    async repairDialog() {
      try {
        const data = await equipApplyRepair('get', null, { params: { plan_id: this.plan_id }})
        const data1 = await equipApplyOrder('get', this.list_id)
        this.ruleForm = data.results[0]
        this.ruleForm.work_order_no = data1.work_order_no
        this.ruleForm.created_username = data1.created_username
        this.ruleForm.created_date = data1.created_date
        this.ruleForm.assign_datetime = data1.assign_datetime
        this.ruleForm.receiving_user = data1.receiving_user
        this.ruleForm.receiving_datetime = data1.receiving_datetime
        this.ruleForm.repair_user = data1.repair_user
        this.ruleForm.repair_start_datetime = data1.repair_start_datetime
        this.ruleForm.repair_end_datetime = data1.repair_end_datetime
        this.ruleForm.accept_user = data1.accept_user
        this.ruleForm.accept_datetime = data1.accept_datetime
        this.resultForm = JSON.parse(JSON.stringify(data1))
        this.creatOrder1 = JSON.parse(JSON.stringify(data1))
      } catch (e) {
        //
      }
    },
    showMaintenanceRecords() {
      this.dialogVisible1 = true
    },
    showAcceptanceRecords() {
      this.dialogVisibleResult = true
    },
    async dialogMaterial() {
      if (this.creatOrder1.is_applyed) {
        const data = await materialReq('get', null, { params: { warehouse_out_no: this.creatOrder1.warehouse_out_no }})
        this.tableDataView = data || []
        this.creatOrder1.out_record_status = this.tableDataView.length > 0 ? this.tableDataView[0].out_record_status : null
        this.dialogVisibleMaterial = true
      }
    }
  }
}
</script>

<style lang="scss">

.operation-status{
   min-width:1000px;
   width: 100%;
  .d-flex{
    display: flex;
    h2{
      margin:15px;
    }
  }
  .head-top{
    display: flex;
    justify-content: space-between ;
     align-items: center;
  }
  .conter-style{
    margin-left:18px;
    margin-top:20px;
    display: flex;
    flex-wrap:wrap;
      .conter-style-box{
        text-align: left;
        display: inline-block;
         margin-bottom:15px;
         border-radius: 15px;
         box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
         width:19%;
         height:180px;
         margin-right: 16px;
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
      background-color: #4b699a;
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
}
.bigScreen{
 min-height: 100vh;
 background-image: url(../../assets/pageBg.f9f9dcd5.png);
 color:#fff;
 padding-top:30px !important;
  .el-divider{
    margin-left: 106px;
    width: 93%;
  }
     .el-divider--horizontal{
         margin:5px 0;
    }
  .el-divider__text.is-left{
    left: -96px
  }

  .el-divider__text{
    color:#fff;
    background: transparent;
  }
  .conter-style .conter-style-box{
    box-shadow: 0 2px 12px 0 #2273c8;
  }
  .conter-style{
    margin-left: 36px;
  }
  .conter-style-box{
    padding-top: 5px;
    height: 198px !important;
  }
  .bottom-font-style span{
    vertical-align: middle;
  }
}
</style>
