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
        <el-button @click="exportTable">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      :data="dataList"
      :span-method="objectSpanMethod"
      border
    >
      <!-- <el-table-column
        label="ID"
        width="50"
        type="index"
      /> -->
      <el-table-column
        prop="a"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="b"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        prop="c"
        label="计划量(车)"
        min-width="20"
      />
      <el-table-column
        prop="c"
        label="完成量(车)"
        min-width="20"
      />
      <el-table-column
        prop="c"
        label="达成率"
        min-width="20"
      />
      <el-table-column
        prop="c"
        label="完成总量(车)"
        min-width="20"
      />
      <el-table-column
        prop="c"
        label="投料人员"
        min-width="20"
      />
      <el-table-column
        prop="c"
        label="生产时间"
        min-width="20"
      />
      <el-table-column
        prop="c"
        label="设备启动率"
        min-width="20"
      />
    </el-table>
    <!-- <table
      border="1"
      bordercolor="#EBEEF5"
      class="info-table"
    >
     <thead>
        <tr>
          <td>机台</td>
          <td>胶料编码</td>
          <td>计划量(车)</td>
          <td>完成量(车)</td>
          <td>达成率</td>
          <td>完成总量(车)</td>
          <td>投料人员</td>
          <td>生产时间</td>
          <td>设备启动率</td>
        </tr>
      </thead>
      <tbody>
      <tr
          v-for="(item,index) in dataList"
          :key="index"
          :rowspan="item.list.length"
        >
          <td>{{ item.a }}</td>
          <td>{{ item.a }}</td>
        </tr>
      </tbody>
    </table> -->
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
          <td>班组：方法</td>
          <td>班次：反对法</td>
          <td>值班长：否适度放大</td>
          <td style="width:300px">2014年02月06日</td>
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
            prop="a"
            label="机台"
            min-width="20"
          />
          <el-table-column
            prop="b"
            label="胶料编码"
            min-width="20"
          />
          <el-table-column
            prop="c"
            label="计划量(车)"
            min-width="20"
          />
          <el-table-column
            prop="c"
            label="完成量(车)"
            min-width="20"
          />
          <el-table-column
            prop="c"
            label="合计(车)"
            min-width="20"
          />
          <el-table-column
            prop="c"
            label="岗位人员配置"
            min-width="30"
          >
            <template slot-scope="{row}">
              <div>
                <div>
                  投料岗位：54545454
                </div>
                <div>挤出岗位：54545454</div>
                <div>收皮岗位：54545454</div>
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
            <td class="rightHeight">6565656565656565</td>
          </tr>
          <tr>
            <td>工艺停机</td>
          </tr>
          <tr>
            <td class="rightHeight">65656565</td>
          </tr>
          <tr>
            <td>生产停机</td>
          </tr>
          <tr>
            <td class="rightHeight">65656565</td>
          </tr>
          <tr>
            <td>辅助岗位名单</td>
          </tr>
          <tr>
            <td class="rightHeight">65656565</td>
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
import { setDate, exportExcel } from '@/utils/index'
export default {
  components: { classSelect },
  data() {
    return {
      search: {
        date: setDate()
      },
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
    this.spanArr = []
    this.pos = null
    for (var i = 0; i < this.dataList.length; i++) {
      if (i === 0) {
        // 如果是第一条记录（即索引是0的时候），向数组中加入１
        this.spanArr.push(1)
        this.pos = 0
      } else {
        if (this.dataList[i].a === this.dataList[i - 1].a) {
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
  },
  methods: {
    changeSearch() {},
    classChanged() {},
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0].includes(columnIndex)) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    objectSpanMethodChid({ row, column, rowIndex, columnIndex }) {
      if ([0, 5].includes(columnIndex)) {
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
