<template>
  <div>
    <!-- 入库管理 -->
    <el-form :inline="true">
      <el-form-item label="单据条码">
        <el-input
          v-model="search.order_id"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="提交人">
        <el-input
          v-model="search.created_username"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="提交起止时间">
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
          v-model="search.status"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in [{label:'未入库',value:1},{label:'入库中',value:2},{label:'已入库',value:3}]"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['equip_job_standard', 'export']" :loading="btnExportLoad" type="primary" style="margin-right:8px" @click="templateDownload">导出Excel</el-button>
        <el-upload
          v-permission="['equip_job_standard', 'import']"
          style="margin-right:8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button
          v-permission="['equip_job_standard', 'add']"
          type="primary"
          @click="onSubmit"
        >新建</el-button>
      </el-form-item></el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
    >
      <el-table-column
        label="操作"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="dialog(scope.row)"
          >入库
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_id"
        label="单据条码"
        min-width="20"
      />
      <el-table-column
        prop="submission_department"
        label="提交部门"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="提交人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="提交时间"
        min-width="20"
      />
      <el-table-column
        prop="_status"
        label="状态"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="80%"
    >
      <el-form :inline="true">
        <el-form-item label="单据条码">
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input :disabled="true" />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        border
      >
        <el-table-column
          label="操作"
          width="90"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="dialog1(scope.row)"
            >确定入库
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_no"
          label="备件条码"
          min-width="20"
        />
        <el-table-column
          prop="sub_no"
          label="备件代码"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="备件名称"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="规格型号"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="技术参数"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="总数量"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="已入库数量"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="标准单位"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="库区"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="库位"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="关键部件"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="出厂编码"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="出厂日期"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="供应商"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="制造商"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="入库人"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="入库时间"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="状态"
          min-width="20"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="备件人工入库"
      :visible.sync="dialogVisible1"
      width="30%"
    >
      <el-form :inline="true" label-width="150px">
        <el-form-item label="备件名称" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="备件条码" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="批号" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="库区">
          <el-select
            v-model="creatOrder.feedi"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in ['库区1']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库位">
          <el-select
            v-model="creatOrder.fei"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in ['库位1']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equp_no"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="单位" style="" prop="checkList">
          <el-input
            v-model="creatOrder.eq"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`新建入库单据`"
      :visible.sync="dialogVisibleAdd"
      width="50%"
      :before-close="handleCloseAdd"
    >
      <el-form
        ref="createForm"
        label-width="100px"
        :model="dialogForm"
      >
        <el-form-item
          label="单据条码"
          prop="order_id"
        >
          <el-input v-model="dialogForm.order_id" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="提交部门">
          <el-select
            v-model="dialogForm.submission_department"
            placeholder="请选择"
            clearable
            @change="changeSearch"
          >
            <el-option
              v-for="item in ['设备部','设备部2','设备部3']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入库物料详情列表">
          <el-button type="primary" @click="Add">添加</el-button>
          <el-table
            :data="dialogForm.equip_spare"
            border
            style="width: 100%"
          >
            <el-table-column
              label="次序"
              type="index"
            />
            <el-table-column
              prop="spare_code"
              label="备件编号"
            />
            <el-table-column
              prop="spare_name"
              label="备件名称"
            />
            <el-table-column
              prop="specification"
              label="规格"
            />
            <el-table-column
              prop="quantity"
              label="数量"
              width="140px"
            >
              <template slot-scope="{row}">
                <el-input-number
                  v-model="row.quantity"
                  size="small"
                  :min="1"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseAdd(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`备品备件库 入库物料选择`"
      :visible.sync="dialogVisibleAdd1"
      width="80%"
      :before-close="handleCloseAdd1"
    >
      <material
        ref="List"
        :show="dialogVisibleAdd1"
        type="入库"
        :list="dialogForm.equip_spare"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseAdd1(false)">取 消</el-button>
        <el-button type="primary" @click="submitFun1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import material from '../components/material-dialog'
import { getOrderId, equipWarehouseOrder } from '@/api/jqy'
import page from '@/components/page'
import { debounce } from '@/utils'
export default {
  name: 'WarehousingManagement',
  components: { page, material },
  data() {
    return {
      search: {},
      btnLoading: false,
      dialogForm: {},
      dateValue: [],
      btnExportLoad: false,
      tableData: [{ date: '1' }],
      tableDataView: [{ date: '1' }],
      total: 0,
      checkList: [],
      loading: false,
      loadingView: false,
      dialogVisibleAdd: false,
      dialogVisibleAdd1: false,
      dialogVisible: false,
      dialogVisible1: false,
      submit: false,
      creatOrder: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    generateFun(obj) {
      this.dialogVisible1 = true
      console.log(obj, 'obj')
    },
    Add() {
      this.dialogVisibleAdd1 = true
    },
    changeDate() {

    },
    async onSubmit() {
      try {
        const orderId = await getOrderId('get', null, { params: { status: '入库' }})
        this.dialogForm.order_id = orderId
        this.dialogForm.equip_spare = []
        this.dialogVisibleAdd = true
      } catch {
        this.dialogVisibleAdd = false
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipWarehouseOrder('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeSearch1() {
      this.search.page = 1
      this.getList()
    },
    dialog() {
      this.dialogVisible = true
    },
    dialog1() {
      this.dialogVisible1 = true
    },
    handleDelete(row) {
      this.dialogForm.equip_spare.forEach((item, index) => {
        if (row.id === item.id) {
          this.dialogForm.equip_spare.splice(index, 1)
        }
      })
    },
    handleClose(done) {
      this.dialogVisible1 = false
      if (done) {
        done()
      }
    },
    handleCloseAdd(done) {
      this.dialogVisibleAdd = false
      if (done) {
        done()
      }
    },
    handleCloseAdd1(done) {
      this.$refs['List'].$refs.multipleTable.clearSelection()
      this.dialogVisibleAdd1 = false
      if (done) {
        done()
      }
    },
    submitFun() {
      this.dialogForm.status = 1
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            await equipWarehouseOrder('post', null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.dialogVisibleAdd = false
          } catch (e) {
            this.dialogVisibleAdd = true
          }
        } else {
          return false
        }
      })
    },
    submitFun1() {
      let data = []
      for (const i in this.dialogForm.equip_spare) {
        data = data.concat(this.dialogForm.equip_spare[i].id)
      }
      for (let index = 0; index < this.$refs['List'].multipleSelection.length; index++) {
        if (data.indexOf(this.$refs['List'].multipleSelection[index].id) === -1) {
          this.dialogForm.equip_spare.push({
            spare_code: this.$refs['List'].multipleSelection[index].spare__code,
            id: this.$refs['List'].multipleSelection[index].id,
            spare_name: this.$refs['List'].multipleSelection[index].spare_name,
            specification: this.$refs['List'].multipleSelection[index].specification,
            quantity: 1
          })
        }
      }
      this.$refs['List'].$refs.multipleTable.clearSelection()
      this.dialogVisibleAdd1 = false
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    templateDownload() {
      // this.btnExportLoad = true
      // const obj = Object.assign({ export: 1 }, this.getParams)
      // const _api = equipRepairStandardDown
      // _api(obj)
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '设备维修标准定义.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
    },
    Upload(param) {
    //   const formData = new FormData()
    //   formData.append('file', param.file)
    //   equipRepairStandardImport('post', null, { data: formData }).then(response => {
    //     this.$message({
    //       type: 'success',
    //       message: response
    //     })
    //     this.getParams.page = 1
    //     this.getList()
    //   })
    }
  }
}
</script>

<style>

</style>
