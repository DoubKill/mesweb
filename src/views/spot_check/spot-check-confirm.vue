<template>
  <div class="spot-check-confirm">
    <!-- 安全装置点检表确认及查询 -->
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
      <el-form-item label="班次">
        <class-select
          style="width:100px"
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="点检表名称">
        <el-input v-model="getParams.point_standard_name" clearable @input="changDebounce" />
      </el-form-item>
      <el-form-item label="机台">
        <el-select
          v-model="getParams.equip_no"
          style="width:150px"
          placeholder="请选择"
          clearable
          @change="changSelect"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.equip_no"
            :value="item.equip_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位">
        <el-input v-model="getParams.station" style="width:150px" clearable @input="changDebounce" />
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
            v-for="item in ['新建','已点检','已确认']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['check_point_table', 'export']" :loading="btnExportLoad" type="primary" style="margin-right:8px" @click="templateDownload">导出Excel</el-button>
        <el-button
          v-permission="['check_point_table', 'add']"
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
      highlight-current-row
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
      />
      <el-table-column
        prop="classes"
        label="班次"
      />
      <el-table-column
        prop="point_standard_code"
        label="点检表编号"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="showDialog(scope.row,true,true)"
          >{{ scope.row.point_standard_code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="point_standard_name"
        label="点检表名称"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
      />
      <el-table-column
        prop="station"
        label="岗位"
      />
      <el-table-column
        prop="check_result"
        label="点检结果"
      />
      <el-table-column
        prop="status"
        label="状态"
      />
      <el-table-column
        prop="point_user"
        label="点检人"
      />
      <el-table-column
        prop="point_time"
        label="点检时间"
      />
      <el-table-column
        prop="confirm_user"
        label="确认人"
      />
      <el-table-column
        prop="confirm_time"
        label="确认时间"
      />
      <el-table-column label="操作" width="190">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['check_point_table', 'change']"
              :disabled="scope.row.status==='已确认'"
              size="mini"
              @click="showDialog(scope.row)"
            >点检</el-button>
            <el-button
              v-permission="['check_point_table', 'confirm']"
              :disabled="scope.row.status==='已确认'"
              size="mini"
              type="success"
              plain
              @click="showDialog(scope.row,true)"
            >确认
            </el-button>
            <el-button
              v-permission="['check_point_table', 'delete']"
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
      :title="`岗位安全装置点检表${typeForm.id&&isLook?'确认':typeForm.id?'点检':'新建'}`"
      width="1150px"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="typeForm" :rules="rules" :model="typeForm" label-width="150px" inline>
        <el-form-item label="点检表编号">
          <el-input v-if="typeForm.id" v-model="typeForm.point_standard_code" style="width:250px" disabled />
          <el-input v-else style="width:250px" disabled />
        </el-form-item>
        <br>
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
        <el-form-item label="班次" prop="classes">
          <class-select
            :is-clearable="false"
            :value-default="typeForm.classes"
            :is-disabled="typeForm.id?true:false"
            style="width:250px"
            @classSelected="classChanged1"
          />
        </el-form-item>
        <br>
        <el-form-item label="适用机台" prop="equip_no">
          <el-select
            v-model="typeForm.equip_no"
            :disabled="typeForm.id?true:false"
            style="width:250px"
            placeholder="请选择"
            @change="searchContent(true)"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="station">
          <el-select
            v-model="typeForm.station"
            :disabled="typeForm.id?true:false"
            style="width:250px"
            placeholder="请选择"
            @visible-change="visibleStation"
            @change="searchContent(false)"
          >
            <el-option
              v-for="item in options1"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="点检内容">
          <el-table
            :data="tableData1"
            border
            max-height="350"
            style="width: 940px"
          >
            <el-table-column
              prop="check_content"
              label="作业内容"
              width="320"
            />
            <el-table-column
              prop="check_style"
              label="检查方法"
              width="320"
            />
            <el-table-column
              prop="check_result"
              label="检查结果"
              width="150"
            >
              <template slot-scope="{row}">
                <el-select
                  v-model="row.check_result"
                  :disabled="isLook"
                  placeholder=""
                  clearable
                  @change="changeRepaired(row)"
                >
                  <el-option
                    v-for="item in ['好','坏']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="is_repaired"
              label="是否修复"
              width="149"
            >
              <template slot-scope="{row}">
                <el-checkbox v-model="row.is_repaired" :disabled="isLook||row.check_result==='好'">已修复</el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-if="isLook" label="异常确认说明">
          <el-input
            v-model="typeForm.confirm_desc"
            :disabled="isLook1"
            type="textarea"
            :rows="4"
            style="width:350px"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button
          v-if="!isLook1"
          type="primary"
          :loading="btnLoading"
          @click="handleEdit"
        >{{ isLook?'确 认':'确 定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { getEquip } from '@/api/banburying-performance-manage'
import { checkPointTable, checkPointStandard, checkPointTableExport } from '@/api/jqy'
import classSelect from '@/components/ClassSelect'
import { setDate } from '@/utils'

export default {
  name: 'SpotCheckConfirm',
  components: { page, classSelect },
  data: function() {
    return {
      dateValue: [],
      tableData: [],
      tableData1: [],
      point_standard_code: null,
      dialogEditVisible: false,
      typeForm: {},
      rules: {
        select_date: [{ required: true, message: '不能为空', trigger: 'blur' }],
        station: [{ required: true, message: '不能为空', trigger: 'blur' }],
        classes: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_no: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      getParams: {
        page: 1
      },
      excelParams: {
        ids: []
      },
      multipleSelection: [],
      isLook: false,
      isLook1: false,
      currentPage: 1,
      total: 1,
      loading: false,
      options: [],
      options1: [],
      btnLoading: false,
      btnExportLoad: false
    }
  },
  created() {
    this.getList()
    this.visibleChange()
  },
  methods: {
    async visibleChange() {
      const obj = { all: 1, category_name: '密炼设备' }
      getEquip(obj).then(response => {
        this.options = response.results
      })
    },
    async visibleStation(val) {
      if (val) {
        if (this.typeForm.equip_no) {
          const data = await checkPointStandard('get', null, { params: { all_station: this.typeForm.equip_no }})
          this.options1 = data.results
        } else {
          this.$message('请先选择机台')
        }
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await checkPointTable('get', null, { params: this.getParams })
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
    onSubmit() {
      this.isLook = false
      this.isLook1 = false
      this.dialogEditVisible = true
      this.typeForm = { select_date: setDate(), classes: null }
    },
    async searchContent(val) {
      if (val) {
        this.typeForm.station = null
        this.typeForm.check_point_standard = null
        this.typeForm.point_standard_code = null
        this.typeForm.point_standard_name = null
        this.tableData1 = []
        return
      }
      if (!this.typeForm.equip_no) {
        this.$message.info('请选择适用机台')
      } else if (!this.typeForm.station) {
        this.$message.info('请选择岗位')
      } else {
        const data = await checkPointTable('get', null, { params: { all_detail: 1, equip_no: this.typeForm.equip_no, station: this.typeForm.station }})
        this.typeForm.check_point_standard = data.check_point_standard
        this.typeForm.point_standard_code = data.point_standard_code
        this.typeForm.point_standard_name = data.point_standard_name
        this.tableData1 = data.table_details
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
    changeRepaired(row) {
      if (row.check_result === '好') {
        row.is_repaired = false
      }
    },
    classChanged1(val) {
      this.$set(this.typeForm, 'classes', val)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showDialog(row, val, val1) {
      if (val) {
        this.isLook = true
      } else {
        this.isLook = false
      }
      if (val1) {
        this.isLook1 = true
      } else {
        this.isLook1 = false
      }
      this.typeForm = JSON.parse(JSON.stringify(row))
      this.tableData1 = this.typeForm.table_details
      this.dialogEditVisible = true
    },
    handleDelete: function(row) {
      this.$confirm('此操作将删除' + row.point_standard_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkPointTable('delete', row.id)
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
          if (this.typeForm.id) {
            this.typeForm.ids = [this.typeForm.id]
            this.typeForm.opera_type = (this.isLook ? 2 : 1)
          }
          try {
            if (this.tableData1.length === 0) {
              throw new Error('点检内容未添加,请选择机台及岗位来获取点检内容')
            }
            if (!this.typeForm.id) {
              this.typeForm.table_details = this.tableData1
            }
            if (!this.tableData1.some(d => d.check_result === '好' || d.check_result === '坏')) {
              throw new Error('点检内容中检查结果至少填一个')
            }
            this.btnLoading = true
            this.typeForm.id ? await checkPointTableExport('post', null, { data: this.typeForm }) : await checkPointTable('post', null, { data: this.typeForm })
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
        checkPointTableExport('post', null, { responseType: 'blob', data: this.excelParams }).then(response => {
          const link = document.createElement('a')
          const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '岗位安全装置点检表.xls' // 下载的文件名
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
.spot-check-confirm{
  .el-dialog{
    margin-top:10vh !important
  }
}
</style>
