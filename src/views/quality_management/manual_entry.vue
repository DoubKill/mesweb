<template>
  <div v-loading="loading">
    <!-- <el-button @click="viewTrial">8888</el-button> -->
    <el-form :inline="true">
      <el-form-item label="日期：">
        <el-date-picker
          v-model="search.day_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="pageOne"
        />
      </el-form-item>
      <!-- <el-form-item label="倒班规则：">
        <plan-schedules-select
          :day-time="search.Data"
          @planScheduleSelected="planScheduleSelected"
        />
      </el-form-item> -->
      <el-form-item label="生产机台：">
        <equip-select
          :equip_no_props="search.equip_no"
          @changeSearch="changeSearch"
        />
      </el-form-item>
      <el-form-item label="班次：">
        <class-select @classSelected="classSelected" />
      </el-form-item>
      <el-form-item label="胶料：">
        <product-no-select @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
    </el-form>

    <div
      class="rigthTable"
      style="width:47%"
    >
      <el-table
        :data="tableData"
        :highlight-current-row="true"
        @row-click="rowClick"
      >
        <el-table-column
          label="生产信息"
          align="center"
        >
          <el-table-column
            prop="lot_no"
            label="收皮条码"
          />
          <el-table-column
            prop="product_no"
            label="胶料编码"
          />
          <el-table-column
            prop="classes"
            label="班次"
          />
          <el-table-column
            prop="equip_no"
            label="生产机台"
          />
          <el-table-column label="车次">
            <template slot-scope="scope">
              {{ scope.row.begin_trains }}--{{ scope.row.end_trains }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <page
        :total="total"
        :current-page="search.page"
        @currentChange="currentChange"
      />
    </div>

    <div class="rigthTable">
      <el-table
        v-if="showTableDataChild"
        :data="tableDataStyle"
        border
      >
        <el-table-column
          prop="test_indicator"
          label="试验指标"
          width="180"
        />
        <el-table-column label="试验方法">
          <template v-if="scope.row.methods.length>0" slot-scope="scope">
            <el-radio
              v-for="(itemData,ik) in scope.row.methods"
              :key="ik"
              v-model="checkedC"
              :label="itemData"
              :disabled="!itemData.allowed"
              @change="changeMethods($event,scope.row)"
            >
              {{ itemData.name }}
            </el-radio>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-button
      v-if="showTableDataChild"
      :loading="loadingBtn"
      style="float:right;margin-bottom:5px;"
      @click="submitTable"
    >保 存</el-button>
    <el-table
      v-if="showTableDataChild"
      :data="tableDataChild"
      border
    >
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        label="生产信息"
        align="center"
      >
        <el-table-column
          prop="product_no"
          label="胶料编码"
        />
        <el-table-column
          prop="lot_no"
          label="收皮条码"
        />
        <el-table-column
          prop="classes"
          label="班次"
        />
        <el-table-column
          prop="equip_no"
          label="生产机台"
        />
        <el-table-column
          prop="actual_trains"
          label="车次"
        />
      </el-table-column>
      <el-table-column
        v-if="changeTable.data_points&&changeTable.data_points.length>0"
        :label="changeTable.test_indicator"
        align="center"
      >
        <el-table-column
          v-for="(itemChild,indexChild) in changeTable.data_points"
          :key="indexChild"
          :label="itemChild.name"
        >
          <template
            v-if="itemChild"
            slot-scope="scope"
          >
            <el-input
              v-if="scope.row._list[changeTable.id][itemChild.name]"
              v-model="scope.row._list[changeTable.id][itemChild.name].value"
              placeholder="请输入检测值"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="试验方法"
        >
          <template slot-scope="scope">
            {{ changeTable.name }}
            <span v-if="false">{{ scope.row }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.note"
            placeholder="请输入内容"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="deleteFunction(scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <view-dialog-trial
      :show="dialogVisible"
      @handleClose="dialogVisible = false"
    />
  </div>
</template>

<script>
import { palletFeedBacksUrl, matTestIndicatorMethods, materialTestOrders } from '@/api/base_w'
import { setDate, deepClone } from '@/utils/index'
// import planSchedulesSelect from '@/components/PlanSchedulesSelect'
import equipSelect from '@/components/select_w/equip'
import classSelect from '@/components/ClassSelect'
import productNoSelect from '@/components/ProductNoSelect'
import viewDialogTrial from '@/components/select_w/viewDialogTrial'
import page from '@/components/page'
export default {
  components: { page, equipSelect, classSelect, productNoSelect, viewDialogTrial },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      total: 0,
      search: {
        ShiftRules: '',
        day_time: setDate(),
        equip_no: '',
        classes: '',
        productNo: '',
        page: 1
      },
      tableData: [],
      tableDataStyle: [],
      tableDataChild: [],
      showTableDataChild: false,
      changeTable: {},
      loadingBtn: false,
      checkedC: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.clearData()
      this.showTableDataChild = false
      try {
        this.loading = true
        const data = await palletFeedBacksUrl('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getTestType(id) {
      try {
        const data = await matTestIndicatorMethods('get', null, { params: { material_no: id }})
        this.tableDataStyle = data || []
      } catch (e) {
        //
      }
    },
    changeMethods(e, obj) {
      this.changeTable = []
      this.$set(e, 'test_indicator', obj.test_indicator)
      this.$nextTick(() => {
        this.changeTable = Object.assign({}, this.changeTable, e)
      })
      setDataChild(this, e)
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    pageOne() {
      this.search.page = 1
      this.getList()
    },
    changeSearch(id) {
      this.search.equip_no = id
      this.pageOne()
    },
    planScheduleSelected(id) {
      this.search.ShiftRules = id
      this.pageOne()
    },
    classSelected(val) {
      this.search.classes = val
      this.pageOne()
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.stage_product_batch_no : ''
      this.pageOne()
    },
    rowClick(row) {
      this.getTestType(row.product_no)

      this.clearData()
      this.showTableDataChild = true

      const num = (Number(row.end_trains) - Number(row.begin_trains) + 1).toFixed(0)
      for (let i = 0; i < num; i++) {
        const obj = JSON.parse(JSON.stringify(row))
        this.$set(obj, 'input', '')
        this.$set(obj, 'actual_trains', Number(row.begin_trains) + i)
        this.tableDataChild.push(obj)
      }
    },
    clearData() {
      // 清除下面的数据
      this.changeTable = {}
      this.tableDataStyle = []
      this.tableDataChild = []
    },
    deleteFunction(index) {
      this.$confirm(
        '是否删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.tableDataChild.splice(index, 1)
      })
    },
    viewTrial() {
      this.dialogVisible = true
    },
    testMethodChange(event, val) {
      if (val) {
        for (const key in val) {
          if (val[key]) {
            this.$set(val[key], 'test_method_name', event)
          }
        }
      }
    },
    async submitTable() {
      console.log(this.tableDataChild, 'this.tableDataChild')
      const arr = []
      try {
        this.tableDataChild.forEach((D, i) => {
          const arrChild = []
          if (!D.lot_no) {
            this.$message.error('收皮条码不能为空！')
            throw new Error('收皮条码不能为空！')
          }
          if (JSON.stringify(D._list) !== '{}') {
            for (const key in D._list) {
              for (const keyChild in D._list[key]) {
                if (D._list[key][keyChild]) {
                  if (!D._list[key][keyChild].value || !D._list[key][keyChild].test_method_name) {
                    this.$message.error('每行数据类型点是必填！')
                    throw new Error('数据点是必填！')
                  }
                  arrChild.push(D._list[key][keyChild])
                }
              }
            }
          }
          arr[i] = {
            lot_no: D.lot_no,
            actual_trains: D.actual_trains,
            product_no: D.product_no,
            plan_classes_uid: D.plan_classes_uid,
            production_class: D.classes,
            production_equip_no: D.equip_no,
            production_factory_date: D.end_time,
            note: D.note,
            order_results: arrChild
          }
        })
      } catch (ex) {
        return
      }
      this.loadingBtn = true
      try {
        await materialTestOrders('post', null, { data: arr })
        this.$message.success('录入成功')
        this.loadingBtn = false
      } catch (e) {
        this.loadingBtn = false
      }
    }
  }
}

function setDataChild(_this, e) {
  const arr1 = deepClone(e.data_points)
  const newObj = {}
  arr1.forEach((data, i) => {
    const obj = {}
    _this.$set(obj, 'test_indicator_name', e.test_indicator)
    _this.$set(obj, 'data_point_name', data.name)
    _this.$set(obj, 'test_method_name', e.name)
    _this.$set(obj, 'value', '')
    _this.$set(newObj, data.name, obj)
  })
  _this.tableDataChild.forEach(dd => {
    _this.$set(dd, '_list', {})
    const arr = deepClone(newObj)
    _this.$set(dd._list, e.id, {
      ...arr,
      // 试验方法
      testMode: ''
    })
  })
}
</script>

<style lang="scss" scoped>
.rigthTable{
  overflow-y: scroll;display:inline-block;
   max-height: 400px;margin-left:10px;width:50%;
}
</style>
