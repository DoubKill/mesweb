<template>
  <div class="quick_plan_manage">
    <!-- 快检计划管理 -->
    <el-row :gutter="20">
      <el-col :span="11">
        <div class="grid-content bg-purple">
          <h4>生产列表</h4>
          <el-form :inline="true" size="mini">
            <el-form-item label="日期">
              <el-date-picker
                v-model="produceSearch.date"
                size="mini"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="dateChange"
              />
            </el-form-item>
            <el-form-item label="倒班规则">
              <planSchedulesSelect :day-time="produceSearch.date" @planScheduleSelected="planScheduleSelected" />
            </el-form-item>
            <el-form-item label="班次">
              <classSelect @classSelected="classSelected" />
            </el-form-item>
            <el-form-item label="胶料">
              <productNoSelect @productBatchingChanged="productBatchingChanged" />
            </el-form-item>
            <el-form-item label="生产机台">
              <equipSelect
                :equip_no_props="produceSearch.equip_no"
                @changeSearch="equipSearch"
              />
            </el-form-item>
            <el-form-item label="抽检规则">
              <!-- 必填 -->
              <el-select v-model="produceSearch.a" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <el-table
            ref="produceTable"
            size="mini"
            :data="tableData1"
            border
            @selection-change="leftSelectionChange"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="date"
              label="日期"
            />
            <el-table-column
              prop="name"
              label="姓名"
            />
            <el-table-column
              prop="address"
              label="地址"
            />
          </el-table>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content center-botton">
          <el-button type="primary" size="small" icon="el-icon-arrow-left" @click="arrowLeft" />
          <el-button type="primary" size="small" icon="el-icon-arrow-right" @click="arrowRight" />
        </div>
      </el-col>
      <el-col :span="11">
        <div class="grid-content bg-purple">
          <h4>计划列表</h4>
          <el-form :inline="true" size="mini">
            <el-form-item label="班次">
              <classSelect @classSelected="classSelectedPlan" />
            </el-form-item>
            <el-form-item label="胶料">
              <productNoSelect @productBatchingChanged="productBatchingChangedPlan" />
            </el-form-item>
            <el-form-item label="生产机台">
              <equipSelect
                :equip_no_props="planSearch.equip_no"
                @changeSearch="equipSearchPlan"
              />
            </el-form-item>
          </el-form>
          <el-table
            ref="planTable"
            size="mini"
            :data="tableData2"
            border
            @selection-change="rightSelectionChange"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="date"
              label="日期"
            />
            <el-table-column
              prop="name"
              label="姓名"
            />
            <el-table-column
              prop="address"
              label="地址"
            />
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import planSchedulesSelect from '@/components/PlanSchedulesSelect'
import classSelect from '@/components/ClassSelect'
import productNoSelect from '@/components/ProductNoSelect'
import equipSelect from '@/components/select_w/equip'
import { setDate } from '@/utils/index'
export default {
  components: { equipSelect, planSchedulesSelect, classSelect, productNoSelect },
  data() {
    return {
      tableData1: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      tableData2: [{
        id: 1,
        date: '111',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '222',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 7,
        date: '333',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        id: 8,
        date: '444',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      produceSelectionList: [],
      planSelectionList: [],
      produceSearch: {
        date: setDate()
      },
      planSearch: {},
      options: []
    }
  },
  methods: {
    dateChange() {},
    equipSearch() {},
    leftSelectionChange(val) {
      this.produceSelectionList = val
    },
    rightSelectionChange(val) {
      this.planSelectionList = val
    },
    planScheduleSelected(val) {
    },
    classSelected(val) {},
    productBatchingChanged(val) {},
    classSelectedPlan() {},
    productBatchingChangedPlan() {},
    equipSearchPlan() {},
    arrowLeft() {
      //  produceSelectionList: [],
      // const tableData1 = JSON.parse(JSON.stringify(this.tableData1))
      // let arr = []
      // tableData1.forEach((D, i) => {
      //   arr = this.planSelectionList.filter(data => data.id === D.id)
      //   if (arr.length > 0) {
      //     // 在左侧存在，需要替换掉
      //     this.tableData1[i] = arr[0]
      //   }
      // })

      // console.log(arr, 7777)
    },
    arrowRight() {
    }
  }
}
</script>

<style lang="scss">
.quick_plan_manage{
    .center-botton{
      margin-top:100px;
        .el-button{
                margin-left: 0px;
                margin-top:10px;
                width:100%;
        }

    }
      .el-select{
          width:150px;
        }
}

</style>
