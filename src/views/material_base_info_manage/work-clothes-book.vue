<template>
  <div>
    <!-- 工装管理台账 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.date_time"
          type="month"
          :clearable="false"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button
          v-permission="['tool_manage_account', 'add']"
          type="primary"
          :loading="btnLoading"
          @click="submitFun"
        >保存</el-button>
      </el-form-item>
    </el-form>
    <div v-loading="loading" class="table-fa">
      <table
        v-if="tableList.length"
        id="out-table"
        class="info-table table_wrap"
        style="transform-style:preserve-3d;"
      >
        <!-- border="1"
        bordercolor="black" -->
        <tr>
          <th class="leftOne">工装类型</th>
          <th colspan="2" class="leftTwo">放置区域</th>
          <th
            v-for="(value) in day"
            :key="value"
            class="td-style"
          >{{ month }}/{{ value }}</th>
        </tr>
        <tr>
          <td rowspan="7" class="leftOne">胶架</td>
          <td rowspan="2" class="leftTwo">立体库</td>
          <td class="leftThree">混炼库</td>
          <td
            v-for="(value,_key) in tableList[0][0]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(0,_key)"
            />
          </td>
        </tr>
        <tr>
          <td class="leftThree">终练库</td>
          <td
            v-for="(value,_key) in tableList[0][1]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(0,_key)"
            />
          </td>
        </tr>
        <tr>
          <td rowspan="3" class="leftTwo">现场</td>
          <td class="leftThree">一楼</td>
          <td
            v-for="(value,_key) in tableList[0][2]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(0,_key)"
            />
          </td>
        </tr>
        <tr>
          <td class="leftThree">二楼</td>
          <td
            v-for="(value,_key) in tableList[0][3]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(0,_key)"
            />
          </td>
        </tr>
        <tr>
          <td class="leftThree">三楼</td>
          <td
            v-for="(value,_key) in tableList[0][4]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(0,_key)"
            />
          </td>
        </tr>
        <tr>
          <td rowspan="2" class="leftTwo">厂外</td>
          <td class="leftThree">分厂区外</td>
          <td
            v-for="(value,_key) in tableList[0][5]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(0,_key)"
            />
          </td>
        </tr>
        <tr>
          <td class="leftThree">硫磺库外</td>
          <td
            v-for="(value,_key) in tableList[0][6]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(0,_key)"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="leftOne">小计</td>
          <td
            v-for="(value,_key) in tableList[0][7]"
            :key="_key"
            class="td-style"
          >
            <span>{{ value.value }}</span>
          </td>
        </tr>
        <!-- 第二个合计 -->
        <tr>
          <td rowspan="4" class="leftOne">小胶架</td>
          <td rowspan="3" class="leftTwo">现场</td>
          <td class="leftThree">一楼</td>
          <td
            v-for="(value,_key) in tableList[1][0]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(1,_key)"
            />
          </td>
        </tr>
        <tr>
          <td class="leftThree">二楼</td>
          <td
            v-for="(value,_key) in tableList[1][1]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(1,_key)"
            />
          </td>
        </tr>
        <tr>
          <td class="leftThree">三楼</td>
          <td
            v-for="(value,_key) in tableList[1][2]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(1,_key)"
            />
          </td>
        </tr>
        <tr>
          <td class="leftTwo">厂外</td>
          <td class="leftThree">硫磺库外</td>
          <td
            v-for="(value,_key) in tableList[1][3]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(1,_key)"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="leftOne">小计</td>
          <td
            v-for="(value,_key) in tableList[1][4]"
            :key="_key"
            class="td-style"
          >
            <span>{{ value.value }}</span>
          </td>
        </tr>
        <!-- 第三个合计 -->
        <tr>
          <td class="leftOne">坏胶架</td>
          <td class="leftTwo" />
          <td class="leftThree" />
          <td
            v-for="(value,_key) in tableList[2][0]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(2,_key)"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="leftOne">胶架合计</td>
          <td
            v-for="(value,_key) in tableList[2][1]"
            :key="_key"
            class="td-style"
          >
            <span>{{ value.value }}</span>
          </td>
        </tr>
        <!-- 第四个合计 -->
        <tr>
          <td rowspan="2" class="leftOne">细料车（红）</td>
          <td rowspan="2" class="leftTwo">现场</td>
          <td class="leftThree">二楼</td>
          <td
            v-for="(value,_key) in tableList[3][0]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(3,_key)"
            />
          </td>
        </tr>
        <tr>
          <td class="leftThree">三楼</td>
          <td
            v-for="(value,_key) in tableList[3][1]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(3,_key)"
            />
          </td>
        </tr>
        <tr>
          <td rowspan="2" class="leftOne">细料车（绿）</td>
          <td rowspan="2" class="leftTwo">现场</td>
          <td class="leftThree">二楼</td>
          <td
            v-for="(value,_key) in tableList[3][2]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(3,_key)"
            />
          </td>
        </tr>
        <tr>
          <td class="leftThree">三楼</td>
          <td
            v-for="(value,_key) in tableList[3][3]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(3,_key)"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="leftOne">小计</td>
          <td
            v-for="(value,_key) in tableList[3][4]"
            :key="_key"
            class="td-style"
          >
            <span>{{ value.value }}</span>
          </td>
        </tr>
        <!-- 第五个合计 -->
        <tr>
          <td rowspan="2" class="leftOne">自制硫磺箱</td>
          <td rowspan="2" class="leftTwo">现场</td>
          <td class="leftThree">二楼</td>
          <td
            v-for="(value,_key) in tableList[4][0]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(4,_key)"
            />
          </td>
        </tr>
        <tr>
          <td class="leftThree">三楼</td>
          <td
            v-for="(value,_key) in tableList[4][1]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(4,_key)"
            />
          </td>
        </tr>
        <tr>
          <td rowspan="2" class="leftOne">购买硫磺箱</td>
          <td rowspan="2" class="leftTwo">现场</td>
          <td class="leftThree">二楼</td>
          <td
            v-for="(value,_key) in tableList[4][2]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(4,_key)"
            />
          </td>
        </tr>
        <tr>
          <td class="leftThree">三楼</td>
          <td
            v-for="(value,_key) in tableList[4][3]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(4,_key)"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="leftOne">小计</td>
          <td
            v-for="(value,_key) in tableList[4][4]"
            :key="_key"
            class="td-style"
          >
            <span>{{ value.value }}</span>
          </td>
        </tr>
        <!-- 第六个合计 -->
        <tr>
          <td class="leftOne">圆桶（单配）</td>
          <td class="leftTwo">现场</td>
          <td class="leftThree">三楼</td>
          <td
            v-for="(value,_key) in tableList[5][0]"
            :key="_key"
            class="td-style"
          >
            <span v-if="isExport">{{ value.value }}</span>
            <el-input-number
              v-else
              v-model="value.value"
              style="width:100px"
              size="mini"
              controls-position="right"
              @change="handleChange(5,_key)"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="leftOne">小计</td>
          <td
            v-for="(value,_key) in tableList[5][1]"
            :key="_key"
            class="td-style"
          >
            <span>{{ value.value }}</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { setDate, exportExcel } from '@/utils'
