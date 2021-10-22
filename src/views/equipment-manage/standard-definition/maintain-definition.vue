<template>
  <div class="maintain-definition">
    <!-- 维护作业标准定义 -->
    <el-form :inline="true" class="search-form-style">
      <el-form-item label="作业类型">
        <el-select
          v-model="getParams.work_type"
          clearable
          placeholder="请选择"
          :disabled="isDialog"
          @change="changSelect"
        >
          <el-option
            v-for="item in ['巡检','保养','润滑','标定']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备种类">
        <el-select v-model="getParams.equip_type" placeholder="请选择" clearable filterable :disabled="isDialog" @change="changSelect">
          <el-option
            v-for="item in options"
            :key="item.category_no"
            :label="item.category_no"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部位名称">
        <el-input v-model="getParams.equip_part" :disabled="isDialog&&params.equip_part?true:false" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="部件名称">
        <el-input v-model="getParams.equip_component" :disabled="isDialog&&params.equip_component?true:false" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="重要程度">
        <el-select
          v-model="getParams.important_level"
          placeholder="请选择"
          clearable
          @change="changSelect"
        >
          <el-option
            v-for="item in ['高', '中', '低']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="getParams.equip_condition"
          placeholder="请选择"
          clearable
          @change="changSelect"
        >
          <el-option
            v-for="item in ['停机', '不停机']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所需物料名称">
        <el-input v-model="getParams.spare_name" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item v-if="!isDialog" style="float:right">
        <el-button v-permission="['equip_maintenance_standard', 'export']" type="primary" style="margin-right:8px" :loading="btnExportLoad" @click="templateDownload">导出Excel</el-button>
        <el-upload
          v-permission="['equip_maintenance_standard', 'import']"
          style="margin-right:8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button
          v-permission="['equip_maintenance_standard', 'add']"
          type="primary"
          @click="onSubmit"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="singleTable"
      v-loading="loading"
      highlight-current-row
      row-key="id"
      :reserve-selection="true"
      :data="tableData"
      border
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        prop="work_type"
        label="作业类型"
      />
      <el-table-column
        prop="standard_code"
        label="标准编号"
      />
      <el-table-column
        prop="standard_name"
        label="标准名称"
      />
      <el-table-column
        prop="equip_type_name"
        label="设备种类"
        width="50px"
      />
      <el-table-column
        prop="equip_part_name"
        label="部位名称"
      />
      <el-table-column
        prop="equip_component_name"
        label="部件名称"
      />
      <el-table-column
        prop="equip_condition"
        label="设备条件"
      />
      <el-table-column
        prop="important_level"
        label="重要程度"
      />
      <el-table-column
        prop="equip_job_item_standard_name"
        label="作业项目"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
          >{{ scope.row.equip_job_item_standard_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="start_time"
        label="起始时间"
      />
      <el-table-column
        prop="maintenance_cycle"
        label="维护周期"
      />
      <el-table-column
        prop="cycle_unit"
        label="周期单位"
      />
      <el-table-column
        prop="cycle_num"
        label="周期数"
      />
      <el-table-column
        prop="cycle_person_num"
        label="所需人数"
      />
      <el-table-column
        prop="operation_time"
        label="作业时间"
      />
      <el-table-column
        prop="operation_time_unit"
        label="作业时间单位"
      />
      <el-table-column
        prop="spare_list_str"
        label="所需物料名称"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
          >{{ scope.row.spare_list_str }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_username"
        label="录入人"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
      />
      <el-table-column v-if="!isDialog" label="操作" width="130px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['equip_maintenance_standard', 'change']"
              size="mini"
              @click="showDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['equip_maintenance_standard', 'delete']"
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >{{ scope.row.use_flag?'停用':'启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${typeForm.id?'修改':'新建'}维护作业标准`"
      width="70%"
      :visible.sync="dialogEditVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :inline="true"
        :rules="rules"
        :model="typeForm"
        label-width="150px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="作业类型" prop="work_type">
              <el-select
                v-model="typeForm.work_type"
                :disabled="typeForm.id?true:false"
                placeholder="请选择"
                @change="changeCode"
              >
                <el-option
                  v-for="item in ['巡检','保养','润滑','标定']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="标准编号" prop="standard_code">
              <el-input v-model="typeForm.standard_code" :disabled="typeForm.id?true:false" />
            </el-form-item>
            <el-form-item label="标准名称" prop="standard_name">
              <el-input v-model="typeForm.standard_name" />
            </el-form-item>
            <el-form-item label="设备种类" prop="equip_type">
              <el-select v-model="typeForm.equip_type" placeholder="请选择" clearable filterable @change="clear">
                <el-option
                  v-for="item in options"
                  :key="item.category_no"
                  :label="item.category_no"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="部位名称"
              prop="equip_part"
            >
              <el-select v-model="typeForm.equip_part" placeholder="请选择" @visible-change="getEquipPart" @change="clear1">
                <el-option
                  v-for="item in options1"
                  :key="item.part_name"
                  :label="item.part_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="部件名称"
              prop="equip_component"
            >
              <el-select v-model="typeForm.equip_component" placeholder="请选择" clearable @visible-change="getEquipComponent">
                <el-option
                  v-for="item in options2"
                  :key="item.component_name"
                  :label="item.component_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备条件" prop="equip_condition">
              <el-select
                v-model="typeForm.equip_condition"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in ['停机', '不停机']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="重要程度" prop="important_level">
              <el-select
                v-model="typeForm.important_level"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in ['高', '中', '低']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="作业项目"
              prop="equip_job_item_standard_name"
            >
              <el-input v-model="typeForm.equip_job_item_standard_name" placeholder="请输入内容" disabled>
                <el-button slot="append" icon="el-icon-search" @click="Add1" />
              </el-input>
              <br>
              <el-input
                v-model="typeForm.equip_job_item_standard_detail"
                style="marginTop:20px"
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                disabled
              />
            </el-form-item>
            <el-form-item label="起始时间" prop="start_time">
              <el-date-picker
                v-model="typeForm.start_time"
                value-format="yyyy-MM-dd"
                :clearable="true"
              />
            </el-form-item>
            <el-form-item label="维护周期" prop="maintenance_cycle">
              <el-input-number v-model="typeForm.maintenance_cycle" placeholder="请输入内容" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="周期单位" prop="cycle_unit">
              <el-select
                v-model="typeForm.cycle_unit"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ['日','小时','分钟','秒','车次']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="周期数" prop="cycle_num">
              <el-input-number v-model="typeForm.cycle_num" placeholder="请输入内容" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="所需人数" prop="cycle_person_num">
              <el-input-number v-model="typeForm.cycle_person_num" placeholder="请输入内容" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="作业时间" prop="operation_time">
              <el-input-number v-model="typeForm.operation_time" placeholder="请输入内容" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="作业时间单位" prop="operation_time_unit">
              <el-select
                v-model="typeForm.operation_time_unit"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ['日','小时','分钟','秒','车次']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="钉钉提醒发送" prop="remind_flag">
              <el-checkbox v-model="typeForm.remind_flag1" label="包干人" />
              <el-checkbox v-model="typeForm.remind_flag2" label="上级" />
              <el-checkbox v-model="typeForm.remind_flag3" label="上上级" />
            </el-form-item>
          </el-col>
          <el-form-item label="所需物料">
            <el-button type="primary" @click="Add">添加</el-button>
            <el-table
              :data="typeForm.spare_list"
              border
              style="width: 100%"
            >
              <el-table-column
                prop="equip_spare_erp__spare_code"
                label="物料编码"
              />
              <el-table-column
                prop="equip_spare_erp__spare_name"
                label="物料名称"
              />
              <el-table-column
                prop="equip_spare_erp__specification"
                label="规格"
              />
              <el-table-column
                prop="equip_spare_erp__technical_params"
                label="技术参数"
              />
              <el-table-column
                prop="quantity"
                label="数量"
                width="140px"
              >
                <template slot-scope="{row}">
                  <el-input-number
                    v-model="row.quantity"
                    size="small"
                    :min="1"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="equip_spare_erp__unit"
                label="单位"
              />
              <el-table-column label="操作" width="130px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete1(scope.row)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button
          :loading="btnLoading"
          type="primary"
          @click="handleEdit"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="`物料列表`"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose1"
    >
      <spare-parts-code
        ref="List"
        :is-multiple="true"
        :is-search="dialogVisible"
        :list="typeForm.spare_list"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`作业项目`"
      :visible.sync="dialogVisible1"
      width="80%"
      :before-close="handleClose2"
    >
      <project-definition
        ref="List1"
        :is-dialog="true"
        :show="dialogVisible1"
        :work-type="typeForm.work_type"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose2(false)">取 消</el-button>
        <el-button type="primary" @click="submitFun1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import SparePartsCode from '../master-data/spare-parts-code'
import ProjectDefinition from './project-definition'
import { equipsCategory, equipMaintenanceStandard, equipPartNew, equipComponent, equipMaintenanceStandardImport, equipMaintenanceStandardDown } from '@/api/jqy'
import page from '@/components/page'

export default {
  name: 'MaintainDefinition',
  components: { page, SparePartsCode, ProjectDefinition },
  props: {
    isDialog: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data: function() {
    return {
      loading: false,
      btnLoading: false,
      btnExportLoad: false,
      tableData: [],
      dialogEditVisible: false,
      dialogVisible: false,
      dialogVisible1: false,
      options: [],
      options1: [],
      options2: [],
      typeName: '',
      typeForm: {},
      rules: {
        work_type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        standard_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        standard_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip_type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip_part: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip_condition: [{ required: true, message: '不能为空', trigger: 'blur' }],
        important_level: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip_job_item_standard_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      currentObj: {},
      getParams: {},
      currentPage: 1,
      total: 0
    }
  },
  watch: {
    show(bool) {
      if (bool) {
        this.getParams.work_type = this.params.work_type
        this.getParams.equip_type = this.params.equip_type
        this.getParams.equip_part = this.params.equip_part
        this.getParams.equip_component = this.params.equip_component
        this.getParams.use_flag = true
        this.getList()
      }
    }
  },
  created() {
    if (this.isDialog) {
      this.getParams.work_type = this.params.work_type
      this.getParams.equip_type = this.params.equip_type
      this.getParams.equip_part = this.params.equip_part
      this.getParams.equip_component = this.params.equip_component
      this.getParams.use_flag = true
    }
    this.getList()
    this.getTypeNode()
    this.getEquipComponentType()
  },
  methods: {
    async getTypeNode() {
      try {
        const data = await equipsCategory('get', null, { params: { all: 1 }})
        this.options = data.results || []
      } catch (e) {
        //
      }
    },
    async getEquipPart(val) {
      if (val) {
        if (this.typeForm.equip_type) {
          try {
            const data = await equipPartNew('get', null, { params: { equip_type: this.typeForm.equip_type }})
            this.options1 = data.results || []
          } catch (e) {
            //
          }
        } else {
          this.options1 = []
          this.$message.info('请先选择主设备种类')
        }
      }
    },
    async getEquipComponent(val) {
      if (val) {
        if (this.typeForm.equip_part) {
          try {
            const data = await equipComponent('get', null, { params: { component_id: this.typeForm.equip_part }})
            this.options2 = data.results || []
          } catch (error) {
            this.options2 = []
          }
        } else {
          this.options2 = []
          this.$message.info('请先选择设备部位')
        }
      }
    },
    changeCode() {
      if (this.typeForm.work_type === '巡检') {
        this.typeForm.standard_code = 'XJBZ00X'
        this.typeForm.equip_condition = '不停机'
        this.typeForm.important_level = '中'
      } else if (this.typeForm.work_type === '保养') {
        this.typeForm.standard_code = 'BYBZ00X'
        this.typeForm.equip_condition = '停机'
        this.typeForm.important_level = '中'
      } else if (this.typeForm.work_type === '润滑') {
        this.typeForm.standard_code = 'RHBZ00X'
        this.typeForm.equip_condition = '不停机'
        this.typeForm.important_level = '中'
      } else if (this.typeForm.work_type === '标定') {
        this.typeForm.standard_code = 'BDBZ00X'
        this.typeForm.equip_condition = '停机'
        this.typeForm.important_level = '中'
      }
    },
    changeDebounce() {
      this.getParams.page = 1
      debounce(this, 'getList')
    },
    handleCurrentChange(obj) {
      this.currentObj = obj
    },
    async getEquipComponentType() {
      try {
        const data = await equipComponent('get', null, { params: { all: 1 }})
        this.options2 = data.results || []
      } catch (error) {
        this.options2 = []
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipMaintenanceStandard('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    onSubmit() {
      this.typeForm = {
        standard_code: '',
        equip_condition: '',
        important_level: '',
        remind_flag1: true,
        remind_flag2: true,
        remind_flag3: false
      }
      this.dialogEditVisible = true
    },
    handleClose1(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
      this.$refs['List'].$refs.multipleTable1.clearSelection()
    },
    handleClose2(done) {
      this.dialogVisible1 = false
      if (done) {
        done()
      }
    },
    clear() {
      if (this.typeForm.equip_part) {
        this.typeForm.equip_part = null
      }
      if (this.typeForm.equip_component) {
        this.typeForm.equip_component = null
      }
    },
    clear1() {
      if (this.typeForm.equip_component) {
        this.typeForm.equip_component = null
      }
    },
    Add() {
      this.dialogVisible = true
    },
    Add1() {
      if (!this.typeForm.work_type) {
        this.$message.info('请先选择作业类型')
      } else {
        this.dialogVisible1 = true
      }
    },
    submitFun() {
      if (this.$refs['List'].multipleSelection1 === undefined) {
        this.$refs['List'].multipleSelection1 = []
      }
      if (this.$refs['List'].multipleSelection1.length > 0) {
        let data = []
        for (const i in this.typeForm.spare_list) {
          data = data.concat(this.typeForm.spare_list[i].equip_spare_erp__id)
        }
        for (let index = 0; index < this.$refs['List'].multipleSelection1.length; index++) {
          if (data.indexOf(this.$refs['List'].multipleSelection1[index].id) === -1) {
            if (this.typeForm.spare_list === undefined) {
              this.typeForm.spare_list = []
            }
            this.typeForm.spare_list.push({
              equip_spare_erp__id: this.$refs['List'].multipleSelection1[index].id,
              equip_spare_erp__spare_code: this.$refs['List'].multipleSelection1[index].spare_code,
              equip_spare_erp__spare_name: this.$refs['List'].multipleSelection1[index].spare_name,
              equip_spare_erp__specification: this.$refs['List'].multipleSelection1[index].specification,
              equip_spare_erp__technical_params: this.$refs['List'].multipleSelection1[index].technical_params,
              equip_spare_erp__unit: this.$refs['List'].multipleSelection1[index].unit,
              quantity: 1
            })
          }
        }
        this.dialogVisible = false
      } else {
        this.$message.info('请选择其中一种物料')
      }
      this.$refs['List'].$refs.multipleTable1.clearSelection()
    },
    submitFun1() {
      if (this.$refs['List1'].currentObj.standard_name) {
        this.typeForm.equip_job_item_standard = this.$refs['List1'].currentObj.id
        this.typeForm.equip_job_item_standard_name = this.$refs['List1'].currentObj.standard_name
        this.typeForm.equip_job_item_standard_detail = this.$refs['List1'].currentObj.work_details_column
        this.dialogVisible1 = false
      } else {
        this.$message.info('请选择一种标准')
      }
    },
    changSelect() {
      this.getParams.page = 1
      this.getList()
    },
    async showDialog(row) {
      this.typeForm = JSON.parse(JSON.stringify(row))
      if (this.typeForm.maintenance_cycle === null) {
        this.typeForm.maintenance_cycle = undefined
      }
      if (this.typeForm.cycle_num === null) {
        this.typeForm.cycle_num = undefined
      }
      if (this.typeForm.cycle_person_num === null) {
        this.typeForm.cycle_person_num = undefined
      }
      if (this.typeForm.operation_time === null) {
        this.typeForm.operation_time = undefined
      }
      try {
        const data = await equipPartNew('get', null, { params: { all: 1 }})
        this.options1 = data.results || []
      } catch (e) {
        //
      }
      this.getEquipComponentType()
      this.dialogEditVisible = true
    },
    handleClose(done) {
      this.dialogEditVisible = false
      this.$refs.createForm.resetFields()
      if (done) {
        done()
      }
    },
    handleEdit() {
      const typeForm1 = JSON.parse(JSON.stringify(this.typeForm))
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.typeForm.id ? 'put' : 'post'
            if (typeForm1.maintenance_cycle === undefined) {
              typeForm1.maintenance_cycle = null
            }
            if (typeForm1.cycle_num === undefined) {
              typeForm1.cycle_num = null
            }
            if (typeForm1.cycle_person_num === undefined) {
              typeForm1.cycle_person_num = null
            }
            if (typeForm1.operation_time === undefined) {
              typeForm1.operation_time = null
            }
            await equipMaintenanceStandard(_api, typeForm1.id || null, { data: typeForm1 })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.btnLoading = false
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.standard_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipMaintenanceStandard('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    handleDelete1(row) {
      this.typeForm.spare_list.forEach((item, index) => {
        if (row.equip_spare_erp__id === item.equip_spare_erp__id) {
          this.typeForm.spare_list.splice(index, 1)
        }
      })
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
      this.$refs.singleTable.setCurrentRow(this.currentObj)
    },
    templateDownload() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.getParams)
      const _api = equipMaintenanceStandardDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '设备维护标准定义.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      equipMaintenanceStandardImport('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        this.getParams.page = 1
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss">
.maintain-definition{
  .search-form-style{
    .el-input{
      width:120px;
    }
  }
  .el-dialog__wrapper .el-input{
    width:200px;
  }
  .el-input-number .el-input{
    width:auto;
  }
}
</style>
