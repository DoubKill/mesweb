<template>
  <div>
    <!-- 定机表(段次及主副机台) -->
    <el-form
      :inline="true"
    >
      <el-form-item label="胶料类别">
        <el-select
          v-model="search.rubber_type"
          placeholder="请选择"
          clearable
          @change="getList"
        >
          <el-option
            v-for="item in ['车胎','丁基、胶浆、胶囊','实心胎','斜交','半钢','全钢']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="配方名称">
        <el-input
          v-model="search.product_no"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['aps_machine_setting','export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel模板</el-button>
        <el-upload
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button v-permission="['aps_machine_setting','import']" type="primary">导入Excel</el-button>
        </el-upload>
        <el-button v-permission="['aps_machine_setting','add']" type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        header-align="center"
        prop="rubber_type"
        label="胶料类别"
      />
      <el-table-column
        header-align="center"
        prop="stage"
        label="段数"
      />
      <el-table-column
        header-align="center"
        prop="product_no"
        label="配方名称"
      />
      <el-table-column
        header-align="center"
        label="混炼MB"
      >
        <el-table-column
          header-align="center"
          label="配方机台"
        >
          <el-table-column
            header-align="center"
            label="主"
            prop="mixing_main_machine"
          />

          <el-table-column
            header-align="center"
            label="副"
            prop="mixing_vice_machine1"
          />
        </el-table-column>
      </el-table-column>
      <el-table-column
        header-align="center"
        label="加硫FM"
      >
        <el-table-column
          header-align="center"
          label="配方机台"
        >
          <el-table-column
            header-align="center"
            label="主"
            prop="final_main_machine"
          />

          <el-table-column
            header-align="center"
            label="副"
            prop="final_vice_machine1"
          />
        </el-table-column>
      </el-table-column>
      <el-table-column
        v-if="!exportTableShow"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['aps_machine_setting','change']"
            type="primary"
            size="mini"
            @click="editOrder(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['aps_machine_setting','delete']"
            type="danger"
            size="mini"
            @click="deleteOrder(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="`${typeForm.id?'修改':'新建'}定机表信息`"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="createForm" :inline="true" label-width="180px" :rules="rules" :model="typeForm">
        <el-form-item label="胶料类别" style="" prop="rubber_type">
          <el-select
            v-model="typeForm.rubber_type"
            :disabled="typeForm.id?true:false"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in ['车胎','丁基、胶浆、胶囊','实心胎','斜交','半钢','全钢']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="段次" prop="stage">
          <el-select
            v-model="typeForm.stage"
            :disabled="typeForm.id?true:false"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配方名称" prop="product_no">
          <el-select
            v-model="typeForm.product_no"
            :disabled="typeForm.id?true:false"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.product_no"
              :value="item.product_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="混炼MB主机台" prop="mixing_main_machine">
          <el-select
            v-model="typeForm.mixing_main_machine"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="混炼MB副机台" prop="mixing_vice_machine">
          <el-select
            v-model="typeForm.mixing_vice_machine"
            placeholder="请选择"
            clearable
            multiple
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="终炼FM主机台" prop="final_main_machine">
          <el-select
            v-model="typeForm.final_main_machine"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="终炼FM副机台" prop="final_vice_machine">
          <el-select
            v-model="typeForm.final_vice_machine"
            placeholder="请选择"
            clearable
            multiple
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { classesListUrl, productInfosUrl } from '@/api/base_w'
import { getEquip } from '@/api/banburying-performance-manage'
import { exportExcel } from '@/utils/index'
import { schedulingRecipeMachineSetting, schedulingRecipeMachineImport } from '@/api/jqy'
export default {
  name: 'ScheduleMachineTable',
  components: {},
  data() {
    return {
      dialogVisible: false,
      submit: false,
      options: [],
      options1: [],
      options2: [],
      btnExportLoad: false,
      search: {},
      exportTableShow: false,
      loading: false,
      tableData: [],
      typeForm: {},
      rules: {
        rubber_type: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        stage: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        product_no: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        mixing_main_machine: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        final_main_machine: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.getList()
    this.equipChange()
    this.classesChange()
    this.productChange()
  },
  methods: {
    equipChange() {
      const obj = { all: 1, category_name: '密炼设备' }
      getEquip(obj).then(response => {
        this.options = response.results
      })
    },
    editOrder(row) {
      this.typeForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    deleteOrder: function(row) {
      this.$confirm('此操作将删除' + row.product_no + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        schedulingRecipeMachineSetting('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    async classesChange() {
      const obj = { all: 1, class_name: '胶料段次' }
      const data = await classesListUrl('get', null, { params: obj })
      this.options1 = data.results
    },
    async productChange() {
      const obj = { all: 1 }
      const data = await productInfosUrl('get', null, { params: obj })
      this.options2 = data.results
    },
    async getList() {
      try {
        this.loading = true
        const data = await schedulingRecipeMachineSetting('get', null, { params: this.search })
        this.tableData = data || []
        this.tableData.forEach(d => {
          d.mixing_vice_machine1 = getStringEquip(d.mixing_vice_machine)
          d.final_vice_machine1 = getStringEquip(d.final_vice_machine)
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.$debounce(this, 'getList')
    },
    onSubmit() {
      if (this.$refs.createForm) {
        this.$refs.createForm.clearValidate()
      }
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$refs.createForm.clearValidate()
      this.typeForm = {}
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    async generateFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            const _api = this.typeForm.id ? 'put' : 'post'
            this.submit = true
            await schedulingRecipeMachineSetting(_api, this.typeForm.id || null, { data: this.typeForm })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.submit = false
            this.dialogVisible = false
          } catch (e) {
            this.submit = false
            this.dialogVisible = true
          }
        } else {
          return false
        }
      })
    },
    async exportTable() {
      await this.$set(this, 'exportTableShow', true)
      await exportExcel('定机表')
      setTimeout(() => {
        this.exportTableShow = false
      }, 1000)
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      schedulingRecipeMachineImport('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: '导入成功'
        })
        this.getList()
      })
    }
  }
}
function getStringEquip(arr) {
  var str = ''
  arr.forEach(d => {
    str += d + '/'
  })
  str = str.substr(0, str.length - 1)
  return str
}
</script>

<style scoped lang='scss'>
</style>
