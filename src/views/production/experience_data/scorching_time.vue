<template>
  <div class="scorching-style">
    <!-- 焦烧时间录入及查询 -->
    <el-form :inline="true">
      <el-form-item label="配方类别">
        <el-select v-model="search.use_flag" clearable @change="changeSearch">
          <el-option
            v-for="item in [{label:'车胎',value:1},{label:'斜交',value:0}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="规格">
        <el-input v-model="search.area_name" clearable @input="debounceList" />
      </el-form-item>
      <el-form-item label="月份">
        <el-date-picker
          v-model="value"
          value-format="yyyy-MM"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select
          @classSelected="classSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['equip_area', 'export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-button v-permission="['equip_area', 'add']" type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
      highlight-current-row
    >
      <el-table-column
        prop="area_code"
        label="配方类别"
        min-width="20"
      />
      <el-table-column
        prop="area_name"
        label="规格"
        min-width="20"
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
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            v-permission="['equip_area', 'change']"
            type="primary"
            size="mini"
            @click="showEditDialog(scope.row)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="`${dialogForm.id?'编辑':'新建'}焦烧检测结果`"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
      >
        <el-form-item label="配方类别" prop="area_code">
          <el-select v-model="dialogForm.area_code" :disabled="dialogForm.id?true:false">
            <el-option
              v-for="item in [{label:'车胎',value:1},{label:'斜交',value:0}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="规格"
          prop="area_code"
        >
          <el-input v-model="dialogForm.area_code" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item label="机台" prop="equip_no">
          <equip-select
            :is-create="true"
            :default-val="dialogForm.equip_no"
            @equipSelected="equipSelected"
          />
        </el-form-item>
        <el-form-item label="日期" prop="factory_date">
          <el-date-picker
            v-model="dialogForm.factory_date"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="班次" prop="classes">
          <class-select
            :value-default="dialogForm.classes"
            :is-clearable="false"
            @classSelected="classChanged"
          />
        </el-form-item>
        <el-form-item label="检测方法" prop="area_code">
          <el-select v-model="dialogForm.area_code">
            <el-option
              v-for="item in [{label:'车胎',value:1},{label:'斜交',value:0}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="检测结果（分钟）"
          prop="min"
        >
          <el-input-number v-model="dialogForm.min" style="width:200px" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect'
import { debounce } from '@/utils'
import classSelect from '@/components/ClassSelect'
import { equipAreaDefine, equipAreaDefineDown } from '@/api/jqy'
export default {
  name: 'EquipmentMasterDataLocation',
  components: { EquipSelect, classSelect },
  data() {
    return {
      search: {},
      tableData: [],
      value: [],
      total: 0,
      loading: false,
      btnExportLoad: false,
      dialogVisible: false,
      use_flag: '',
      rules: {
        area_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        area_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        min: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      SupplierTypeList: [],
      dialogForm: {},
      btnLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipAreaDefine('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeDate() {
      this.search.st = this.value[0]
      this.search.et = this.value[1]
      this.getList()
    },
    debounceList() {
      debounce(this, 'changeSearch')
    },
    async onSubmit() {
      this.dialogForm = { area_code: '' }
      this.dialogVisible = true
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = equipAreaDefineDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '设备区域位置定义.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    showEditDialog(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    classSearch(val) {
      this.search.classes = val
      this.getList()
    },
    classChanged(val) {
      this.$set(this.dialogForm, 'classes', val)
    },
    equipSelected(obj) {
      this.$set(this.dialogForm, 'equip_no', obj ? obj.equip_no : '')
    },
    changeSearch() {
      this.getList()
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.area_code + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipAreaDefine('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    handleClose(done) {
      this.dialogVisible = false
      // this.$refs.createForm.resetFields()
      // if (done) {
      //   done()
      // }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            if (this.dialogForm.inspection_line_no === '') {
              this.dialogForm.inspection_line_no = null
            }
            await equipAreaDefine(_api, this.dialogForm.id || null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.handleClose(null)
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

<style lang="scss">
.scorching-style{
  .el-input{
    width:200px;
  }
}
</style>

