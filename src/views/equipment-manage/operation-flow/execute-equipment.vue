<template>
  <div>
    <!-- 执行维修工单 -->
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
      <el-form-item label="维修标准">
        <el-input
          v-model="search.equip_repair_standard"
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="维修人">
        <el-input
          v-model="search.repair_user"
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="是否等待外协维修">
        <el-select
          v-model="search.wait_outsourcing"
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
      <el-form-item label="是否等待物料">
        <el-select
          v-model="search.wait_material"
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
      <el-form-item label="最终故障原因">
        <el-input
          v-model="search.result_final_fault_cause"
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeSearch">查询</el-button>
        <!-- <el-button type="primary">导出Excel</el-button> -->
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
        width="230"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="primary"
              size="mini"
              @click="start(scope.row)"
            >开始</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="dialog(scope.row,'处理维修工单')"
            >处理
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="dialog(scope.row,'查看处理结果')"
            >查看处理结果
            </el-button>
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
        prop="equip_repair_standard_name"
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
        label="维修记录"
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
        prop="wait_material"
        label="是否等待物料"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.wait_material===true">Y</span>
          <span v-if="scope.row.wait_material===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="wait_outsourcing"
        label="是否等待外协维修"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.wait_outsourcing===true">Y</span>
          <span v-if="scope.row.wait_outsourcing===false">N</span>
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
      width="50%"
    >
      <el-form
        ref="ruleFormHandle"
        :model="creatOrder"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="计划/报修名称">
          <el-input
            v-model="creatOrder.plan_name"
            style="width:250px"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="工单编号">
          <el-input
            v-model="creatOrder.work_order_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="机台">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="维修标准/故障原因">
          <el-input
            v-if="creatOrder.equip_maintenance_standard"
            v-model="creatOrder.equip_maintenance_standard_name"
            :disabled="true"
            style="width:250px"
          />
          <el-input
            v-if="creatOrder.equip_repair_standard"
            v-model="creatOrder.equip_repair_standard_name"
            :disabled="true"
            style="width:250px"
          />
          <el-input
            v-if="creatOrder.result_fault_cause"
            v-model="creatOrder.result_fault_cause_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="故障详情描述" prop="note">
          <el-input
            v-model="creatOrder.result_fault_desc"
            :disabled="operateType==='查看处理结果'"
            type="textarea"
            style="width:250px"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="实际维修标准" prop="result_repair_standard_name">
          <el-input
            v-if="creatOrder.work_type==='维修'"
            v-model="creatOrder.result_repair_standard_name"
            style="width:250px"
            :disabled="true"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              :disabled="operateType==='查看处理结果'"
              @click="dialog2"
            />
          </el-input>
          <el-input
            v-else
            v-model="creatOrder.result_maintenance_standard_name"
            style="width:250px"
            :disabled="true"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              :disabled="operateType==='查看处理结果'"
              @click="dialog2"
            />
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-table
            :data="creatOrder.work_content"
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
              label="说明"
              width="200"
            >
              <template slot-scope="{row}">
                <el-input v-model="row.job_item_check_standard" :disabled="operateType==='查看处理结果'" />
              </template>
            </el-table-column>
            <el-table-column
              prop="operation_result"
              label="处理结果"
              width="200"
            >
              <template slot-scope="{row}">
                <el-radio-group v-model="row.operation_result" :disabled="operateType==='查看处理结果'">
                  <el-radio label="完成">完成</el-radio>
                  <el-radio label="未完成">未完成</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="维修备注">
          <el-input
            v-model="creatOrder.result_repair_desc"
            :disabled="operateType==='查看处理结果'"
            style="width:250px"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            v-if="operateType==='处理维修工单'"
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
          <!-- <template v-for="(item, index) in creatOrder.result_repair_graph_url">
            <el-image
              v-if="operateType==='处理维修工单'&&creatOrder.result_repair_graph_url.length>0"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            />
          </template> -->
          <template v-for="(item, index) in creatOrder.result_repair_graph_url">
            <el-image
              v-if="operateType==='查看处理结果'&&creatOrder.result_repair_graph_url.length>0"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            />
          </template>
          <div v-if="operateType==='查看处理结果'&&creatOrder.result_repair_graph_url.length===0">
            暂无图片
          </div>
        </el-form-item>
        <el-form-item label="最终故障原因" prop="result_final_fault_cause">
          <el-input
            v-model="creatOrder.result_final_fault_cause"
            :disabled="true"
            style="width:250px"
          >
            <el-button
              slot="append"
              :disabled="operateType==='查看处理结果'"
              icon="el-icon-search"
              @click="Add"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="物料申请">
          <el-radio-group v-model="creatOrder.result_material_requisition" :disabled="operateType==='查看处理结果'||creatOrder.is_applyed" @change="change">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
          <span v-if="!creatOrder.is_applyed" style="marginLeft:30px">未申请</span>
          <span v-if="creatOrder.is_applyed" style="marginLeft:30px">已申请</span>
          <el-button type="primary" :disabled="creatOrder.result_material_requisition===false" style="marginLeft:30px" @click="dialog1">{{ creatOrder.is_applyed?'查看物料列表':'申请物料' }}</el-button>
          <br>
          <el-checkbox v-model="creatOrder.wait_material" :disabled="operateType==='查看处理结果'||!creatOrder.result_material_requisition" @change="change">等待物料</el-checkbox>
        </el-form-item>
        <el-form-item label="是否需要外协">
          <el-radio-group v-model="creatOrder.result_need_outsourcing" :disabled="operateType==='查看处理结果'" @change="change">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
          <el-checkbox v-model="creatOrder.wait_outsourcing" :disabled="operateType==='查看处理结果'||!creatOrder.result_need_outsourcing" style="margin-left:30px" @change="change">等待外协维修</el-checkbox>
        </el-form-item>
        <el-form-item label="维修结论" prop="result_repair_final_result">
          <el-radio-group v-model="creatOrder.result_repair_final_result" disabled>
            <el-radio label="完成">完成</el-radio>
            <el-radio label="等待">等待</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button v-if="operateType==='处理维修工单'" :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="维修物料申请"
      :visible.sync="dialogVisible1"
      width="70%"
    >
      <el-form :inline="true">
        <el-form-item label="领料申请单号">
          <el-input v-model="creatOrder.warehouse_out_no" :disabled="true" />
        </el-form-item>
        <el-form-item label="单据状态">
          <el-input v-model="creatOrder.out_record_status" :disabled="true" />
        </el-form-item>
        <el-form-item style="float:right">
          <el-button v-if="!creatOrder.is_applyed" type="primary" @click="dialogSelect">添加</el-button>
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
              :disabled="creatOrder.is_applyed"
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
            <el-checkbox v-model="row.submit_old_flag" :disabled="creatOrder.is_applyed" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="!creatOrder.is_applyed"
          label="操作"
          width="85"
        >
          <template slot-scope="{row}">
            <el-button type="danger" @click="deleteList(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun1">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="备品备件库物料选择"
      :visible.sync="dialogVisibleSelect"
      width="70%"
    >
      <el-form :inline="true">
        <el-form-item label="物料编码">
          <el-input v-model="search1.spare_code" @input="changeSearch1" />
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input v-model="search1.spare_name" @input="changeSearch1" />
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        v-loading="loadingView"
        :data="tableDataView1"
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
          prop="spare__code"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="spare_name"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="component_type_name"
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
          prop="quantity.all_qty"
          label="库存数量"
          min-width="20"
        />
      </el-table>
      <page
        :old-page="false"
        :total="total1"
        :current-page="search1.page"
        @currentChange="currentChange1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseSelect(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFunSelect">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="`维修作业项目`"
      :visible.sync="dialogVisible2"
      width="80%"
      :before-close="handleClose2"
    >
      <repair-definition
        ref="List1"
        :is-dialog="true"
        :params="creatOrder"
        :show="dialogVisible2"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose2(false)">取 消</el-button>
        <el-button type="primary" @click="submitFun1">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`维护作业项目`"
      :visible.sync="dialogVisibleWork"
      width="80%"
      :before-close="handleClosework"
    >
      <maintain-definition
        ref="List2"
        :is-dialog="true"
        :params="creatOrder"
        :show="dialogVisibleWork"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClosework(false)">取 消</el-button>
        <el-button type="primary" @click="submitFunwork">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="`故障原因`"
      :visible.sync="dialogVisible3"
      width="80%"
      :before-close="handleClose3"
    >
      <fault-classify
        ref="List"
        :is-dialog="true"
        :show="dialogVisible3"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose3(false)">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
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
  </div>
