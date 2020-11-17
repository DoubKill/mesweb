<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="仓库名称">
        <ware-house-name-select
          @warehouseNameSelected="warehouseNameChanged"
        />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button v-permission="['warehouse', 'add']" @click="handleCreateWarehouseInfo">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="warehouseInfoList"
      border
      fit
      style="width: 100%"
    >
      <el-table-column type="index" label="No" align="center" />
      <el-table-column prop="name" label="仓库名称" align="center" />
      <el-table-column prop="no" label="仓库编号" align="center" />
      <el-table-column label="出库站点管理" align="center">
        <template slot-scope="{ row }">
          <el-button v-permission="['warehouse', 'change']" size="mini" @click="showStations(row)">管理</el-button>
        </template>
      </el-table-column>
      <el-table-column label="存储物料类型" align="center">
        <template slot-scope="{ row }">
          <el-button v-permission="['warehouse', 'change']" size="mini" @click="showMaterialType(row)">管理</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button v-permission="['warehouse', 'change']" size="mini" @click="handleUpdateWarehouseInfo(row)">修改</el-button>
            <!-- <el-button v-permission="['warehouse', 'change']" size="mini" @click="updateSIUseFlag(row)">{{ row.use_flag ? '弃用' : '启用' }}</el-button> -->
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />
    <el-dialog
      :title="textMap[dialogStatus] + '仓库信息'"
      :visible.sync="dialogWarehouseInfoFormVisible"
    >
      <el-form ref="warehouseInfoForm" :model="warehouseInfoForm" :rules="warehouseInfoRules" label-position="left" label-width="110px">
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="warehouseInfoForm.name" />
        </el-form-item>
        <el-form-item label="仓库编号" prop="no">
          <el-input v-model="warehouseInfoForm.no" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWarehouseInfoFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createWarehouseInfo():updateWarehouseInfo()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="出入库站点管理"
      :visible.sync="stationManageDialogVisible"
    >
      <div class="clearfix">
        <el-button style="float: right; margin-bottom: 15px" @click="handleAddStation">新增</el-button>
        <el-table
          :data="stationList"
          border
          fit
          style="width: 100%"
        >
          <el-table-column type="index" label="No" align="center" />
          <el-table-column prop="warehouse_no" label="仓库编码" align="center" />
          <el-table-column prop="name" label="站点名称" align="center" />
          <el-table-column prop="no" label="站点编码" align="center" />
          <el-table-column prop="type_name" label="站点类型" align="center" />
          <el-table-column label="操作" align="center" width="140">
            <template slot-scope="{ row }">
              <el-button-group>
                <el-button size="mini" @click="handleChangeStation(row)">修改</el-button>
                <el-button size="mini" @click="updateSUseFlag(row)">{{ row.use_flag ? '弃用' : '启用' }}</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <page :total="stationTotal" :current-page="stationGetParams.page" @currentChange="stationCurrentChange" />
      </div>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatus] + '出入库站点'"
      :visible.sync="stationFormVisible"
    >
      <el-form ref="stationForm" :model="stationForm" :rules="stationRules" label-position="left" label-width="110px">
        <el-form-item label="站点名称" prop="name">
          <el-input v-model="stationForm.name" />
        </el-form-item>
        <el-form-item label="站点编码" prop="no">
          <el-input v-model="stationForm.no" />
        </el-form-item>
        <el-form-item label="站点类型" prop="type">
          <station-type-select v-model="stationForm.type" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="stationFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createStation():updateStation()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="存储物料类型界面"
      :visible.sync="materialTypeManageDialogVisible"
    >
      <div class="clearfix">
        <el-button style="float: right; margin-bottom: 15px" @click="handleAddMaterialType">新增</el-button>
        <el-table
          :data="materialTypeList"
          border
          fit
          style="width: 100%"
        >
          <el-table-column type="index" label="No" align="center" />
          <el-table-column prop="warehouse_no" label="仓库编码" align="center" />
          <el-table-column prop="material_type_name" label="物料类型" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button-group>
                <el-button size="mini" @click="handleChangeMaterialType(row)">修改</el-button>
                <el-button size="mini" @click="updateMUseFlag(row)">{{ row.use_flag ? '弃用' : '启用' }}</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <page :total="materialTypeTotal" :current-page="materialTypeGetParams.page" @currentChange="materialTypeCurrentChange" />
      </div>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatus] + '仓库物料类型'"
      :visible.sync="materialTypeFormVisible"
    >
      <el-form ref="materialTypeForm" :model="materialTypeForm" :rules="materialTypeRules" label-position="left" label-width="110px">
        <el-form-item label="物料类型" prop="material_type">
          <material-type-select v-model="materialTypeForm.material_type" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="materialTypeFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createMaterialType():updateMaterialType()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Page from '@/components/page'
