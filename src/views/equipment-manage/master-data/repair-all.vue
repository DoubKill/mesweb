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
        <div style="width:100%;overflow: hidden;margin-bottom:5px;">
          <el-button v-permission="['equip_maintenance_setting', 'add']" style="float:right;margin-right:20px" size="small" type="primary" @click="addFun">添加</el-button>
        </div>
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
                v-permission="['equip_maintenance_setting', 'delete']"
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
          <el-select v-model="dialogForm.equip" placeholder="请选择" @change="changeEquip">
            <el-option
              v-for="item in equips"
              :key="item.id"
              :label="item.equip_no"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部位名称:" prop="">
          <el-select v-model="dialogForm.equip_part" placeholder="请选择" @visible-change="getVisibleChange" @change="clickArea">
            <el-option
              v-for="item in equipPartList"
              :key="item.id"
              :label="item.part_name"
              :value="item.part"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区域:" prop="">
          <el-input v-model="dialogForm.equip_area_name" disabled clearable />
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
import { equipBom } from '@/api/base_w_four'
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
        equip: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_part: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      dialogVisible: false,
      btnLoading: false,
      equips: [],
      total: 0,
      equipPartList: []
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
        const arr = data.results
        const arr1 = aaa(arr)
        this.data = arr1 || []
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
    async getPartList() {
      try {
        const obj = {
          level: 4,
          equip_info: this.dialogForm.equip,
          part__use_flag: true
        }
        if (!this.dialogForm.equip) {
          return
        }
        const data = await equipBom('get', null, { params: obj })
        this.equipPartList = data || []
      } catch (e) {
        this.equipPartList = []
      }
    },
    clickArea(id) {
      const arr = this.equipPartList.filter(d => d.part === id)
      if (arr.length > 0) {
        this.dialogForm.equip_area_name = arr[0].equip_area_name
        this.dialogForm.equip_area = arr[0].equip_area_define
      }
    },
    changeEquip() {
      this.$set(this.dialogForm, 'equip_part', '')
      this.$set(this.dialogForm, 'equip_area_name', '')
      this.$set(this.dialogForm, 'equip_area', '')
    },
    getVisibleChange(bool) {
      if (bool) {
        this.getPartList()
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
        const data = await equipMaintenanceAreaSettings('get', null, { params: { maintenance_user_id: this.formInline.user_id, page: this.formInline.page,
          page_size: this.formInline.page_size }})
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    onSubmit() {},
    addFun() {
      if (!this.formInline.user_id) {
        this.$message.info('请选择用户')
        return
      }
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
      this.dialogForm.maintenance_user = this.formInline.user_id
      this.$refs.dialogForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            await equipMaintenanceAreaSettings(_api, this.dialogForm.id || null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.getAreaSettings()
            this.handleClose(false)
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
function aaa(arr) {
  const arr2 = arr.filter(d => d.label === '设备科')
  if (arr2.length > 0) {
    return arr2
  } else {
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index]
      if (aaa(element.children).length) {
        return aaa(element.children)
      } else {
        aaa(element.children)
      }
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
