<template>
  <div class="fault-classify">
    <!-- 设备故障分类管理 -->
    <el-row class="search-form-style">
      <el-col :span="10">
        <el-form inline>
          <el-form-item
            label="大分类故障名称"
          >
            <el-input v-model="dataForm.fault_type_name" clearable @input="debounceFun" />
          </el-form-item>
          <el-form-item
            label="是否启用"
          >
            <el-select v-model="dataForm.use_flag" style="width:130px" clearable @change="getListTypeChange">
              <el-option
                v-for="(item,key) in [{label:1,name:'Y'},{label:0,name:'N'}]"
                :key="key"
                :label="item.name"
                :value="item.label"
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
          v-loading="loading"
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
            prop="fault_type_code"
            label="大分类故障代码"
          />
          <el-table-column
            prop="fault_type_name"
            label="大分类故障名称"
          />
          <el-table-column
            prop="use_flag"
            label="是否使用"
            :formatter="(row)=>{return row.use_flag?'Y':'N'}"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="mini"
                  @click.stop="editArea(scope.row,true)"
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
        <page
          :old-page="false"
          :total="total"
          :current-page="dataForm.page"
          @currentChange="currentChange"
        />
      </el-col>
      <el-col :span="14">
        <el-form inline style="float:right">
          <el-form-item
            label="中分类故障名称"
          >
            <el-input v-model="dataForm1.fault_name" clearable @input="debounceFun1" />
          </el-form-item>
          <el-form-item
            label="是否启用"
          >
            <el-select v-model="dataForm1.use_flag" style="width:130px" clearable @change="getListReason">
              <el-option
                v-for="(item,key) in [{label:1,name:'Y'},{label:0,name:'N'}]"
                :key="key"
                :label="item.name"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-bottom:10px;float:right"
              :disabled="equip_machine_halt_type_id&&isLeftStop?false:true"
              type="primary"
              @click="addArea(false)"
            >添加</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="loading1"
          :data="tableData1"
          border
          width="100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60px"
          />
          <el-table-column
            prop="fault_code"
            label="中分类故障代码"
            min-width="20"
          />
          <el-table-column
            prop="fault_name"
            label="中分类故障名称"
            min-width="20"
          />
          <el-table-column
            prop="desc"
            label="备注"
            min-width="20"
          />
          <el-table-column
            prop="use_flag"
            label="是否使用"
            min-width="20"
            :formatter="(row)=>{return row.use_flag?'Y':'N'}"
          />
          <el-table-column
            label="操作"
            width="140px"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="mini"
                  @click.stop="editArea(scope.row,false)"
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
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        ref="formObj"
        :model="formObj"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item v-if="!isType" label="中分类故障代码" prop="fault_code">
          <el-input v-model="formObj.fault_code" :disabled="formObj.id?true:false" />
        </el-form-item>
        <el-form-item v-if="!isType" label="中分类故障名称" prop="fault_name">
          <el-input :key="2" v-model="formObj.fault_name" />
        </el-form-item>
        <el-form-item v-if="!isType" label="备注" prop="">
          <el-input :key="3" v-model="formObj.desc" />
        </el-form-item>
        <el-form-item v-if="isType" label="大分类故障代码" prop="fault_type_code">
          <el-input v-model="formObj.fault_type_code" :disabled="formObj.id?true:false" />
        </el-form-item>
        <el-form-item v-if="isType" label="大分类故障名称" prop="fault_type_name">
          <el-input v-model="formObj.fault_type_name" />
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
import page from '@/components/page'
import { equipFaultTypes, equipFaultCodes } from '@/api/base_w_four'
export default {
  name: 'EquipmentMasterDataFaultClassify',
  components: { page },
  data() {
    return {
      tableData: [],
      tableData1: [],
      dataForm: {},
      dataForm1: {},
      formObj: {},
      dialogVisible: false,
      loading: false,
      loading1: false,
      isType: false,
      dialogVisible1: false,
      loadingBtn1: false,
      loadingBtn: false,
      equip_machine_halt_type_id: null,
      total: 0,
      isLeftStop: false,
      rules: {
        fault_type_code: [{ required: true, message: '请输入', trigger: 'blur' }],
        fault_type_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        fault_code: [{ required: true, message: '请输入', trigger: 'blur' }],
        fault_name: [{ required: true, message: '请输入', trigger: 'blur' }],
        fault_names: [{ required: true, message: '请输入', trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!this.formObj.fault_names && !value) {
              callback(new Error('请输入'))
            } else {
              callback()
            }
          } }]
        // desc: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getListType()
  },
  methods: {
    async getListType() {
      try {
        this.loading = true
        const data = await equipFaultTypes('get', null, { params: this.dataForm })
        this.tableData = data.results || []
        this.total = data.count
        if (this.tableData.length > 0) {
          this.$refs.currentRow.setCurrentRow(this.tableData[0])
          this.equip_machine_halt_type_id = this.tableData[0].id
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getListReason() {
      try {
        this.loading1 = true
        this.dataForm1.id = this.equip_machine_halt_type_id
        const data = await equipFaultCodes('get', null, { params: this.dataForm1 })
        this.tableData1 = data || []
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    currentChange(page, pageSize) {
      this.dataForm.page = page
      this.dataForm.page_size = pageSize
      this.$refs.currentRow.setCurrentRow()
      this.getListType()
    },
    getListTypeChange() {
      this.dataForm.page = 1
      this.getListType()
    },
    debounceFun() {
      this.$debounce(this, 'getListTypeChange')
    },
    debounceFun1() {
      this.$debounce(this, 'getListReason')
    },
    handleCurrentChange(row) {
      this.equip_machine_halt_type_id = row.id
      this.isLeftStop = row.use_flag
      this.getListReason()
    },
    addArea(bool) {
      this.dialogVisible = true
      this.isType = bool
    },
    editArea(row, bool) {
      this.dialogVisible = true
      this.isType = bool
      this.formObj = JSON.parse(JSON.stringify(row))
    },
    handleClose(done) {
      this.dialogVisible = false
      this.formObj = {}
      this.$refs.formObj.resetFields()
      if (done) {
        done()
      }
    },
    handleClose1(done) {
      this.dialogVisible1 = false
      if (done) {
        done()
      }
    },
    showFailureCause() {
      this.dialogVisible1 = true
    },
    submitFun1() {
      const list = this.$refs.refFailureCause.handleSelection
      if (list.length === 0) {
        this.$message.info('请选择故障原因')
        return
      }
      this.dialogVisible1 = false
      this.formObj.fault_names = []
      this.formObj.equip_fault = []
      list.forEach(d => {
        this.formObj.fault_names += d.fault_name + ' '
        this.formObj.equip_fault.push(d.id)
      })
    },
    submitFun() {
      this.$refs.formObj.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            const _api = this.isType ? equipFaultTypes : equipFaultCodes
            const _method = this.formObj.id ? 'put' : 'post'
            const obj = Object.assign({ equip_fault_type: this.equip_machine_halt_type_id }, this.formObj)
            await _api(_method, this.formObj.id || null, { data: obj })
            this.$message.success('操作成功')
            this.handleClose(false)
            if (this.isType) {
              this.getListType()
            } else {
              this.getListReason()
            }
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
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        try {
          const _api = bool ? equipFaultTypes : equipFaultCodes
          _api('delete', row.id, {
          }).then(response => {
            this.$message({ message: '操作成功', type: 'success' })
            if (bool) {
              this.getListTypeChange()
            } else {
              this.getListReason()
            }
          })
        } catch (e) { e }
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss">
.fault-classify{
   .search-form-style{
    .el-input{
      width:130px;
    }
  }
  .el-dialog__wrapper .el-input{
    width:230px;
  }
  .el-input-number .el-input{
    width:auto;
  }
}
</style>
