<template>
  <div class="temperature-confirm">
    <!-- 除尘袋滤器记录检查表确认 -->
    <el-form :inline="true">
      <el-form-item label="起止日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="getParams.status"
          style="width:100px"
          placeholder="请选择"
          clearable
          @change="changSelect"
        >
          <el-option
            v-for="item in ['新建','已检查','已确认']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['check_temperature_table', 'confirm']"
          type="primary"
          @click="confirm"
        >批量确认</el-button>
        <el-button v-permission="['check_temperature_table', 'export']" :loading="btnExportLoad" type="primary" @click="templateDownload">导出Excel</el-button>
        <el-button
          v-permission="['check_temperature_table', 'add']"
          type="primary"
          @click="onSubmit"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
      row-key="id"
      :reserve-selection="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column
        prop="select_date"
        label="日期"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="showDialog(scope.row,true)"
          >{{ scope.row.select_date }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_exceed"
        label="温度是否有超标"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.is_exceed?'有':'无' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
      />
      <el-table-column
        prop="created_username"
        label="录入人"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
      />
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['check_temperature_table', 'change']"
              :disabled="scope.row.status==='已确认'"
              size="mini"
              @click="showDialog(scope.row)"
            >检查</el-button>
            <el-button
              v-permission="['check_temperature_table', 'delete']"
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      v-if="!loading"
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`除尘袋滤器温度${typeForm.id&&isLook?'查看':typeForm.id?'检查':'新建'}`"
      width="1150px"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="typeForm" :rules="rules" :model="typeForm" label-width="150px" inline>
        <el-form-item label="日期" prop="select_date">
          <el-date-picker
            v-model="typeForm.select_date"
            style="width:250px"
            :disabled="typeForm.id?true:false"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <br>
        <el-form-item label="具体位置">
          <el-input
            v-model="location"
            style="width:250px"
            placeholder=""
            clearable
            @input="searchList"
          />
        </el-form-item>
        <el-form-item label="名称">
          <el-input
            v-model="station_name"
            style="width:250px"
            placeholder=""
            clearable
            @input="searchList"
          />
        </el-form-item>
        <br>
        <el-form-item label="检查内容">
          <el-checkbox v-model="check" @change="searchList1">只显示超标项目</el-checkbox>
          <el-table
            v-loading="loading1"
            :data="tableData1"
            border
            max-height="350"
            style="width: 780px"
          >
            <el-table-column
              prop="sn"
              label="序号"
              width="80"
            />
            <el-table-column
              prop="location"
              label="具体位置"
              width="150"
            />
            <el-table-column
              prop="station_name"
              label="名称"
              width="200"
            />
            <el-table-column
              prop="temperature_limit"
              label="温度上限(℃)"
              width="150"
            />
            <el-table-column
              prop="input_value"
              label="温度"
              width="199"
            >
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.input_value" :disabled="isLook" style="width:160px" controls-position="right" :min="0" @change="changValue(scope)" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button
          v-if="!isLook"
          type="primary"
          :loading="btnLoading"
          @click="handleEdit"
        >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="除尘袋滤器温度检查记录表  确认"
      width="30%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="typeForm1" label-width="150px" inline>
        <el-form-item label="确认备注" prop="classes">
          <el-input
            v-model="typeForm1.confirm_desc"
            type="textarea"
            :rows="4"
            controls-position="right"
            style="width:250px"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="handleConfirm"
        >确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { checkTemperatureTable, checkTemperatureTableExport } from '@/api/jqy'
import { setDate } from '@/utils'

export default {
  name: 'SpotCheckConfirm',
  components: { page },
  data: function() {
    return {
      dateValue: [],
      tableData: [],
      tableData1: [],
      check: false,
      dialogEditVisible: false,
      dialogVisible: false,
      excelParams: {
        ids: []
      },
      isLook: false,
      multipleSelection: [],
      station_name: null,
      location: null,
      typeForm: {},
      typeForm1: {},
      firstList: [],
      rules: {
        select_date: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      getParams: {
        page: 1
      },
      currentPage: 1,
      total: 1,
      loading: false,
      loading1: false,
      options: [],
      btnLoading: false,
      btnExportLoad: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await checkTemperatureTable('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.total = data.count || 0
        this.loading = false
      } catch (error) {
        this.loading = false
        this.tableData = []
      }
    },
    handleClose(done) {
      this.dialogEditVisible = false
      this.tableData1 = []
      this.typeForm = {}
      setTimeout(d => {
        this.$refs.typeForm.clearValidate()
      })
      if (done) {
        done()
      }
    },
    async onSubmit() {
      try {
        this.isLook = false
        this.check = false
        this.dialogEditVisible = true
        this.loading1 = true
        const data = await checkTemperatureTable('get', null, { params: { all_detail: 1 }})
        this.typeForm = { select_date: setDate() }
        this.tableData1 = JSON.parse(JSON.stringify(data.results))
        this.firstList = JSON.parse(JSON.stringify(data.results))
        this.loading1 = false
      } catch (error) {
        this.loading1 = false
        this.tableData = []
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changValue(scope) {
      this.$set(this.firstList[scope.$index], 'input_value', scope.row.input_value)
    },
    searchList() {
      if (this.location && !this.station_name) {
        this.$set(this, 'tableData1', this.firstList.filter(d => d.location.indexOf(this.location) !== -1))
      } else if (!this.location && this.station_name) {
        this.$set(this, 'tableData1', this.firstList.filter(d => d.station_name.indexOf(this.station_name) !== -1))
      } else if (this.location && this.station_name) {
        this.$set(this, 'tableData1', this.firstList.filter(d => (d.location.indexOf(this.location) !== -1) && (d.station_name.indexOf(this.station_name) !== -1)))
      } else {
        this.tableData1 = JSON.parse(JSON.stringify(this.firstList))
      }
    },
    searchList1() {
      if (this.check) {
        this.$set(this, 'tableData1', this.firstList.filter(d => { return d.temperature_limit < d.input_value }))
      } else {
        this.tableData1 = JSON.parse(JSON.stringify(this.firstList))
      }
    },
    changSelect() {
      this.getParams.page = 1
      this.getList()
    },
    changDebounce() {
      this.$debounce(this, 'changSelect')
    },
    changeDate(arr) {
      this.getParams.select_date_after = arr ? arr[0] : ''
      this.getParams.select_date_before = arr ? arr[1] : ''
      this.getList()
    },
    classChanged(val) {
      this.getParams.classes = val
      this.getParams.page = 1
      this.getList()
    },
    classChanged1(val) {
      this.$set(this.typeForm, 'classes', val)
    },
    confirm() {
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.some(d => d.status === '已确认')) {
          this.$message.info('所选择数据有已确认状态')
          return
        }
        this.dialogVisible = true
        this.typeForm1 = { ids: [], opera_type: 2 }
        this.multipleSelection.forEach(d => {
          this.typeForm1.ids.push(d.id)
        })
      } else {
        this.$message.info('请选择所需确认数据')
        return
      }
    },
    async handleConfirm() {
      try {
        this.btnLoading = true
        await checkTemperatureTableExport('post', null, { data: this.typeForm1 })
        this.$refs.multipleTable.clearSelection()
        this.dialogVisible = false
        this.btnLoading = false
        this.$message.success('操作成功')
        this.getList()
      } catch (e) {
        this.btnLoading = false
      }
    },
    showDialog(row, val) {
      if (val) {
        this.isLook = true
      } else {
        this.isLook = false
      }
      this.check = false
      this.typeForm = JSON.parse(JSON.stringify(row))
      this.tableData1 = JSON.parse(JSON.stringify(this.typeForm.table_details))
      this.firstList = JSON.parse(JSON.stringify(this.typeForm.table_details))
      this.dialogEditVisible = true
    },
    handleDelete: function(row) {
      this.$confirm('此操作将删除该除尘袋滤器温度检查表是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkTemperatureTable('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    handleEdit: function() {
      this.$refs.typeForm.validate(async(valid) => {
        if (valid) {
          try {
            if (this.typeForm.id) {
              this.typeForm.ids = [this.typeForm.id]
              this.typeForm.opera_type = 1
            }
            if (this.location !== null || this.station_name !== null) {
              this.location = null
              this.station_name = null
              this.tableData1 = JSON.parse(JSON.stringify(this.firstList))
            }
            if (this.tableData1.length === 0) {
              throw new Error('检查内容未添加')
            }
            this.typeForm.table_details = this.tableData1
            this.firstList.forEach(d => {
              if (!d.input_value) {
                throw new Error('温度为必填项')
              }
            })
            this.btnLoading = true
            this.typeForm.id ? await checkTemperatureTableExport('post', null, { data: this.typeForm }) : await checkTemperatureTable('post', null, { data: this.typeForm })
            this.btnLoading = false
            this.handleClose(false)
            this.$message.success('操作成功')
            this.getList()
          } catch (e) {
            this.btnLoading = false
            if (e.message) {
              this.$message(e.message)
            }
          }
        }
      })
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
    },
    templateDownload() {
      if (this.multipleSelection.length > 0) {
        this.excelParams.ids = []
        this.multipleSelection.forEach(d => {
          this.excelParams.ids.push(d.id)
        })
        this.btnExportLoad = true
        this.excelParams.opera_type = 3
        checkTemperatureTableExport('post', null, { responseType: 'blob', data: this.excelParams }).then(response => {
          const link = document.createElement('a')
          const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '除尘袋滤器温度检查表.xls' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.$refs.multipleTable.clearSelection()
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
      } else {
        this.$message.info('请选择导出数据')
      }
    }
  }
}

</script>
<style lang="scss">
</style>
