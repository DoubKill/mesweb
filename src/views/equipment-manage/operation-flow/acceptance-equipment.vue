<template>
  <div>
    <!-- 验收维修工单 -->
    <el-form :inline="true">
      <el-form-item label="计划维修时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="计划名称">
        <el-input
          v-model="search.plan_name"
          clearable
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="工单编号">
        <el-input
          v-model="search.work_order_no"
          clearable
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.equip_condition"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['停机', '不停机']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重要程度">
        <el-select
          v-model="search.importance_level"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['高', '中', '低']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="维修标准">
        <el-input
          v-model="search.equip_repair_standard"
          clearable
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item> -->
      <el-form-item label="维修人">
        <el-input
          v-model="search.repair_user"
          clearable
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="验收人">
        <el-input
          v-model="search.accept_user"
          clearable
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <!-- <el-form-item label="验收结果">
        <el-select
          v-model="search.result_accept_result"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['合格','不合格']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="是否需要外协">
        <el-select
          v-model="search.result_need_outsourcing"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in [{label:'Y',value:true},{label:'N',value:false}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要物料">
        <el-select
          v-model="search.result_material_requisition"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in [{label:'Y',value:true},{label:'N',value:false}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeSearch">查询</el-button>
        <el-button v-permission="['equip_apply_order', 'accept']" type="primary" @click="dialog(false,'验收维修工单')">验收</el-button>
        <!-- <el-button type="primary">导出Excel</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      size="mini"
      :data="tableData"
      row-key="id"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="primary"
              size="mini"
              @click="dialog1(scope.row,'查看处理结果')"
            >查看维修结果
            </el-button>
            <!-- <el-button
              type="primary"
              size="mini"
              @click="dialog(scope.row,'查看验收结果')"
            >查看验收结果
            </el-button> -->
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="plan_id"
        label="计划/报修编号"
        min-width="20"
      />
      <el-table-column
        prop="plan_name"
        label="计划/报修名称"
        min-width="20"
      />
      <el-table-column
        prop="work_order_no"
        label="工单编号"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="part_name"
        label="部位名称"
        min-width="20"
      />
      <el-table-column
        label="维修标准/故障原因"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.equip_maintenance_standard_name"
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.equip_maintenance_standard_name }}</el-link>
          <el-link
            v-if="scope.row.equip_repair_standard_name"
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.equip_repair_standard_name }}</el-link>
          <el-link
            v-else
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.result_fault_cause_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="result_fault_desc"
        label="故障详情描述"
        min-width="20"
      />
      <el-table-column
        prop="result_repair_desc"
        label="维修备注"
        min-width="20"
      />
      <el-table-column
        prop="planned_repair_date"
        label="计划维修日期"
        min-width="20"
      />
      <el-table-column
        prop="equip_condition"
        label="设备条件"
        min-width="20"
      />
      <el-table-column
        prop="importance_level"
        label="重要程度"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="repair_user"
        label="维修人"
        min-width="20"
      />
      <el-table-column
        prop="repair_start_datetime"
        label="维修开始时间"
        min-width="20"
      />
      <el-table-column
        prop="repair_end_datetime"
        label="维修结束时间"
        min-width="20"
      />
      <el-table-column
        prop="result_material_requisition"
        label="是否需要物料"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.result_material_requisition===true">Y</span>
          <span v-if="scope.row.result_material_requisition===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="result_need_outsourcing"
        label="是否需要外协"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.result_need_outsourcing===true">Y</span>
          <span v-if="scope.row.result_need_outsourcing===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="assign_user"
        label="指派人"
        min-width="20"
      />
      <el-table-column
        prop="assign_datetime"
        label="指派时间"
        min-width="20"
      />
      <el-table-column
        prop="assign_to_user"
        label="被指派人"
        min-width="20"
      />
      <el-table-column
        prop="receiving_user"
        label="接单人"
        min-width="20"
      />
      <el-table-column
        prop="receiving_datetime"
        label="接单时间"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="报修人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="报修时间"
        min-width="20"
      />
      <el-table-column
        prop="accept_user"
        label="验收人"
        min-width="20"
      />
      <el-table-column
        prop="accept_datetime"
        label="验收时间"
        min-width="20"
      />
      <el-table-column
        prop="result_accept_result"
        label="验收结果"
        min-width="20"
      />
      <el-table-column
        prop="result_accept_desc"
        label="验收记录"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="operateType"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form
        ref="ruleFormHandle"
        :model="creatOrder"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="验收说明" prop="result_accept_desc">
          <el-input
            v-model="creatOrder.result_accept_desc"
            :disabled="operateType!=='验收维修工单'"
            style="width:250px"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            v-if="operateType==='验收维修工单'"
            ref="elUploadImg"
            action=""
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="onChangeImg"
            :on-exceed="onExceed"
            :limit="5"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <template v-for="(item, index) in creatOrder.result_accept_graph_url">
            <el-image
              v-if="operateType==='查看验收结果'&&creatOrder.result_accept_graph_url.length>0"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            />
          </template>
          <div v-if="operateType==='查看验收结果'&&creatOrder.result_accept_graph_url.length===0">
            暂无图片
          </div>
        </el-form-item>
        <el-form-item label="验收结论" prop="result_accept_result">
          <el-radio-group v-model="creatOrder.result_accept_result" :disabled="operateType!=='验收维修工单'">
            <el-radio label="合格">合格</el-radio>
            <el-radio label="不合格">不合格</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button v-if="operateType==='验收维修工单'" :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="operateType"
      :visible.sync="dialogVisible1"
      width="50%"
    >
      <el-form
        ref="ruleFormHandle"
        :model="creatOrder1"
        label-width="150px"
      >
        <el-form-item label="计划/报修名称">
          <el-input
            v-model="creatOrder1.plan_name"
            style="width:250px"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="工单编号">
          <el-input
            v-model="creatOrder1.work_order_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="机台">
          <el-input
            v-model="creatOrder1.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="维修标准/故障原因">
          <el-input
            v-if="creatOrder1.equip_maintenance_standard"
            v-model="creatOrder1.equip_maintenance_standard_name"
            :disabled="true"
            style="width:250px"
          />
          <el-input
            v-if="creatOrder1.equip_repair_standard"
            v-model="creatOrder1.equip_repair_standard_name"
            :disabled="true"
            style="width:250px"
          />
          <el-input
            v-if="creatOrder1.result_fault_cause"
            v-model="creatOrder1.result_fault_cause_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="故障详情描述" prop="note">
          <el-input
            v-model="creatOrder1.result_fault_desc"
            :disabled="true"
            type="textarea"
            style="width:250px"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="实际维修标准">
          <el-input
            v-if="creatOrder1.work_type==='维修'"
            v-model="creatOrder1.result_repair_standard_name"
            style="width:250px"
            :disabled="true"
          />
          <el-input
            v-if="creatOrder1.work_type!=='维修'"
            v-model="creatOrder1.result_maintenance_standard_name"
            style="width:250px"
            :disabled="true"
          />

          <el-table
            :data="creatOrder1.work_content"
            border
            style="width: 651px"
          >
            <el-table-column
              label="序号"
              prop="job_item_sequence"
              width="50"
            />
            <el-table-column
              prop="job_item_content"
              label="作业明细"
              width="200"
            />
            <el-table-column
              prop="job_item_check_standard"
              label="判断标准"
              width="200"
            />
            <el-table-column
              prop="operation_result"
              label="处理结果"
              width="200"
            />
          </el-table>
        </el-form-item>
        <el-form-item label="维修备注">
          <el-input
            v-model="creatOrder1.result_repair_desc"
            :disabled="true"
            style="width:250px"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <template v-for="(item, index) in creatOrder1.result_repair_graph_url ">
            <el-image
              v-if="creatOrder1.result_repair_graph_url.length>0"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            />
          </template>
          <div v-if="creatOrder1.result_repair_graph_url.length===0">
            暂无图片
          </div>
        </el-form-item>
        <el-form-item label="最终故障原因" prop="result_final_fault_cause">
          <el-input
            v-model="creatOrder1.result_final_fault_cause"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="物料申请">
          <el-radio-group v-model="creatOrder1.result_material_requisition" :disabled="true">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
          <el-checkbox v-model="creatOrder1.wait_material" :disabled="true" style="margin-left:30px">等待物料</el-checkbox>
          <el-button v-if="creatOrder1.is_applyed" type="primary" style="marginLeft:30px" @click="dialogMaterial">查看物料列表</el-button>
        </el-form-item>
        <el-form-item label="是否需要外协">
          <el-radio-group v-model="creatOrder1.result_need_outsourcing" :disabled="true">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
          <el-checkbox v-model="creatOrder1.wait_outsourcing" :disabled="true" style="margin-left:30px">等待外协维修</el-checkbox>
        </el-form-item>
        <el-form-item label="维修结论" prop="result_repair_final_result">
          <el-radio-group v-model="creatOrder1.result_repair_final_result" :disabled="true">
            <el-radio label="完成">完成</el-radio>
            <el-radio label="等待">等待</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1=false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="报修详情"
      :visible.sync="dialogVisibleRepair"
      width="30%"
    >
      <repair
        :rule-form="ruleForm"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseRepair">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="维修作业标准详情"
      :visible.sync="dialogVisibleDefinition"
      width="70%"
    >
      <definition
        :type-form="typeForm"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDefinition">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="维护作业标准详情"
      :visible.sync="dialogVisibleMaintain"
      width="70%"
    >
      <maintain
        :type-form="typeForm1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseMaintain">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="维修物料申请"
      :visible.sync="dialogVisibleMaterial"
      width="70%"
    >
      <el-form :inline="true">
        <el-form-item label="领料申请单号">
          <el-input v-model="creatOrder1.warehouse_out_no" disabled />
        </el-form-item>
        <el-form-item label="单据状态">
          <el-input v-model="creatOrder1.out_record_status" disabled />
        </el-form-item>
      </el-form>
      <el-table
        :data="tableDataView"
        border
      >
        <el-table-column
          prop="spare_code"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="spare_name"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="equip_component_type_name"
          label="备件分类"
          min-width="20"
        />
        <el-table-column
          prop="specification"
          label="规格型号"
          min-width="20"
        />
        <el-table-column
          prop="technical_params"
          label="技术参数"
          min-width="20"
        />
        <el-table-column
          prop="unit"
          label="标准单位"
          min-width="20"
        />
        <el-table-column
          prop="inventory_quantity"
          label="库存数量"
          min-width="20"
        />
        <el-table-column
          prop="apply"
          label="领料数量"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model="row.apply"
              disabled
              size="small"
              :min="1"
              :max="row.inventory_quantity"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="submit_old_flag"
          label="是否交旧"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-checkbox v-model="row.submit_old_flag" disabled />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMaterial=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { mapGetters } from 'vuex'
