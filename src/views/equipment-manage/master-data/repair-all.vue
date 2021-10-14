<template>
  <div class="repair-all-style">
    <!-- 维修包干定义 -->
    <el-container style="height:580px;">
      <el-aside width="400px" class="border-style aside-style">
        <h3>人员组织架构</h3>
        <el-tree :highlight-current="true" :data="data" default-expand-all :props="defaultProps" @node-click="handleNodeClick" />
      </el-aside>
      <el-main v-loading="loading" class="border-style">
        <h3>维修包干设置</h3>
        <el-form :inline="true" label-width="100px">
          <!-- <el-form-item label="节点编号">
            <el-input v-model="formInline.user" disabled placeholder="规则名称" />
          </el-form-item><br> -->
          <el-form-item label="姓名">
            <el-input v-model="formInline.label" disabled clearable />
          </el-form-item>
          <el-form-item label="职务">
            <el-input v-model="formInline.user" disabled clearable />
          </el-form-item>
          <!-- <el-form-item>
            <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
          </el-form-item> -->
        </el-form>
        <h4>维修区域设定</h4>
        <el-button style="float:right;margin-right:20px" size="small" type="primary" @click="addFun">添加</el-button>
        <el-table
          :data="tableData"
          style="width: 90%"
          border
        >
          <el-table-column
            prop="equip_no"
            label="机台"
            min-width="20"
          />
          <el-table-column
            prop="equip_part_name"
            label="部位名称"
            min-width="20"
          />
          <el-table-column
            prop="equip_area_name"
            label="区域"
            min-width="20"
          />
          <el-table-column
            label="操作"
            width="130"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                :disabled="btnLoading"
                @click="handleUserDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <page
          :old-page="false"
          :total="total"
          :current-page="formInline.page"
          @currentChange="currentChange"
        />
      </el-main>
    </el-container>
    <el-dialog
      :title="'添加包干区域'"
      width="400px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-form ref="dialogForm" label-width="100px" :model="dialogForm" :rules="rules">
        <el-form-item label="机台:" prop="equip">
          <el-select v-model="dialogForm.equip" placeholder="请选择">
            <el-option
              v-for="item in equips"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部位名称:" prop="equip_part">
          <el-select v-model="dialogForm.equip_part" placeholder="请选择">
            <el-option
              v-for="item in ['浙江','大连']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区域:" prop="equip_area">
          <el-input v-model="dialogForm.equip_area" disabled clearable />
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
import { equipUrl } from '@/api/base_w'
import { sectionUserTree, equipMaintenanceAreaSettings } from '@/api/base_w_four'
export default {
  name: 'EquipmentMasterDataRepairAll',
  components: { page },
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [],
      formInline: {},
      loading: false,
      dialogForm: {},
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      dialogVisible: false,
      btnLoading: false,
      equips: [],
      total: 0
    }
  },
  created() {
    this.getTree()
    this.getEquipList()
  },
  methods: {
    async getTree() {
      try {
        this.loading = true
        const data = await sectionUserTree('get')
        this.data = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getEquipList() {
      try {
        const equipData = await equipUrl('get', { params: { all: 1 }})
        this.equips = equipData.results
      } catch (e) {
        //
      }
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getAreaSettings()
    },
    async handleNodeClick(val) {
      this.formInline = val
      if (val.user_id) {
        this.getAreaSettings()
      } else {
        this.tableData = []
      }
    },
    async getAreaSettings() {
      try {
        this.loading = true
        const data = await equipMaintenanceAreaSettings('get', null, { params: { maintenance_user_id: this.formInline.user_id }})
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    onSubmit() {},
    addFun() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      this.dialogForm = {}
      this.$refs.dialogForm.resetFields()
      if (done) {
        done()
      }
    },
    submitFun() {
      if (!this.formInline.user_id) {
        this.$message.info('请选择用户')
        return
      }
      this.dialogForm.maintenance_user = this.formInline.user_id
      this.$refs.dialogForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            // const _api = this.bindingForm.id ? 'put' : 'post'
            // await equipPart(_api, this.bindingForm.id || null, { data: this.bindingForm })
            this.$message.success('操作成功')
            this.getAreaSettings()
            this.btnLoading = false
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    },
    handleUserDelete(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.btnLoading = true
        equipMaintenanceAreaSettings('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getAreaSettings()
            this.btnLoading = false
          }).catch(e => {
            this.btnLoading = false
            this.$message.error('删除失败')
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.repair-all-style{
  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-thumb {
      background: #eee
  }
  .el-main{
    padding:0;
  }
  .border-style{
    border:1px solid #eee;
    padding-left:10px;
  }
  .aside-style{
    // padding: 20px;
    margin-right:10px;
  }
  .el-input{
    width:250px;
  }
}
</style>
