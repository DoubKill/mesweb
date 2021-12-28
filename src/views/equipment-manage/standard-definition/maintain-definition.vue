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
      <!-- <el-form-item label="所需物料名称">
        <el-input v-model="getParams.spare_name" clearable @input="changeDebounce" />
      </el-form-item> -->
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
          @click="onSubmitXJ"
        >新建巡检标准</el-button>
        <el-button
          v-permission="['equip_maintenance_standard', 'add']"
          type="primary"
          @click="onSubmit"
        >新建其他标准</el-button>
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
        prop="type"
        label="类别"
        width="60"
      />
      <el-table-column
        prop="equip"
        label="机台"
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
            @click="repairDialog(scope.row)"
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
      <!-- <el-table-column
        prop="spare_list_str"
        label="所需物料名称"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
          >{{ scope.row.spare_list_str }}</el-link>
        </template>
      </el-table-column> -->
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
      width="80%"
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
                  v-for="item in ['保养','润滑','标定']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="标准编号" prop="standard_code">
              <el-input v-model="typeForm.standard_code" :disabled="typeForm.id?true:false" style="width:200px" />
            </el-form-item>
            <el-form-item label="标准名称" prop="standard_name">
              <el-input v-model="typeForm.standard_name" style="width:200px" />
            </el-form-item>
            <el-form-item label="机台" prop="equip_no">
              <el-select
                v-model="typeForm.equip_no"
                placeholder="请选择"
                clearable
                multiple
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.equip_no"
                  :value="item.equip_no"
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
              <el-input v-model="typeForm.equip_job_item_standard_name" disabled>
                <el-button slot="append" icon="el-icon-search" @click="Add1" />
              </el-input>
              <br>
              <el-input
                v-model="typeForm.equip_job_item_standard_detail"
                style="marginTop:20px"
                type="textarea"
                :rows="4"
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

          </el-col>
          <el-col :span="8">
            <el-form-item label="维护周期" prop="maintenance_cycle">
              <el-input-number v-model="typeForm.maintenance_cycle" placeholder="请输入内容" controls-position="right" :min="0" />
              <el-form-item style="width:100px">
                <el-select
                  v-model="typeForm.cycle_unit"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ['4小时','班次','日','周','月','季度','年','车数']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="周期数" prop="cycle_num">
              <el-input-number v-model="typeForm.cycle_num" placeholder="请输入内容" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="所需人数" prop="cycle_person_num">
              <el-input-number v-model="typeForm.cycle_person_num" placeholder="请输入内容" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="作业时间" prop="operation_time">
              <el-input-number v-model="typeForm.operation_time" placeholder="请输入内容" controls-position="right" :min="0" />
              <el-form-item prop="operation_time_unit" style="width:100px">
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
            </el-form-item>
            <el-form-item label="钉钉提醒发送" prop="remind_flag">
              <el-checkbox v-model="typeForm.remind_flag1" label="包干人" />
              <el-checkbox v-model="typeForm.remind_flag2" label="上级" />
              <el-checkbox v-model="typeForm.remind_flag3" label="上上级" />
            </el-form-item>
          </el-col>
          <!-- <el-form-item label="所需物料">
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
                label="用途"
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
          </el-form-item> -->
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
      :title="`${typeForm.id?'修改':'新建'}巡检作业标准`"
      width="80%"
      :visible.sync="dialogEditVisibleXJ"
      :before-close="handleCloseXJ"
    >
      <el-form
        ref="createForm1"
        :inline="true"
        :rules="rules1"
        :model="typeForm"
        label-width="150px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="作业类型" prop="work_type">
              <el-input v-model="typeForm.work_type" disabled style="width:200px" />
            </el-form-item>
            <el-form-item label="标准编号" prop="standard_code">
              <el-input v-model="typeForm.standard_code" :disabled="typeForm.id?true:false" style="width:200px" />
            </el-form-item>
            <el-form-item label="标准名称" prop="standard_name">
              <el-input v-model="typeForm.standard_name" style="width:200px" />
            </el-form-item>
            <el-form-item label="类别" prop="type">
              <el-select
                v-model="typeForm.type"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in ['机械', '电气','通用']"
                  :key="item"
                  :label="item"
                  :value="item"
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
            <el-form-item label="机台" prop="equip_no">
              <el-select
                v-model="typeForm.equip_no"
                placeholder="请选择"
                clearable
                multiple
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.equip_no"
                  :value="item.equip_no"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起始时间" prop="start_time">
              <el-date-picker
                v-model="typeForm.start_time"
                style="width:180px"
                value-format="yyyy-MM-dd"
                :clearable="true"
              />
            </el-form-item>
            <el-form-item label="维护周期" prop="maintenance_cycle">
              <el-input-number v-model="typeForm.maintenance_cycle" placeholder="请输入内容" controls-position="right" :min="0" />
              <el-form-item style="width:100px">
                <el-select
                  v-model="typeForm.cycle_unit"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ['4小时','班次','日','周','月','季度','年','车数']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="周期数" prop="cycle_num">
              <el-input-number v-model="typeForm.cycle_num" placeholder="请输入内容" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="所需人数" prop="cycle_person_num">
              <el-input-number v-model="typeForm.cycle_person_num" placeholder="请输入内容" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="作业时间" prop="operation_time">
              <el-input-number v-model="typeForm.operation_time" placeholder="请输入内容" controls-position="right" :min="0" />
              <el-form-item prop="operation_time_unit" style="width:100px">
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
            </el-form-item>
            <el-form-item label="钉钉提醒发送" prop="remind_flag">
              <el-checkbox v-model="typeForm.remind_flag1" label="包干人" />
              <el-checkbox v-model="typeForm.remind_flag2" label="上级" />
              <el-checkbox v-model="typeForm.remind_flag3" label="上上级" />
            </el-form-item>
          </el-col>
          <el-form-item
            label="作业内容"
            prop="work_list"
          >
            <el-button type="primary" @click="AddWork">添加</el-button>
            <span style="color:red;marginLeft:30px">注：作业内容中区域编号、区域名称、部位名称、作业项目、作业项目详情为必填项</span>
            <el-table
              :data="typeForm.work_list"
              border
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="次序"
              />
              <el-table-column
                label="区域编号"
                width="180"
              >
                <template slot-scope="{row,$index}">
                  <el-input v-model="row.equip_area_define__area_code" disabled>
                    <el-button slot="append" disable icon="el-icon-search" @click="showLocation(row,$index)" />
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="区域名称"
                width="150"
              >
                <template slot-scope="{row}">
                  <el-input
                    v-model="row.equip_area_define__area_name"
                    disabled
                  />
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                label="部位名称"
              >
                <template slot-scope="{row}">
                  <el-select v-model="row.equip_part__id" placeholder="请选择" @visible-change="getEquipPart1" @change="clear(row)">
                    <el-option
                      v-for="item in options1"
                      :key="item.part_name"
                      :label="item.part_name"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                label="部件名称"
              >
                <template slot-scope="{row}">
                  <el-select v-model="row.equip_component__id" placeholder="请选择" clearable @visible-change="getEquipComponent1($event,row)" @change="changeComponent(row)">
                    <el-option
                      v-for="item in options2"
                      :key="item.component_name"
                      :label="item.component_name"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="作业项目"
                width="200px"
              >
                <template slot-scope="{row,$index}">
                  <el-input v-model="row.equip_job_item_standard__standard_name" disabled>
                    <el-button slot="append" icon="el-icon-search" @click="Add1(row,$index)" />
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="作业项目详情"
                width="200px"
              >
                <template slot-scope="{row}">
                  <el-input
                    v-model="row.work_details_column"
                    disabled
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDeleteWork(scope.$index)"
                  >删除
                  </el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    :loading="btnLoad&&index===scope.row.id"
                    :disabled="btnLoad"
                    @click="printingFun(scope.row)"
                  >打印标签
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
        <el-button @click="handleCloseXJ(false)">取 消</el-button>
        <el-button
          :loading="btnLoading"
          type="primary"
          @click="handleEditXJ"
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

    <el-dialog
      :title="`作业标准`"
      :visible.sync="dialogVisibleProject"
      width="80%"
      append-to-body
    >
      <project
        :show="dialogVisibleProject"
        :type-form="typeForm1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleProject=false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="`区域编号选择`"
      :visible.sync="dialogVisibleLocation"
      width="90%"
    >
      <locationArea
        ref="locationAreaRef"
        :is-dialog="true"
        :show-dialog="dialogVisibleLocation"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleLocation=false">取 消</el-button>
        <el-button type="primary" @click="submitFunLocation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import locationArea from '../master-data/location-area.vue'
