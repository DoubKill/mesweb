<template>
  <div>
    <!--炭黑库 质检信息设定 -->
    <el-form :inline="true">
      <el-form-item label="物料名称">
        <el-input v-model="search.material_name" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="search.material_no" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="中策物料编码">
        <el-input v-model="search.zc_material_code" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="批次号">
        <el-input v-model="search.batch_no" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="PDM">
        <el-input v-model="search.pdm_no" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="入库时间">
        <el-date-picker
          v-model="datetimerange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="品质状态">
        <el-select v-model="search.quality_status" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="(item,i) in qualityStatus"
            :key="i"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="厂家">
        <el-select v-model="search.factory" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="(item,i) in factoryList"
            :key="i"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['th_quality_setting','release']"
            size="mini"
            type="primary"
            :loading="submitQualified&&scope.row.batch_no===loadId"
            :disabled="submitQualified"
            @click="qualified(scope.row,'合格')"
          >设定合格</el-button>
          <el-button
            v-permission="['th_quality_setting','release']"
            size="mini"
            type="primary"
            @click="qualified(scope.row,'放行')"
          >异常处理</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="material_name"
        label="物料名称"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ scope.row.material_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="material_no"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="zc_material_code"
        label="中策物料编码"
        min-width="20"
      />
      <el-table-column
        prop="batch_no"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="quality_status"
        label="品质状态"
        min-width="20"
        :formatter="(row)=>{
          let obj = qualityStatus.find(d=>d.id === row.quality_status)
          return obj.name
        }"
      />
      <el-table-column
        prop="pdm_no"
        label="PDM"
        min-width="15"
      />
      <el-table-column
        prop="unit"
        label="单位"
        min-width="10"
      />
      <el-table-column
        prop="quantity"
        label="库存数量"
        min-width="15"
      />
      <el-table-column
        prop="weight"
        label="重量/kg"
        min-width="15"
      />
      <el-table-column
        prop="weight"
        label="入库日期"
        min-width="15"
      />
      <el-table-column
        prop="factory"
        label="厂家"
        min-width="15"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="原材料库存 详细列表"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose"
    >
      <el-form :inline="true">
        <el-form-item label="物料名称">
          <el-input
            v-model="searchView.material_name"
            disabled
          />
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input
            v-model="searchView.e_material_no"
            style="width:400px"
            disabled
          />
        </el-form-item>
        <el-form-item label="中策物料编码">
          <el-input
            v-model="searchView.zc_material_code"
            disabled
          />
        </el-form-item>
        <el-form-item>
          <el-button v-permission="['th_quality_setting','release']" type="primary" :loading="submit" @click="qualifiedList('合格')">合格</el-button>
          <el-button v-permission="['th_quality_setting','release']" type="primary" :loading="submit1" @click="qualifiedList('放行')">放行</el-button>
          <el-button type="primary" @click="handleClose">返回</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        v-loading="loadingView"
        :data="tableDataView"
        max-height="500"
        row-key="id"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40"
          :reserve-selection="true"
        />
        <el-table-column
          prop="batch_no"
          label="批次号"
          min-width="20"
        />
        <el-table-column
          prop="quality_status"
          label="品质状态"
          min-width="20"
        />
        <el-table-column
          prop="lot_no"
          label="质检条码"
          min-width="20"
        />
        <el-table-column
          prop="container_no"
          label="托盘号"
          min-width="20"
        />
        <el-table-column
          prop="location"
          label="库位号"
          min-width="20"
        />
        <el-table-column
          prop="in_storage_time"
          label="入库时间"
          min-width="20"
        />
        <el-table-column
          prop="unit"
          label="单位"
          min-width="20"
        />
        <el-table-column
          prop="qty"
          label="库存数量"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="重量/kg"
          min-width="20"
        />
      </el-table>
    </el-dialog>

    <el-dialog
      title="原材料 异常处理"
      :visible.sync="dialogVisibleAbnormal"
      width="25%"
    >
      <el-form :model="abnormalForm" :rules="rules" label-width="150px">
        <el-form-item label="品质状态" prop="abnormal_operation_result">
          <el-radio-group v-model="abnormalForm.abnormal_operation_result">
            <el-radio label="不合格">不合格</el-radio>
            <el-radio label="待检品">待检品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理结果" prop="abnormal_operation_result">
          <el-radio-group v-model="abnormalForm.abnormal_operation_result">
            <el-radio label="放行">放行</el-radio>
            <el-radio label="不放行">不放行</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理说明" prop="abnormal_operation_result">
          <el-input
            v-model="abnormalForm.revocation_desc"
            type="textarea"
            style="width:200px"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAbnormal=false">取 消</el-button>
        <el-button :loading="submitPass" type="primary" @click="generateFunAbnormal">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import page from '@/components/page'