import { equipApplyOrder, uploadImages, multiUpdate, equipApplyRepair, equipRepairStandard, equipMaintenanceStandard, materialReq } from '@/api/jqy'
import { debounce } from '@/utils'
import definition from '../components/definition-dialog'
import maintain from '../components/definition-dialog1'
import repair from '../components/repair-dialog'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'AcceptanceEquipment',
  components: { EquipSelect, page, repair, definition, maintain },
  data() {
    return {
      search: { status: '已完成' },
      loading: false,
      btnExportLoad: false,
      dialogVisibleRepair: false,
      dialogVisibleDefinition: false,
      dialogVisibleMaintain: false,
      dialogVisibleMaterial: false,
      dateValue: [],
      tableData: [],
      tableDataView: [],
      total: 0,
      multipleSelection: [],
      dialogImageUrl: '',
      operateType: '',
      dialogVisible: false,
      dialogVisible1: false,
      submit: false,
      ruleForm: {},
      typeForm: {},
      typeForm1: {},
      dialogVisibleImg: false,
      creatOrder: {},
      creatOrder1: { result_repair_graph_url: [] },
      rules: {
        result_accept_desc: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        result_accept_result: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.search.created_user = this.name
    this.getList()
  },
  methods: {
    debounceList() {
      debounce(this, 'changeSearch')
    },
    async dialogMaterial() {
      if (this.creatOrder1.is_applyed) {
        const data = await materialReq('get', null, { params: { warehouse_out_no: this.creatOrder1.warehouse_out_no }})
        this.tableDataView = data || []
        this.creatOrder1.out_record_status = this.tableDataView.length > 0 ? this.tableDataView[0].out_record_status : null
        this.dialogVisibleMaterial = true
      }
    },
    async generateFun() {
      delete this.creatOrder.apply_repair_graph_url
      const obj = []
      this.multipleSelection.forEach(d => {
        obj.push(d.id)
      })
      if (this.creatOrder.result_accept_result === '合格') {
        this.creatOrder.pks = obj
        this.creatOrder.status = '已验收'
        this.creatOrder.opera_type = '验收'
      } else {
        this.creatOrder.pks = obj
        this.creatOrder.status = '已开始'
        this.creatOrder.opera_type = '验收'
      }
      try {
        await multiUpdate('post', null, { data: this.creatOrder })
        this.$message.success('验收成功')
        this.dialogVisible = false
        this.$refs.multipleTable.clearSelection()
        this.getList()
      } catch (e) {
        this.dialogVisible = true
      }
    },
    changeDate(date) {
      this.search.planned_repair_date_after = date ? date[0] : ''
      this.search.planned_repair_date_before = date ? date[1] : ''
      this.changeSearch()
    },
    async repairDialog(row) {
      if (row.equip_repair_standard_name) {
        try {
          const data = await equipRepairStandard('get', null, { params: { id: row.equip_repair_standard }})
          this.typeForm = data.results[0]
        } catch (e) {
          // this.dialogVisible = true
        }
        this.dialogVisibleDefinition = true
      } else if (row.equip_maintenance_standard_name) {
        try {
          const data = await equipMaintenanceStandard('get', null, { params: { id: row.equip_maintenance_standard }})
          this.typeForm1 = data.results[0]
        } catch (e) {
          // this.dialogVisible = true
        }
        this.dialogVisibleMaintain = true
      } else if (row.result_fault_cause_name) {
        try {
          const data = await equipApplyRepair('get', null, { params: { plan_id: row.plan_id }})
          this.ruleForm = data.results[0]
        } catch (e) {
        // this.dialogVisible = true
        }
        this.dialogVisibleRepair = true
      }
    },
    handleCloseRepair() {
      this.dialogVisibleRepair = false
    },
    handleCloseDefinition() {
      this.dialogVisibleDefinition = false
    },
    handleCloseMaintain() {
      this.dialogVisibleMaintain = false
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipApplyOrder('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.getList()
    },
    onExceed() {
      this.$message.info('最多上传五张图片')
    },
    async onChangeImg(file, fileList) {
      const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.raw.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpeg、jpg 、png格式!')
        fileList.pop()
        return
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        fileList.pop()
        return
      }
      const picture = new FormData()
      picture.append('image_file_name', file.raw)
      picture.append('source_type', '维修')
      const data = await uploadImages('post', null, { data: picture })
      this.creatOrder.image_url_list.push(data.image_file_name)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleImg = true
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
    },
    dialog1(row, type) {
      this.dialogVisible1 = true
      this.operateType = type
      this.creatOrder1 = JSON.parse(JSON.stringify(row))
    },
    dialog(row, type) {
      if (row === false) {
        this.operateType = type
        if (this.multipleSelection.length > 0) {
          if (this.multipleSelection.every(d => d.status === '已完成')) {
            this.dialogVisible = true
            this.creatOrder = {
              result_accept_desc: '验收完成',
              image_url_list: [],
              result_accept_result: '合格'
            }
          } else {
            this.$message.info('请勾选已完成状态列表')
          }
        } else {
          this.$message.info('请先勾选工单列表')
        }
      } else {
        this.dialogVisible = true
        this.operateType = type
        this.creatOrder = JSON.parse(JSON.stringify(row))
      }
    },
    handleClose(done) {
      if (this.$refs.elUploadImg) {
        this.$refs.elUploadImg.clearFiles()
      }
      this.$refs.ruleFormHandle.clearValidate()
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style>

</style>
