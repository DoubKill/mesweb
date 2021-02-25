<template>
  <div>
    <!-- 停机原因定义 -->
    <el-form :inline="true">
      <el-form-item label="停机类型:">
        <shutdownMoldSelect @shutdownMoldChange="shutdownMoldChange" />
      </el-form-item>
      <el-form-item class="button-right">
        <el-button @click="add">新建</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        width="40"
        type="index"
      />
      <el-table-column
        prop="equip_down_type_name"
        label="停机类型"
        min-width="30"
      />
      <el-table-column
        prop="no"
        label="停机编码"
        min-width="30"
      />
      <el-table-column
        prop="desc"
        label="原因描述"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-popover
            v-model="scope.row.visible"
            placement="right"
            width="400"
            trigger="manual"
          >
            <el-input
              v-model="reason"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            />
            <i slot="reference" class="el-icon-edit slotIconStyle" @click="iconEdit(scope.row,scope.$index)" />
            <el-button style="float:right;margin-top:5px" size="mini" @click="submitFun(scope.row,scope.$index)">确定</el-button>
            <el-button style="float:right;margin-top:5px;margin-right:5px" size="mini" @click="scope.row.visible = false">取消</el-button>
          </el-popover>
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_username"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
        min-width="30"
      />
      <el-table-column
        prop="address"
        label="操作"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="searchData.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="600"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="停机类型" prop="equip_down_type">
          <shutdownMoldSelect ref="shutdownMoldSelect" @shutdownMoldChange="shutdownMoldDialog" />
        </el-form-item>
        <el-form-item label="停机编码" prop="no">
          <el-input v-model="ruleForm.no" />
        </el-form-item>
        <el-form-item label="原因" prop="desc">
          <el-input
            v-model="ruleForm.desc"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="refertoFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import shutdownMoldSelect from '../components/shutdown-mold-select'
import { equipDownReason } from '@/api/base_w_two'
import page from '@/components/page'
export default {
  components: { shutdownMoldSelect, page },
  data() {
    return {
      tableData: [],
      reason: '',
      dialogVisible: false,
      ruleForm: {
        no: '',
        desc: ''
      },
      loadingBtn: false,
      rules: {
        no: [{ required: true, message: '不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip_down_type: [{ required: true, message: '不能为空',
          validator: (rule, value, callback) => {
            if (!this.ruleForm.equip_down_type) {
              callback(new Error('选择停机类型'))
            } else {
              callback()
            }
          },
          trigger: 'change' }]
      },
      total: 0,
      searchData: {
        page: 1,
        page_size: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await equipDownReason('get', null, { params: this.searchData })
        this.tableData = data.results || []
        this.total = data.count
      } catch (e) {
        //
      }
    },
    refertoFun() {
      this.$refs['ruleForm'].validate(async(valid) => {
        if (valid) {
          this.loadingBtn = true
          await equipDownReason('post', null, { data: this.ruleForm })
          this.$message.success('添加成功')
          this.getList()
          this.handleClose(false)
          this.loadingBtn = false
        }
      })
    },
    shutdownMoldChange(obj) {
      this.searchData.equip_down_type_name = obj ? obj.name : ''
      this.searchData.page = 1
      this.getList()
    },
    shutdownMoldDialog(obj) {
      this.ruleForm.equip_down_type = obj ? obj.id : ''
    },
    currentChange(page, page_size) {
      this.searchData.page = page
      this.searchData.page_size = page_size
      this.getList()
    },
    async submitFun(row, index) {
      try {
        await equipDownReason('patch', row.id, { data: { desc: this.reason }})
        this.getList()
        this.tableData[index].visible = false
      } catch (e) {
        //
      }
    },
    iconEdit(row, index) {
      this.tableData.forEach((D) => {
        D.visible = false
      })
      row.visible = true
      this.reason = row.desc
    },
    add() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$refs.ruleForm.clearValidate()
      this.$refs.ruleForm.resetFields()
      this.$refs.shutdownMoldSelect.className = null
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    handleDelete(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipDownReason('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.ruleForm.page = 1
            this.getList()
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .slotIconStyle{
    color: rgb(11, 189, 11);
    font-size: 20px;
    display: inline-block;
    width: 30px;
  }
</style>
