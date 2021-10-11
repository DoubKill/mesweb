<template>
  <div class="supplier-style">
    <!-- 供应商管理台账 -->
    <el-form :inline="true">
      <el-form-item label="供应商类别">
        <el-select v-model="formInline.supplier_type" clearable placeholder="供应商类别" @change="changeSearch" @visible-change="getSupplierType">
          <el-option
            v-for="item in SupplierTypeList"
            :key="item.global_name"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-input v-model="formInline.supplier_name" clearable placeholder="供应商名称" @input="debounceList" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="formInline.use_flag" clearable placeholder="是否启用" @change="changeSearch">
          <el-option
            v-for="item in [{label:'Y',value:1},{label:'N',value:0}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="onSubmit">导出Excel</el-button>
        <el-button type="primary" @click="onSubmit">导入Excel</el-button>
        <el-button type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="supplier_code"
        label="供应商编号"
        min-width="20"
      />
      <el-table-column
        prop="supplier_name"
        label="供应商名称"
        min-width="20"
      />
      <el-table-column
        prop="region"
        label="地域"
        min-width="20"
      />
      <el-table-column
        prop="contact_name"
        label="联系人姓名"
        min-width="20"
      />
      <el-table-column
        prop="contact_phone"
        label="联系人电话"
        min-width="20"
      />
      <el-table-column
        prop="supplier_type"
        label="供应商类别"
        min-width="20"
      />
      <el-table-column
        prop="use_flag"
        label="是否启用"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.use_flag===true">Y</span>
          <span v-if="scope.row.use_flag===false">N</span>
        </template>
      </el-table-column>
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
            >{{ scope.row.use_flag?'停用':'启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="formInline.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${dialogForm.id?'编辑':'新建'}供应商`"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="100px"
        :model="dialogForm"
      >
        <el-form-item
          label="供应商代码"
          prop="supplier_code"
        >
          <el-input v-model="dialogForm.supplier_code" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="供应商名称"
          prop="supplier_name"
        >
          <el-input v-model="dialogForm.supplier_name" />
        </el-form-item>
        <el-form-item
          label="地域"
          prop="region"
        >
          <el-select v-model="dialogForm.region" placeholder="请选择">
            <el-option
              v-for="item in ['浙江','大连']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="联系人姓名"
          prop="contact_name"
        >
          <el-input v-model="dialogForm.contact_name" />
        </el-form-item>
        <el-form-item
          label="联系人电话"
          prop="contact_phone"
        >
          <el-input v-model="dialogForm.contact_phone" />
        </el-form-item>
        <el-form-item
          label="供应商类别"
          prop="supplier_type"
        >
          <el-select v-model="dialogForm.supplier_type" placeholder="请选择" @visible-change="getSupplierType">
            <el-option
              v-for="item in SupplierTypeList"
              :key="item.global_name"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
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
import page from '@/components/page'
import { debounce } from '@/utils'
import { equipSupplierList, getSupplierType } from '@/api/jqy'
export default {
  name: 'EquipmentMasterDataSupplier',
  components: { page },
  data() {
    return {
      formInline: {},
      tableData: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      use_flag: '',
      rules: {
        supplier_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        supplier_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        region: [{ required: true, message: '不能为空', trigger: 'change' }],
        contact_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        contact_phone: [{ required: true, message: '不能为空', trigger: 'blur' }],
        supplier_type: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      SupplierTypeList: [],
      dialogForm: { supplier_code: 'GYS00X' },
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
        const data = await equipSupplierList('get', null, { params: this.formInline })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getSupplierType(val) {
      console.log(val)
      if (val === true) {
        try {
          const data = await getSupplierType('get', null, { params: { all: 1, class_name: '供应商类别' }})
          this.SupplierTypeList = data.results
        } catch (error) {
          this.SupplierTypeList = []
        }
      }
    },
    debounceList() {
      debounce(this, 'changeSearch')
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getList()
    },
    onSubmit() {
      this.dialogForm = { supplier_code: 'GYS00X' }
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    changeSearch() {
      this.formInline.page = 1
      this.getList()
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.supplier_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.use_flag = !row.use_flag
        equipSupplierList('delete', row.id, {})
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
            await equipSupplierList(_api, this.dialogForm.id || null, { data: this.dialogForm })
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
.supplier-style{
  .el-input{
    width:250px;
  }
}
</style>
