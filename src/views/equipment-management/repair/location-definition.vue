<template>
  <div class="location-definition-style">
    <!-- 设备部位定义 -->
    <el-form :inline="true">
      <el-form-item label="设备类型:">
        <equipTypeSelect @equipTypeSelect="changeList" />
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
        <el-button @click="dialogEditVisible = true">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        type="index"
        width="40"
      />
      <el-table-column
        prop="date"
        label="工序"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="设备类型"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="设备名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备部位"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="设备部位编码"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="位置点"
        min-width="20"
      />
      <el-table-column
        label="操作"
        min-width="20"
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

    <el-dialog
      :title="bindingForm.id?'编辑':'新增'"
      :visible.sync="dialogEditVisible"
      :before-close="handleClose"
      width="500"
    >
      <el-form ref="editForm" :rules="rules" :model="bindingForm" label-width="120px">
        <el-form-item label="设备类型:">
          <equipTypeSelect @equipTypeSelect="changeList" />
        </el-form-item>
        <el-form-item label="工序:">
          //
        </el-form-item>
        <el-form-item label="设备编码:">
          //
        </el-form-item>
        <el-form-item label="设备名称:">
          //
        </el-form-item>
        <el-form-item label="位置点:" prop="a">
          <locationSiteSelect ref="locationSiteSelect" :default-val="bindingForm.a" @locationSelect="locationSelect" />
        </el-form-item>
        <el-form-item label="设备部位编码:" prop="b">
          <el-input
            v-model="bindingForm.b"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="设备部位名称:" prop="c">
          <el-input
            v-model="bindingForm.c"
            placeholder="请输入内容"
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
// import equipSelect from '@/components/select_w/equip'
export default {
  components: { equipTypeSelect, locationSiteSelect },
  data() {
    return {
      search: {},
      bindingForm: {},
      tableData: [],
      rules: {
        a: [
          { required: true, message: '请选择位置点', trigger: 'change' }
        ],
        b: [
          { required: true, message: '请输入设备部位编码', trigger: 'blur' }
        ],
        c: [
          { required: true, message: '请输入设备部位名称', trigger: 'blur' }
        ]
      },
      dialogEditVisible: false
    }
  },
  methods: {
    async getList() {
      try {
        // this.loading = true
        // const data = await spareInventory('get', null, { params: this.search })
        // this.tableData = data.results
        // this.total = data.count
      } catch (e) {
        //
      }
      this.loading = false
    },
    changeList() {
      this.getList()
    },
    showEditDialog: function(row) {
      this.bindingForm = Object.assign({}, row)
      this.dialogEditVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    locationSelect() {},
    handleClose(done) {
      this.dialogEditVisible = false
      this.$refs.editForm.clearValidate()
      this.$refs.editForm.resetFields()
      this.$refs.locationSiteSelect.className = ''
      if (done) {
        done()
      }
    },
    handleDelete: function(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteMaterialLocationBinding(row.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     })
        //     this.getParams.page = 1
        //     this.getTableData()
        //   }).catch(e=>{
        //  this.$message.error('删除失败')
        // })
      })
    },
    submitFun() {
      this.$refs.editForm.validate(async(valid) => {
        if (valid) {
          try {
            // await outStorage('post', this.currentRow.id, { data: obj })
            // this.$message.success('操作成功')
            // this.handleClose(null)
            // this.getList()
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
