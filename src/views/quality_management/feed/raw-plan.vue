<template>
  <div class="raw-plan-style">
    <!-- 投料计划 -->
    <h4>本日班次密炼生产计划</h4>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 50%;"
      border
    >
      <el-table-column
        label="序号"
        width="50"
        type="index"
      />
      <el-table-column
        prop="date_now"
        label="生产日期"
        min-width="20"
      />
      <el-table-column
        prop="classes"
        label="班次"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="密炼机台号"
        min-width="20"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
        min-width="30"
      />
      <el-table-column
        prop="plan_trains"
        label="计划车数"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="20"
      />
    </el-table>
    <h4>炭黑罐投料提示信息</h4>
    <el-row class="dialogPlanAdd">
      <el-col :span="1" class="leftEquip">
        <el-checkbox
          v-if="equips.length>0"
          v-model="checkAll"
          :disabled="disabledEquip"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <div
          v-for="item in equips"
          :key="item.id"
          style="position:relative"
        >
          <el-checkbox
            v-model="item.checkbox"
            :label="item.id"
            :disabled="disabledEquip"
            @change="changeEquip($event,item)"
            @click.native="clickEquip"
          >
            {{ item.equip_no }}
          </el-checkbox>
          <!-- <span
            v-if="item.checkbox"
            style="position:absolute;top:0;left:0;width:100%;height:100%;background:transparent;z-index:5"
            @click="changeEquip(false,item)"
          /> -->
        </div>
      <!-- </div> -->
      </el-col>
      <el-col
        v-loading="addPlanArrLoading"
        :span="23"
        class="rightContent"
      >
        <div
          v-for="(tableItem,key) in addPlanArr"
          :key="key"
          style="margin-left:10px;"
          element-loading-text="拼命加载中"
        >
          <div v-for="(tableItem1,key1) in tableItem" :key="key1" class="tableTop">
            <div>
              <el-button v-permission="['carbon_feeding_prompt', 'add']" style="float:right;margin:5px 10px" size="small" :disabled="loadingBtn" @click="saveFun(key,key1)">保存</el-button>
              {{ key1 }}
            </div>
            <el-table
              :key="key1"
              :data="tableItem1"
              border
              width="100%"
              :cell-class-name="tableRowClassName"
              :span-method="objectSpanMethod"
            >
              >
              <el-table-column label="炭黑罐号" min-width="20">
                <template slot-scope="scope">
                  {{ scope.row.tank_no }}
                </template>
              </el-table-column>
              <el-table-column
                min-width="20"
                label="料罐类别"
              >
                <template slot-scope="scope">
                  {{ scope.row.tank_capacity_type ===0?'小':'大' }}
                </template>
              </el-table-column>
              <el-table-column
                label="炭黑物料名称"
                min-width="20"
              >
                <template slot-scope="scope">
                  {{ scope.row.tank_material_name }}
                </template>
              </el-table-column>
              <el-table-column
                label="料位状态"
                min-width="20"
              >
                <template slot-scope="scope">
                  {{ scope.row.tank_level_status }}
                </template>
              </el-table-column>
              <!-- <el-table-column
              label="班次补料计算值kg"
              min-width="20"
            >
              <template slot-scope="scope">
                {{ scope.row.status }}
              </template>
            </el-table-column> -->
              <!-- <el-table-column label="2小时补料计算值kg" min-width="20">
              <template slot-scope="scope">
                {{ scope.row.status }}
              </template>
            </el-table-column> -->
              <el-table-column label="补料设定值kg" min-width="30">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.feedcapacity_weight_set"
                    style="width:150px"
                    controls-position="right"
                    :min="0"
                    :max="scope.row._feedcapacity_weight_set"
                    @change="weightSetChange(tableItem1,scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="投料口" width="170">
                <template slot-scope="scope">
                  <el-select
                    v-if="!scope.row.is_no_port_one"
                    v-model="scope.row.feedport_code"
                    placeholder="请选择"
                    @change="portChange($event,scope.$index,key,key1,scope.row)"
                  >
                    <el-option
                      v-for="(item,portI) in options"
                      :key="portI"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                  <span v-else>{{ scope.row.feedport_code }}</span>
                </template>
              </el-table-column>
              <el-table-column label="投料物料信息" width="170">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.feed_material_name"
                    placeholder="请选择"
                    filterable
                    @change="MaterialChange($event,scope.$index,key,key1,scope.row)"
                    @visible-change="visibleChangeMaterial($event,scope.row)"
                  >
                    <el-option
                      v-for="(item,portI) in optionsMaterial"
                      :key="portI"
                      :label="item.zc_material__material_name"
                      :value="item.zc_material__material_name"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="是否出库" min-width="20">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.ex_warehouse_flag"
                  />
                </template>
              </el-table-column>
              <el-table-column label="投料状态" min-width="20">
                <template slot-scope="scope">
                  {{ scope.row.feed_status===0?'投料中':scope.row.feed_status===1?'投料完成':'无' }}
                </template>
              </el-table-column>
              <el-table-column
                width="160"
                label="操作"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['carbon_feeding_prompt', 'begin']"
                    size="mini"
                    type="primary"
                    :disabled="loadingBtn"
                    @click="handleStart(scope.row,key1,key,scope.$index)"
                  >开始
                  </el-button>
                  <el-button
                    v-permission="['carbon_feeding_prompt', 'end']"
                    size="mini"
                    type="primary"
                    :disabled="loadingBtn"
                    @click="handleGroupDelete(scope.row)"
                  >结束
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-alert style="color:black" title="表格字体颜色说明：红色-优先度高，密炼计划中使用到的物料，且料罐料位低的；黄色-优先度中，密炼计划中使用到的物料，且料罐料位中的；绿色-优先度中，密炼计划中未使用到的物料，且料罐料位低或中" type="success" />
    <el-dialog
      title="炭黑罐投料 出库信息确认"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="form" :model="formData" label-width="160px">
        <el-form-item label="生产机台:">
          {{ formData.equip_id }}
        </el-form-item>
        <el-form-item label="炭黑罐号:">
          {{ formData.tank_no }}
        </el-form-item>
        <el-form-item label="料罐物料:">
          {{ formData.tank_material_name }}
        </el-form-item>
        <el-form-item label="投料口:">
          {{ formData.feedport_code }}
        </el-form-item>
        <el-form-item label="投料重量（kg）:">
          {{ formData.feedcapacity_weight_set }}
        </el-form-item>
        <el-form-item label="库存数量（托）:">
          {{ formData.pallets }}
        </el-form-item>
        <el-form-item label="库库存重量（kg）:">
          {{ formData.total_weight }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitForm(false,formData.id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { equipUrl } from '@/api/base_w'
import { zcMaterialsThoughMes } from '@/api/base_w_two'
import { feedCapacityPlan, carbonFeedingPrompt, carOutCheck, carbonOutTask } from '@/api/base_w_four'
export default {
  name: 'RawPlan',
  data() {
    return {
      tableData: [],
      equips: [],
      checkAll: [],
      disabledEquip: false,
      addPlanArrLoading: false,
      addPlanArr: [],
      options: [
        { name: '掺混1-1号口' },
        { name: '掺混1-2号口' },
        { name: '掺混2-1号口' },
        { name: '掺混2-2号口' },
        { name: '炭黑' },
        { name: '白炭黑' }
      ],
      optionsMaterial: [],
      dialogVisible: false,
      formData: {},
      loading: true,
      loadingBtn: false
    }
  },
  created() {
    this.getEquipList()
    this.getFeedingPort()
  },
  methods: {
    async getEquipList() {
      try {
        const equipData = await equipUrl('get', { params: { all: 1, category_name: '密炼设备' }})
        this.equips = equipData.results
      } catch (e) {
        //
      }
    },
    async getFeedingPort() {
      try {
        const data = await feedCapacityPlan('get')
        this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getOptionsMaterial(row) {
      try {
        const DATA = await zcMaterialsThoughMes('get', null, { params: { material_name: row.tank_material_name }})
        this.optionsMaterial = DATA.results || []
      } catch (e) {
        //
      }
    },
    async handleCheckAllChange(val) {
      let work_schedule = []
      const arr = []
      if (val) {
        // 获取全部机台数据全部循环  this.addPlanArr不存在的就push
        work_schedule = await this.getInfoFun(false)

        for (const key in work_schedule) {
          if (Object.hasOwnProperty.call(work_schedule, key)) {
            const element = work_schedule[key]
            arr.push({ [key]: element })
          }
        }
        // console.log(arr, 'work_schedule')
        this.addPlanArr = arr
      }

      this.equips.forEach(D => {
        if (val) {
          D.checkbox = true
        } else {
          D.checkbox = false
          this.addPlanArr = []
        }
      })

      // console.log(this.addPlanArr, 2222)
    },
    async changeEquip(val, row) {
      if (val) {
        const work_schedule = await this.getInfoFun(row) || { [row.equip_no]: [] }
        // this.visibleChange(row.id, row.category, work_schedule)
        this.addPlanArr.push(work_schedule)
      } else {
        const newAddPlanArr = []
        const addPlanArr = JSON.parse(JSON.stringify(this.addPlanArr))
        for (const iterator of addPlanArr) {
          if (Object.keys(iterator)[0] !== row.equip_no) {
            newAddPlanArr.push(iterator)
          }
        }
        row.checkbox = false
        this.addPlanArr = newAddPlanArr
      }
    },
    async getInfoFun(row) {
      try {
        this.disabledEquip = true
        let obj = {}
        if (row) {
          obj = { equip_id: row.equip_no }
        } else {
          delete obj.equip_id
          obj = { all: 1 }
        }
        this.addPlanArrLoading = true
        const data = await carbonFeedingPrompt('get', null, { params: obj })
        this.disabledEquip = false
        this.addPlanArrLoading = false
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            data[key].forEach(d => {
              d.is_no_port_one = d.is_no_port_one ? d.is_no_port_one : false
              this.$set(d, '_feedcapacity_weight_set', d.feedcapacity_weight_set)
            })
          }
        }
        return data
      } catch (e) {
        this.disabledEquip = false
        this.addPlanArrLoading = false
      }
    },
    MaterialChange(val, index, faIndex, zo, row) {
      const arr = this.optionsMaterial.filter(d => d.zc_material__material_name === val)
      if (arr.length > 0) {
        row.wlxxid = arr[0].zc_material__wlxxid
      }
    },
    visibleChangeMaterial(bool, row) {
      if (bool) {
        this.optionsMaterial = []
        this.getOptionsMaterial(row)
      }
    },
    portChange(val, index, faindex, key1, row) {
      const row1 = this.addPlanArr[faindex][key1][index + 1] || null
      const _row = JSON.parse(JSON.stringify(row))
      // is_no_port_one 表示是附属添加的数据
      if (val === '掺混1-1号口') {
        _row.feedport_code = '掺混1-2号口'
        _row.is_no_port_one = true
        _row.feed_change = 2
        row.feed_change = 2
      } else if (val === '掺混1-2号口') {
        _row.feedport_code = '掺混1-1号口'
        _row.is_no_port_one = true
        _row.feed_change = 2
        row.feed_change = 2
      } else if (val === '掺混2-1号口') {
        _row.feedport_code = '掺混2-2号口'
        _row.is_no_port_one = true
        _row.feed_change = 2
        row.feed_change = 2
      } else if (val === '掺混2-2号口') {
        _row.feedport_code = '掺混2-1号口'
        _row.is_no_port_one = true
        _row.feed_change = 2
        row.feed_change = 2
      } else {
        if (row1 && row1.is_no_port_one) {
          this.addPlanArr[faindex][key1].splice(index + 1, 1)
          row.feed_change = 1
          _row.feed_change = 1
          row.is_no_port_one = false
          _row.is_no_port_one = false
        }
        return
      }
      if (row1 && row1.is_no_port_one) {
        this.addPlanArr[faindex][key1][index + 1].feedport_code = _row.feedport_code
        return
      }
      this.addPlanArr[faindex][key1].splice(index + 1, 0, _row)
      // console.log(this.addPlanArr, 8888)
    },
    clickEquip() {},
    weightSetChange(arr, row) {
      arr.forEach(d => {
        if (d.tank_no === row.tank_no) {
          d.feedcapacity_weight_set = row.feedcapacity_weight_set
        }
      })
    },
    handleGroupDelete(row) {
      this.$confirm(`是否确定结束?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadingBtn = true
        carbonFeedingPrompt('put', row.id, { data: { feed_status: 1 }})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            row.feed_status = 1
            this.loadingBtn = false
          }).catch(e => {
            this.loadingBtn = false
          })
      })
    },
    async handleStart(row, zo, faIndex, index) {
      try {
        if (!row.feed_material_name || !row.feedport_code) {
          this.$message({ type: 'error', message: '投料口或投入物料未选择!' })
          return
        }
        const obj = JSON.parse(JSON.stringify(row))
        obj.equip_id = zo
        delete obj.is_plan_used
        delete obj._feedcapacity_weight_set
        // delete obj.id
        this.loadingBtn = true
        const data = await carOutCheck('post', null, { data: obj })
        this.loadingBtn = false
        if (data === 'NO') {
          this.formData = {}
          this.submitForm(true, obj.id, row)
        } else {
          obj.feedcapacity_weight_set = Number(obj.feedcapacity_weight_set) > Number(data.total_weight) ? data.total_weight : obj.feedcapacity_weight_set
          this.formData = Object.assign({ total_weight: data.total_weight, pallets: data.pallets }, obj)
          this.formData._faIdex = faIndex
          this.formData._index = index
          this.dialogVisible = true
        }
      } catch (e) {
        this.loadingBtn = false
      }
    },
    submitForm(bool, id, row) {
      // bool 等于true 出库关闭得情况
      const _value = bool ? '请预先切换好管路，点击确定后解包房将开始投料，是否继续？'
        : '请预先切换好管路，点击确定后炭黑料包将从炭黑立库里输出，解包房将开始投料，是否继续？'
      const _api = bool ? carbonFeedingPrompt : carbonOutTask
      let obj = {}
      if (bool) {
        obj = { feed_status: 0 }
      } else {
        obj = Object.assign({ total_weight: this.formData.total_weight,
          material_name: this.addPlanArr[this.formData._faIdex][this.formData.equip_id][this.formData._index].feed_material_name,
          feedcapacity_weight_set: this.formData.feedcapacity_weight_set }, this.addPlanArr[this.formData._faIdex][this.formData.equip_id][this.formData._index])
      }
      this.$confirm(_value, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadingBtn = true
        _api(bool ? 'put' : 'post', bool ? id : '', { data: obj })
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            if (bool) {
              row.feed_status = 0
            } else {
              this.addPlanArr[this.formData._faIdex][this.formData.equip_id][this.formData._index].feed_status = 0
            }
            this.loadingBtn = false
            this.dialogVisible = false
          }).catch(e => {
            this.loadingBtn = false
          })
      })
    },
    async startFun() {
      // try {
      //   await carbonFeedingPrompt('post', null, { data: { }})
      // } catch (e) {
      //   //
      // }
    },
    async saveFun(faIndex, zo) {
      try {
        let arr = []
        for (const key in this.addPlanArr[faIndex]) {
          if (Object.hasOwnProperty.call(this.addPlanArr[faIndex], key)) {
            const element = this.addPlanArr[faIndex][key]
            arr = element
          }
        }
        arr.forEach(d => {
          d.equip_id = zo
          // if (!d.feedport_code || !d.feed_material_name) {
          //   throw new Error('投料口或投入物料未选择!')
          // }
        })
        if (this.addPlanArr[faIndex][zo].length === 0) {
          this.$message.info('暂无数据保存')
          return
        }
        this.loadingBtn = true
        await carbonFeedingPrompt('post', null, { data: arr })
        this.$message.success('保存成功')
        const work_schedule = await this.getInfoFun({ equip_no: zo })
        this.addPlanArr[faIndex][zo] = work_schedule[zo]
        this.loadingBtn = false
      } catch (e) {
        this.loadingBtn = false
        if (e.message) {
          this.$message.info(e.message)
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 5) {
        if (row.feed_change === 2) {
          if (!row.is_no_port_one) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    tableRowClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex > 4) {
        return
      }
      if (row.is_plan_used) {
        if (row.tank_level_status === '低位') {
          return 'danger-row'
        } else if (row.tank_level_status === '中位') {
          return 'wait-row'
        }
      } else {
        if (row.tank_level_status === '低位' || row.tank_level_status === '中位') {
          return 'green-row'
        }
      }
      return ''
    }
  }
}
</script>
<style lang="scss">
.raw-plan-style{
  ::-webkit-scrollbar {
    width: 1px;
}
::-webkit-scrollbar-button {
    background: #ccc
}
::-webkit-scrollbar-track-piece {
    background: #888
}
::-webkit-scrollbar-thumb {
    background: #eee
}
 .wait-row{
       background: rgb(255, 255, 0) !important;
 }
 .green-row{
       background: rgb(149, 240, 4) !important;
 }
 .danger-row{
    background: rgb(217, 0, 25)  !important;
 }
   .el-form-item{
     margin-bottom:0;
   }
 .tableTop{
   width:100%;
   text-align: center;
   line-height: 40px;
   overflow: hidden;
   background: #0bbd0b;
   color:#fff;
    border: 1px solid #EBEEF5;
    border-bottom: none;
 }
   .dialogPlanAdd{
    // display: flex;
    // min-width: 800px;
      .leftEquip{
        .el-checkbox{
          display: block;
          padding: 0 0 10px 0;
        }
      }
      .rightContent{
        padding-left:20px;
        max-height:800px;
        overflow-y: scroll;
      }
 }
}

</style>