import { getEquip } from '@/api/banburying-performance-manage'
import project from '../components/project-dialog'
import SparePartsCode from '../master-data/spare-parts-code'
import ProjectDefinition from './project-definition'
import { equipJobItemStandard } from '@/api/base_w_four'
import { equipMaintenanceStandard, equipPartNew, equipComponent, equipMaintenanceStandardImport, equipMaintenanceStandardDown, equipMaintenanceStandardGetName, equipCodePrint } from '@/api/jqy'
import page from '@/components/page'

export default {
  name: 'MaintainDefinition',
  components: { locationArea, page, SparePartsCode, ProjectDefinition, project },
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
      index: '',
      loading: false,
      btnLoad: false,
      btnLoading: false,
      btnExportLoad: false,
      tableData: [],
      dialogEditVisible: false,
      dialogVisibleLocation: false,
      dialogEditVisibleXJ: false,
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisibleProject: false,
      options: [],
      options1: [],
      options2: [],
      typeName: '',
      typeForm: {},
      typeForm1: {},
      rules: {
        work_type: [{ required: true, message: '不能为空', trigger: 'change' }],
        standard_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip_no: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_part: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_condition: [{ required: true, message: '不能为空', trigger: 'change' }],
        important_level: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_job_item_standard_name: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      rules1: {
        work_type: [{ required: true, message: '不能为空', trigger: 'change' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }],
        standard_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip_no: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_condition: [{ required: true, message: '不能为空', trigger: 'change' }],
        important_level: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_job_item_standard_name: [{ type: Array, required: true, message: '不能为空', trigger: 'change' }],
        work_list: [{ required: true, message: '不能为空', trigger: 'change' }]
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
      this.getParams.equip_part = this.params.equip_part
      this.getParams.equip_component = this.params.equip_component
      this.getParams.use_flag = true
    }
    this.getList()
    this.visibleChange()
    this.getEquipComponentType()
  },
  methods: {
    visibleChange() {
      const obj = { all: 1 }
      getEquip(obj).then(response => {
        this.options = response.results
      })
    },
    showLocation(row, index) {
      this.workIndex = index
      this.dialogVisibleLocation = true
    },
    async submitFunLocation() {
      if (this.$refs.locationAreaRef) {
        if (!this.$refs.locationAreaRef.handleData) {
          this.$message.info('请单击选择区域编号')
          return
        }
        this.dialogVisibleLocation = false
        const a = this.$refs.locationAreaRef.handleData
        this.$set(this.typeForm.work_list[this.workIndex], 'equip_area_define__id', a.id)
        this.$set(this.typeForm.work_list[this.workIndex], 'equip_area_define__area_code', a.area_code)
        this.$set(this.typeForm.work_list[this.workIndex], 'equip_area_define__area_name', a.area_name)
      }
    },
    async repairDialog(row) {
      try {
        const data = await equipJobItemStandard('get', null, { params: { id: row.equip_job_item_standard }})
        this.typeForm1 = data.results[0]
        this.dialogVisibleProject = true
      } catch (e) {
        // this.dialogVisible = true
      }
    },
    async getEquipPart(val) {
      if (val) {
        try {
          const data = await equipPartNew('get', null, { params: { use_flag: true }})
          this.options1 = data.results || []
        } catch (e) {
          //
        }
      }
    },
    async getEquipComponent(val) {
      if (val) {
        if (this.typeForm.equip_part) {
          try {
            const data = await equipComponent('get', null, { params: { equip_part: this.typeForm.equip_part, use_flag: 1 }})
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
    async getEquipPart1(val) {
      if (val) {
        try {
          const data = await equipPartNew('get', null, { params: { use_flag: true }})
          this.options1 = data.results || []
        } catch (e) {
          //
        }
      }
    },
    async getEquipComponent1(val, row) {
      if (val) {
        console.log(row)
        if (row.equip_part__id) {
          try {
            const data = await equipComponent('get', null, { params: { equip_part: row.equip_part__id, use_flag: 1 }})
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
    async changeCode() {
      if (this.typeForm.equip_job_item_standard_name) {
        this.typeForm.equip_job_item_standard_name = null
      }
      if (this.typeForm.equip_job_item_standard_detail) {
        this.typeForm.equip_job_item_standard_detail = null
      }
      if (this.typeForm.work_type === '保养') {
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
      this.typeForm.standard_code = ''
      try {
        const data = await equipMaintenanceStandardGetName('get', null, { params: { rule_code: this.typeForm.work_type }})
        this.typeForm.standard_code = data.results
      } catch (e) {
        // this.$message.info('获取编号失败')
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
      this.workIndex = null
      // if (this.$refs.createForm) {
      //   this.$refs.createForm.resetFields()
      // }
      this.typeForm = {
        standard_code: '',
        equip_condition: '',
        important_level: '',
        cycle_num: 0,
        equip_no: [],
        remind_flag1: true,
        remind_flag2: true,
        remind_flag3: false
      }
      this.dialogEditVisible = true
    },
    async onSubmitXJ() {
      this.workIndex = null
      if (this.$refs.createForm1) {
        this.$refs.createForm1.resetFields()
      }
      this.typeForm = {
        work_type: '巡检',
        standard_code: '',
        equip_no: [],
        equip_condition: '不停机',
        important_level: '中',
        cycle_num: 0,
        remind_flag1: true,
        remind_flag2: true,
        remind_flag3: false,
        work_list: []
      }
      try {
        const data = await equipMaintenanceStandardGetName('get', null, { params: { rule_code: '巡检' }})
        this.typeForm.standard_code = data.results
      } catch (e) {
        // this.$message.info('获取编号失败')
      }
      this.dialogEditVisibleXJ = true
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
    clear(row) {
      row.equip_part__part_name = this.options1.filter(d => d.id === row.equip_part__id)[0].part_name
      console.log(row.equip_part__part_name)
      if (row.equip_component) {
        row.equip_component = null
      }
    },
    changeComponent(row) {
      row.equip_component__component_name = this.options2.filter(d => d.id === row.equip_component__id)[0].component_name
      console.log(row.equip_component__component_name)
    },
    clear1() {
      if (this.typeForm.equip_component) {
        this.typeForm.equip_component = null
      }
    },
    AddWork() {
      this.typeForm.work_list.push({ })
    },
    Add() {
      this.dialogVisible = true
    },
    Add1(row, index) {
      if (!this.typeForm.work_type) {
        this.$message.info('请先选择作业类型')
      } else {
        if (row) {
          this.workIndex = index
        } else {
          this.workIndex = null
        }
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
        if (this.typeForm.work_type === '巡检') {
          this.$set(this.typeForm.work_list[this.workIndex], 'equip_job_item_standard__id', this.$refs['List1'].currentObj.id)
          this.$set(this.typeForm.work_list[this.workIndex], 'equip_job_item_standard__standard_name', this.$refs['List1'].currentObj.standard_name)
          this.$set(this.typeForm.work_list[this.workIndex], 'work_details_column', this.$refs['List1'].currentObj.work_details_column)
        } else {
          this.$set(this.typeForm, 'equip_job_item_standard', this.$refs['List1'].currentObj.id)
          this.$set(this.typeForm, 'equip_job_item_standard_name', this.$refs['List1'].currentObj.standard_name)
          this.$set(this.typeForm, 'equip_job_item_standard_detail', this.$refs['List1'].currentObj.work_details_column)
        }
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
      if (this.typeForm.work_type === '巡检') {
        this.dialogEditVisibleXJ = true
      } else {
        this.dialogEditVisible = true
      }
    },
    handleClose(done) {
      this.$refs.createForm.resetFields()
      this.dialogEditVisible = false
      if (done) {
        done()
      }
    },
    handleCloseXJ(done) {
      this.$refs.createForm1.resetFields()
      this.dialogEditVisibleXJ = false
      if (done) {
        done()
      }
    },
    async printingFun(row) {
      if (this.typeForm.standard_code && row.equip_area_define__area_code && row.equip_area_define__area_name && row.equip_part__part_name) {
        this.index = row.id
        try {
          this.btnLoad = true
          await equipCodePrint('post', null, { data: { status: 4, area_code: row.equip_area_define__area_code,
            area_name: row.equip_area_define__area_name,
            part_name: row.equip_part__part_name,
            component_name: row.equip_component__component_name,
            lot_no: this.typeForm.standard_code + row.equip_area_define__area_code }})
          this.$message.success('打印任务已连接')
          this.btnLoad = false
        } catch (e) {
          this.btnLoad = false
        }
      } else {
        this.$message('打印标签时巡检编号、区域编号、区域名称及部位名称不能为空')
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
    handleEditXJ() {
      const typeForm1 = JSON.parse(JSON.stringify(this.typeForm))
      this.$refs.createForm1.validate(async(valid) => {
        if (valid) {
          if (typeForm1.work_list.some(d => !d.equip_area_define__area_code)) {
            this.$message('请选择区域编号')
            return
          }
          if (typeForm1.work_list.some(d => !d.equip_part__id)) {
            this.$message('请选择设备部位')
            return
          }
          if (typeForm1.work_list.some(d => !d.equip_job_item_standard__standard_name)) {
            this.$message('请选择作业项目')
            return
          }
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
            this.handleCloseXJ(null)
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
    handleDeleteWork(index) {
      this.typeForm.work_list.splice(index, 1)
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
          message: response
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
      width:100px;
    }
  }
  .el-input-number .el-input{
    width:auto;
  }
}
</style>