import { thStorageSummary, thStorage, thRelease } from '@/api/jqy'
export default {
  name: 'CarbonInspectionRelease',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      searchView: {},
      total: 0,
      loadId: '',
      submitQualified: false,
      submitPass: false,
      submit: false,
      submit1: false,
      abnormalForm: {},
      dialogVisibleAbnormal: false,
      dialogVisible: false,
      datetimerange: [getDay(-3) + ' ' + time(), getDay(0) + ' ' + time()],
      tableDataView: [],
      trackingList: [],
      loadingView: false,
      multipleSelection: [],
      factoryList: [],
      tableData: [],
      loading: false,
      rules: {
        abnormal_operation_result: [{ required: true, message: '不能为空', trigger: 'change' }],
        revocation_desc: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      qualityStatus: [
        { id: 1, name: '合格' },
        { id: 2, name: '抽检中' },
        { id: 3, name: '不合格' },
        { id: 4, name: '过期' },
        { id: 5, name: '待检品' }
      ]
    }
  },
  created() {
    this.search.st = this.datetimerange[0]
    this.search.et = this.datetimerange[1]
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await thStorageSummary('get', null, { params: this.search })
        this.tableData = data.results
        this.factoryList = data.factory_list
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async DetailedList(row) {
      try {
        this.searchView.material_name = row.material_name
        this.searchView.e_material_no = row.material_no
        this.searchView.zc_material_code = row.zc_material_code
        this.searchView.unit = row.unit
        this.searchView.batch_no = row.batch_no
        this.searchView.quality_status = row.quality_status
        this.searchView.st = this.search.st
        this.searchView.et = this.search.et
        this.searchView.page_size = 1000000
        this.dialogVisible = true
        this.loadingView = true
        const data = await thStorage('get', null, { params: this.searchView })
        this.tableDataView = data.results
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
    },
    handleClose() {
      this.$refs.multipleTable.clearSelection()
      this.dialogVisible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async qualified(row, val) {
      try {
        if (row.quality_status !== 1) {
          this.loadId = row.batch_no
          this.searchView.material_name = row.material_name
          this.searchView.e_material_no = row.material_no
          this.searchView.zc_material_code = row.zc_material_code
          this.searchView.unit = row.unit
          this.searchView.batch_no = row.batch_no
          this.searchView.quality_status = row.quality_status
          this.searchView.st = this.search.st
          this.searchView.et = this.search.et
          this.searchView.page_size = 1000000
          const data = await thStorage('get', null, { params: this.searchView })
          this.tableDataView = data.results
          const obj = []
          this.tableDataView.forEach(d => {
            obj.push(d.lot_no)
          })
          this.trackingList = obj
          if (val === '合格') {
            this.$confirm('此操作将该物料的品质状态改成' + val + '是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.submitQualified = true
              thRelease('post', null, { data: { tracking_nums: obj, operation_type: val }})
                .then(response => {
                  this.$message({
                    type: 'success',
                    message: '操作成功'
                  })
                  this.submitQualified = false
                  this.getList()
                })
                .catch(response => {
                  this.submitQualified = false
                })
            })
          } else {
            this.dialogVisibleAbnormal = true
            this.abnormalForm = {}
          }
        } else {
          this.$message('合格品不能处理')
        }
      } catch (e) {
        //
      }
    },
    async generateFunAbnormal() {
      if (this.abnormalForm.abnormal_operation_result === '放行') {
        try {
          this.submitPass = true
          await thRelease('post', null, { data: { tracking_nums: this.trackingList, operation_type: '放行' }})
          this.$message.success('操作成功')
          this.submitPass = false
          this.dialogVisibleAbnormal = false
          this.getList()
        } catch {
          this.submitPass = false
        }
      } else {
        this.$message.success('操作成功')
        this.dialogVisibleAbnormal = false
      }
    },
    async qualifiedList(val) {
      const obj = []
      this.multipleSelection.forEach(d => {
        obj.push(d.lot_no)
      })
      const type = val
      if (obj.length > 0 && this.multipleSelection.every(d => d.quality_status !== '合格品')) {
        try {
          val === '合格' ? this.submit = true : this.submit1 = true
          await thRelease('post', null, { data: { tracking_nums: obj, operation_type: type }})
          this.$message.success('操作成功')
          val === '合格' ? this.submit = false : this.submit1 = false
          this.$refs.multipleTable.clearSelection()
          this.loadingView = true
          const data = await thStorage('get', null, { params: this.searchView })
          this.tableDataView = data.results
          this.loadingView = false
          this.getList()
        } catch (e) {
          val === '合格' ? this.submit = false : this.submit1 = false
        }
      } else if (obj.length === 0) {
        this.$message.info('请选择库存')
      } else {
        this.$message.info('合格品不能处理')
      }
    },
    changeDate(date) {
      this.search.st = date ? date[0] : ''
      this.search.et = date ? date[1] : ''
      this.changeList()
    },
    debounceFun() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
function getDay(day) {
  var today = new Date()
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday_milliseconds)
  var tYear = today.getFullYear()
  var tMonth = today.getMonth()
  var tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}
function doHandleMonth(month) {
  var m = month
  if (month.toString().length === 1) {
    m = '0' + month
  }
  return m
}
function time() {
  var d = new Date()
  var hour = d.getHours()// 得到小时数
  var minute = d.getMinutes()// 得到分钟数
  var second = d.getSeconds()// 得到秒数
  const h = hour < 10 ? '0' + hour : hour
  const m = minute < 10 ? '0' + minute : minute
  const s = second < 10 ? '0' + second : second
  return h + ':' + m + ':' + s
}
</script>

<style lang="scss" scoped>

</style>
