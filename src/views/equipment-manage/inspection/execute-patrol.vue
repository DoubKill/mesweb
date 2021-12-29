<template>
  <div>
    <!-- 执行巡检工单 -->
    <el-form :inline="true">
      <el-form-item label="计划巡检日期">
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
      <el-form-item label="类别">
        <el-select
          v-model="search.type"
          style="width:100px"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['机械', '电气','通用']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划名称">
        <el-input
          v-model="search.plan_name"
          style="width:200px"
          clearable
          @input="changeDebounce"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          style="width:100px"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="巡检标准">
        <el-input
          v-model="search.equip_repair_standard"
          style="width:150px"
          clearable
          @input="changeDebounce"
        />
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.equip_condition"
          placeholder="请选择"
          style="width:100px"
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
          style="width:100px"
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
    </el-form>
    <el-table
      v-loading="loading"
      size="mini"
      :data="tableData"
      border
    >
      <el-table-column
        label="操作"
        width="220"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['equip_inspection_order','begin']"
              type="primary"
              size="mini"
              :loading="submit1&&scope.row.id===loadId"
              :disabled="submit1||name!==scope.row.receiving_user"
              @click="start(scope.row)"
            >开始</el-button>
            <el-button
              v-permission="['equip_inspection_order', 'regulation']"
              :disabled="!(name===scope.row.receiving_user||name===sectionTop)"
              type="primary"
              size="mini"
              @click="personChange(scope.row)"
            >增减人员
            </el-button>
            <el-button
              v-permission="['equip_inspection_order','handle']"
              :disabled="name!==scope.row.receiving_user"
              type="primary"
              size="mini"
              @click="dialog(scope.row,'处理巡检工单')"
            >处理
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="plan_id"
        label="计划编号"
        min-width="20"
      />
      <el-table-column
        prop="plan_name"
        label="计划名称"
        min-width="20"
      />
      <el-table-column
        prop="inspection_line_no"
        label="序号"
        min-width="20"
      />
      <el-table-column
        prop="area_name"
        label="区域"
        min-width="20"
      />
      <el-table-column
        prop="type"
        label="类别"
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
        prop="equip_repair_standard_name"
        label="巡检标准"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.equip_repair_standard_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="planned_repair_date"
        label="计划巡检日期"
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
        prop="repair_user"
        label="巡检人"
        min-width="20"
      />
      <el-table-column
        prop="repair_start_datetime"
        label="巡检开始时间"
        min-width="20"
      />
      <el-table-column
        prop="repair_end_datetime"
        label="巡检结束时间"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="录入人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
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
      :before-close="handleClose"
      :title="operateType"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <el-form
        ref="ruleFormHandle"
        :model="creatOrder"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="巡检计划名称">
          <el-input
            v-model="creatOrder.plan_name"
            style="width:250px"
            disabled
          />
        </el-form-item>
        <el-form-item label="工单编号">
          <el-input
            v-model="creatOrder.work_order_no"
            disabled
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="机台">
          <el-input
            v-model="creatOrder.equip_no"
            disabled
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="巡检标准">
          <el-input
            v-model="creatOrder.equip_repair_standard_name"
            style="width:250px"
            disabled
          />
          <el-button type="primary" style="float:right;margin-bottom:6px" @click="addList">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-table
            :data="creatOrder.work_content"
            border
            style="width: 1091px"
          >
            <el-table-column
              label="序号"
              type="index"
              prop="job_item_sequence"
              width="50"
            />
            <el-table-column
              prop="job_item_content"
              label="作业明细"
              width="150"
            >
              <template slot-scope="{row}">
                <el-input v-model="row.job_item_content" />
              </template>
            </el-table-column>
            <el-table-column
              prop="job_item_check_standard"
              label="判断标准"
              width="270"
            >
              <template slot-scope="{row}">
                <div v-if="row.job_item_check_type==='有无'">
                  <el-switch
                    v-model="row.job_item_check_standard"
                    active-value="无"
                    inactive-value="有"
                    active-text="无"
                    inactive-text="有"
                    @change="changeRusult"
                  />
                </div>
                <div v-if="row.job_item_check_type==='正常异常'">
                  <el-switch
                    v-model="row.job_item_check_standard"
                    active-value="正常"
                    inactive-value="异常"
                    active-text="正常"
                    inactive-text="异常"
                    @change="changeRusult"
                  />
                </div>
                <div v-if="row.job_item_check_type==='完成未完成'">
                  <el-switch
                    v-model="row.job_item_check_standard"
                    active-value="完成"
                    inactive-value="未完成"
                    active-text="完成"
                    inactive-text="未完成"
                    @change="changeRusult"
                  />
                </div>
                <div v-if="row.job_item_check_type==='合格不合格'">
                  <el-switch
                    v-model="row.job_item_check_standard"
                    active-value="合格"
                    inactive-value="不合格"
                    active-text="合格"
                    inactive-text="不合格"
                    @change="changeRusult"
                  />
                </div>
                <div v-if="row.job_item_check_type==='数值范围'">
                  <el-input-number v-model="row.job_item_check_standard_a" style="width:120px" controls-position="right" :min="0" :max="row.job_item_check_standard_b" @change="changeRusult" />
                  -
                  <el-input-number v-model="row.job_item_check_standard_b" style="width:120px" controls-position="right" :min="row.job_item_check_standard_a" @change="changeRusult" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              width="180"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.job_item_check_type" placeholder="请选择" @change="standardType(row)">
                  <el-option
                    v-for="item in ['有无','数值范围','正常异常','完成未完成','合格不合格']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="operation_result"
              label="处理结果"
              width="150"
            >
              <template slot-scope="{row}">
                <div v-if="row.job_item_check_type==='有无'">
                  <el-switch
                    v-model="row.operation_result"
                    active-value="无"
                    inactive-value="有"
                    active-text="无"
                    inactive-text="有"
                    @change="changeRusult"
                  />
                </div>
                <div v-if="row.job_item_check_type==='正常异常'">
                  <el-switch
                    v-model="row.operation_result"
                    active-value="正常"
                    inactive-value="异常"
                    active-text="正常"
                    inactive-text="异常"
                    @change="changeRusult"
                  />
                </div>
                <div v-if="row.job_item_check_type==='完成未完成'">
                  <el-switch
                    v-model="row.operation_result"
                    active-value="完成"
                    inactive-value="未完成"
                    active-text="完成"
                    inactive-text="未完成"
                    @change="changeRusult"
                  />
                </div>
                <div v-if="row.job_item_check_type==='合格不合格'">
                  <el-switch
                    v-model="row.operation_result"
                    active-value="合格"
                    inactive-value="不合格"
                    active-text="合格"
                    inactive-text="不合格"
                    @change="changeRusult"
                  />
                </div>
                <div v-if="row.job_item_check_type==='数值范围'">
                  <el-input-number v-model="row.operation_result" style="width:120px" controls-position="right" :min="1" :max="99999" @change="changeRusult" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="异常处理结果"
              prop="abnormal_operation_result"
              width="120"
            />
            <el-table-column label="操作" width="170">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="delDialogFun(scope.$index)"
                >删除</el-button>
                <el-button
                  v-if="!((scope.row.job_item_check_type === '数值范围' && scope.row.job_item_check_standard_a <= scope.row.operation_result && scope.row.job_item_check_standard_b >= scope.row.operation_result) ||
                    (scope.row.job_item_check_type !== '数值范围' && scope.row.job_item_check_standard === scope.row.operation_result))"
                  size="mini"
                  type="danger"
                  @click="dialogProject(scope.row,scope.$index)"
                >处理异常</el-button>
                <!-- <el-button
                  v-if="scope.row.job_item_check_standard&&
                    ((scope.row.job_item_check_type === '数值范围' && scope.row.job_item_check_standard_a <= scope.row.abnormal_operation_result && scope.row.job_item_check_standard_b >= scope.row.abnormal_operation_result)||
                      (scope.row.job_item_check_type !== '数值范围' && scope.row.job_item_check_standard === scope.row.abnormal_operation_result))"
                  size="mini"
                  type="danger"
                  @click="dialogProject(scope.row,scope.$index)"
                >查看处理详情</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="巡检备注" prop="result_repair_desc">
          <el-input
            v-model="creatOrder.result_repair_desc"
            type="textarea"
            style="width:250px"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
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
          <template v-for="(item, index) in creatOrder.result_repair_graph_url">
            <el-image
              v-if="creatOrder.result_repair_graph_url.length>0"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            />
          </template>
        </el-form-item>
        <el-form-item label="巡检结论" prop="abnormal_operation_result">
          <el-radio-group v-model="creatOrder.result_repair_final_result" disabled>
            <el-radio label="正常">正常</el-radio>
            <el-radio label="不正常">不正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogApplication">报修申请</el-button>
        <el-button type="primary" @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :before-close="handleCloseApplication"
      title="报修申请"
      :visible.sync="dialogVisibleApplication"
    >
      <application
        ref="List"
        :work-id="creatOrder.id"
        :equip="creatOrder.equip_no"
        :show="dialogVisibleApplication"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCloseApplication(false)">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="generateFunApplication">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="增减人员"
      :visible.sync="dialogVisiblePerson"
      width="30%"
    >
      <el-form v-loading="loadPerson" :inline="true" label-width="120px">
        <el-form-item style="" prop="checkList">
          <span v-if="bz">作业标准人数：{{ bz }}</span>
          <el-checkbox-group v-model="checkList">
            <template v-for="(item, index) in staffList">
              <el-checkbox :key="index" :label="item.username" :disabled="!item.optional||item.username===receiving_user" />
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePerson=false">取 消</el-button>
        <el-button :loading="submitPerson" type="primary" @click="generateFunPerson">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="巡检作业标准详情"
      :visible.sync="dialogVisibleMaintain"
      width="80%"
    >
      <maintain
        :show="dialogVisibleMaintain"
        :type-form="typeForm1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMaintain=false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="异常项目处理"
      :visible.sync="dialogVisibleProject"
      width="30%"
    >
      <el-form :model="projectForm" :rules="projectRules" :inline="true" label-width="150px">
        <el-form-item label="异常项目备注" prop="abnormal_operation_desc">
          <el-input
            v-model="projectForm.abnormal_operation_desc"
            type="textarea"
            style="width:250px"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            ref="elUploadImg"
            action=""
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="onChangeImg1"
            :on-exceed="onExceed"
            :limit="5"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <template v-for="(item, index) in projectForm.abnormal_operation_url">
            <el-image
              v-if="projectForm.abnormal_operation_url.length>0"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            />
          </template>
        </el-form-item>
        <br>
        <el-form-item label="异常处理结果" prop="abnormal_operation_result">
          <div v-if="projectForm.job_item_check_type==='有无'">
            <el-radio-group v-model="projectForm.abnormal_operation_result">
              <el-radio label="有">有</el-radio>
              <el-radio label="无">无</el-radio>
            </el-radio-group>
          </div>
          <div v-if="projectForm.job_item_check_type==='正常异常'">
            <el-radio-group v-model="projectForm.abnormal_operation_result">
              <el-radio label="正常">正常</el-radio>
              <el-radio label="异常">异常</el-radio>
            </el-radio-group>
          </div>
          <div v-if="projectForm.job_item_check_type==='完成未完成'">
            <el-radio-group v-model="projectForm.abnormal_operation_result">
              <el-radio label="完成">完成</el-radio>
              <el-radio label="未完成">未完成</el-radio>
            </el-radio-group>
          </div>
          <div v-if="projectForm.job_item_check_type==='合格不合格'">
            <el-radio-group v-model="projectForm.abnormal_operation_result">
              <el-radio label="合格">合格</el-radio>
              <el-radio label="不合格">不合格</el-radio>
            </el-radio-group>
          </div>
          <div v-if="projectForm.job_item_check_type==='数值范围'">
            <el-input-number v-model="projectForm.abnormal_operation_result" style="width:120px" controls-position="right" :min="1" />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleProject=false">取 消</el-button>
        <el-button :loading="submitPerson" type="primary" @click="generateFunProject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import page from '@/components/page'
