<template>
  <div class="location-definition-style">
    <!-- 设备部位定义 -->
    <el-form :inline="true">
      <el-form-item label="设备类型:">
        <equipTypeSelect @equipTypeSelect="equipTypeSelect" />
      </el-form-item>
      <el-form-item label="设备编码:">
        <!-- <equip-select
          :equip_no_props.sync="search.equip_no"
          @equipTypeSelect="changeList"
        /> -->
        <el-input v-model="search.equip_no" placeholder="请输入内容" @input="changeList" />
      </el-form-item>
      <el-form-item label="设备名称:">
        <el-input v-model="search.equip_name" placeholder="请输入内容" @input="changeList" />
      </el-form-item>
      <el-form-item>
        <el-button @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column
        label="No"
        type="index"
        width="40"
      />
      <el-table-column
        prop="process"
        label="工序"
        min-width="8"
      />
      <el-table-column
        prop="equip_type"
        label="设备类型"
        min-width="10"
      />
      <el-table-column
        prop="equip_no"
        label="设备编码"
        min-width="10"
      />
      <el-table-column
        prop="equip_name"
        label="设备名称"
        min-width="10"
      />
      <el-table-column
        prop="name"
        label="设备部位"
        min-width="20"
      />
      <el-table-column
        prop="no"
        label="设备部位编码"
        min-width="20"
      />
      <el-table-column
        prop="location_name"
        label="位置点"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="130"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
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
      :title="bindingForm.id?'编辑':'新增'"
      :visible.sync="dialogEditVisible"
      :before-close="handleClose"
      width="500"
    >
      <el-form ref="editForm" :rules="rules" :model="bindingForm" label-width="120px">
        <el-form-item label="设备:" prop="equip">
          <EquipSelect :is-created="true" :default-val="bindingForm.equip" @equipSelected="equipSelected" />
        </el-form-item>
        <el-form-item label="位置点:" prop="location">
          <locationSiteSelect ref="locationSiteSelect" :is-created="true" :default-val="bindingForm.location" @locationSelect="locationSelect" />
        </el-form-item>
        <el-form-item label="设备部位名称:" prop="name">
          <el-input
            v-model="bindingForm.name"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="设备部位编码:" prop="no">
          <el-input
            v-model="bindingForm.no"
            placeholder="请输入内容"
            :disabled="!!bindingForm.id"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(null)">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import equipTypeSelect from '../components/equip-type-select'
import locationSiteSelect from '../components/location-site-select'
import EquipSelect from '@/components/EquipSelect'
import page from '@/components/page'
import { equipPart } from '@/api/base_w_two'
export default {
  components: { page, equipTypeSelect, EquipSelect, locationSiteSelect },
  data() {
    const validator = (rule, value, callback, _value, str) => {
      if (!_value) {
        callback(new Error(str))
      } else {
        callback()
      }
    }
    return {
      search: {
        page: 1,
        page_size: 10
      },
      loading: false,
      bindingForm: {
        name: '',
        no: ''
      },
      tableData: [],
      rules: {
        equip: [
          { required: true, trigger: 'change', validator: (rule, value, callback) => {
            validator(rule, value, callback,
              this.bindingForm.equip, '请选择设备')
          } }
        ],
        location: [
          { required: true, trigger: 'change', validator: (rule, value, callback) => {
            validator(rule, value, callback,
              this.bindingForm.location, '请选择位置点')
          } }
        ],
        name: [{ required: true, message: '请输入设备部位编码', trigger: 'blur' }],
        no: [{ required: true, message: '请输入设备部位名称', trigger: 'blur' }]
      },
      dialogEditVisible: false,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipPart('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
      } catch (e) {
        //
      }
      this.loading = false
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    equipTypeSelect(obj) {
      this.search.equip_type = obj ? obj.global_name : ''
      this.changeList()
    },
    equipSelected(obj) {
      this.bindingForm.equip = obj ? obj.id : ''
    },
    showEditDialog: function(row) {
      this.bindingForm = Object.assign({}, row)
      this.dialogEditVisible = true
    },
    locationSelect(obj) {
      this.$set(this.bindingForm, 'location', obj ? obj.id : '')
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    handleClose(done) {
      this.bindingForm = { equip: '', location: '' }
      this.$refs['editForm'].resetFields()
      if (done) {
        done()
      }
      this.dialogEditVisible = false
    },
    add() {
      this.dialogEditVisible = true
    },
    handleDelete: function(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipPart('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.search.page = 1
            this.getList()
          }).catch(e => {
            this.$message.error('删除失败')
          })
      })
    },
    async submitFun() {
      this.$refs.editForm.validate(async(valid) => {
        if (valid) {
          try {
            const _api = this.bindingForm.id ? 'put' : 'post'
            await equipPart(_api, this.bindingForm.id || null, { data: this.bindingForm })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
          } catch (e) {
            //
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
.location-definition-style{
.el-autocomplete,.el-input,.el-select,.el-input-number{
  width:250px;
}
 .el-pagination .el-select{
    width:auto;
 }
 }

</style>