</template>

<script>
import page from '@/components/page'
import { mapGetters } from 'vuex'
import RepairDefinition from '../standard-definition/repair-definition'
import MaintainDefinition from '../standard-definition/maintain-definition'
import FaultClassify from '../master-data/fault-classify'
import { equipApplyOrder, uploadImages, multiUpdate, equipWarehouseInventory, materialReq,
  equipApplyRepair, equipRepairStandard, equipMaintenanceStandard, getOrderId, equipWarehouseOrder } from '@/api/jqy'
import { debounce } from '@/utils'
import definition from '../components/definition-dialog'
import maintain from '../components/definition-dialog1'
import repair from '../components/repair-dialog'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'ExecuteEquipment',
  components: { EquipSelect, page, RepairDefinition, MaintainDefinition, FaultClassify, repair, definition, maintain },
  data() {
    return {
      search: { my_order: 1 },
      search1: {},
      loading: false,
      btnExportLoad: false,
      dateValue: [],
      tableData: [],
      total: 0,
      total1: 0,
      multipleSelection: [],
      dialogImageUrl: '',
      loadingView: false,
      operateType: '',
      tableDataView: [],
      tableDataView1: [],
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisibleWork: false,
      dialogVisibleSelect: false,
      dialogVisibleRepair: false,
      dialogVisibleDefinition: false,
      dialogVisibleMaintain: false,
      ruleForm: {},
      typeForm: {},
      typeForm1: {},
      submit: false,
      rules: {
        result_repair_standard_name: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        result_repair_final_result: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      creatOrder: {}
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    debounceList() {
      debounce(this, 'changeSearch')
    },
    changeDate(date) {
      this.search.planned_repair_date_after = date ? date[0] : ''
      this.search.planned_repair_date_before = date ? date[1] : ''
      this.changeSearch()
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
    start(row) {
      const obj = []
      obj.push(row.id)
      if (row.status === '已接单') {
        this.$confirm('此操作将开始维修此工单是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          multiUpdate('post', null, { data: { pks: obj, status: '已开始', opera_type: '开始' }})
            .then(response => {
              this.$message({
                type: 'success',
                message: '开始工单成功'
              })
              this.getList()
            })
        })
      } else {
        this.$message({
          type: 'info',
          message: '只能开始已接单工单'
        })
      }
    },
    Add() {
      this.dialogVisible3 = true
    },
    submitFun() {
      if (this.$refs['List'].currentObj === null) {
        this.$refs['List'].currentObj = {}
      }
      if (this.$refs['List'].currentObj.fault_name) {
        this.creatOrder.result_final_fault_cause = this.$refs['List'].currentObj.fault_name
        this.dialogVisible3 = false
      } else {
        this.$message.info('请选择一种原因')
      }
    },
    submitFun1() {
      this.creatOrder.work_content = []
      if (this.$refs['List1'].currentObj.standard_name) {
        this.creatOrder.result_repair_standard_name = this.$refs['List1'].currentObj.standard_name
        this.creatOrder.result_repair_standard = this.$refs['List1'].currentObj.id
        for (let index = 0; index < this.$refs['List1'].currentObj.detail_list.length; index++) {
          this.creatOrder.work_content.push({
            job_item_sequence: this.$refs['List1'].currentObj.detail_list[index].job_item_sequence,
            job_item_content: this.$refs['List1'].currentObj.detail_list[index].job_item_content,
            job_item_check_standard: '',
            operation_result: '完成'

          })
        }
        this.dialogVisible2 = false
      } else {
        this.$message.info('请选择一种标准')
      }
    },
    submitFunwork() {
      this.creatOrder.work_content = []
      if (this.$refs['List2'].currentObj.standard_name) {
        this.creatOrder.result_maintenance_standard_name = this.$refs['List2'].currentObj.standard_name
        this.creatOrder.result_maintenance_standard = this.$refs['List2'].currentObj.id
        for (let index = 0; index < this.$refs['List2'].currentObj.detail_list.length; index++) {
          this.creatOrder.work_content.push({
            job_item_sequence: this.$refs['List2'].currentObj.detail_list[index].job_item_sequence,
            job_item_content: this.$refs['List2'].currentObj.detail_list[index].job_item_content,
            job_item_check_standard: '',
            operation_result: '完成'
          })
        }
        this.dialogVisibleWork = false
      } else {
        this.$message.info('请选择一种标准')
      }
    },
    handleClose2(done) {
      this.dialogVisible2 = false
      if (done) {
        done()
      }
    },
    handleClose3(done) {
      this.dialogVisible3 = false
      if (done) {
        done()
      }
    },
    handleClosework(done) {
      this.dialogVisibleWork = false
      if (done) {
        done()
      }
    },

    deleteList(row) {
      this.tableDataView.forEach((item, index) => {
        if (row.spare_code1 === item.spare_code1) {
          this.tableDataView.splice(index, 1)
        }
      })
    },
    async repairDialog(row) {
      if (row.equip_repair_standard_name) {
        this.dialogVisibleDefinition = true
        try {
          const data = await equipRepairStandard('get', null, { params: { id: row.equip_repair_standard }})
          this.typeForm = data.results[0]
        } catch (e) {
          // this.dialogVisible = true
        }
      } else if (row.equip_maintenance_standard_name) {
        this.dialogVisibleMaintain = true
        try {
          const data = await equipMaintenanceStandard('get', null, { params: { id: row.equip_maintenance_standard }})
          this.typeForm1 = data.results[0]
        } catch (e) {
          // this.dialogVisible = true
        }
      } else if (row.result_fault_cause_name) {
        this.dialogVisibleRepair = true
        try {
          const data = await equipApplyRepair('get', null, { params: { plan_id: row.plan_id }})
          this.ruleForm = data.results[0]
        } catch (e) {
        // this.dialogVisible = true
        }
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
    change() {
      console.log(this.creatOrder.result_need_outsourcing)
      if (this.creatOrder.wait_material === true || this.creatOrder.wait_outsourcing === true) {
        this.creatOrder.result_repair_final_result = '等待'
      } else if (this.creatOrder.wait_material === false && this.creatOrder.wait_outsourcing === false) {
        this.creatOrder.result_repair_final_result = '完成'
      }
      if (this.creatOrder.result_material_requisition === false) {
        this.creatOrder.wait_material = false
        if (this.creatOrder.wait_outsourcing === false) {
          this.creatOrder.result_repair_final_result = '完成'
        }
      }
      if (this.creatOrder.result_need_outsourcing === false) {
        this.creatOrder.wait_outsourcing = false
        if (this.creatOrder.wait_material === false) {
          this.creatOrder.result_repair_final_result = '完成'
        }
      }
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
      picture.append('source_type', '维修')
      const data = await uploadImages('post', null, { data: picture })
      this.creatOrder.image_url_list.push(data.image_file_name)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
    },
    dialog(row, type) {
      if (type === '查看处理结果') {
        this.dialogVisible = true
        this.creatOrder = JSON.parse(JSON.stringify(row))
        this.operateType = type
      } else {
        if (row.status === '已开始') {
          this.operateType = type
          this.creatOrder = JSON.parse(JSON.stringify(row))
          this.tableDataView = []
          this.creatOrder.image_url_list = this.creatOrder.result_repair_graph_url
          if (this.creatOrder.result_repair_final_result !== '等待') {
            this.creatOrder.result_need_outsourcing = false
            this.creatOrder.result_need_outsourcing = false
            this.creatOrder.result_material_requisition = false
            this.creatOrder.result_repair_final_result = '完成'
            this.creatOrder.work_content = []
            this.creatOrder.wait_material = false
            this.creatOrder.wait_outsourcing = false
          }
          // this.creatOrder = {
          //   image_url_list: [],
          //   result_need_outsourcing: false,
          //   result_material_requisition: false,
          //   result_repair_final_result: '完成',
          //   work_content: [],
          //   wait_material: false,
          //   wait_outsourcing: false
          // }
          // this.creatOrder.id = row.id
          // this.creatOrder.is_applyed = row.is_applyed
          // this.creatOrder.equip_type = row.equip_type
          // this.creatOrder.work_type = row.work_type
          // this.creatOrder.plan_name = row.plan_name
          // this.creatOrder.work_order_no = row.work_order_no
          // this.creatOrder.equip_no = row.equip_no
          // this.creatOrder.equip_maintenance_standard = row.equip_maintenance_standard
          // this.creatOrder.equip_repair_standard = row.equip_repair_standard
          // this.creatOrder.result_fault_cause = row.result_fault_cause
          // this.creatOrder.equip_maintenance_standard_name = row.equip_maintenance_standard_name
          // this.creatOrder.equip_repair_standard_name = row.equip_repair_standard_name
          // this.creatOrder.result_fault_cause_name = row.result_fault_cause_name
          if (row.result_final_fault_cause) {
            this.creatOrder.result_final_fault_cause = row.result_final_fault_cause
          } else if (row.result_fault_cause_name) {
            this.creatOrder.result_final_fault_cause = row.result_fault_cause_name
          } else if (row.equip_maintenance_standard || row.equip_repair_standard) {
            this.creatOrder.result_final_fault_cause = row.equip_maintenance_standard ? row.equip_maintenance_standard_name : row.equip_repair_standard_name
          }
          this.dialogVisible = true
        } else {
          this.$message.info('请处理已开始工单')
        }
      }
    },
    async dialog1() {
      if (this.creatOrder.is_applyed) {
        const data = await materialReq('get', null, { params: { warehouse_out_no: this.creatOrder.warehouse_out_no }})
        this.tableDataView = data || []
        this.creatOrder.out_record_status = this.tableDataView.length > 0 ? this.tableDataView[0].out_record_status : null
      }
      this.dialogVisible1 = true
    },
    dialog2() {
      if (this.creatOrder.work_type === '维修') {
        this.dialogVisible2 = true
      } else {
        this.dialogVisibleWork = true
      }
    },
    async dialogSelect() {
      try {
        this.loadingView = true
        const data = await equipWarehouseInventory('get', null, { params: this.search1 })
        this.tableDataView1 = data.results || []
        let data1 = []
        for (const i in this.tableDataView) {
          data1 = data1.concat(this.tableDataView[i].spare_code1)
        }
        this.tableDataView1.forEach(row => {
          if (data1.indexOf(row.spare_code) >= 0) {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          }
        })
        this.total1 = data.count
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
      this.dialogVisibleSelect = true
    },
    handleClose(done) {
      this.dialogVisible = false
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
    handleCloseSelect(done) {
      this.$refs.multipleTable.clearSelection()
      this.dialogVisibleSelect = false
      if (done) {
        done()
      }
    },
    changeSearch1() {
      this.search1.page = 1
      debounce(this, 'dialogSelect')
    },
    async generateFun() {
      this.$refs.ruleFormHandle.validate(async(valid) => {
        if (valid) {
          if (this.creatOrder.result_material_requisition) {
            const orderId = await getOrderId('get', null, { params: { status: '出库' }})
            const orderData = {}
            orderData.order_id = orderId
            orderData.submission_department = '维修部'
            orderData.status = 4
            orderData.equip_spare = this.tableDataView.map(item => ({ id: item.id, quantity: item.apply }))
            var warehouse_out_no = await equipWarehouseOrder('post', null, { data: orderData })
          }
          const data = {}
          data.work_order_no = this.creatOrder.work_order_no
          data.work_type = this.creatOrder.work_type
          data.pks = [this.creatOrder.id]
          data.opera_type = '处理'
          data.assign_user = this.creatOrder.assign_user
          data.result_fault_desc = this.creatOrder.result_fault_desc
          if (this.creatOrder.result_material_requisition) {
            data.apply_material_list = this.tableDataView.map(item => ({
              work_order_no: this.creatOrder.work_order_no,
              warehouse_out_no: warehouse_out_no.order_id,
              equip_spare_id: item.id,
              inventory_quantity: item.inventory_quantity,
              apply: item.apply,
              work_type: this.creatOrder.work_type,
              submit_old_flag: item.submit_old_flag }))
          }
          if (this.creatOrder.work_type === '维修') {
            data.result_repair_standard = this.creatOrder.result_repair_standard
          }
          if (this.creatOrder.work_type !== '维修') {
            data.result_maintenance_standard = this.creatOrder.result_maintenance_standard
          }
          data.work_content = this.creatOrder.work_content
          data.result_repair_desc = this.creatOrder.result_repair_desc
          data.image_url_list = this.creatOrder.image_url_list
          data.result_final_fault_cause = this.creatOrder.result_final_fault_cause
          data.result_material_requisition = this.creatOrder.result_material_requisition
          data.wait_material = this.creatOrder.wait_material
          data.result_need_outsourcing = this.creatOrder.result_need_outsourcing
          data.wait_outsourcing = this.creatOrder.wait_outsourcing
          data.result_repair_final_result = this.creatOrder.result_repair_final_result
          // delete this.creatOrder.apply_repair_graph_url
          // this.creatOrder1 = JSON.parse(JSON.stringify(this.creatOrder))
          // delete this.creatOrder1.result_repair_standard_name
          // delete this.creatOrder1.result_fault_cause_name
          // delete this.creatOrder1.is_applyed
          // delete this.creatOrder1.equip_type
          // delete this.creatOrder1.equip_maintenance_standard_name
          try {
            await multiUpdate('post', null, { data: data })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.dialogVisible = false
          } catch (e) {
            this.dialogVisible = true
          }
        } else {
          return false
        }
      })
    },
    async generateFun1() {
      this.dialogVisible1 = false
    },
    generateFunSelect() {
      let data = []
      for (const i in this.tableDataView) {
        data = data.concat(this.tableDataView[i].spare_code1)
      }
      for (let index = 0; index < this.multipleSelection.length; index++) {
        if (data.indexOf(this.multipleSelection[index].spare_code) === -1) {
          this.tableDataView.push({
            spare_code: this.multipleSelection[index].spare__code,
            spare_code1: this.multipleSelection[index].spare_code,
            spare_name: this.multipleSelection[index].spare_name,
            equip_component_type_name: this.multipleSelection[index].component_type_name,
            specification: this.multipleSelection[index].specification,
            technical_params: this.multipleSelection[index].technical_params,
            unit: this.multipleSelection[index].unit,
            inventory_quantity: this.multipleSelection[index].quantity.all_qty,
            id: this.multipleSelection[index].equip_spare,
            apply: 1,
            submit_old_flag: true
          })
        }
      }
      this.$refs.multipleTable.clearSelection()
      this.dialogVisibleSelect = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    currentChange1(page, page_size) {
      this.search1.page = page
      this.search1.page_size = page_size
      this.dialogSelect()
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
