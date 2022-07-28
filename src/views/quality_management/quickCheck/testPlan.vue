<template>
  <div class="quickCheck-testPlan">
    <!-- 快检检测计划 -->
    <el-row :gutter="20">
      <el-col :span="11">
        <el-form ref="searchForm" label-width="80px" :model="search" :inline="true" :rules="rulesLeft">
          <el-form-item label="检测机号">
            <el-select
              v-model="search.test_equip"
              clearable
              placeholder="请选择"
              @visible-change="changeVisibleTestEquip"
              @change="changeTestEquip"
            >
              <el-option
                v-for="(group,groupI) in testEquipList"
                :key="groupI"
                :label="group&&group.no"
                :value="group&&group.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="实验区分">
            <el-select
              v-model="search.test_indicator_name"
              placeholder="请选择"
              :disabled="!!ruleForm.plan_uid"
              @change="changeTestIndicators"
            >
              <!-- @visible-change="changeVisibleTestIndicators" -->
              <el-option
                v-for="(group,_i) in testIndicatorsList"
                :key="_i"
                :label="group.test_indicator__name"
                :value="group.test_indicator__name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工厂日期">
            <el-date-picker
              v-model="search.factory_date"
              type="date"
              :disabled="!!ruleForm.plan_uid"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              clearable
              @change="searchList"
            />
          </el-form-item>
          <el-form-item label="生产班次">
            <class-select
              :is-disabled="!!ruleForm.plan_uid"
              :value-default="search.classes"
              @classSelected="classChanged"
            />
          </el-form-item>
          <el-form-item label="生产机号">
            <equip-select class="equipStyle" :equip_no_props="search.equip_no" :disabled="!!ruleForm.plan_uid" @changeSearch="equipSearch" />
          </el-form-item>
          <el-form-item label="胶料规格">
            <allProductNoSelect :is-disabled="!!ruleForm.plan_uid" :default-val="search.product_no" :params-obj="search" @productBatchingChanged="productBatchingChanged" />
          </el-form-item>
          <el-form-item label="检测间隔" prop="test_interval">
            <el-select
              v-model="ruleForm.test_interval"
              :clearable="false"
              placeholder="请选择"
              :disabled="!noRecheck"
            >
              <el-option
                v-for="group in 5"
                :key="group"
                :label="group"
                :value="group"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="试验车次" class="trainsNumStyle">
            <el-input-number
              v-model="ruleForm.num"
              controls-position="right"
              :min="1"
              :max="ruleForm.num1"
              size="mini"
              clearable
            /> --
            <el-input-number
              v-model="ruleForm.num1"
              size="mini"
              controls-position="right"
              :min="ruleForm.num"
              :max="tableData[tableData.length-1]&&tableData[tableData.length-1].actual_trains"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['examine_test_plan', 'begin']" size="mini" style="margin-left:10px" type="primary" @click="addSpace">添加</el-button>
          </el-form-item>
          <!-- <el-form-item label="胶料段次">
            <el-select
              v-model="search.stage"
              clearable
              placeholder="请选择"
              @visible-change="visibleStageList"
              @change="getList"
            >
              <el-option
                v-for="(item,k) in stageList"
                :key="k"
                :label="item.global_name"
                :value="item.global_name"
              />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="是否检测">
            <el-select
              v-model="search.is_tested"
              clearable
              placeholder="请选择"
              @change="changeTested"
            >
              <el-option
                v-for="(item,k) in [{name:'已检测',id:'Y'},{name:'未检测',id:'N'}]"
                :key="k"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item> -->
        </el-form>

        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          border
          :cell-style="cellStyle"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="40"
          />
          <el-table-column
            prop="equip_no"
            label="生产机号"
            min-width="10"
          />
          <el-table-column
            prop="production_classes"
            label="生产班次"
            min-width="10"
          />
          <el-table-column
            prop="product_no"
            label="胶料规格"
            min-width="20"
          />
          <el-table-column
            prop="actual_trains"
            label="车次"
            min-width="8"
          />
          <!-- <el-table-column
            prop="lot_no"
            label="收皮条码"
            min-width="20"
          />
          <el-table-column
            prop="is_tested"
            label="已检测"
            min-width="10"
          /> -->
        </el-table>
      </el-col>
      <el-col :span="1" class="center-box">
        <div class="center-box-child">
          <el-button size="small" type="primary" @click="moveRight">>></el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <el-form ref="ruleForm" label-width="80px" :inline="true" :rules="rules" :model="ruleForm">
          <el-form-item label="检测日期" prop="test_time">
            <el-date-picker
              v-model="ruleForm.test_time"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="检测班次" prop="test_classes">
            <class-select
              :value-default="ruleForm.test_classes"
              :is-disabled="!noRecheck"
              @classSelected="classChangedTest"
            />
          </el-form-item>
          <el-form-item label="检测班组" prop="test_group">
            <el-select
              v-model="ruleForm.test_group"
              placeholder="请选择"
              :disabled="!noRecheck"
              @visible-change="changeGroup"
            >
              <el-option
                v-for="group in groups"
                :key="group.id"
                :label="group.global_name"
                :value="group.global_name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="试验方法" prop="test_method_name">
            <el-select
              v-model="ruleForm.test_method_name"
              placeholder="请选择"
              :disabled="!noRecheck"
              @visible-change="changeTestMethod"
            >
              <el-option
                v-for="group in testMethodList"
                :key="group.id"
                :label="group.name"
                :value="group.name"
                :disabled="!group.allowed"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="试验次数" prop="test_times">
            <el-select
              v-model="ruleForm.test_times"
              placeholder="请选择"
            >
              <el-option
                v-for="group in 5"
                :key="group"
                :label="group"
                :value="group"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="胶料规格">
            {{ ruleForm.product_no }}
          </el-form-item>
          <el-form-item v-if="search.test_indicator_name==='钢拔'" label="检测次数" prop="count">
            <el-select
              v-model="ruleForm.count"
              placeholder="请选择"
              :disabled="!noRecheck"
            >
              <el-option
                v-for="group in [5,4]"
                :key="group"
                :label="group"
                :value="group"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="检测间隔" prop="test_interval">
            <el-select
              v-model="ruleForm.test_interval"
              clearable
              placeholder="请选择"
              :disabled="!noRecheck"
            >
              <el-option
                v-for="group in 5"
                :key="group"
                :label="group"
                :value="group"
              />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="试验车次" class="trainsNumStyle">
            <el-input-number
              v-model="ruleForm.num"
              controls-position="right"
              :min="1"
              :max="ruleForm.num1"
              size="mini"
              clearable
            /> --
            <el-input-number
              v-model="ruleForm.num1"
              size="mini"
              controls-position="right"
              :min="ruleForm.num"
              :max="tableData[tableData.length-1]&&tableData[tableData.length-1].actual_trains"
              clearable
            />
          </el-form-item> -->
          <el-form-item>
            <!-- <el-button v-permission="['examine_test_plan', 'begin']" size="mini" style="margin-left:10px" type="primary" @click="addSpace">添加</el-button> -->
            <el-tag v-if="btnLoading&&noRecheck" style="margin-left:60px;color:#000;padding:0 60px" color="rgba(149, 242, 4)" type="success" effect="dark">检测进行中</el-tag>
          </el-form-item>
        </el-form>
        <el-button v-permission="['examine_test_plan', 'begin']" type="primary" :disabled="btnLoading&&noRecheck" @click="startTestFun">开始检测</el-button>
        <el-button v-permission="['examine_test_plan', 'end']" type="primary" :disabled="endBtnLoading" @click="endTestFun">结束检测</el-button>
        <el-button type="primary" @click="refreshFun">刷新</el-button>
        <div style="float:right">
          检测计划单据号:
          <el-input
            v-model="ruleForm.plan_uid"
            :disabled="true"
            style="width:250px !important"
          />
        </div>
        <el-table
          :data="tableDataRight"
          style="width: 100%;margin-top:10px"
          border
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            prop="factory_date"
            label="生产日期"
            min-width="24"
          />
          <el-table-column
            prop="production_classes"
            label="生产班次"
            min-width="15"
          />
          <el-table-column
            prop="equip_no"
            label="生产机号"
            min-width="15"
          />
          <el-table-column
            prop="product_no"
            label="胶料规格"
            min-width="20"
          />
          <el-table-column
            prop="actual_trains"
            label="车次"
            width="80px"
          >
            <template slot-scope="{row,$index}">
              <div v-if="row.add" class="actualTrains">
                <el-input-number v-model="row.actual_trains" controls-position="right" @blur="trainsBlur(row.actual_trains,$index)" />
              </div>
              <span v-else>{{ row.actual_trains }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="检测值"
            min-width="40"
          >
            <template v-if="row.value" slot-scope="{row}">
              <!-- {{ row.value.replace(/{|}|'/g,"") }} -->
              <span v-for="item in JSON.parse(row.value)" :key="item.name" :style="{'color':item.flag==='H'?'red':item.flag==='L'?'blue':''}">{{ item.name }}:{{ item.value }};</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="18"
            :formatter="(row)=>{
              return row.value?'已检测':'待检测'
            }"
          />
          <el-table-column
            prop="lot_no"
            label="收皮条码"
            width="100px"
          />
          <el-table-column
            label="操作"
            width="70"
          >
            <template slot-scope="{row,$index}">
              <el-button size="mini" type="primary" :disabled="row.value?true:false" @click="delRow($index,row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="['物性','钢拔'].includes(search.test_indicator_name)"
            label="查看绑定"
            width="70"
          >
            <template slot-scope="{row}">
              <el-button size="mini" type="primary" @click="showTestData(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin-top:5px;">
          <el-button v-permission="['examine_test_plan', 'begin']" type="primary" :disabled="btnLoading" @click="addRowFun">新增一行</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :title="search.test_indicator_name+'检测数据查看'"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="检测计划单据号">
          <el-input
            v-model="ruleForm.plan_uid"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="物料规格">
          <el-input
            v-model="ruleForm.product_no"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="车次">
          <el-input
            v-model="searchValue.actual_trains"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="检测方法">
          <el-input
            v-model="ruleForm.test_method_name"
            :disabled="true"
          />
        </el-form-item>
      </el-form>
      <el-table
        :data="tableDataValue"
        style="width: 100%"
        border
        class="trainsNumStyle"
      >
        <el-table-column
          prop="ordering"
          label="次序
          （ID)"
          width="60"
        />
        <el-table-column
          prop="product_no"
          label="材料"
          min-width="20"
        />
        <el-table-column
          prop="test_time"
          label="检测日期"
          min-width="20"
        >
          <template v-if="row.test_time" slot-scope="{row}">
            {{ row.test_time.split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column
          label="检测时间"
          min-width="20"
        >
          <template v-if="row.test_time" slot-scope="{row}">
            {{ row.test_time.split(' ')[1] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="speed"
          label="速度(mm/min)"
          min-width="20"
        />
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="1"
          label="厚度(mm)"
          min-width="15"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-if="row.edit"
              v-model="row.thickness"
              controls-position="right"
              size="mini"
              :min="0"
            />
            <span v-else>{{ row.thickness }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="2"
          prop="width"
          label="宽度(mm)"
          min-width="15"
        />
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="3"
          label="100%（Mpa）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-if="row.edit"
              v-model="row.ds1"
              controls-position="right"
              size="mini"
              :min="0"
            />
            <span v-else>{{ row.ds1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="4"
          label="300%（Mpa）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-if="row.edit"
              v-model="row.ds2"
              controls-position="right"
              size="mini"
              :min="0"
            />
            <span v-else>{{ row.ds2 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="5"
          label="断裂强力（Mpa）"
          min-width="23"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-if="row.edit"
              v-model="row.break_strength"
              controls-position="right"
              size="mini"
              :min="0"
            />
            <span v-else>{{ row.break_strength }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="6"
          label="断裂伸长（%）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-if="row.edit"
              v-model="row.break_length"
              controls-position="right"
              size="mini"
              :min="0"
            />
            <span v-else>{{ row.break_length }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='钢拔'"
          :key="7"
          label="最大力（N)"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-if="row.edit"
              v-model="row.max_strength"
              controls-position="right"
              size="mini"
              :min="0"
            />
            <span v-else>{{ row.max_strength }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='钢拔'"
          :key="8"
          label="结束力（N）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-if="row.edit"
              v-model="row.end_strength"
              controls-position="right"
              size="mini"
              :min="0"
            />
            <span v-else>{{ row.end_strength }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="result"
          label="检测结果"
          min-width="20"
        />
        <el-table-column
          prop=""
          label="检测文件名称"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="操作"
          width="160px"
        >
          <template slot-scope="{row,$index}">
            <el-button v-if="tableDataValue.length-1!==$index" type="primary" @click="modifyFun(row)">{{ row.edit?'保存':'修改' }}</el-button>
            <el-upload
              v-if="false"
              style="display:inline-block;margin-left:5px"
              action="string"
              accept=".xls, .xlsx"
              :http-request="Upload"
              :show-file-list="false"
            >
              <el-button>浏览</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import classSelect from '@/components/ClassSelect'
import equipSelect from '@/components/select_w/equip'
import { globalCodesUrl, testIndicators, palletTrainsFeedbacks, matTestIndicatorMethods } from '@/api/base_w'
import { productReportEquip, productTestPlan, rubberMaxStretchTestResult, productTestPlanDetail, bulkCreate, underwayPlan } from '@/api/base_w_four'
import allProductNoSelect from '@/components/select_w/allProductNoSelect.vue'

export default {
  name: 'TestPlan',
  components: { classSelect, equipSelect, allProductNoSelect },
  data() {
    const validator = (rule, value, callback, _value, str) => {
      if (!_value) {
        callback(new Error(str))
      } else {
        callback()
      }
    }
    return {
      search: {
        equip_no: '', // Z01
        product_no: '', // C-3MB-A019-02
        classes: '', // 早班
        factory_date: '', // 2021-04-29 2021-07-21
        test_indicator_name: ''
      },
      loading: false,
      tableData: [],
      tableDataRight: [],
      rules: {
        test_time: { required: true, message: '请选择检测日期', trigger: 'change' },
        test_group: { required: true, message: '请选择检测班组', trigger: 'change' },
        test_method_name: { required: true, message: '请选择试验方法', trigger: 'change' },
        // test_times: { required: true, message: '请选择试验次数', trigger: 'change' },
        test_interval: { required: true, message: '请选择检测间隔', trigger: 'change' },
        count: { required: true, message: '请选择检测次数', trigger: 'change' },
        test_classes: [
          { required: true, trigger: 'change', validator: (rule, value, callback) => {
            validator(rule, value, callback,
              this.ruleForm.test_classes, '请选择检测班次')
          } }
        ]
      },
      rulesLeft: {},
      groups: [],
      ruleForm: {
        test_interval: 1,
        test_method_name: '',
        count: 5
      },
      btnLoading: false,
      testEquipList: [],
      testIndicatorsList: [],
      endBtnLoading: false,
      stageList: [],
      alltableData: [],
      testMethodList: [],
      handleList: [],
      dialogVisible: false,
      searchValue: {},
      tableDataValue: [],
      TableDataValueId: '',
      isDelRow: false,
      maxTrain: 0,
      minTrain: 0,
      noRecheck: true // false为复检中
    }
  },
  watch: {
  },
  created() {
    this.getTestEquipList(true)
    // this.getTestIndicators(true)
  },
  methods: {
    titleInfo(val, error) {
      if (!val && val !== 0) {
        this.$message.info(error)
        throw new Error(error)
      }
    },
    async getList() {
      try {
        this.titleInfo(this.search.equip_no, '请输入生产机台')
        this.titleInfo(this.search.classes, '请输入班次')
        this.titleInfo(this.search.product_no, '请输入胶料')
        this.titleInfo(this.search.factory_date, '请输入时间')
        // this.loading = true
        const data = await palletTrainsFeedbacks('get', null, { params: this.search })
        data.forEach(d => {
          d.production_classes = d.classes
        })
        this.loading = false
        this.tableData = []
        if (!this.tableDataRight.length) {
          this.tableData = data
        } else {
          data.forEach(d => { // 去掉左边相同得数据
            if (this.removeFun(d)) {
              return
            }
            this.tableData.push(d)
          })
        }
        // this.alltableData = data
        this.search.is_tested = ''

        // 获取最大车次和最小车次
        this.maxTrain = data[data.length - 1].actual_trains
        this.minTrain = data[0].actual_trains
      } catch (e) {
        this.loading = false
      }
    },
    async getTestEquipList(bool) {
      try {
        const data = await productReportEquip('get', null, { params: { all: 1 }})
        this.testEquipList = data || []
        if (bool) {
          this.search.test_equip = data && data[0].id
          this.getWaitPlan()
          this.getTestIndicatorsList()
        }
      } catch (e) {
        //
      }
    },
    changeVisibleTestEquip(bool) {
      if (bool) {
        this.getTestEquipList(false)
      }
    },
    visibleStageList(bool) {
      if (bool) {
        globalCodesUrl('get', {
          params: {
            class_name: '胶料段次'
          }
        }).then((response) => {
          this.stageList = response.results
        }).catch(function() {
        })
      }
    },
    async getTestIndicators(bool) {
      try {
        const data = await testIndicators('get', null, { params: { all: 1 }})
        this.testIndicatorsList = data
        if (bool) {
          this.search.test_indicator_name = data[0].name
        }
      } catch (e) {
        //
      }
    },
    changeVisibleTestIndicators(bool) {
      if (bool) {
        this.getTestIndicators()
      }
    },
    async changeTestMethod(bool) {
      if (!bool) return
      try {
        const data = await matTestIndicatorMethods('get', null, { params: { material_no: this.ruleForm.product_no }})
        let arr = []
        arr = data.filter(d => d.test_indicator === this.search.test_indicator_name)
        this.testMethodList = arr[0].methods
      } catch (e) {
        this.testMethodList = []
      }
    },
    changeGroup(bool) {
      if (bool) {
        this.getClassGroup()
      }
    },
    getClassGroup() {
      globalCodesUrl('get', {
        params: {
          class_name: '班组'
        }
      }).then((response) => {
        this.groups = response.results
      }).catch(function() {
      })
    },
    changeTestEquip() {
      this.tableDataRight = []
      this.tableData = []
      this.btnLoading = false
      this.ruleForm.plan_uid = ''
      this.ruleForm.product_no = ''
      this.search.product_no = ''
      this.getTestIndicatorsList()
      this.getWaitPlan()
    },
    getTestIndicatorsList() {
      this.search.test_indicator_name = ''
      const obj = this.testEquipList.find(d => d.id === this.search.test_equip)
      this.testIndicatorsList = obj.test_indicator_name || []
      if (!this.ruleForm.plan_uid) {
        this.search.test_indicator_name = this.testIndicatorsList[0].test_indicator__name
      }
    },
    async getWaitPlan(bool) {
      try {
        // let obj = { status: 1, test_equip: this.search.test_equip, test_indicator_name: this.search.test_indicator_name }
        // delete obj.plan_uid
        // if (bool) {
        //   obj = { id: this.ruleForm.id }
        // }
        const obj = { test_equip: this.search.test_equip }
        const data = await underwayPlan('get', null, { params: obj })

        if (JSON.stringify(data) === '{}') {
          this.btnLoading = false
          this.noRecheck = true
          this.tableDataRight = []
          this.ruleForm.plan_uid = ''
          this.testMethodList = []
          return
        }
        if (!data.id) {
          this.btnLoading = true
          this.noRecheck = false
          this.ruleForm = data

          this.search.factory_date = data.product_test_plan_detail[0].factory_date
          this.search.classes = data.product_test_plan_detail[0].production_classes
          this.search.equip_no = data.product_test_plan_detail[0].equip_no
          this.search.product_no = data.product_test_plan_detail[0].product_no

          this.tableDataRight = data.product_test_plan_detail
          this.search.test_indicator_name = data.test_indicator_name
          this.ruleForm.product_no = data.product_test_plan_detail[0].product_no

          this.getList()
        } else if (data.status === 1) {
          this.btnLoading = true
          this.noRecheck = true
          this.ruleForm = data
          this.search.factory_date = data.product_test_plan_detail[0].factory_date
          this.search.classes = data.product_test_plan_detail[0].production_classes
          this.search.equip_no = data.product_test_plan_detail[0].equip_no
          this.search.product_no = data.product_test_plan_detail[0].product_no

          this.tableDataRight = data.product_test_plan_detail
          if (!this.isDelRow) {
            this.$message.info('正在检测中')
          }
          this.search.test_indicator_name = data.test_indicator_name
          this.ruleForm.product_no = data.product_test_plan_detail[0].product_no

          this.getList()
        } else {
          this.$message.success('全部检测完毕')
          this.tableDataRight = []
          this.btnLoading = false
          this.ruleForm.plan_uid = ''
          this.testMethodList = []
          // this.ruleForm = {}
          // this.$refs.ruleForm.clearValidate()
        }
        this.isDelRow = false
      } catch (e) {
        //
      }
    },
    changeTestIndicators() {
      this.ruleForm.test_method_name = ''
    },
    classChanged(val) {
      this.search.classes = val
      this.searchList()
    },
    classChangedTest(val) {
      this.ruleForm.test_classes = val
    },
    searchList() {
      this.search.product_no = ''
      this.ruleForm.product_no = ''
      this.getList()
    },
    equipSearch(val) {
      this.search.equip_no = val
      this.searchList()
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.material_no : ''
      this.ruleForm.product_no = this.search.product_no
      this.tableDataRight = []
      this.ruleForm.test_method_name = ''
      this.getList()
    },
    changeTested(val) {
      if (!val) { this.tableData = this.alltableData } else {
        const arr = this.alltableData.filter(d => d.is_tested === val)
        this.tableData = arr
      }
    },
    handleSelectionChange(arr) {
      this.handleList = arr
    },
    startTestFun() {
      if (this.tableDataRight.length === 0) {
        this.$message.info('没有可检测数据，请添加')
        return
      }
      if (!this.search.test_indicator_name) {
        this.$message.info('请选择实验区分！')
        return
      }
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.tableDataRight.forEach(d => {
              if (!d.actual_trains) {
                throw new Error('有检测数据车次未填写，请添加')
              }
            })
            this.btnLoading = true
            const obj = {
              ...this.ruleForm,
              test_indicator_name: this.search.test_indicator_name,
              test_equip: this.search.test_equip,
              product_test_plan_detail: this.tableDataRight
            }
            const { plan_uid } = await productTestPlan('post', null, { data: obj })
            this.ruleForm.plan_uid = plan_uid
            this.$message.success('已开始检测')

            this.getWaitPlan()
          } catch (e) {
            if (e.message) {
              this.$message.info(e.message)
            }
            this.btnLoading = false
          }
        } else {
          this.$message.info('请填入检测信息')
          return false
        }
      })
    },
    trainsBlur(val, index) {
      const arr = this.tableDataRight.filter(d => d.actual_trains === val)
      if (arr.length > 1) {
        this.$message.info('已经存在相同的车次')
        this.tableDataRight[index].actual_trains = undefined
      }
    },
    endTestFun() {
      if (!this.ruleForm.plan_uid) {
        this.$message.info('没有可结束计划,如果存在请刷新页面查看')
        return
      }
      this.$confirm('此操作将结束检测, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await productTestPlan('delete', this.ruleForm.id, { params: { }})
          this.btnLoading = false
          this.getWaitPlan()
          // this.$message.success('已全部结束检测')
          // this.ruleForm.plan_uid = ''
          // this.tableDataRight = []
          // this.ruleForm.product_no = ''
          // this.$nextTick(() => {
          // this.$refs.ruleForm.clearValidate()
          // })
        } catch (e) {
          //
        }
      })
    },
    refreshFun() {
      if (!this.ruleForm.plan_uid) {
        this.changeTestEquip()
      } else {
        this.getWaitPlan(true)
      }
    },
    showTestData(row) {
      this.dialogVisible = true
      this.searchValue = {
        actual_trains: row.actual_trains
      }
      if (!row.id) {
        return
      }
      this.TableDataValueId = row.id
      this.getTableDataValue()
    },
    handleClose(done) {
      done()
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('excel_file', param.file)
      // planImport('post', null, { data: formData }).then(response => {
      //   this.$message({
      //     type: 'success',
      //     message: '导入成功!'
      //   })
      // })
    },
    async modifyFun(row) {
      let obj = {
        thickness: row.thickness,
        ds1: row.ds1,
        ds2: row.ds2,
        break_strength: row.break_strength,
        break_length: row.break_length
      }
      // let bool = false
      if (this.search.test_indicator_name === '钢拔') {
        obj = {
          max_strength: row.max_strength,
          end_strength: row.end_strength
        }
        // if (row.max_strength && row.end_strength) {
        //   bool = true
        // }
      }
      // else if (this.search.test_indicator_name === '物性') {
      //   if (row.thickness && row.ds1 && !row.ds2 && !row.break_strength && !row.break_length) {
      //     bool = true
      //   }
      // }
      // if (!bool && !row.edit) {
      //   this.$set(row, 'edit', !row.edit)
      //   return
      // } else if (row.edit) {
      //   this.$set(row, 'edit', !row.edit)
      // } else {
      //   return
      // }
      this.$set(row, 'edit', !row.edit)
      if (!row.edit) {
        try {
          await rubberMaxStretchTestResult('put', row.id, { data: obj })
          this.getTableDataValue()
          this.$message.success('操作成功')
        } catch (e) {
          this.getTableDataValue()
        }
      }
    },
    addRowFun() {
      if (!this.search.product_no) {
        this.$message.info('请选择胶料规格')
        return
      }
      let obj = {
        production_classes: this.search.classes,
        equip_no: this.search.equip_no,
        factory_date: this.search.factory_date,
        product_no: this.search.product_no,
        add: 1
      }
      obj = JSON.parse(JSON.stringify(obj))
      this.tableDataRight.push(obj)
    },
    async moveRight() {
      if (this.handleList.length === 0) {
        return
      }
      if (this.btnLoading && this.noRecheck) {
        try {
          const _tableDataRight = this.handleList.filter(d => !d.id)
          _tableDataRight.forEach(d => {
            if (!d.production_classes) {
              d.production_classes = d.classes
            }
          })
          await bulkCreate('post', null, { data: {
            'product_test_plan_detail': _tableDataRight,
            'test_plan': this.ruleForm.id
          }})
          this.$message.success('添加成功')
          this.isDelRow = true
          this.refreshFun()
        } catch (e) {
          this.refreshFun()
          const _tableDataRight1 = this.tableDataRight.filter(d => d.id)
          this.tableDataRight = _tableDataRight1
        }
        this.handleList.forEach(d => { // 去掉左边移到右边得数据
          const _index = this.tableData.findIndex(dd => dd.actual_trains === d.actual_trains)
          this.tableData.splice(_index, 1)
        })
        return
      }
      const handleMax = this.handleList[this.handleList.length - 1].actual_trains
      const handleMin = this.handleList[0].actual_trains
      if (handleMin < this.minTrain || handleMax > this.maxTrain) {
        this.$message(`不在该胶料规格车数范围内${this.minTrain}-
        ${this.maxTrain}，请检查`)
        return
      }
      let bool
      this.handleList.forEach(d => {
        if (this.removeFun(d)) {
          bool = true
          return
        }
        // d.production_classes = d.classes
        this.tableDataRight.push(d)
        const _index = this.tableData.findIndex(dd => dd.actual_trains === d.actual_trains)
        this.tableData.splice(_index, 1)
      })
      if (bool) {
        this.$message.success('已去掉右边相同记录，请确认')
      } else {
        this.$message.success('已添加到右侧检测列表')
      }
    },
    removeFun(d) {
      // d.factory_date === D.factory_date &&
      //   d.production_classes === D.production_classes && d.equip_no === D.equip_no &&
      //   d.product_no === D.product_no &&
      const arr = this.tableDataRight.filter(D => d.actual_trains === D.actual_trains)
      if (arr.length > 0) {
        return true
      } else {
        return false
      }
    },
    async addSpace() {
      if (!this.ruleForm.test_interval) {
        this.$message.info('请选择检测间隔')
        return
      }
      if (!this.ruleForm.num || !this.ruleForm.num1) {
        this.$message.info('请输入试验车次')
        return
      }
      if (!this.ruleForm.product_no) {
        this.$message.info('请选择胶料规格')
        return
      }
      this.tableData = []
      let obj = {
        production_classes: this.search.classes,
        equip_no: this.search.equip_no,
        factory_date: this.search.factory_date,
        product_no: this.search.product_no
      }
      if (this.btnLoading) {
        const _objRight = this.tableDataRight[0]
        obj = {
          production_classes: _objRight.production_classes,
          equip_no: _objRight.equip_no,
          factory_date: _objRight.factory_date,
          product_no: _objRight.product_no
        }
      }

      let bool = false
      let _val = this.ruleForm.num
      for (let index = this.ruleForm.num; index < this.ruleForm.num1 + 1; index++) {
        if (index === this.ruleForm.num) {
          obj.actual_trains = _val
        } else {
          _val = _val + this.ruleForm.test_interval
          if (_val <= this.ruleForm.num1) {
            obj.actual_trains = _val
          } else {
            break
          }
        }
        const _obj = JSON.parse(JSON.stringify(obj))
        if (!this.removeFun(_obj)) {
          this.tableData.push(_obj)
        } else {
          bool = true
        }
      }
      // if (!this.btnLoading) {
      if (bool) {
        this.$message.success('已去掉右边相同记录，请确认')
      } else {
        this.$message.success('已添加到左侧检测列表')
      }
      // }

      // if (this.btnLoading && this.noRecheck) {
      //   try {
      //     const _tableDataRight = this.tableDataRight.filter(d => !d.id)
      //     await bulkCreate('post', null, { data: {
      //       'product_test_plan_detail': _tableDataRight,
      //       'test_plan': this.ruleForm.id
      //     }})
      //     this.$message.success('添加成功')
      //     this.isDelRow = true
      //     this.refreshFun()
      //   } catch (e) {
      //     const _tableDataRight1 = this.tableDataRight.filter(d => d.id)
      //     this.tableDataRight = _tableDataRight1
      //   }
      // }
    },
    async getTableDataValue() {
      try {
        this.tableDataValue = []
        const data = await rubberMaxStretchTestResult('get', null, { params: { product_test_plan_detail_id: this.TableDataValueId }})
        this.tableDataValue = data.results || []

        if (this.tableDataValue.length > 0) {
          this.tableDataValue.push({
            ordering: this.search.test_indicator_name === '物性' ? '平均值' : 'Mid',
            product_no: this.tableDataValue[0].product_no,
            // Math.round(data.avg_value['厚度'] * num) / num,
            thickness: data.avg_value['厚度'],
            ds1: data.avg_value['百分之百'],
            ds2: data.avg_value['百分之三百'],
            break_strength: data.avg_value['断裂强力'],
            break_length: data.avg_value['断裂伸长'],
            max_strength: data.avg_value['最大力'],
            end_strength: data.avg_value['结束力']
          })
        }
      } catch (e) {
        this.tableDataValue = []
      }
    },
    async delRow(index, row) {
      if (!row.id) {
        this.tableDataRight.splice(index, 1)
        this.tableData.unshift(row)
        if (!this.tableDataRight.length) {
          this.btnLoading = false
          this.noRecheck = true
        }
        if (!this.ruleForm.num) {
          this.getList()
        }
        return
      }
      if (this.tableDataRight.length === 1) {
        this.$message.info('最少保留一列数据')
        return
      }
      try {
        await productTestPlanDetail('delete', row.id)
        this.$message.success('操作成功')
        this.isDelRow = true
        this.refreshFun()
      } catch (e) {
        //
      }
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.row.is_tested === 'Y') {
        return 'background:#fafafa'
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.is_qualified === false) {
        // return 'red-row'
      }
    }
  }
}
</script>

<style lang="scss">
  .quickCheck-testPlan{
    .el-input,.el-select{
      width:170px !important;
    }
    .equipStyle{
      width:170px !important;
    }
    .el-form-item{
      margin-bottom:0px;
    }
    .el-input__inner{
      height: 30px !important;
      line-height: 30px !important;
    }
    .trainsNumStyle{
      .el-input,.el-input-number--mini{
        width:120px !important;
      }
    }
    .actualTrains{
      .el-input{
        width:70px !important;
      }
      .el-input__inner{
        padding:0;
      }
    }
    .el-form-item__error{
      display: none;
    }
    .center-box{
      position: relative;
      height: 100vh;
        .center-box-child{
          position: absolute;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
    }
    .red-row{
      background: red;
    }
  }
</style>
