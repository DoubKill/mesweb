<template>
  <div>
    <!-- 公差标准区分关键字 -->
    <el-form :inline="true">
      <el-form-item style="float:right">
        <el-button type="primary" @click="showCreateDialog">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="keyword_code"
        label="区分关键字编号"
      />
      <el-table-column
        prop="keyword_name"
        label="区分关键字名称"
      />
      <el-table-column
        prop="re_str"
        label="匹配字符"
      />
      <el-table-column
        prop="desc"
        label="备注"
      />
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            plain
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新建区分关键字"
      width="30%"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="createForm" :rules="rules" :model="dialogForm" label-width="150px">
        <el-form-item
          label="区分关键字编号"
          prop="keyword_code"
        >
          <el-input v-model="dialogForm.keyword_code" style="width:250px" disabled />
        </el-form-item>
        <el-form-item
          label="区分关键字名称"
          prop="keyword_name"
        >
          <el-input v-model="dialogForm.keyword_name" style="width:250px" />
        </el-form-item>
        <el-form-item label="匹配字符" prop="re_str">
          <el-select
            v-model="dialogForm.re_str"
            style="width:250px"
            placeholder="请选择"
            clearable
            multiple
            @visible-change="visibleChange"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="desc"
        >
          <el-input v-model="dialogForm.desc" style="width:250px" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreate"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { toleranceKeyword, getDefaultCode } from '@/api/jqy'
import { globalCodesUrl } from '@/api/base_w'

export default {
  name: 'BanburyingStandardDistinction',
  data: function() {
    return {
      tableData: [],
      dialogCreateVisible: false,
      dialogForm: {},
      loading: false,
      rules: {
        keyword_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      options: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await toleranceKeyword('get', null, { params: { work_type: '区分' }})
        this.tableData = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async visibleChange(val) {
      if (val) {
        try {
          const data = await globalCodesUrl('get', { params: { all: 1, class_name: '原材料类别' }})
          this.options = data.results || []
        } catch (e) {
          this.options = []
        }
      }
    },
    changSelect() {
      this.getList()
    },
    async showCreateDialog() {
      if (this.$refs.createForm) {
        this.$refs.createForm.resetFields()
      }
      this.dialogForm = {}
      const data = await getDefaultCode('get', null, { params: { work_type: '区分' }})
      this.dialogForm.keyword_code = data
      this.dialogCreateVisible = true
    },
    handleCreate() {
      this.dialogForm.work_type = '区分'
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          toleranceKeyword('post', null, { data: this.dialogForm }).then(response => {
            this.dialogCreateVisible = false
            this.$message.success('创建成功')
            this.getList()
          }).catch(e => {
            // errorRepeat(this, e)
          })
        }
      })
    },
    handleDelete: function(row) {
      this.$confirm('此操作将删除' + row.keyword_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        toleranceKeyword('delete', null, { data: { id: row.id, work_type: '区分' }})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    }
  }
}
</script>
<style lang="scss">
</style>
