<template>
  <div>
    <!-- 机台设备生产能力 -->
    <el-form :inline="true">
      <el-form-item label="机台">
        <selectEquip
          :equip_no_props.sync="search.equip_no"
          @changeSearch="changeList"
        />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-select v-model="search.product_no" clearable filterable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in options"
            :key="item.material_no"
            :label="item.material_no"
            :value="item.material_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="batchSet">批量设置</el-button>
        <el-button type="primary" :disabled="btnExportLoad" @click="templateDownload">导出Excel</el-button>
        <el-button type="primary" @click="addList">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        prop="avg_mixing_time"
        label="平均工作时间(秒)"
        min-width="20"
        sortable
      />
      <el-table-column
        prop="avg_interval_time"
        label="平均间隔时间(秒)"
        min-width="20"
        sortable
      />
      <el-table-column
        prop="avg_rubbery_quantity"
        label="平均加胶量(kg)"
        min-width="20"
        sortable
      />
      <el-table-column
        prop="created_username"
        label="录入者"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
        min-width="20"
      />
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </el-button-group>
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
      :title="`${formData.id?'编辑':'新建'}机台设备生产能力`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="150px">
        <el-form-item label="机台" prop="equip_no">
          <selectEquip
            :equip_no_props.sync="formData.equip_no"
          />
        </el-form-item>
        <el-form-item label="胶料编码" prop="product_no">
          <el-select v-model="formData.product_no" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.material_no"
              :label="item.material_no"
              :value="item.material_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平均工作时间(秒）" prop="avg_mixing_time">
          <el-input-number v-model="formData.avg_mixing_time" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="平均间隔时间(秒）" prop="avg_interval_time">
          <el-input-number v-model="formData.avg_interval_time" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="平均加胶量(kg)" prop="avg_rubbery_quantity">
          <el-input-number v-model="formData.avg_rubbery_quantity" controls-position="right" :min="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import selectEquip from '@/components/select_w/equip'
import page from '@/components/page'
import { batchingMaterials } from '@/api/base_w'
import { schedulingEquipCapacity } from '@/api/base_w_five'
export default {
  name: 'ScheduleProductionCapacity',
  components: { page, selectEquip },
  data() {
    return {
      search: {},
      optionsBranch: [],
      tableData: [],
      formData: {},
      loading: false,
      dateValue: [],
      options: [],
      btnExportLoad: false,
      total: 0,
      dialogVisible: false,
      tableData1: [],
      btnLoading: false,
      rules: {
        product_no: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        equip_no: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        avg_mixing_time: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        avg_interval_time: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        avg_rubbery_quantity: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      multipleTableArr: []
    }
  },
  created() {
    this.getList()
    this.getProductList()
  },
  methods: {
    async getList() {
      this.loading = false
      try {
        this.loading = true
        const data = await schedulingEquipCapacity('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getProductList() {
      try {
        const data = await batchingMaterials('get', null, { params: { all: 1 }})
        this.options = data || []
      } catch (e) {
        //
      }
    },
    handleSelectionChange(arr) {
      this.multipleTableArr = arr || []
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    changeDate(arr) {
      this.changeList()
    },
    debounceInput() {
      this.$debounce(this, 'getList')
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    handleClose(done) {
      this.dialogVisible = false
      this.formData = {}
      setTimeout(d => {
        this.$refs.ruleForm.clearValidate()
      }, 300)
      if (done) {
        done()
      }
    },
    showEditDialog(row) {
      this.dialogVisible = true
      this.formData = JSON.parse(JSON.stringify(row))
    },
    handleDelete: function(row) {
      var str = '删除'
      this.btnExportLoad = true
      this.$confirm('此操作将' + str + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        schedulingEquipCapacity('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.btnExportLoad = false
            this.getList()
          }).catch(e => {
            this.btnExportLoad = false
          })
      })
    },
    changeBranch() {},
    batchSet() {
      if (!this.multipleTableArr.length) {
        this.$message.info('请选择列表数据')
        return
      }
      this.dialogVisible = true
    },
    templateDownload() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      schedulingEquipCapacity('get', null, { params: obj, responseType: 'blob' })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '机台设备生产能力.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    addList() {
      this.dialogVisible = true
    },
    Upload(param) {
    //   const formData = new FormData()
    //   formData.append('file', param.file)
    //   equipOrderAssignRuleImportXlsx('post', null, { data: formData }).then(response => {
    //     this.$message({
    //       type: 'success',
    //       message: response
    //     })
    //     this.changeList()
    //   })
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.formData.id ? 'put' : 'post'
            await schedulingEquipCapacity(_api, this.formData.id || null, { data: this.formData })
            this.$message.success('操作成功')
            this.handleClose(false)
            this.getList()
            this.btnLoading = false
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
