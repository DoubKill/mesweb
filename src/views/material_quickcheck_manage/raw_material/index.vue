<template>
  <div class="app-container">
    <!-- 原材料管理 -->
    <el-form :inline="true">
      <el-form-item label="原材料名称">
        <el-input v-model="listQuery.name" clearable @input="handleFilter" />
      </el-form-item>
      <el-form-item label="样品名称">
        <el-input
          v-model="listQuery.sample_name"
          clearable
          @input="handleFilter"
        />
      </el-form-item>
      <el-form-item label="批次">
        <el-input v-model="listQuery.batch" clearable @input="handleFilter" />
      </el-form-item>
      <el-form-item label="产地">
        <el-input
          v-model="listQuery.supplier"
          clearable
          @input="handleFilter"
        />
      </el-form-item>
      <el-form-item label="是否合格">
        <el-select
          v-model="listQuery.qualified"
          clearable
          placeholder="请选择"
          @change="handleFilter"
        >
          <el-option
            v-for="item in [
              { name: '合格', value: true },
              { name: '不合格', value: false },
            ]"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原材料记录时间">
        <el-date-picker
          v-model="materialCreateTimes"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="materialCreateTimeshandleFilter"
        />
      </el-form-item>
      <!--
      <el-form-item label="检测日期">
        <el-date-picker
          v-model="listQuery.examine_date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @input="handleFilter"
        />
      </el-form-item>
      <el-form-item label="收货日期">
        <el-date-picker
          v-model="listQuery.transport_date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @input="handleFilter"
        />
      </el-form-item>
      <el-form-item label="抽样人">
        <el-input v-model="listQuery.sampling_user" clearable @input="handleFilter" />
      </el-form-item>
      <el-form-item label="记录人">
        <el-input v-model="listQuery.recorder" clearable @input="handleFilter" />
      </el-form-item>
      <el-form-item label="复检">
        <el-select
          v-model="listQuery.re_examine"
          clearable
          placeholder="请选择"
          @change="handleFilter"
        >
          <el-option
            v-for="item in [
              { name: '是', value: true },
              { name: '否', value: false },
            ]"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检测类型">
        <testTypeSelect @typeSelect="typeSelect" />
      </el-form-item> -->
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="materialList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="检测信息" width="70" type="expand" align="center">
        <template slot-scope="props">
          <el-table
            border
            fit
            highlight-current-row
            style="width: 100%"
            :data="props.row.examine_results"
          >
            <el-table-column
              label="检测日期"
              prop="examine_date"
              align="center"
            />
            <el-table-column
              label="收货日期"
              prop="transport_date"
              align="center"
            />
            <el-table-column
              label="抽样人"
              prop="sampling_user"
              align="center"
            />
            <el-table-column label="记录人" prop="recorder" align="center" />
            <el-table-column
              v-for="type in props.row.examine_types"
              :key="type"
              :label="type"
              align="center"
            >
              <template
                v-if="row.single_examine_results.find(d=>d.type_name === type)"
                slot-scope="{row}"
              >
                <span :style="{'color':row.single_examine_results.find(d=>d.type_name === type).mes_decide_qualified?'':'red'}">
                  {{ row.single_examine_results.find(d=>d.type_name === type).value }}
                </span>
                <span
                  v-if="row.single_examine_results.find(d=>d.type_name === type).interval_type===4"
                  :style="{'color':row.single_examine_results.find(d=>d.type_name === type).mes_decide_qualified?'':'red'}"
                >
                  {{ row.single_examine_results.find(d=>d.type_name === type).mes_decide_qualified?'合格':'不合格' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="复检" align="center">
              <template slot-scope="{ row }">
                <div>
                  {{ row.re_examine ? "是" : "否" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="本次判定" align="center">
              <template slot-scope="{ row }">
                <div :class="row.qualified ? '' : 'error'">
                  {{ row.qualified ? "合格" : "不合格" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="同批次最新结果" align="center">
              <template slot-scope="{ row }">
                <div :class="row.newest_qualified ? '' : 'error'">
                  {{ row.newest_qualified ? "合格" : "不合格" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              prop="create_time"
              align="center"
            />
            <el-table-column
              label="更新时间"
              prop="update_time"
              align="center"
            />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="原材料名称" prop="name" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="showLineFun(row)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="样品名称" prop="sample_name" align="center" />
      <el-table-column label="批次" prop="batch" align="center">
        <template slot-scope="{row}">
          <span v-if="row.qualified">{{ row.name }}</span>
          <el-link v-else type="primary" @click="unqualifiedFun(row, false)">{{ row.batch }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="产地" width="90" prop="supplier" align="center" />
      <el-table-column label="最新检测结果" width="80" prop="qualified" align="center">
        <template slot-scope="{ row }">
          <div :class="row.qualified ? '' : 'error'">
            {{ row.qualified ? "合格" : "不合格" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="记录时间"
        width="160"
        prop="create_time"
        align="center"
      />
      <el-table-column width="230" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="scope.row.qualified" @click="unqualifiedFun(scope.row,true)">不合格处理</el-button>
          <!-- <el-button size="mini" :disabled="scope.row.qualified" @click="downloadFun(scope.row)">下载不合格单</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :old-page="false"
      :current-page="listQuery.page"
      @currentChange="currentChange"
    />

    <el-dialog
      :title="'不合格原材料处理'+(unqualifiedObj.boolOperate?'':'单')"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form v-if="unqualifiedObj.material_data" ref="formData" v-loading="unqualifiedLoading" class="formDataClass" :model="formData" label-width="80px">
        <el-form-item label="原材料">
          {{ unqualifiedObj.material_data.name }}
        </el-form-item>
        <el-form-item label="样品名称">
          {{ unqualifiedObj.material_data.sample_name }}
        </el-form-item>
        <el-form-item label="批次">
          {{ unqualifiedObj.material_data.batch }}
        </el-form-item>
        <el-form-item label="产地">
          {{ unqualifiedObj.material_data.supplier }}
        </el-form-item>
        <el-form-item label="抽检人">
          {{ unqualifiedObj.material_data.supplier }}
        </el-form-item>
        <el-form-item label="检测日期">
          {{ unqualifiedObj.material_data.examine_date }}
        </el-form-item>
        <el-form-item label="收货日期">
          {{ unqualifiedObj.material_data.transport_date }}
        </el-form-item>
        <el-form-item label="复检">
          {{ unqualifiedObj.material_data.re_examine?'是':'否' }}
        </el-form-item>
        <h3>不合格项</h3>
        <div v-for="(item,index) in unqualifiedObj.unqualified_type_data" :key="index">
          <el-form-item>
            {{ item.type__name }}
          </el-form-item>
          <el-form-item label="检测值">
            {{ item.value }}
          </el-form-item>
          <div style="width:100%;height:0.5px;background:#DCDFE6;margin-bottom:25px" />
        </div>
        <el-form-item label="处理方式">
          <span v-if="!unqualifiedObj.boolOperate" class="fontWeight">{{ unqualifiedObj.mode.mode }}</span>
          <el-input v-else v-model="unqualifiedObj.mode.mode" />
        </el-form-item>
        <el-form-item v-if="!unqualifiedObj.boolOperate" label="经办人">
          <span class="fontWeight">{{ unqualifiedObj.mode.created_username }}</span>
        </el-form-item>
        <el-form-item v-if="!unqualifiedObj.boolOperate" label="日期">
          <span class="fontWeight">{{ unqualifiedObj.mode.create_time }}</span>
        </el-form-item>
      </el-form>
      <span v-if="unqualifiedObj.boolOperate" slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button v-permission="['examine_material','deal']" type="primary" :loading="btnDealLoading" @click="submitDeal">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="历史检测曲线图"
      :visible.sync="dialogVisible1"
      width="80%"
      :before-close="handleClose1"
    >
      <el-date-picker
        v-model="dialogTimes"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :clearable="false"
        @change="dialogTimesChange"
      />
      <div id="yieldLine" style="width: 100%;height:400px" />
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import * as echarts from 'echarts'
import { setDate } from '@/utils'
import { examineMaterial, materialUnqualifiedTypes, materialUnqualifiedProcess, materialExamineResultCurve } from '@/api/material-check'
// import testTypeSelect from '../components/test-type-select'

export default {
  name: 'QuickcheckRawMaterial',
  components: { page },
  data() {
    return {
      listLoading: false,
      materialSuppliers: [{ id: 1, name: '产地1' }],
      total: 0,
      materialCreateTimes: null,
      listQuery: {
        page: 1,
        name: '',
        sample_name: '',
        batch: '',
        supplier: '',
        qualified: null,
        material_create_time_b: null,
        material_create_time_e: null,
        examine_date: null,
        transport_date: null,
        sampling_user: '',
        recorder: '',
        re_examine: '',
        examine_types: null
      },
      materialList: [],
      dialogVisible: false,
      formData: {},
      unqualifiedObj: {},
      unqualifiedLoading: false,
      btnDealLoading: false,
      dialogVisible1: false,
      dialogTimes: [],
      currentMaterial: '',
      optionYieldLine: {
        title: {
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '7%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
        },
        xAxis: {
          type: 'category',
          name: '检测日期',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          name: '值'
        },
        series: []
      }
    }
  },

  created() {
    let a = setDate()
    let timestamp = new Date().getTime()
    let b = setDate(timestamp - 1000 * 60 * 60 * 24 * 10)
    if (this.day_time && this.day_time.length > 0) {
      a = this.day_time[1]
      timestamp = new Date(this.day_time[0]).getTime()
      b = setDate(timestamp - 1000 * 60 * 60 * 24 * 10)
    }
    this.dialogTimes = [b, a]

    this.getExamineMaterial()
  },

  methods: {
    currentChange(page, pageSize) {
      this.listQuery.page = page
      this.listQuery.page_size = pageSize
      this.getExamineMaterial()
    },
    getExamineMaterial() {
      this.listLoading = true
      examineMaterial(this.listQuery).then((response) => {
        this.materialList = response.results
        this.total = response.count
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    getExamineValueByName(results, type) {
      console.log(results, 'results')
      if (!results) {
        return ''
      }
      for (let i = 0; i < results.length; i++) {
        if (results[i].type_name === type) {
          return results[i].value
        }
      }
      return ''
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getExamineMaterial()
    },
    materialCreateTimeshandleFilter() {
      if (this.materialCreateTimes) {
        this.listQuery.material_create_time_b = this.materialCreateTimes[0]
        this.listQuery.material_create_time_e = this.materialCreateTimes[1]
      } else {
        this.listQuery.material_create_time_b = null
        this.listQuery.material_create_time_e = null
      }
      this.handleFilter()
    },
    unqualifiedFun(row, bool) {
      this.dialogVisible = true
      this.getUnqualified(row.id, bool)
    },
    async getUnqualified(id, bool) {
      try {
        this.unqualifiedLoading = true
        const data = await materialUnqualifiedTypes('get', null, { params: { material: id }})
        this.unqualifiedObj = data
        this.unqualifiedObj.boolOperate = bool
        this.unqualifiedLoading = false
      } catch (e) { this.unqualifiedLoading = false }
    },
    downloadFun() {},
    handleClose(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    typeSelect(val) {
      this.listQuery.examine_types = val ? val.id : ''
      this.listQuery.page = 1
      this.getExamineMaterial()
    },
    async submitDeal() {
      try {
        this.btnDealLoading = true
        await materialUnqualifiedProcess('post', null, { data: { mode: this.unqualifiedObj.mode.mode, material: this.unqualifiedObj.material_data.id }})
        this.btnDealLoading = false
        this.dialogVisible = false
      } catch (e) {
        this.btnDealLoading = false
      }
    },
    dialogTimesChange() {
      this.getLine()
    },
    showLineFun(row) {
      this.dialogVisible1 = true
      this.currentMaterial = row.id
      this.getLine()
    },
    async getLine() {
      try {
        const a = this.dialogTimes ? this.dialogTimes[0] : ''
        const b = this.dialogTimes ? this.dialogTimes[1] : ''
        const data = await materialExamineResultCurve('get', null, { params: { st: a, et: b, material: this.currentMaterial }})
        this.optionYieldLine.xAxis.data = data.x_axis
        this.optionYieldLine.series = data.y_axis

        this.$nextTick(() => {
          this.myChartYieldLine = echarts.init(document.getElementById('yieldLine'))
          this.myChartYieldLine.setOption(this.optionYieldLine)
        })
      } catch (e) {
        //
      }
    },
    handleClose1(done) {
      if (done) {
        done()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.error {
  background: red;
  color: #fff;
}
.formDataClass{
  .el-form-item{
    margin-bottom: 0px;
  }
}
.fontWeight{
  font-weight: 700;
  font-size: 16px;
}
</style>