import WareHouseNameSelect from '@/components/WareHouseNameSelect'
import StationTypeSelect from '@/components/StationTypeSelect'
import MaterialTypeSelect from '@/components/MaterialTypeSelect'

import { warehouseInfo, editWarehouseInfo, editStationInfo, updateSIUseFlag, stationInfo, updateSUseFlag, warehouseMaterialTypes, editWarehouseMaterialType, updateMUseFlag } from '@/api/warehouse'

export default {
  components: { WareHouseNameSelect, StationTypeSelect, MaterialTypeSelect, Page },
  data() {
    return {
      warehouseInfoForm: {
        name: '',
        no: ''
      },
      warehouseInfoRules: {
        name: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
        no: [{ required: true, message: '该字段不能为空', trigger: 'blur' }]
      },
      dialogWarehouseInfoFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      total: 0,
      getParams: {
        page: 1,
        name: ''
      },
      warehouseInfoList: [],
      stationManageDialogVisible: false,
      stationList: [],
      stationTotal: 0,
      stationGetParams: {
        page: 1,
        warehouse_info: null
      },
      stationFormVisible: false,
      stationForm: {
        name: '',
        no: '',
        type: null
      },
      stationRules: {
        name: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
        no: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
      },
      materialTypeManageDialogVisible: false,
      materialTypeList: [],
      materialTypeGetParams: {
        page: 1,
        warehouse_info: null
      },
      materialTypeTotal: 0,
      materialTypeFormVisible: false,
      materialTypeForm: {
        material_type: null
      },
      materialTypeRules: {
        material_type: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getWareHouseInfo()
  },
  methods: {
    createWarehouseInfo() {
      this.$refs['warehouseInfoForm'].validate((valid) => {
        if (valid) {
          editWarehouseInfo('post', null, this.warehouseInfoForm).then(() => {
            this.dialogWarehouseInfoFormVisible = false
            this.currentChange(1)
            this.$notify({
              title: '成功',
              message: `${this.warehouseInfoForm.name}创建成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateWarehouseInfo() {
      this.$refs['warehouseInfoForm'].validate((valid) => {
        if (valid) {
          const { name, no } = this.warehouseInfoForm
          editWarehouseInfo('put', this.warehouseInfoForm.id, {
            name,
            no
          }).then(() => {
            this.dialogWarehouseInfoFormVisible = false
            this.currentChange(this.getParams.page)
            this.$notify({
              title: '成功',
              message: `${name}更新成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleCreateWarehouseInfo() {
      this.warehouseInfoForm = {
        name: '',
        no: ''
      }
      this.dialogStatus = 'create'
      this.dialogWarehouseInfoFormVisible = true
      this.$nextTick(() => {
        this.$refs['warehouseInfoForm'].clearValidate()
      })
    },
    handleUpdateWarehouseInfo(row) {
      this.warehouseInfoForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogWarehouseInfoFormVisible = true
      this.$nextTick(() => {
        this.$refs['warehouseInfoForm'].clearValidate()
      })
    },
    async getWareHouseInfo() {
      this.warehouseInfoList = []
      try {
        const { results, count } = await warehouseInfo(this.getParams)
        this.warehouseInfoList = results
        this.total = count
      } catch (e) {
        //
      }
    },
    updateSIUseFlag(row) {
      updateSIUseFlag(row.id).then(() => {
        this.currentChange(this.getParams.page)
        this.$notify({
          title: '成功',
          message: `${row.name}更新成功`,
          type: 'success',
          duration: 2000
        })
      })
    },
    warehouseNameChanged(name) {
      this.getParams.name = name || ''
      this.getParams.page = 1
      this.getWareHouseInfo()
    },
    currentChange(page) {
      this.getParams.page = page
      this.getWareHouseInfo()
    },
    async showStations(row) {
      this.stationGetParams.warehouse_info = row.id
      this.stationGetParams.page = 1
      this.getStationInfo()
      this.stationManageDialogVisible = true
    },
    async getStationInfo() {
      this.stationList = []
      try {
        const { results, count } = await stationInfo(this.stationGetParams)
        this.stationList = results
        this.stationTotal = count
      } catch (e) {
        //
      }
    },
    async stationCurrentChange(page) {
      this.stationGetParams.page = page
      this.getStationInfo()
    },
    resetStationFormData() {
      this.stationForm = {
        name: '',
        no: '',
        type: null
      }
    },
    handleAddStation() {
      this.resetStationFormData()
      this.dialogStatus = 'create'
      this.stationFormVisible = true
      this.$nextTick(() => {
        this.$refs['stationForm'].clearValidate()
      })
    },
    handleChangeStation(row) {
      this.stationForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.stationFormVisible = true
      this.$nextTick(() => {
        this.$refs['stationForm'].clearValidate()
      })
    },
    createStation() {
      this.$refs['stationForm'].validate((valid) => {
        if (valid) {
          const {
            name,
            no,
            type
          } = this.stationForm
          editStationInfo('post', null, {
            warehouse_info: this.stationGetParams.warehouse_info,
            name,
            no,
            type
          }).then(() => {
            this.stationFormVisible = false
            this.stationCurrentChange(1)
            this.$notify({
              title: '成功',
              message: `${name}创建成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateStation() {
      this.$refs['stationForm'].validate(valid => {
        if (valid) {
          const {
            name,
            no,
            type
          } = this.stationForm
          editStationInfo('patch', this.stationForm.id, {
            name,
            no,
            type
          }).then(() => {
            this.stationFormVisible = false
            this.stationCurrentChange(this.stationGetParams.page)
            this.$notify({
              title: '成功',
              message: `${name}修改成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateSUseFlag(row) {
      updateSUseFlag(row.id).then(() => {
        this.stationCurrentChange(this.stationGetParams.page)
        this.$notify({
          title: '成功',
          message: `${row.name}更新成功`,
          type: 'success',
          duration: 2000
        })
      })
    },
    async getMaterialTypes() {
      this.materialTypeList = []
      try {
        const { results, count } = await warehouseMaterialTypes(this.materialTypeGetParams)
        this.materialTypeList = results
        this.materialTypeTotal = count
      } catch (e) {
        //
      }
    },
    showMaterialType(row) {
      this.materialTypeGetParams.warehouse_info = row.id
      this.materialTypeGetParams.page = 1
      this.getMaterialTypes()
      this.materialTypeManageDialogVisible = true
    },
    materialTypeCurrentChange(page) {
      this.materialTypeGetParams.page = page
      this.getMaterialTypes()
    },
    handleAddMaterialType() {
      this.materialTypeForm = {
        material_type: null
      }
      this.dialogStatus = 'create'
      this.materialTypeFormVisible = true
      this.$nextTick(() => {
        this.$refs['materialTypeForm'].clearValidate()
      })
    },
    createMaterialType() {
      this.$refs['materialTypeForm'].validate(valid => {
        if (valid) {
          const {
            material_type
          } = this.materialTypeForm
          editWarehouseMaterialType('post', null, {
            warehouse_info: this.materialTypeGetParams.warehouse_info,
            material_type
          }).then(() => {
            this.materialTypeFormVisible = false
            this.materialTypeCurrentChange(1)
            this.$notify({
              title: '成功',
              message: `${material_type}创建成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateMaterialType() {
      this.$refs['materialTypeForm'].validate(valid => {
        if (valid) {
          const {
            material_type
          } = this.materialTypeForm
          editWarehouseMaterialType('patch', this.materialTypeForm.id, {
            material_type
          }).then(() => {
            this.materialTypeFormVisible = false
            this.materialTypeCurrentChange(this.materialTypeGetParams.page)
            this.$notify({
              title: '成功',
              message: `更新成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleChangeMaterialType(row) {
      this.materialTypeForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.materialTypeFormVisible = true
      this.$nextTick(() => {
        this.$refs['materialTypeForm'].clearValidate()
      })
    },
    updateMUseFlag(row) {
      updateMUseFlag(row.id).then(() => {
        this.materialTypeCurrentChange(this.materialTypeGetParams.page)
        this.$notify({
          title: '成功',
          message: `更新成功`,
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
