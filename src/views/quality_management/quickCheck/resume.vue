<template>
  <div>
    <!-- 检测履历查询 -->
    <el-form :inline="true">
      <el-form-item label="实验区分">
        <el-select
          v-model="search.test_indicator_name"
          placeholder="请选择"
          clearable
          @change="searchList"
          @visible-change="visibleChange"
        >
          <el-option
            v-for="(item,i) in options"
            :key="i"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产机号">
        <equip-select :equip_no_props="search.equip_no" @changeSearch="equipSearch" />
      </el-form-item>
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="search.factory_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          clearable
          @change="searchList"
        />
      </el-form-item>
      <el-form-item label="生产班次">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="胶料规格">
        <allProductNoSelect @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
      <el-form-item label="检测时间">
        <el-date-picker
          v-model="search.test_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择检测时间"
          clearable
          @change="searchList"
        />
      </el-form-item>
      <el-form-item label="检测班次">
        <class-select
          @classSelected="testClassChanged"
        />
      </el-form-item>
      <!-- <el-form-item label="检测班组">
        <el-select
          v-model="search.group"
          clearable
          placeholder="请选择"
          @visible-change="changeGroup"
        >
          <el-option
            v-for="group in groups"
            :key="group.id"
            :label="group.global_name"
            :value="group.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="检测机号">
        <el-select
          v-model="search.test_equip"
          clearable
          placeholder="请选择"
          @visible-change="changeTestEquip"
          @change="searchList"
        >
          <el-option
            v-for="group in testEquipList"
            :key="group.id"
            :label="group.no"
            :value="group.no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检测计划编号">
        <el-input
          v-model="search.plan_uid"
          clearable
          @input="getDebounce"
        />
      </el-form-item>
      <el-form-item label="检测状态">
        <el-select
          v-model="search.status"
          clearable
          placeholder="请选择"
          @change="searchList"
        >
          <el-option
            v-for="(item,key) in statusList"
            :key="key"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="检测人员">
        <el-input
          v-model="search.aaa"
          clearable
          @input="getDebounce"
        />
      </el-form-item> -->
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="factory_date"
        label="生产日期"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="生产机号"
        min-width="10"
      />
      <el-table-column
        prop="production_group"
        label="生产班组"
        min-width="20"
        :formatter="(row)=>{
          return row.production_classes+'/'+row.production_group
        }"
      />
      <el-table-column
        prop="product_no"
        label="胶料规格"
        min-width="29"
      />
      <el-table-column
        label="是否复测"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.is_recheck"
            type="primary"
            @click="retestDialog(scope.row)"
          >{{ '复测' }}</el-link>
          <!-- <span v-else>否</span> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="actual_trains"
        label="车次"
        min-width="10"
      />
      <el-table-column
        label="状态"
        min-width="18"
        :formatter="(row)=>{
          let obj = statusList[row.status]
          return obj
        }"
      />
      <el-table-column
        prop="lot_no"
        label="收皮条码"
        min-width="30"
      />
      <el-table-column
        prop="test_equip"
        label="检测机台"
        min-width="10"
      />
      <el-table-column
        prop="plan_uid"
        label="检测计划编号"
        min-width="25"
      />
      <el-table-column
        prop="test_method_name"
        label="实验方法"
        min-width="20"
      />
      <el-table-column
        prop="test_times"
        label="实验次数"
        min-width="10"
      />
      <el-table-column
        prop="test_interval"
        label="实验间隔"
        min-width="10"
      />
      <el-table-column
        prop="value"
        label="检测值"
        min-width="50"
      >
        <template v-if="row.value" slot-scope="{row}">
          <span v-for="item in JSON.parse(row.value)" :key="item.name" :style="{'color':item.flag==='H'?'red':item.flag==='L'?'blue':''}">{{ item.name }}:{{ item.value }};</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="test_user"
        label="检测人员"
        min-width="20"
      />
      <el-table-column
        prop="test_time"
        label="检测时间"
        min-width="20"
      />
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
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      :title="test_indicator_name+'检测数据查看'"
      :visible.sync="dialogVisible"
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
            v-model="ruleForm.actual_trains"
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
        v-loading="tableDataValueLoading"
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
          prop="date"
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
          v-if="test_indicator_name==='物性'"
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
          v-if="test_indicator_name==='物性'"
          :key="2"
          prop="width"
          label="宽度(mm)"
          min-width="15"
        />
        <el-table-column
          v-if="test_indicator_name==='物性'"
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
          v-if="test_indicator_name==='物性'"
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
          v-if="test_indicator_name==='物性'"
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
          v-if="test_indicator_name==='物性'"
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
          v-if="test_indicator_name==='钢拔'"
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
          v-if="test_indicator_name==='钢拔'"
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
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="检测履历"
      :visible.sync="dialogVisible1"
      width="90%"
    >
      <el-table
        v-loading="loading1"
        :data="tableData1"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="factory_date"
          label="生产日期"
          min-width="20"
        />
        <el-table-column
          prop="equip_no"
          label="生产机号"
          min-width="10"
        />
        <el-table-column
          label="生产班组"
          min-width="20"
          :formatter="(row)=>{
            return row.production_classes+'/'+row.production_group
          }"
        />
        <el-table-column
          prop="product_no"
          label="胶料规格"
          min-width="29"
        />
        <el-table-column
          prop="actual_trains"
          label="车次"
          min-width="10"
        />
        <el-table-column
          label="状态"
          min-width="18"
          :formatter="(row)=>{
            let obj = statusList[row.status]
            return obj
          }"
        />
        <el-table-column
          prop="lot_no"
          label="收皮条码"
          min-width="30"
        />
        <el-table-column
          prop="test_equip"
          label="检测机台"
          min-width="10"
        />
        <el-table-column
          prop="plan_uid"
          label="检测计划编号"
          min-width="25"
        />
        <el-table-column
          prop="test_method_name"
          label="实验方法"
          min-width="20"
        />
        <el-table-column
          prop="test_times"
          label="实验次数"
          min-width="10"
        />
        <el-table-column
          prop="test_interval"
          label="实验间隔"
          min-width="10"
        />
        <el-table-column
          prop="value"
          label="检测值"
          min-width="50"
        >
          <template v-if="row.value" slot-scope="{row}">
            {{ row.value.replace(/{|}|'/g,"") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="test_user"
          label="检测人员"
          min-width="20"
        />
        <el-table-column
          prop="test_time"
          label="检测时间"
          min-width="20"
        />
        <!-- <el-table-column
          v-if="['物性','钢拔'].includes(search.test_indicator_name)"
          label="查看绑定"
          width="70"
        >
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="showTestData(row)">查看</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <page
        :old-page="false"
        :total="total1"
        :current-page="page1"
        @currentChange="currentChange1"
      />
    </el-dialog>
  </div>
</template>

<script>
import equipSelect from '@/components/select_w/equip'
import allProductNoSelect from '@/components/select_w/allProductNoSelect.vue'
import page from '@/components/page'
import classSelect from '@/components/ClassSelect'
import { debounce } from '@/utils'
import { globalCodesUrl, testIndicators } from '@/api/base_w'
import { productTestResume, productReportEquip, rubberMaxStretchTestResult } from '@/api/base_w_four'
export default {
  name: 'QuickCheckResume',
  components: { page, equipSelect, classSelect, allProductNoSelect },
  data() {
    return {
      options: [
        { name: '门尼', id: 1 },
        { name: '流变', id: 2 },
        { name: '物性', id: 3 },
        { name: '钢拔', id: 4 }
      ],
      total: 0,
      groups: [],
      search: {},
      tableData: [],
      loading: false,
      statusList: { 1: '待检测', 2: '完成', 4: '强制结束' },
      testEquipList: [],
      dialogVisible: false,
      tableDataValue: [],
      test_indicator_name: '',
      ruleForm: {},
      tableDataValueLoading: false,
      dialogVisible1: false,
      loading1: false,
      tableData1: [],
      total1: 0,
      page1: 1,
      page_size1: 10
    }
  },
  created() {
    // this.getTestIndicators()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await productTestResume('get', null, { params: this.search })
        this.loading = false
        this.tableData = data.results
        this.total = data.count
      } catch (e) {
        this.loading = false
      }
    },
    searchList() {
      this.search.page = 1
      this.getList()
    },
    visibleChange(bool) {
      // if (bool) {
      //   this.getTestIndicators()
      // }
    },
    async getTestIndicators() {
      try {
        const data = await testIndicators('get', null, { params: { all: 1 }})
        this.options = data
      } catch (e) {
        //
      }
    },
    async getTestEquipList() {
      try {
        const data = await productReportEquip('get', null, { params: { all: 1 }})
        this.testEquipList = data
      } catch (e) {
        //
      }
    },
    changeTestEquip(bool) {
      if (bool) {
        this.getTestEquipList()
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    equipSearch(val) {
      this.search.equip_no = val
      this.search.page = 1
      this.getList()
    },
    classChanged(val) {
      this.search.page = 1
      this.search.production_classes = val
      this.getList()
    },
    testClassChanged(val) {
      this.search.page = 1
      this.search.test_classes = val
      this.getList()
    },
    getDebounce() {
      this.search.page = 1
      debounce(this, 'getList')
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
    productBatchingChanged(val) {
      this.search.product_no = val ? val.material_no : ''
      this.searchList()
    },
    showTestData(row) {
      this.dialogVisible = true
      if (!row.id) {
        return
      }
      this.ruleForm = row
      this.test_indicator_name = row.test_indicator_name
      this.getTableDataValue(row.id)
    },
    async getTableDataValue(id) {
      try {
        this.tableDataValue = []
        this.tableDataValueLoading = true
        const data = await rubberMaxStretchTestResult('get', null, { params: { product_test_plan_detail_id: id }})
        this.tableDataValue = data.results || []
        this.tableDataValueLoading = false

        if (this.tableDataValue.length > 0) {
          this.tableDataValue.push({
            ordering: this.search.test_indicator_name === '物性' ? '平均值' : 'Mid',
            product_no: this.tableDataValue[0].product_no,
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
        this.tableDataValueLoading = false
      }
    },
    retestDialog(row) {
      this.currentObj = row
      this.dialogVisible1 = true
      this.getRetestList()
    },
    async getRetestList() {
      try {
        this.loading1 = true
        const data = await productTestResume('get', null, { params: { page: this.page1, page_size: this.page_size1, lot_no: this.currentObj.lot_no, test_indicator_name: this.currentObj.test_indicator_name }})
        this.tableData1 = data.results
        this.loading1 = false
        this.total1 = data.count
      } catch (e) {
        this.tableData1 = []
        this.loading1 = false
      }
    },
    currentChange1(page, page_size) {
      this.page1 = page
      this.page_size1 = page_size
      this.getRetestList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
