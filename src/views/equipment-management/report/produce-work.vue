<template>
  <div>
    <!-- 生产运行记录 -->
    <el-form :inline="true">
      <el-form-item label="工厂时间:">
        <el-date-picker
          v-model="search.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择工厂时间"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="班次:">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button @click="reportBrowse">报表浏览</el-button>
        <!-- <el-button @click="exportTable">导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="dataList"
      :span-method="objectSpanMethod"
      border
    >
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="10"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        prop="plan_trains"
        label="计划量(车)"
        min-width="14"
      />
      <el-table-column
        prop="actual_trains"
        label="完成量(车)"
        min-width="14"
      />
      <el-table-column
        prop="c"
        label="达成率"
        min-width="20"
      >
        <template v-if="row.actual_trains" slot-scope="{row}">
          <el-progress :text-inside="true" :stroke-width="24" :percentage="parseInt(row.actual_trains/row.plan_trains * 100)" />
        </template>
      </el-table-column>
      <el-table-column
        label="完成总量(车)"
        min-width="14"
      >
        <template v-if="row.trains_sum" slot-scope="{row}">
          {{ row.trains_sum[0] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="put_user"
        label="投料人员"
        min-width="20"
      />
      <el-table-column
        prop="c"
        label="生产时间"
        min-width="20"
      />
      <el-table-column
        label="设备启动率"
        min-width="20"
      >
        <template v-if="row.start_rate" slot-scope="{row}">
          <el-progress :text-inside="true" :stroke-width="24" status="success" :percentage="parseInt(row.start_rate *100)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="浏览"
      :visible.sync="dialogVisible"
      width="90%"
    >
      <table
        border="1"
        bordercolor="#EBEEF5"
        class="info-table-head"
      >
        <tr>
          <td colspan="4"><h3>安吉炼胶分厂</h3></td>
        </tr>
        <tr>
          <td colspan="4">炼胶生产运行记录</td>
        </tr>
        <tr style="">
          <td>班组：--</td>
          <td>班次：--</td>
          <td>值班长：--</td>
          <td style="width:300px">{{ search.date }}</td>
        </tr>
      </table>
      <div style="display:flex">
        <el-table
          :data="dataList"
          :span-method="objectSpanMethodChid"
          border
          style="width:70%"
        >
          <el-table-column
            prop="equip_no"
            label="机台"
            min-width="20"
          />
          <el-table-column
            prop="product_no"
            label="胶料编码"
            min-width="20"
          />
          <el-table-column
            prop="plan_trains"
            label="计划量(车)"
            min-width="20"
          />
          <el-table-column
            prop="actual_trains"
            label="完成量(车)"
            min-width="20"
          />
          <el-table-column
            label="合计(车)"
            min-width="20"
          >
            <template slot-scope="{row}">
              {{ row.trains_sum[0] }}
            </template>
          </el-table-column>
          <el-table-column
            label="岗位人员配置"
            min-width="30"
          >
            <template slot-scope="{row}">
              <div>
                <div>投料岗位：{{ row.put_user }}</div>
                <div>挤出岗位：--</div>
                <div>收皮岗位：--</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <table
          border="1"
          bordercolor="#EBEEF5"
          class="info-table"
          style="width:30%"
        >
          <tr>
            <td>相关记录</td>
          </tr>
          <tr>
            <td class="rightHeight">--</td>
          </tr>
          <tr>
            <td>工艺停机</td>
          </tr>
          <tr>
            <td class="rightHeight">--</td>
          </tr>
          <tr>
            <td>生产停机</td>
          </tr>
          <tr>
            <td class="rightHeight">--</td>
          </tr>
          <tr>
            <td>辅助岗位名单</td>
          </tr>
          <tr>
            <td class="rightHeight">--</td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import classSelect from '@/components/ClassSelect'
import { runtimeRecord } from '@/api/base_w_three'
import { setDate, exportExcel } from '@/utils/index'
export default {
  components: { classSelect },
  data() {
    return {
      search: {
        date: setDate()
      },
      loading: true,
      dialogVisible: false,
      dataList: [
        {
          a: 'z01',
          b: 22,
          c: 11,
          d: 33
        },
        {
          a: 'z01',
          b: 22,
          c: 11,
          d: 33
        },
        {
          a: 'z01',
          b: 22,
          c: 11,
          d: 33
        },
        {
          a: 'z02',
          b: 22,
          c: 11,
          d: 33
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await runtimeRecord('get', null, { params: this.search })
        this.dataList = data.results || []
        this.loading = false

        if (this.dataList.length === 0) return
        this.spanArr = []
        this.pos = null
        for (var i = 0; i < this.dataList.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1)
            this.pos = 0
          } else {
            if (this.dataList[i].equip_no === this.dataList[i - 1].equip_no) {
              // 如果a相等就累加，并且push 0  这里是根据一样的a匹配
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
            } else {
              // 不相等push 1
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.getList()
    },
    classChanged(obj) {
      this.search.classes = obj
      this.getList()
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0].includes(columnIndex) && this.spanArr) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    objectSpanMethodChid({ row, column, rowIndex, columnIndex }) {
      if ([0, 5].includes(columnIndex) && this.spanArr) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    exportTable() {
      exportExcel('生产运行记录')
    },
    reportBrowse() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
 table {
      width: 100%;
      border-collapse: collapse;
    }
    .info-table-head{
      tr{
        text-align: center;
      }
      td{
        padding:5px;
      }
    }
   .info-table {
       td {
        min-width: 100px;
        padding: 5px 10px;
         font-size: 14px;
         color: #606266;
      }
       thead{
        font-weight: 700;
        td{
          color: #909399;
        }
       }

    }
    .rightHeight{
      height:150px;
    }
</style>
