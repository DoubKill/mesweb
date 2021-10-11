<template>
  <div class="supplier-style">
    <!-- 设备位置区域定义 -->
    <el-form :inline="true">
      <el-form-item label="位置区域名称">
        <el-input v-model="formInline.area_name" placeholder="位置区域名称" @input="debounceList" />
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
        prop="area_code"
        label="位置区域编号"
        min-width="20"
      />
      <el-table-column
        prop="area_name"
        label="位置区域名称"
        min-width="20"
      />
      <el-table-column
        prop="inspection_line_no"
        label="巡检顺序编号"
        min-width="20"
      />
      <el-table-column
        prop="desc"
        label="备注说明"
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
        label-width="150px"
        :model="dialogForm"
      >
        <el-form-item
          label="位置区域编号"
          prop="area_code"
        >
          <el-input v-model="dialogForm.area_code" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="位置区域名称"
          prop="area_name"
        >
          <el-input v-model="dialogForm.area_name" />
        </el-form-item>
        <el-form-item
          label="巡检顺序编号"
          prop="inspection_line_no"
        >
          <el-input v-model="dialogForm.inspection_line_no" />
        </el-form-item>
        <el-form-item
          label="备注说明"
          prop="desc"
        >
          <el-input
            v-model="dialogForm.desc"
            style="width:250px"
            type="textarea"
            :rows="4"
          />
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
import { equipAreaDefine } from '@/api/jqy'
export default {
  name: 'EquipmentMasterDataLocation',
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
        area_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        area_code: [{ required: true, message: '不能为空', trigger: 'blur' }]
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
        const data = await equipAreaDefine('get', null, { params: this.formInline })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    debounceList() {
      this.formInline.page = 1
      debounce(this, 'changeSearch')
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getList()
    },
    onSubmit() {
      this.dialogForm = { area_code: 'WZQY00X' }
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
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
.supplier-style{
  .el-input{
    width:250px;
  }
}
</style>

