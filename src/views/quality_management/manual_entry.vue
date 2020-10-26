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
          prop="test_type_name"
          label="试验类型"
          width="180"
        />
        <el-table-column label="数据类型点">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checkAll"
              :disabled="scope.row.data_indicator_detail.length === 0"
              @change="handleCheckAllChange($event,scope.row)"
            >全选</el-checkbox>
            <div style="margin: 15px 0;" />
            <el-checkbox-group
              v-model="scope.row.checkedC"
              @change="handleCheckedCitiesChange($event,scope.row,scope.$index)"
            >
              <el-checkbox
                v-for="itemData in scope.row.data_indicator_detail"
                :key="itemData"
                :label="itemData"
              >{{ itemData }}</el-checkbox>
            </el-checkbox-group>
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
        v-for="(item,i) in changeTable"
        :key="tableDataChild.length+i"
        :label="item.test_type_name"
        align="center"
      >
        <el-table-column
          v-for="(itemChild,indexChild) in item.checkedC"
          :key="indexChild"
          :label="itemChild"
        >
          <template
            v-if="itemChild"
            slot-scope="scope"
          >
            <el-input
              v-if="scope.row._list[item.test_type_id][itemChild]"
              v-model="scope.row._list[item.test_type_id][itemChild].value"
              placeholder="请输入检测值"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="试验方法"
          width="130px"
        >
          <template slot-scope="scope">
            <!-- slot-scope="scope" -->
            <testMethodSelect
              :test-type-id="item.test_type_id"
              :add="true"
              @changeSelect="testMethodChange($event,scope.row._list[item.test_type_id])"
            />
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
import { palletFeedBacksUrl, testTypeData, materialTestOrders } from '@/api/base_w'
import { setDate, deepClone } from '@/utils/index'
// import planSchedulesSelect from '@/components/PlanSchedulesSelect'
import equipSelect from '@/components/select_w/equip'
import classSelect from '@/components/ClassSelect'
import productNoSelect from '@/components/ProductNoSelect'
import viewDialogTrial from '@/components/select_w/viewDialogTrial'
import page from '@/components/page'
import testMethodSelect from '@/components/select_w/testMethodSelect'
export default {
  components: { testMethodSelect, page, equipSelect, classSelect, productNoSelect, viewDialogTrial },
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
      changeTable: [],
      loadingBtn: false
    }
  },
  mounted() {
    this.getTestType()
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
    async getTestType() {
      try {
        const data = await testTypeData('get')
        this.tableDataStyle = data || []
        this.tableDataStyle.forEach(D => {
          this.$set(D, 'checkAll', null)
          this.$set(D, 'checkedC', [])
        })
      } catch (e) {
        //
      }
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
      this.clearData()
      this.showTableDataChild = true

      const num = (Number(row.end_trains) - Number(row.begin_trains) + 1).toFixed(0)
      for (let i = 0; i < num; i++) {
        const obj = JSON.parse(JSON.stringify(row))
        this.$set(obj, 'input', '')
        this.$set(obj, 'actual_trains', i + 1)
        this.tableDataChild.push(obj)
      }
    },
    clearData() {
      // 清除下面的数据
      this.changeTable = []
      this.tableDataStyle.forEach(D => {
        D.checkAll = false
        D.checkedC = []
      })
      this.tableDataChild = []
    },
    handleCheckAllChange(val, row) {
      if (!val) {
        row.checkedC = []
      } else {
        const arr = []
        row.data_indicator_detail.forEach(D => {
          arr.push(D)
        })
        row.checkedC = arr
      }
      setDataChild(this, row)
    },
    handleCheckedCitiesChange(val, row, index) {
      if (val.length !== row.data_indicator_detail.length) {
        row.checkAll = false
      } else {
        row.checkAll = true
      }
      setDataChild(this, row)
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
      // console.log(this.tableDataChild, 'this.tableDataChild')
      const arr = []
      try {
        this.tableDataChild.forEach((D, i) => {
          const arrChild = []
          if (JSON.stringify(D._list) !== '{}') {
            for (const key in D._list) {
              for (const keyChild in D._list[key]) {
                if (D._list[key][keyChild]) {
                  if (!D._list[key][keyChild].value || !D._list[key][keyChild].test_method_name) {
                    throw new Error('试验方法和数据类型点是必填！')
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
        this.$message.error('每行试验方法和数据类型点是必填！')
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

function setDataChild(_this, row) {
  const changeTableNum = _this.changeTable.findIndex(D => D.test_type_id === row.test_type_id)
  if (changeTableNum > -1) {
    if (row.checkedC.length === 0) {
      _this.tableDataChild.forEach(D => {
        delete D._list[row.test_type_id]
      })
      _this.changeTable.splice(changeTableNum, 1)
    } else {
      _this.changeTable[changeTableNum] = row
    }
  } else {
    _this.changeTable.push(row)
  }
  _this.changeTable.forEach((D, index) => {
    const newObj = {}
    const arr1 = deepClone(D.checkedC)
    const obj = {}
    arr1.forEach((data, i) => {
      _this.$set(obj, 'test_indicator_name', D.test_type_name)
      _this.$set(obj, 'data_point_name', data)
      _this.$set(obj, 'test_method_name', '')
      _this.$set(obj, 'value', '')
      _this.$set(newObj, data, obj)
    })

    _this.tableDataChild.forEach(dd => {
      if (dd._list) {
        if (dd._list[D.test_type_id]) {
          Object.assign(newObj, dd._list[D.test_type_id])
        }
      }

      const aaaaa = deepClone(newObj)
      const _obj = {}
      _this.$set(_obj, D.test_type_id, {
        ...aaaaa,
        // 试验方法
        testMode: ''
      })
      if (!dd._list) {
        _this.$set(dd, '_list', {})
      }
      const ccc = Object.assign({}, dd._list, _obj)
      _this.$set(dd, '_list', ccc)
    })
  })
  // console.log(_this.tableDataChild, 7777)
}
</script>

<style lang="scss" scoped>
.rigthTable{
  overflow-y: scroll;display:inline-block;
   max-height: 400px;margin-left:10px;width:50%;
}
</style>
