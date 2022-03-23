<template>
  <div>
    <!-- 定机表(段次及主辅机台) -->
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
          clearable
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['aps_machine_setting','export']" type="primary" @click="exportTable">导出Excel</el-button>
        <el-upload
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button v-permission="['aps_machine_setting','import']" type="primary">导入定机表Excel</el-button>
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
        prop="product_no"
        label="配方名称"
      />
      <el-table-column
        header-align="center"
        prop="version"
        label="配方尾号"
      />
      <el-table-column
        header-align="center"
        prop="stages1"
        label="所需段数"
      />
      <el-table-column
        header-align="center"
        label="HMB"
      >
        <el-table-column
          header-align="center"
          label="主"
          prop="main_machine_HMB"
        />
        <el-table-column
          header-align="center"
          label="辅"
          prop="vice_machine_HMB1"
        />
      </el-table-column>
      <el-table-column
        header-align="center"
        label="CMB"
      >
        <el-table-column
          header-align="center"
          label="主"
          prop="main_machine_CMB"
        />
        <el-table-column
          header-align="center"
          label="辅"
          prop="vice_machine_CMB1"
        />
      </el-table-column>
      <el-table-column
        header-align="center"
        label="1MB"
      >
        <el-table-column
          header-align="center"
          label="主"
          prop="main_machine_1MB"
        />
        <el-table-column
          header-align="center"
          label="辅"
          prop="vice_machine_1MB1"
        />
      </el-table-column>
      <el-table-column
        header-align="center"
        label="2MB"
      >
        <el-table-column
          header-align="center"
          label="主"
          prop="main_machine_2MB"
        />
        <el-table-column
          header-align="center"
          label="辅"
          prop="vice_machine_2MB1"
        />
      </el-table-column>
      <el-table-column
        header-align="center"
        label="3MB"
      >
        <el-table-column
          header-align="center"
          label="主"
          prop="main_machine_3MB"
        />
        <el-table-column
          header-align="center"
          label="辅"
          prop="vice_machine_3MB1"
        />
      </el-table-column>
      <el-table-column
        header-align="center"
        label="FM"
      >
        <el-table-column
          header-align="center"
          label="主"
          prop="main_machine_FM"
        />
        <el-table-column
          header-align="center"
          label="辅"
          prop="vice_machine_FM1"
        />
      </el-table-column>
      <el-table-column
        v-if="!exportTableShow"
        label="操作"
        width="160"
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
      width="50%"
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
        <el-form-item label="配方尾号" prop="version">
          <el-input v-model="typeForm.version" :disabled="typeForm.id?true:false" style="width:200px" />
        </el-form-item>
        <el-form-item label="所需段数" prop="stages">
          <el-select
            v-model="typeForm.stages"
            multiple
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
        <el-form-item label="HMB主机台" prop="main_machine_HMB">
          <el-select
            v-model="typeForm.main_machine_HMB"
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
        <el-form-item label="HMB辅机台" prop="vice_machine_HMB">
          <el-select
            v-model="typeForm.vice_machine_HMB"
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
        <el-form-item label="CMB主机台" prop="main_machine_CMB">
          <el-select
            v-model="typeForm.main_machine_CMB"
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
        <el-form-item label="CMB辅机台" prop="vice_machine_CMB">
          <el-select
            v-model="typeForm.vice_machine_CMB"
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
        <el-form-item label="1MB主机台" prop="main_machine_1MB">
          <el-select
            v-model="typeForm.main_machine_1MB"
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
        <el-form-item label="1MB辅机台" prop="vice_machine_1MB">
          <el-select
            v-model="typeForm.vice_machine_1MB"
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
        <el-form-item label="2MB主机台" prop="main_machine_2MB">
          <el-select
            v-model="typeForm.main_machine_2MB"
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
        <el-form-item label="2MB辅机台" prop="vice_machine_2MB">
          <el-select
            v-model="typeForm.vice_machine_2MB"
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
        <el-form-item label="3MB主机台" prop="main_machine_3MB">
          <el-select
            v-model="typeForm.main_machine_3MB"
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
        <el-form-item label="3MB辅机台" prop="vice_machine_3MB">
          <el-select
            v-model="typeForm.vice_machine_3MB"
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
        <el-form-item label="FM主机台" prop="main_machine_FM">
          <el-select
            v-model="typeForm.main_machine_FM"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options3"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="FM辅机台" prop="vice_machine_FM">
          <el-select
            v-model="typeForm.vice_machine_FM"
            placeholder="请选择"
            clearable
            multiple
          >
            <el-option
              v-for="item in options3"
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
// import { getEquip } from '@/api/banburying-performance-manage'
import { exportExcel } from '@/utils/index'
import { schedulingRecipeMachineSetting, schedulingRecipeMachineImport } from '@/api/jqy'
export default {
  name: 'ScheduleMachineTable',
  components: {},
  data() {
    return {
      dialogVisible: false,
      submit: false,
      options: [
        { id: 1, equip_no: 'Z01' },
        { id: 2, equip_no: 'Z02' },
        { id: 3, equip_no: 'Z03' },
        { id: 4, equip_no: 'Z04' },
        { id: 5, equip_no: 'Z05' },
        { id: 6, equip_no: 'Z06' },
        { id: 7, equip_no: 'Z07' },
        { id: 8, equip_no: 'Z08' },
        { id: 9, equip_no: 'Z09' },
        { id: 10, equip_no: 'Z10' }
      ],
      options1: [],
      options2: [],
      options3: [
        { id: 1, equip_no: 'Z09' },
        { id: 2, equip_no: 'Z10' },
        { id: 3, equip_no: 'Z11' },
        { id: 4, equip_no: 'Z12' },
        { id: 5, equip_no: 'Z13' },
        { id: 6, equip_no: 'Z14' },
        { id: 7, equip_no: 'Z15' }
      ],
      search: {},
      exportTableShow: false,
      loading: false,
      tableData: [],
      typeForm: {},
      rules: {
        rubber_type: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        stages: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        version: [
          { required: true, message: '不能为空', trigger: 'bulr' }
        ],
        product_no: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        main_machine_HMB: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        main_machine_CMB: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        main_machine_1MB: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        main_machine_2MB: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        main_machine_3MB: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        main_machine_FM: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.getList()
    // this.equipChange()
    this.classesChange()
    this.productChange()
  },
  methods: {
    // equipChange() {
    //   const obj = { all: 1, category_name: '密炼设备' }
    //   getEquip(obj).then(response => {
    //     this.options = response.results
    //   })
    // },
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
          d.stages1 = getStringEquip(d.stages)
          d.vice_machine_1MB1 = getStringEquip(d.vice_machine_1MB)
          d.vice_machine_2MB1 = getStringEquip(d.vice_machine_2MB)
          d.vice_machine_3MB1 = getStringEquip(d.vice_machine_3MB)
          d.vice_machine_FM1 = getStringEquip(d.vice_machine_FM)
          d.vice_machine_CMB1 = getStringEquip(d.vice_machine_CMB)
          d.vice_machine_HMB1 = getStringEquip(d.vice_machine_HMB)
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
