<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="beginTime"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择日期"
          @change="dateChange"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="endTime"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择日期"
          @change="dateChange"
        />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column fixed type="index" label="No" />
      <el-table-column fixed label="月份" prop="date">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="monthPassClick">{{ scope.row.date }}</el-link>
        </template>
      </el-table-column>
      <el-table-column fixed label="产量/车" prop="actual_trains" />
      <el-table-column fixed label="一次合格率%" width="75" prop="once_pass_percent" />
      <el-table-column fixed label="流变合格率%" width="75" prop="sulphur_pass_percent" />
      <el-table-column fixed label="综合合格率%" width="75" prop="composite_pass_percent" />
      <el-table-column v-for="(value,index) in headers" :key="index" :label="value" align="center">
        <el-table-column label="+" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].up_trains }}</span>
          </template>
        </el-table-column>
        <el-table-column label="%" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].up_percent }}</span>
          </template>
        </el-table-column>
        <el-table-column label="+" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].lower_trains }}</span>
          </template>
        </el-table-column>
        <el-table-column label="%" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].lower_percent }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      top="0"
      title="合格率统计"
      :visible.sync="dialogShow"
    >
      <!-- <el-col :span="8" style="margin: 0 0;"> -->
      <span>总合格率</span>
      <el-table
        :data="tableData"
        size="small"
        border
        max-height="200"
        style="width: 100%"
      >
        <el-table-column type="index" label="No" />
        <el-table-column label="日期" prop="date" />
        <el-table-column label="产量/车" prop="actual_trains" />
        <el-table-column label="一次合格率%" prop="once_pass_percent" />
        <el-table-column label="流变合格率%" prop="sulphur_pass_percent" />
        <el-table-column label="综合合格率%" prop="composite_pass_percent" />
      </el-table>
      <!-- </el-col> -->
      <!-- <el-col :span="8"> -->
      <span>机台别合格率</span>
      <el-table
        :data="tableData"
        border
        size="small"
        max-height="200"
        style="width: 100%"
      >
        <el-table-column fixed type="index" label="No" />
        <el-table-column fixed label="日期" prop="date" />
        <el-table-column v-for="(value,index) in headers" :key="index" :label="value" align="center">
          <el-table-column label="一次合格率%" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].up_trains }}</span>
            </template>
          </el-table-column>
          <el-table-column label="流变合格率%" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].up_trains }}</span>
            </template>
          </el-table-column>
          <el-table-column label="综合合格率%" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].up_trains }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- </el-col>
      <el-col :span="8"> -->
      <span>班组别合格率</span>
      <el-table
        :data="tableData"
        border
        size="small"
        max-height="200"
        style="width: 100%"
      >
        <el-table-column fixed type="index" label="No" />
        <el-table-column fixed label="日期" prop="date" />
        <el-table-column v-for="(value,index) in headers" :key="index" :label="value" align="center">
          <el-table-column label="一次合格率%" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].up_trains }}</span>
            </template>
          </el-table-column>
          <el-table-column label="流变合格率%" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].up_trains }}</span>
            </template>
          </el-table-column>
          <el-table-column label="综合合格率%" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.test_detail[value]">{{ scope.row.test_detail[value].up_trains }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- </el-col> -->
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  components: { },
  data() {
    return {
      beginTime: dayjs().startOf('year').format('YYYY-MM'),
      endTime: dayjs().endOf('year').format('YYYY-MM'),
      headers: [],
      dialogShow: false,
      tableData: [
        {
          'date': '2020-09',
          'composite_pass_percent': 1,
          'once_pass_percent': '99.99%',
          'sulphur_pass_percent': 1,
          'actual_trains': 10,
          'test_detail': {
            '门尼': {
              'test_type_name': '门尼',
              'data_name': '门尼',
              'up_trains': 1,
              'up_percent': 0.9,
              'lower_trains': 1,
              'lower_percent': 0.9
            },
            'MH': {
              'test_type_name': '流变',
              'data_name': 'MH',
              'up_trains': 1,
              'up_percent': 0.9,
              'lower_trains': 1,
              'lower_percent': 0.9
            },
            'MH1': {
              'test_type_name': '流变',
              'data_name': 'MH',
              'up_trains': 1,
              'up_percent': 0.9,
              'lower_trains': 1,
              'lower_percent': 0.9
            },
            'MH2': {
              'test_type_name': '流变',
              'data_name': 'MH',
              'up_trains': 1,
              'up_percent': 0.9,
              'lower_trains': 1,
              'lower_percent': 0.9
            }
          }
        },
        {
          'date': '2020-10',
          'composite_pass_percent': '100%',
          'once_pass_percent': '100%',
          'sulphur_pass_percent': '100%',
          'actual_trains': 10,
          'test_detail': {
            'MH': {
              'test_type_name': '流变',
              'data_name': 'MH',
              'up_trains': 1,
              'up_percent': 0.9,
              'lower_trains': 1,
              'lower_percent': 0.9
            }
          }
        },
        {
          'date': '2020-10',
          'composite_pass_percent': '100%',
          'once_pass_percent': '100%',
          'sulphur_pass_percent': '100%',
          'actual_trains': 10,
          'test_detail': {
            'MH': {
              'test_type_name': '流变',
              'data_name': 'MH',
              'up_trains': 1,
              'up_percent': 0.9,
              'lower_trains': 1,
              'lower_percent': 0.9
            }
          }
        },
        {
          'date': '2020-10',
          'composite_pass_percent': '100%',
          'once_pass_percent': '100%',
          'sulphur_pass_percent': '100%',
          'actual_trains': 10,
          'test_detail': {
            'MH': {
              'test_type_name': '流变',
              'data_name': 'MH',
              'up_trains': 1,
              'up_percent': 0.9,
              'lower_trains': 1,
              'lower_percent': 0.9
            }
          }
        },
        {
          'date': '2020-10',
          'composite_pass_percent': '100%',
          'once_pass_percent': '100%',
          'sulphur_pass_percent': '100%',
          'actual_trains': 10,
          'test_detail': {
            'MH': {
              'test_type_name': '流变',
              'data_name': 'MH',
              'up_trains': 1,
              'up_percent': 0.9,
              'lower_trains': 1,
              'lower_percent': 0.9
            }
          }
        },
        {
          'date': '2020-10',
          'composite_pass_percent': '100%',
          'once_pass_percent': '100%',
          'sulphur_pass_percent': '100%',
          'actual_trains': 10,
          'test_detail': {
            'MH': {
              'test_type_name': '流变',
              'data_name': 'MH',
              'up_trains': 1,
              'up_percent': 0.9,
              'lower_trains': 1,
              'lower_percent': 0.9
            }
          }
        },
        {
          'date': '2020-10',
          'composite_pass_percent': '100%',
          'once_pass_percent': '100%',
          'sulphur_pass_percent': '100%',
          'actual_trains': 10,
          'test_detail': {
            'MH': {
              'test_type_name': '流变',
              'data_name': 'MH',
              'up_trains': 1,
              'up_percent': 0.9,
              'lower_trains': 1,
              'lower_percent': 0.9
            }
          }
        }
      ]
    }
  },
  created() {
    this.getheaders()
  },
  methods: {
    dateChange() {
      console.log(this.beginTime)
      console.log(this.endTime)
    },
    getheaders() {
      for (var n in this.tableData) {
        for (var m in this.tableData[n].test_detail) {
          if (this.headers.indexOf(m) === -1) {
            this.headers.push(m)
          }
        }
      }
      console.log(this.headers)
      console.log(this.beginTime)
      console.log(this.endTime)
    },
    monthPassClick() {
      this.dialogShow = true
    }
  }
}
</script>

<style>

</style>