import { toolManageAccount } from '@/api/base_w_five'
export default {
  name: 'WorkClothesBook',
  data() {
    return {
      search: { date_time: setDate(false, false, 'month') },
      btnExportLoad: false,
      btnLoading: false,
      loading: false,
      isExport: false,
      day: [],
      month: '',
      tableList: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    async getList() {
      try {
        if (!this.search.date_time) {
          this.$message('请选择月份')
          return
        }
        const a = new Date(this.search.date_time)
        const y = a.getFullYear()
        const m = a.getMonth() + 1
        this.day = new Date(y, m, 0).getDate()
        this.month = m
        this.tableList = []
        this.loading = true
        const data = await toolManageAccount('get', null, { params: this.search })
        if (data.results.details.length) {
          this.tableList = data.results.details || []
        } else {
          this.initialData()
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    initialData() {
      for (let key = 1; key < this.day + 1; key++) {
        for (let indexFa = 0; indexFa < 6; indexFa++) {
          if (!this.tableList[indexFa]) {
            this.$set(this.tableList, indexFa, [])
          }
          const _arr = [8, 5, 2, 5, 5, 2]
          for (let index = 0; index < _arr[indexFa]; index++) {
            if (!this.tableList[indexFa][index]) {
              this.$set(this.tableList[indexFa], index, [])
            }
            this.tableList[indexFa][index].push({ value: undefined })
          }
        }
      }
    },
    handleChange(faIndex, key) {
      let sum = 0
      this.tableList[faIndex].forEach((d, i) => {
        if (i !== this.tableList[faIndex].length - 1 && Number(d[key].value)) {
          sum += Number(d[key].value)
        }
      })
      if (faIndex !== 2) {
        this.$set(this.tableList[faIndex][this.tableList[faIndex].length - 1][key], 'value', sum)
      }

      let sumA = 0
      if ([0, 1, 2].includes(faIndex)) {
        let a = this.tableList[0][this.tableList[0].length - 1][key].value
        a = a ? Number(a) : 0
        let b = this.tableList[1][this.tableList[1].length - 1][key].value
        b = b ? Number(b) : 0
        let c = this.tableList[2][0][key].value
        c = c ? Number(c) : 0
        sumA = a + b + c

        this.$set(this.tableList[2][this.tableList[2].length - 1][key], 'value', sumA)
      }
    },
    async exportTable() {
      this.btnExportLoad = true
      this.loading = true
      setTimeout(d => {
        this.isExport = true
        setTimeout(d => {
          exportExcel('工装管理台账', 'disposal-list-components')
          this.isExport = false
          this.btnExportLoad = false
          this.loading = false
        }, 1000)
      }, 100)
    },
    async submitFun() {
      try {
        const obj = {
          'date_time': this.search.date_time,
          details: this.tableList
        }
        this.btnLoading = true
        await toolManageAccount('post', null, { data: obj })
        this.$message.success('保存成功')
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .table-fa{
        overflow-x:scroll;
    }

    //
 .table_wrap{
  width:100%;
  overflow: auto;
  border-top:1px solid #000;
}
table {
  table-layout: fixed;
  width: 100%;
  border-collapse:separate;
  border-spacing:0;
  border:0;
}

td, th{
    width:130px;
    height: 30px;
     text-align: center;
    box-sizing: border-box;
    border-right:1px solid #000;
    border-bottom:1px solid #000;
    /*超出长度...*/
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

   .info-table {
      td,th {
        padding: 2px 0;
      }
    }

    .leftOne, .leftTwo,.leftThree{
       position:sticky;
      left:0;
      background:#FFF;
      border-left:1px solid #000;
      z-index:2;
    }
    .leftTwo {
      left:130px;
      border-left:none;
    }
    .leftThree {
      left:195px;
      border-left:none;
    }
</style>
