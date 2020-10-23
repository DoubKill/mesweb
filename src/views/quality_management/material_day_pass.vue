<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="searchTime"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择日期"
          @change="dateChange"
        />
      </el-form-item>
      <el-form-item label="合格率类型">
        <el-select v-model="value1" multiple placeholder="请选择" @change="changeSearch">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      v-if="value1.length == 0 || value1.indexOf('综合合格率') > -1"
      :data="tableData"
      size="small"
      border
      max-height="200"
      style="width: 100%"
    >
      <el-table-column label="综合合格率">
        <el-table-column fixed type="index" label="No" />
        <el-table-column fixed label="胶料编码">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="monthPassClick">{{ scope.row.material }}</el-link>
          </template>
        </el-table-column>
        <el-table-column v-for="(value,index) in headers" :key="index" :label="value" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row[value]">{{ scope.row[value].composite_pass_percent }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-table
      v-if="value1.length == 0 || value1.indexOf('一次合格率') > -1"
      :data="tableData"
      border
      size="small"
      max-height="200"
      style="width: 100%"
    >
      <el-table-column label="一次合格率">
        <el-table-column fixed type="index" label="No" />
        <el-table-column fixed label="胶料编码">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="monthPassClick">{{ scope.row.material }}</el-link>
          </template>
        </el-table-column>
        <el-table-column v-for="(value,index) in headers" :key="index" :label="value" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row[value]">{{ scope.row[value].once_pass_percent }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-table
      v-if="value1.length == 0 || value1.indexOf('流变合格率') > -1"
      :data="tableData"
      border
      size="small"
      max-height="200"
      style="width: 100%"
    >
      <el-table-column label="流变合格率">
        <el-table-column fixed type="index" label="No" />
        <el-table-column fixed label="胶料编码">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="monthPassClick">{{ scope.row.material }}</el-link>
          </template>
        </el-table-column>
        <el-table-column v-for="(value,index) in headers" :key="index" :label="value" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row[value]">{{ scope.row[value].sulphur_pass_percent }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      title="胶料月合格率详情"
      :visible.sync="dialogShow"
    >
      <el-table
        :data="detailData"
        border
        style="width: 100%"
      >
        <el-table-column fixed type="index" label="No" />
        <el-table-column fixed label="月份" prop="date" />
        <el-table-column fixed label="规格名称" prop="material" />
        <el-table-column fixed label="产量/车" prop="actual_trains" />
        <el-table-column fixed label="一次合格率%" prop="once_pass_percent" />
        <el-table-column fixed label="流变合格率%" prop="sulphur_pass_percent" />
        <el-table-column fixed label="综合合格率%" prop="composite_pass_percent" />
        <el-table-column v-for="(value,index) in detailHeaders" :key="index" :label="value" align="center">
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
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  components: { },
  data() {
    return {
      searchTime: dayjs().format('YYYY-MM'),
      headers: ['2020-09-04', '2020-10-05'],
      detailHeaders: ['门尼', 'MH'],
      dialogShow: false,
      tableData: [{
        'material': 'FM-C102-02',
        '2020-09-04': {
          'actual_trains': 10,
          'composite_pass_percent': 1,
          'once_pass_percent': 1,
          'sulphur_pass_percent': 1
        },
        '2020-10-05': {
          'actual_trains': 10,
          'composite_pass_percent': 0.99,
          'once_pass_percent': 0.99,
          'sulphur_pass_percent': 0.99
        }
      },
      {
        'material': 'FM-C106-08',
        '2020-09-04': {
          'actual_trains': 10,
          'composite_pass_percent': 0.98,
          'once_pass_percent': 0.98,
          'sulphur_pass_percent': 0.98
        },
        '2020-10-05': {
          'composite_pass_percent': 0.97,
          'once_pass_percent': 0.97,
          'sulphur_pass_percent': 0.97
        }
      }
      ],
      detailData: [
        {
          'material': 'FM-C102-02',
          'date': '2020-09-04',
          'actual_trains': 10,
          'composite_pass_percent': 1,
          'once_pass_percent': 1,
          'sulphur_pass_percent': 1,
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
            }
          }
        },
        {
          'material': 'FM-C102-02',
          'date': '2020-10-05',
          'actual_trains': 10,
          'composite_pass_percent': '100%',
          'once_pass_percent': '100%',
          'sulphur_pass_percent': '100%',
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

      ],
      options: ['综合合格率', '一次合格率', '流变合格率'],
      value1: []
    }
  },
  created() {
    // this.getheaders()
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
    },
    changeSearch() {
    }
  }
}
</script>

<style>

</style>
