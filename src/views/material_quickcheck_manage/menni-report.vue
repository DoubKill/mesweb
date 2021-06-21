<template>
  <div>
    <!-- 原材料门尼数据上报 -->
    上报日期
    <el-date-picker
      v-model="factory_date"
      style="margin:0 10px;"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="选择日期"
      :clearable="false"
      @change="changeList"
    />
    <el-button
      v-permission="['material_report_value','add']"
      type="primary"
      :loading="loadingBtn"
      @click="addFun"
    >提交</el-button>

    <el-table
      v-loading="loading"
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        prop="no"
        label="设备编号"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="检测类型"
        min-width="20"
      >
        <!-- <template slot-scope="{row}">
          <el-select
            v-model="row.type"
            placeholder="请选择"
            filterable
            style="width:320px"
          >
            <el-option
              v-for="item in EquipCateOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="created_date"
        label="上报时间"
        min-width="20"
      />
      <el-table-column
        prop="value"
        label="测试值"
        min-width="20"
      />
      <el-table-column
        prop="qualified"
        label="是否合格"
        min-width="20"
        :formatter="(row)=>{
          return row.qualified===1?'合格':'不合格'
        }"
      />
      <el-table-column
        label="扫码关联原材料"
        width="120"
      >
        <template slot-scope="{row,$index}">
          <el-input v-model="row.aaaa" @input="scanCodeChange($event,$index,row)" />
        </template>
      </el-table-column>
      <el-table-column
        prop="material_sample_name"
        label="样品名称"
        min-width="20"
      />
      <el-table-column
        label="抽检人"
        width="130"
      >
        <template slot="header" slot-scope="scope">
          抽检人
          <el-popover
            v-model="visible"
            placement="right"
            trigger="click"
          >
            <el-select
              v-model="selectUserAll"
              placeholder="请选择用户"
              @change="changeSelectUserAll($event,scope)"
            >
              <el-option
                v-for="item in optionsUser"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              />
            </el-select>
            <i
              slot="reference"
              class="el-icon-edit slotIconStyle"
            />
          </el-popover>
        </template>
        <template slot-scope="{row}">
          <el-select
            v-model="row.sampling_user"
            placeholder="请选择用户"
            @change="changeSelectUser"
          >
            <el-option
              v-for="item in optionsUser"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="复检"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-checkbox v-model="row.re_examine" />
        </template>
      </el-table-column>
      <el-table-column
        label="收货日期"
        width="160"
      >
        <template slot="header" slot-scope="scope">
          收货日期
          <el-popover
            v-model="visible1"
            placement="right"
            trigger="click"
          >
            <el-date-picker
              v-model="factory_date_all"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :clearable="false"
              @change="changeFactoryDate($event,scope)"
            />
            <i
              slot="reference"
              class="el-icon-edit slotIconStyle"
            />
          </el-popover>
        </template>
        <template slot-scope="{row}">
          <div class="tableDateStyle">
            <el-date-picker
              v-model="row.transport_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :clearable="false"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import testTypeSelect from './components/test-type-select'
import { setDate, debounce } from '@/utils'
import { personnelsUrl } from '@/api/user'
import { materialExamineType, wmsMaterialSearch } from '@/api/base_w_three'
import { materialReportValue } from '@/api/base_w_four'
export default {
  name: 'MenniReport',
  //   components: { testTypeSelect },
  data() {
    return {
      factory_date: setDate(),
      tableData: [],
      spanArr: [],
      pos: null,
      optionsUser: [],
      visible: false,
      visible1: false,
      selectUserAll: '',
      factory_date_all: '',
      EquipCateOptions: [],
      loading: false,
      // 当前条码号
      aaaa: '',
      currentIndex: '',
      loadingBtn: false
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.selectUserAll = ''
      }
    },
    visible1(val) {
      if (!val) {
        this.factory_date_all = ''
      }
    }
  },
  created() {
    this.getUserList()
    this.equip_type_list()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await materialReportValue('get', null, { params: { created_date: this.factory_date }})
        this.tableData = data.results
        this.loading = false
        if (this.tableData.length === 0) return
        this.spanArr = []
        this.pos = null
        for (var i = 0; i < this.tableData.length; i++) {
          this.$set(this.tableData[i], 'sampling_user', null)
          this.$set(this.tableData[i], 'transport_date', null)
          this.$set(this.tableData[i], 're_examine', false)
          this.$set(this.tableData[i], 'examine_date', this.factory_date)
          if (i === 0) {
            this.spanArr.push(1)
            this.pos = 0
          } else {
            if (this.tableData[i].id === this.tableData[i - 1].id) {
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
            } else {
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
      } catch (e) { this.loading = false }
    },
    changeList(data) {
      if (!this.factory_date) {
        this.$message('请选择日期')
        return
      }
      this.getList()
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0, 1].includes(columnIndex) && this.spanArr) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    async getUserList() {
      try {
        const { results } = await personnelsUrl('get', null, { params: { all: 1 }})
        this.optionsUser = results || []
      } catch (e) {
        //
      }
    },
    async equip_type_list() {
      try {
        const equip_type_list = await materialExamineType('get', null, {
          params: { all: 1 }
        })
        this.EquipCateOptions = equip_type_list.results || []
      } catch (e) { throw new Error(e) }
    },
    typeSelect(event, row, index) {

    },
    changeSelectUserAll(val) {
      if (val) {
        this.tableData.forEach(d => {
          d.sampling_user = val
        })
      }
    },
    changeFactoryDate(val) {
      if (val) {
        this.tableData.forEach(d => {
          d.transport_date = val
        })
      }
    },
    scanCodeChange(val, index, row) {
      this.tableData[index].material_sample_name = ''
      this.aaaa = val
      this.currentIndex = index
      //   再去加载接口
      debounce(this, 'getWmsMaterial')
    },
    async getWmsMaterial() {
      try {
        const arr = await wmsMaterialSearch('get', null, { params: { tmh: this.aaaa }})
        const obj = arr[0]
        const arrT = JSON.parse(JSON.stringify(this.tableData))
        arrT[this.currentIndex].material_sample_name = obj.WLMC
        arrT[this.currentIndex].material_name = obj.WLMC
        arrT[this.currentIndex].material_batch = obj.PH
        arrT[this.currentIndex].material_supplier = obj.CD
        arrT[this.currentIndex].material_tmh = obj.TMH
        arrT[this.currentIndex].material_wlxxid = obj.WLXXID
        this.tableData = arrT
      } catch (e) { throw new Error(e) }
    },
    changeSelectUser() {},
    async addFun() {
      if (this.tableData.length === 0) {
        this.$message('暂无可提交的信息')
        return
      }
      try {
        this.tableData.forEach(d => {
          if (!d.transport_date || !d.material_sample_name) {
            throw new Error('每行：原材料、抽检人、收货日期必填')
          }
        })
      } catch (error) {
        this.$message(error.message)
        return
      }
      try {
        this.loadingBtn = true
        await materialReportValue('post', null, {
          data: this.tableData
        })
        this.$message.success('提交成功')
        this.getList()
        this.loadingBtn = false
      } catch (e) { this.loadingBtn = false }
    }
  }
}
</script>

<style lang="scss">
.tableDateStyle{
    .el-input, .el-input__inner{
        width: 150px;
    }
    .slotIconStyle{
        font-size:24px;
    }
}

</style>