import maintain from '../components/definition-dialog2'
import { sectionTree } from '@/api/base_w_four'
import { mapGetters } from 'vuex'
import application from '../components/application-dialog'
import { equipInspectionOrder, multiUpdateInspection, uploadImages, equipApplyRepair, getStaff, equipMaintenanceStandard } from '@/api/jqy'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'ExecutePatrol',
  components: { EquipSelect, page, application, maintain },
  data() {
    return {
      search: {
        my_order: 1,
        page: 1,
        page_size: 10
      },
      dateValue: [],
      tableData: [],
      typeForm1: {},
      bz: null,
      lengthIndex: null,
      order_id: null,
      dialogVisibleMaintain: false,
      dialogVisibleProject: false,
      loadPerson: false,
      checkList: [],
      loading: false,
      submitPerson: false,
      staffList: [],
      sectionTop: null,
      receiving_user: '',
      equip_jobitem_standard_id: null,
      dialogVisiblePerson: false,
      dialogVisibleApplication: false,
      total: 0,
      rules: {
        result_repair_final_result: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      projectRules: {
        abnormal_operation_result: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      multipleSelection: [],
      dialogImageUrl: '',
      operateType: '',
      btnLoading: false,
      dialogVisible: false,
      loadId: '',
      submit: false,
      submit1: false,
      creatOrder: {},
      projectForm: { abnormal_operation_desc: null, abnormal_operation_result: null }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getList()
    this.getSectionTop()
  },
  methods: {
    changeDebounce() {
      debounce(this, 'changeSearch')
    },
    async repairDialog(row) {
      try {
        const data = await equipMaintenanceStandard('get', null, { params: { id: row.equip_repair_standard }})
        this.typeForm1 = data.results[0]
        this.dialogVisibleMaintain = true
      } catch (e) {
        // this.dialogVisible = true
      }
    },
    async getSectionTop() {
      try {
        const data = await sectionTree('get', null, { params: { section_name: '设备科' }})
        this.sectionTop = data.in_charge_user
      } catch (e) {
        //
      }
    },
    changeDate(date) {
      this.search.planned_repair_date_after = date ? date[0] : ''
      this.search.planned_repair_date_before = date ? date[1] : ''
      this.changeSearch()
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipInspectionOrder('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    standardType(row) {
      delete row.job_item_check_standard_a
      delete row.job_item_check_standard_b
      if (row.job_item_check_type === '有无') {
        this.$set(row, 'operation_result', '无')
        this.$set(row, 'job_item_check_standard', '无')
      }
      if (row.job_item_check_type === '数值范围') {
        delete row.job_item_check_standard
        this.$set(row, 'operation_result', '')
        this.$set(row, 'job_item_check_standard_a', 0)
        this.$set(row, 'job_item_check_standard_b', 1)
      }
      if (row.job_item_check_type === '正常异常') {
        this.$set(row, 'operation_result', '正常')
        this.$set(row, 'job_item_check_standard', '正常')
      }
      if (row.job_item_check_type === '完成未完成') {
        this.$set(row, 'operation_result', '完成')
        this.$set(row, 'job_item_check_standard', '完成')
      }
      if (row.job_item_check_type === '合格不合格') {
        this.$set(row, 'operation_result', '合格')
        this.$set(row, 'job_item_check_standard', '合格')
      }
    },
    delDialogFun(index) {
      if (this.creatOrder.work_content.length === 1) {
        this.$message('只剩一条作业内容时不能删除')
        return
      }
      this.creatOrder.work_content.splice(index, 1)
      this.changeRusult()
    },
    addList() {
      this.creatOrder.work_content.push({
        equip_jobitem_standard_id: this.equip_jobitem_standard_id,
        job_item_sequence: this.creatOrder.work_content.length + 1,
        job_item_check_standard: '完成',
        job_item_check_type: '完成未完成',
        operation_result: '完成' })
    },
    async personChange(row) {
      try {
        this.dialogVisiblePerson = true
        this.loadPerson = true
        const data = await getStaff('get', null, { params: { equip_no: row.equip_no, have_classes: 1 }})
        this.staffList = data.results || []
        this.bz = row.work_persons ? row.work_persons : null
        this.receiving_user = row.receiving_user
        this.order_id = row.id
        this.checkList = row.repair_users
        this.loadPerson = false
      } catch (e) {
        this.loadPerson = false
      }
    },
    async generateFunPerson() {
      try {
        this.submitPerson = true
        await equipInspectionOrder('post', null, { data: { order_id: this.order_id, users: this.checkList }})
        this.$message.success('修改成功')
        this.submitPerson = false
        this.dialogVisiblePerson = false
        this.getList()
      } catch (e) {
        this.submitPerson = false
        this.dialogVisiblePerson = true
      }
    },
    start(row) {
      const obj = []
      obj.push(row.id)
      this.loadId = row.id
      if (row.status === '已接单') {
        this.$confirm('此操作将开始巡检此工单是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submit1 = true
          multiUpdateInspection('post', null, { data: { pks: obj, status: '已开始', opera_type: '开始' }})
            .then(response => {
              this.$message({
                type: 'success',
                message: '开始工单成功'
              })
              this.submit1 = false
              this.getList()
            })
            .catch(response => {
              this.submit1 = false
            })
        })
      } else {
        this.$message({
          type: 'info',
          message: '只能开始已接单工单'
        })
      }
    },
    dialogProject(row, index) {
      // this.projectForm = JSON.parse(JSON.stringify(row))
      this.lengthIndex = index
      this.projectForm.job_item_check_type = row.job_item_check_type
      this.projectForm.abnormal_operation_desc = row.abnormal_operation_desc || ''
      this.projectForm.abnormal_operation_url = row.abnormal_operation_url || []
      if (this.projectForm.job_item_check_type === '数值范围') {
        this.projectForm.abnormal_operation_result = row.abnormal_operation_result ? row.abnormal_operation_result : 1
      } else {
        this.projectForm.abnormal_operation_result = row.abnormal_operation_result ? row.abnormal_operation_result : row.job_item_check_standard
      }
      this.dialogVisibleProject = true
    },
    generateFunProject() {
      this.$set(this.creatOrder.work_content[this.lengthIndex], 'abnormal_operation_desc', this.projectForm.abnormal_operation_desc)
      this.$set(this.creatOrder.work_content[this.lengthIndex], 'abnormal_operation_result', this.projectForm.abnormal_operation_result)
      this.$set(this.creatOrder.work_content[this.lengthIndex], 'abnormal_operation_url', this.projectForm.abnormal_operation_url)
      if (this.creatOrder.work_content.every(d =>
        (d.job_item_check_type === '数值范围' && d.job_item_check_standard_a <= d.operation_result && d.job_item_check_standard_b >= d.operation_result) ||
        (d.job_item_check_type !== '数值范围' && d.job_item_check_standard === d.operation_result) ||
        (d.job_item_check_type === '数值范围' && d.job_item_check_standard_a <= d.abnormal_operation_result && d.job_item_check_standard_b >= d.abnormal_operation_result) ||
        (d.job_item_check_type !== '数值范围' && d.job_item_check_standard === d.abnormal_operation_result)
      )) {
        this.creatOrder.result_repair_final_result = '正常'
      } else {
        this.creatOrder.result_repair_final_result = '不正常'
      }
      this.dialogVisibleProject = false
    },
    changeSearch() {
      this.search.page = 1
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
      picture.append('source_type', '巡检')
      const data = await uploadImages('post', null, { data: picture })
      this.creatOrder.image_url_list.push(data.image_file_name)
    },
    async onChangeImg1(file, fileList) {
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
      picture.append('source_type', '巡检')
      const data = await uploadImages('post', null, { data: picture })
      this.projectForm.abnormal_operation_url.push(data.image_file_name)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
    },
    dialogApplication() {
      this.dialogVisibleApplication = true
    },
    handleCloseApplication() {
      if (this.$refs['List'].$refs.elUploadImg) {
        this.$refs['List'].$refs.elUploadImg.clearFiles()
      }
      this.$refs['List'].$refs.ruleFormHandle.resetFields()
      this.dialogVisibleApplication = false
      this.$refs['List'].disable = false
    },
    generateFunApplication() {
      this.$refs['List'].$refs.ruleFormHandle.validate(async(valid) => {
        if (valid) {
          try {
            delete this.$refs['List'].ruleForm.apply_repair_graph_url
            if (this.$refs['List'].ruleForm.equip_condition === true) {
              this.ruleForm.equip_condition = '停机'
            } else {
              this.$refs['List'].ruleForm.equip_condition = '不停机'
            }
            this.btnLoading = true
            await equipApplyRepair('post', null, { data: this.$refs['List'].ruleForm })
            this.$message.success('操作成功')
            this.handleCloseApplication(null)
            this.btnLoading = false
            this.$refs['List'].disable = false
          } catch (e) {
            this.btnLoading = false
            this.$refs['List'].disable = false
          }
        } else {
          return false
        }
      })
      this.dialogVisibleApplication = true
      // this.$refs['List'].$refs.addSubmitFun()
    },
    dialog(row, type) {
      this.equip_jobitem_standard_id = null
      if (row.status === '已开始') {
        this.operateType = type
        this.creatOrder = JSON.parse(JSON.stringify(row))
        this.creatOrder.image_url_list = this.creatOrder.result_repair_graph_url || []
        if (row.work_content.length > 0) {
          const arr = []
          this.equip_jobitem_standard_id = row.work_content[0].equip_jobitem_standard_id
          this.creatOrder.work_content.map((item, index) => {
            if (item.job_item_check_type === '数值范围') {
              item.job_item_check_standard_a = Number(item.job_item_check_standard.split('-')[0])
              item.job_item_check_standard_b = Number(item.job_item_check_standard.split('-')[1])
            } else {
              delete item.job_item_check_standard_a
              delete item.job_item_check_standard_b
            }
            arr.push(Object.assign({}, item))
          })
          arr.forEach(d => {
            if (d.job_item_check_type === '数值范围') {
              if (!d.operation_result || d.operation_result === '') {
                d.operation_result = 1
              } else {
                d.operation_result = Number(d.operation_result)
              }
            } else {
              if (!d.operation_result || d.operation_result === '') {
                d.operation_result = d.job_item_check_standard
              }
            }
          })
          this.creatOrder.work_content = arr
        }
        if (this.creatOrder.work_content.every(d =>
          (d.job_item_check_type === '数值范围' && d.job_item_check_standard_a <= d.operation_result && d.job_item_check_standard_b >= d.operation_result) ||
          (d.job_item_check_type !== '数值范围' && d.job_item_check_standard === d.operation_result) ||
          (d.job_item_check_type === '数值范围' && d.job_item_check_standard_a <= d.abnormal_operation_result && d.job_item_check_standard_b >= d.abnormal_operation_result) ||
          (d.job_item_check_type !== '数值范围' && d.job_item_check_standard === d.abnormal_operation_result)
        )) {
          this.creatOrder.result_repair_final_result = '正常'
        } else {
          this.creatOrder.result_repair_final_result = '不正常'
        }
        this.dialogVisible = true
      } else {
        this.$message.info('请处理已开始工单')
      }
    },
    changeRusult() {
      if (this.creatOrder.work_content.every(d =>
        (d.job_item_check_type === '数值范围' && d.job_item_check_standard_a <= d.operation_result && d.job_item_check_standard_b >= d.operation_result) ||
        (d.job_item_check_type !== '数值范围' && d.job_item_check_standard === d.operation_result) ||
        (d.job_item_check_type === '数值范围' && d.job_item_check_standard_a <= d.abnormal_operation_result && d.job_item_check_standard_b >= d.abnormal_operation_result) ||
        (d.job_item_check_type !== '数值范围' && d.job_item_check_standard === d.abnormal_operation_result)
      )) {
        this.creatOrder.result_repair_final_result = '正常'
      } else {
        this.creatOrder.result_repair_final_result = '不正常'
      }
      this.creatOrder.work_content.forEach(d => {
        if ((d.job_item_check_type === '数值范围' && d.job_item_check_standard_a <= d.operation_result && d.job_item_check_standard_b >= d.operation_result) ||
        (d.job_item_check_type !== '数值范围' && d.job_item_check_standard === d.operation_result)) {
          delete d.abnormal_operation_desc
          delete d.abnormal_operation_result
          delete d.abnormal_operation_url
        }
      })
    },
    handleClose(done) {
      if (this.$refs.elUploadImg) {
        this.$refs.elUploadImg.clearFiles()
      }
      this.$refs.ruleFormHandle.resetFields()
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    async generateFun() {
      this.creatOrder.work_content.forEach(d => {
        if (d.job_item_check_type === '数值范围') {
          if (!d.job_item_check_standard_a || !d.job_item_check_standard_b) {
            return
          } else {
            d.job_item_check_standard = d.job_item_check_standard_a + '-' + d.job_item_check_standard_b
          }
        }
      })
      if (this.creatOrder.work_content.every(d => d.job_item_content) &&
      this.creatOrder.work_content.every(d => d.job_item_check_standard)) {
        this.$refs.ruleFormHandle.validate(async(valid) => {
          if (this.creatOrder.work_content.length > 0) {
            this.creatOrder.work_content.forEach((d, i) => {
              if (d.job_item_check_type === '数值范围') {
                delete d.job_item_check_standard_a
                delete d.job_item_check_standard_b
              }
              d.job_item_sequence = i + 1
            })
          }
          const form = {}
          form.result_repair_desc = this.creatOrder.result_repair_desc
          form.image_url_list = this.creatOrder.image_url_list
          form.result_repair_final_result = this.creatOrder.result_repair_final_result
          form.pks = [this.creatOrder.id]
          form.status = '已完成'
          form.opera_type = '处理'
          form.work_content = this.creatOrder.work_content
          form.work_order_no = this.creatOrder.work_order_no
          form.equip_repair_standard = this.creatOrder.equip_repair_standard
          if (valid) {
            try {
              this.submit = true
              await multiUpdateInspection('post', null, { data: form })
              this.$message.success('操作成功')
              this.handleClose(null)
              this.getList()
              this.submit = false
              this.dialogVisible = false
            } catch (e) {
              this.submit = false
              this.dialogVisible = true
            }
          } else {
            return false
          }
        })
      } else {
        this.$message('请输入巡检标准作业明细或判断标准')
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
