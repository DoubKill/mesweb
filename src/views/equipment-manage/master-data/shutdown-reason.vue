<template>
  <div class="shutdown-reason">
    <!-- 设备停机原因定义 -->
    <el-row class="search-form-style">
      <el-col v-loading="loading" :span="10">
        <el-form inline>
          <el-form-item
            label="停机原因分类名称"
          >
            <el-input v-model="dataForm.machine_halt_type_name" @input="debounceFun" />
          </el-form-item>
          <el-form-item
            label="是否启用"
          >
            <el-select v-model="dataForm.use_flag" style="width:130px" clearable @change="getListType">
              <el-option
                v-for="(item,key) in [{label:true,name:'Y'},{label:false,name:'N'}]"
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
            prop="machine_halt_type_code"
            label="停机原因分类编码"
          />
          <el-table-column
            prop="machine_halt_type_name"
            label="停机原因分类名称"
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
            label="停机原因名称"
          >
            <el-input v-model="dataForm1.machine_halt_reason_name" @input="debounceFun1" />
          </el-form-item>
          <el-form-item
            label="是否启用"
          >
            <el-select v-model="dataForm1.use_flag" style="width:130px" clearable @change="getListReason">
              <el-option
                v-for="(item,key) in [{label:true,name:'Y'},{label:false,name:'N'}]"
                :key="key"
                :label="item.name"
                :value="item.label"
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
            prop="machine_halt_reason_code"
            label="停机原因代码"
          />
          <el-table-column
            prop="machine_halt_reason_name"
            label="停机原因名称"
          />
          <el-table-column
            prop="equip_fault_types"
            label="停机故障"
            :formatter="(row)=>{
              let str = ''
              row.equip_fault_types.forEach(d=>str+=d.fault_type_name+';')
              return str
            }"
          />
          <el-table-column
            prop="desc"
            label="备注"
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
      :title="(formObj.id?'编辑':'添加')+(isType?'停机原因分类':'停机原因')"
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
        <el-form-item v-if="!isType" label="停机原因代码" prop="depot_name">
          <el-input v-model="formObj.depot_name" />
        </el-form-item>
        <el-form-item v-if="!isType" label="停机原因名称" prop="depot_name">
          <el-input v-model="formObj.depot_name" />
        </el-form-item>
        <el-form-item v-if="!isType" label="停机故障" prop="depot_name">
          <el-input v-model="formObj.input3" disabled placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="showFailureCause" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="!isType" label="备注" prop="depot_site_name">
          <el-input v-model="formObj.depot_site_name" />
        </el-form-item>
        <el-form-item v-if="isType" label="停机原因分类编码" prop="description">
          <el-input v-model="formObj.description" />
        </el-form-item>
        <el-form-item v-if="isType" label="停机原因分类名称" prop="description">
          <el-input v-model="formObj.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'停机故障原因选择'"
      :visible.sync="dialogVisible1"
      width="80%"
      :before-close="handleClose1"
    >
      <failureCause ref="refFailureCause" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn1" @click="submitFun1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import failureCause from '../components/failure-cause'
import { equipMachineHaltType, equipMachineHaltReason } from '@/api/base_w_four'
export default {
  name: 'EquipmentMasterDataShutdownReason',
  components: { failureCause },
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
      isType: false,
      dialogVisible1: false,
      loadingBtn1: false,
      equip_machine_halt_type_id: null,
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
  created() {
    this.getListType()
  },
  methods: {
    async getListType() {
      try {
        this.loading = true
        const data = await equipMachineHaltType('get', null, { params: this.dataForm })
        this.tableData = data || []
        if (this.tableData.length > 0) {
          this.$refs.currentRow.setCurrentRow(this.tableData[0])
          this.equip_machine_halt_type_id = this.tableData[0].id
          this.getListReason()
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getListReason() {
      try {
        this.loading1 = true
        this.dataForm1.equip_machine_halt_type_id = this.equip_machine_halt_type_id
        const data = await equipMachineHaltReason('get', null, { params: this.dataForm1 })
        this.tableData1 = data || []
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    debounceFun() {
      this.$debounce(this, 'getListType')
    },
    debounceFun1() {
      this.$debounce(this, 'getListReason')
    },
    handleCurrentChange(row) {
      this.depot = row.id
    },
    editArea(row, bool) {
      this.dialogVisible = true
      this.isType = bool
    },
    handleClose(done) {
      this.dialogVisible = false
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
    submitFun1() {},
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
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        try {
          const _api = bool ? equipMachineHaltType : equipMachineHaltReason
          _api('delete', row.id, {
          }).then(response => {
            this.$message({ message: '操作成功', type: 'success' })
            if (bool) {
              this.getListType()
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

<style lang="scss" scoped>
.shutdown-reason{
  .search-form-style{
    .el-input{
      width:140px;
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
