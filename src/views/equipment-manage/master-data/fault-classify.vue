<template>
  <div class="fault-classify">
    <!-- 设备故障分类管理 -->
    <el-row class="search-form-style">
      <el-col v-loading="loading" :span="10">
        <el-form inline>
          <el-form-item
            label="大分类故障名称"
          >
            <el-input v-model="dataForm.name" />
          </el-form-item>
          <el-form-item
            label="是否启用"
          >
            <el-select v-model="dataForm.value" style="width:130px">
              <el-option
                v-for="item in []"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="margin-bottom:10px"
              @click="addArea(true)"
            >添加</el-button>
          </el-form-item>
        </el-form>

        <el-table
          ref="currentRow"
          :data="tableData"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column
            type="index"
            label="序号"
          />
          <el-table-column
            prop="depot_name"
            label="大分类故障代码"
          />
          <el-table-column
            prop="description"
            label="大分类故障名称"
          />
          <el-table-column
            prop="description"
            label="是否使用"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="mini"
                  @click="editArea(scope.row,true)"
                >编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  @click.stop="delArea(scope.row,true)"
                >{{ scope.row.use_flag ? '停用' : '启用' }}
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col v-loading="loading1" :span="14">
        <el-form inline style="float:right">
          <el-form-item
            label="中分类故障名称"
          >
            <el-input v-model="dataForm1.name" />
          </el-form-item>
          <el-form-item
            label="是否启用"
          >
            <el-select v-model="dataForm1.value">
              <el-option
                v-for="item in []"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-bottom:10px;float:right"
              :disabled="depot?false:true"
              type="primary"
              @click="addArea(false)"
            >添加</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData1"
          border
        >
          <el-table-column
            type="index"
            label="序号"
          />
          <el-table-column
            prop="depot__depot_name"
            label="中分类故障代码"
          />
          <el-table-column
            prop="depot_site_name"
            label="中分类故障名称"
          />
          <el-table-column
            prop="description"
            label="备注"
          />
          <el-table-column
            prop="depot_site_name"
            label="是否使用"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="mini"
                  @click="editArea(scope.row,false)"
                >编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  @click.stop="delArea(scope.row,false)"
                >{{ scope.row.use_flag ? '停用' : '启用' }}
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      :title="(formObj.id?'编辑':'添加')+(isType?'大分类故障':'中分类故障')"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="formObj"
        :model="formObj"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item v-if="!isType" label="中分类故障代码" prop="depot_name">
          <el-input v-model="formObj.depot_name" />
        </el-form-item>
        <el-form-item v-if="!isType" label="中分类故障名称" prop="depot_name">
          <el-input v-model="formObj.depot_name" />
        </el-form-item>
        <el-form-item v-if="!isType" label="备注" prop="depot_site_name">
          <el-input v-model="formObj.depot_site_name" />
        </el-form-item>
        <el-form-item v-if="isType" label="大分类故障代码" prop="description">
          <el-input v-model="formObj.description" />
        </el-form-item>
        <el-form-item v-if="isType" label="大分类故障名称" prop="description">
          <el-input v-model="formObj.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EquipmentMasterDataFaultClassify',
  data() {
    return {
      tableData: [{}],
      tableData1: [{}],
      dataForm: {},
      dataForm1: {},
      formObj: {},
      dialogVisible: false,
      loading: false,
      loading1: false,
      depot: null,
      // true 为大分类故障
      isType: false,
      rules: {
        depot_name: [
          { required: true, message: '请输入库区', trigger: 'blur' }
        ],
        depot_site_name: [
          { required: true, message: '请输入库位', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        depot: [
          { required: true, message: '请选择库区', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await testIndicators('get', null, { all: 1 })
        // this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handleCurrentChange(row) {
      this.depot = row.id
    },
    editArea(row, bool) {
      this.dialogVisible = true
      this.isType = bool
    },
    handleClose(done) {
      this.$refs.formObj.resetFields()
      done()
    },
    submitFun() {
      this.$refs.formObj.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            // const _api = this.isArea ? sulfurDepot : sulfurDepotSite
            // const _method = this.formObj.id ? 'put' : 'post'
            // await _api(_method, this.formObj.id, { data: this.formObj })
            // this.$message.success('操作成功')
            // this.handleClose(false)
            // if (this.isArea) {
            //   this.getList()
            // } else {
            //   this.getList1()
            // }
            this.loadingBtn = false
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    },
    delArea(row, bool) {
      var str = row.delete_flag ? '启用' : '停用'
      this.$confirm('此操作将' + str + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        try {
        //   departmentManage('delete', row.id, {
        //   }).then(response => {
        //     this.$message({ message: '操作成功', type: 'success' })
        //     this.currentChange()
        //   })
        } catch (e) { e }
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss">
.fault-classify{
  .el-input{
    width:160px;
  }
  .el-dialog .el-input{
    width:250px;
  }
}
</style>
