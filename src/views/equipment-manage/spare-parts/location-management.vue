<template>
  <div class="loaction-style">
    <!--库区库位管理 -->
    <el-row>
      <el-col v-loading="loading" :span="12">
        <el-button
          v-permission="['equip_warehouse', 'addArea']"
          type="primary"
          style="margin-bottom:10px;float:right"
          @click="addArea(true)"
        >添加库区</el-button>
        <el-table
          :data="tableData"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column
            prop="area_name"
            label="库区名称"
          />
          <el-table-column
            prop="desc"
            label="描述"
          />
          <el-table-column
            prop="equip_component_type_name"
            label="备件分类"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  v-permission="['equip_warehouse', 'changeArea']"
                  size="mini"
                  @click="editArea(scope.row,true)"
                >编辑
                </el-button>
                <el-button
                  v-permission="['equip_warehouse', 'deleteArea']"
                  size="mini"
                  type="danger"
                  plain
                  @click.stop="delArea(scope.row,true)"
                > 删除
                </el-button>
                <el-button
                  v-permission="['equip_warehouse', 'printArea']"
                  size="mini"
                  plain
                  :loading="btnLoading"
                  @click="printingFun(scope.row)"
                > 打印条码
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col v-loading="loading1" :span="12">
        <el-button
          v-permission="['equip_warehouse', 'addLocation']"
          type="primary"
          style="margin-bottom:10px;float:right"
          :disabled="depot?false:true"
          @click="addArea(false)"
        >添加库位</el-button>
        <el-table
          :data="tableData1"
          border
        >
          <el-table-column
            prop="location_name"
            label="库位名称"
          />
          <el-table-column
            prop="area_name"
            label="库区"
          />
          <el-table-column
            prop="desc"
            label="描述"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  v-permission="['equip_warehouse', 'changeLocation']"
                  size="mini"
                  @click="editArea(scope.row,false)"
                >编辑
                </el-button>
                <el-button
                  v-permission="['equip_warehouse', 'deleteLocation']"
                  size="mini"
                  type="danger"
                  plain
                  @click="delArea(scope.row,false)"
                > 删除
                </el-button>
                <el-button
                  v-permission="['equip_warehouse', 'printLocation']"
                  size="mini"
                  :loading="btnLoading"
                  plain
                  @click="printingFun1(scope.row)"
                > 打印条码
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog
      :title="(formObj.id?'编辑':'添加')+(isArea?'库区':'库位')"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="formObj"
        :model="formObj"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item v-if="!isArea" label="库区" prop="equip_warehouse_area">
          <el-select
            v-model="formObj.equip_warehouse_area"
            placeholder="请选择"
            :disabled="formObj.equip_warehouse_area?true:false"
          >
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.area_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isArea" label="库区名称" prop="area_name">
          <el-input v-model="formObj.area_name" />
        </el-form-item>
        <el-form-item v-if="!isArea" label="库位名称" prop="location_name">
          <el-input v-model="formObj.location_name" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="formObj.desc" />
        </el-form-item>
        <el-form-item v-if="isArea" label="备件分类" prop="equip_component_type">
          <el-select
            v-model="formObj.equip_component_type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.component_type_name"
              :value="item.id"
            />
          </el-select>
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
import { equipWarehouseArea, equipWarehouseLocation, equipSpareErp, equipCodePrint } from '@/api/jqy'
// import { depot, depotSite } from '@/api/base_w_four'
import { checkPermission } from '@/utils'
export default {
  name: 'LocationManagement',
  data() {
    return {
      btnLoading: false,
      tableData: [],
      tableData1: [],
      isArea: null,
      formObj: {},
      dialogVisible: false,
      rules: {
        area_name: [
          { required: true, message: '请输入库区', trigger: 'blur' }
        ],
        location_name: [
          { required: true, message: '请输入库位', trigger: 'blur' }
        ]
      },
      options: [],
      loading: false,
      loading1: false,
      loadingBtn: false,
      total: 0,
      total1: 0,
      pageNo: 1,
      pageNo1: 1,
      pageSize: 10,
      pageSize1: 10,
      depot: null
    }
  },
  created() {
    this.getList()
    // this.getList1()
    this.getList2()
  },
  methods: {
    checkPermission,
    async getList() {
      try {
        this.loading = true
        const data = await equipWarehouseArea('get', null, { params: {}})
        this.tableData = data.results
        this.total = data.count
        this.$refs.currentRow.setCurrentRow(this.tableData[0])
        this.depot = this.tableData[0].id
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async printingFun(row) {
      try {
        this.btnLoading = true
        await equipCodePrint('post', null, { data: { status: 1, code: row.area_barcode, print_type: 1, name: row.area_name }})
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
      }
    },
    async printingFun1(row) {
      try {
        this.btnLoading = true
        await equipCodePrint('post', null, { data: { status: 1, code: row.location_barcode, print_type: 2, name: row.location_name }})
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
      }
    },
    async getList2() {
      try {
        const data = await equipSpareErp('get', null, { params: { all: 1 }})
        this.options = data.results || []
      } catch (e) {
        //
      }
    },
    handleCurrentChange(row) {
      this.depot = row.id
      this.getList1()
    },
    async getList1() {
      try {
        this.loading1 = true
        const data = await equipWarehouseLocation('get', null, { params: { equip_warehouse_area_id: this.depot }})
        this.tableData1 = data.results
        // this.total1 = data.count
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    addArea(bool) {
      this.formObj.equip_warehouse_area = this.depot
      this.isArea = bool
      this.dialogVisible = true
    },
    editArea(row, bool) {
      this.isArea = bool
      this.dialogVisible = true
      this.formObj = JSON.parse(JSON.stringify(row))
    },
    delArea(row, bool) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _api = bool ? equipWarehouseArea : equipWarehouseLocation
        _api('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (bool) {
              this.getList()
            } else {
              this.getList1()
            }
          }).catch(e => {
          })
      })
    },
    handleClose(done) {
      this.dialogVisible = false
      this.formObj = {
        name: ''
      }
      this.$refs.formObj.resetFields()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.formObj.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            const _api = this.isArea ? equipWarehouseArea : equipWarehouseLocation
            const _method = this.formObj.id ? 'put' : 'post'
            await _api(_method, this.formObj.id, { data: this.formObj })
            this.$message.success('操作成功')
            this.handleClose(false)
            if (this.isArea) {
              this.getList()
            } else {
              this.getList1()
            }
            this.loadingBtn = false
          } catch (e) {
            this.loadingBtn = false
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
.loaction-style{
.el-input{
  width:auto !important;
}
}
</style>
