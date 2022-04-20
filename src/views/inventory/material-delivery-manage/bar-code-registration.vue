<template>
  <div class="bar-code-registration">
    <!-- 总部送检条码登记 -->
    <el-form :inline="true">
      <el-form-item label="质检条码">
        <el-input v-model="search.tracking_num" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-select v-model="search.material_name" allow-create filterable placeholder="请选择" clearable @visible-change="getMaterialsList" @change="changeList">
          <el-option
            v-for="item in options2"
            :key="item.material_name"
            :label="item.material_name"
            :value="item.material_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码">
        <el-select v-model="search.material_no" allow-create filterable placeholder="请选择" clearable @visible-change="getMaterialsList" @change="changeList">
          <el-option
            v-for="item in options2"
            :key="item.material_no"
            :label="item.material_no"
            :value="item.material_no"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="中策物料编码">
        <el-input v-model="search.zc_material_code" clearable @input="getDebounce" />
      </el-form-item> -->
      <el-form-item label="送检日期">
        <el-date-picker
          v-model="searchDate"
          type="daterange"
          :clearable="true"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="总部检测结果">
        <el-select
          v-model="search.quality_status"
          filterable
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in options1"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['material_sjdj','add']" type="primary" @click="dialogAdd">添加</el-button>
        <el-button type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        prop="tracking_num"
        label="质检条码"
        min-width="20"
      />
      <el-table-column
        prop="quality_status"
        label="总部品质状态"
        min-width="20"
      />
      <el-table-column
        prop="material_name"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="material_no"
        label="物料编码"
        min-width="20"
      />
      <!-- <el-table-column
        prop="spare_code"
        label="中策物料编码"
        min-width="20"
      /> -->
      <el-table-column
        prop="batch"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="mes_quality_status"
        label="安吉质检状态"
        min-width="20"
      />
      <el-table-column
        prop="locked_status"
        label="核酸状态"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="送检日期"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="送检人"
        min-width="20"
      />
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button
            v-permission="['material_sjdj','delete']"
            size="mini"
            type="danger"
            @click="delDialog(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="总部送检条码  添加"
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="handleClose"
    >
      <el-form
        :model="objForm"
        label-width="120px"
      >
        <el-form-item
          label="质检条码"
          prop="name"
        >
          <el-input v-model="objForm.tracking_num" @input="debounceCode" />
        </el-form-item>
        <el-form-item
          label="物料名称"
          prop="material_name"
        >
          <el-input v-model="objForm.material_name" disabled />
        </el-form-item>
        <el-form-item
          label="物料编码"
          prop="material_no"
        >
          <el-input v-model="objForm.material_no" disabled />
        </el-form-item>
        <el-form-item
          label="批次号"
          prop="batch"
        >
          <el-input v-model="objForm.batch" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnloading" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { debounce, setDate } from '@/utils'
import { materialCount, materialInspectionRegistration } from '@/api/base_w'
import { wmsMaterialSearch } from '@/api/base_w_three'
export default {
  name: 'BarCodeRegistration',
  components: { page },
  data() {
    return {
      search: { quality_status: '待检' },
      searchDate: [getDay(-7), getDay(0)],
      loading: false,
      tableData: [],
      total: 0,
      options2: [],
      options1: ['待检', '合格', '不合格'],
      btnExportLoad: false,
      dialogVisible: false,
      objForm: {
        material_name: '',
        material_no: '',
        batch: ''
      },
      btnloading: false
    }
  },
  mounted() {
    this.search.st = this.searchDate ? this.searchDate[0] : ''
    this.search.et = this.searchDate ? this.searchDate[1] : ''
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      this.tableData = []
      try {
        const data = await materialInspectionRegistration('get', null, { params: this.search })
        this.loading = false
        this.tableData = data.results || []
        this.total = data.count
      } catch (e) {
        this.loading = false
      }
    },
    async getMaterialsList(val) {
      if (val) {
        try {
          const data = await materialCount('get', null, { params: { store_name: '原材料库' }})
          this.options2 = data || []
        } catch (e) {
        //
        }
      }
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    getDebounce() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    changeDate(date) {
      this.search.st = date ? date[0] : ''
      this.search.et = date ? date[1] : ''
      this.changeList()
    },
    handleClose(done) {
      this.dialogVisible = false
      this.objForm = {
        material_name: '',
        material_no: '',
        batch: ''
      }
      if (done) {
        done(done)
      }
    },
    debounceCode() {
      debounce(this, 'getDebounceCode')
    },
    async getDebounceCode() {
      try {
        const data = await wmsMaterialSearch('get', null, { params: { tmh: this.objForm.tracking_num }})
        this.objForm.material_name = data[0].WLMC
        this.objForm.material_no = data[0].WLXXID
        this.objForm.batch = data[0].PH
      } catch (e) {
        //
      }
    },
    async handleSubmit() {
      try {
        if (!this.objForm.tracking_num) {
          this.$message('请输入质检条码')
          return
        }
        this.btnloading = true
        await materialInspectionRegistration('post', null, { data: this.objForm })
        this.$message.success('添加成功')
        this.btnloading = false
        this.handleClose(false)
        this.getList()
      } catch (e) {
        this.btnloading = false
      }
    },
    dialogAdd() {
      this.dialogVisible = true
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.quality_status === '合格') {
        return 'green-row'
      } else if (row.quality_status === '不合格') {
        return 'red-row'
      } else {
        var timestamp = new Date(setDate()).getTime()
        const oldTimestamp = new Date(row.created_date).getTime()
        const oneTimestamp = 1000 * 60 * 60 * 24 * 10
        // 创建日期 过了十天 背景颜色变成紫色
        if (oldTimestamp + oneTimestamp < timestamp) {
          return 'purple-row'
        }
      }
    },
    delDialog(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        materialInspectionRegistration('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }).catch(e => {
            //
          })
      })
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      delete obj.page
      delete obj.page_size
      const _api = materialInspectionRegistration
      _api('get', null, { responseType: 'blob', params: obj })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '原材料-总部送检条码登记.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
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
</script>

<style lang="scss">
.bar-code-registration{
    .el-dialog__body .el-input{
        width:350px;
    }
    .green-row{
      background: rgb(149, 242, 4) !important;
    }
    .red-row{
      background: rgb(236, 160, 169) !important;
    }
    .purple-row{
      background: rgb(214, 144, 214) !important;
    }
}

</style>
