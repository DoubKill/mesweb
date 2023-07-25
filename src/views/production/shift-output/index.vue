<template>
  <div v-loading="loading">
    <!-- 各班产量统计 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker v-model="search.target_month" type="month" value-format="yyyy-MM" format="yyyy-MM" placeholder="选择月" :clearable="false" @change="getList" />
      </el-form-item>
      <el-form-item label="班组">
        <el-select v-model="groud" placeholder="请选择" @change="changeGroup">
          <el-option v-for="groupItem in groups" :key="groupItem.id" :label="groupItem.global_name" :value="groupItem.global_name" />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="td_flag" @change="getList">是否包含当日产量</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="btnExportLoad" @click="exportTable(1)">导出Excel</el-button>
      </el-form-item>
      <el-form-item>
        <h3 style="display: inline-block;margin:0">单位：车</h3>
      </el-form-item>
    </el-form>
    <el-table :id="type===1?'out-table':''" :data="tableData" border style="width: 100%" :span-method="arraySpanMethod">
      <el-table-column prop="equip_no" label="机台" width="60" :fixed="!btnExportLoad" />
      <el-table-column :key="1" label="日期" align="center">
        <el-table-column label="班次" align="center">
          <el-table-column label="班别" width="50" align="center" />
        </el-table-column>
      </el-table-column>
      <el-table-column prop="target_trains" label="目标值" width="60" align="center" />
      <el-table-column prop="total_trains" label="总产量" width="60" align="center" />
      <el-table-column prop="dailyOutput" label="日均产量" width="70" align="center" />
      <el-table-column prop="completionRate" label="完成率" width="80" align="center" />
      <el-table-column v-for="(item,_key) in headDataNew" :key="_key+new Date().getTime()" align="center" :label="_key.split('-')[0]">
        <el-table-column :label="_key.split('-')[1]" align="center">
          <el-table-column :label="item" align="center">
            <template slot-scope="{row}">
              {{ row[_key+'-'+item]||'' }}
              {{ row[_key]||'' }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-button v-permission="['equip_fault_signal', 'export']" style="margin-top:5px" type="primary" :disabled="btnExportLoad" @click="exportTable(2)">导出单班班组产量</el-button>
    <el-table :id="type===2?'out-table':''" :data="tableData1" border style="width: 100%" :span-method="arraySpanMethod">
      <el-table-column prop="equip_no" label="机台" width="60" :fixed="!btnExportLoad" />
      <el-table-column :key="1" label="日期" align="center">
        <el-table-column label="班次" align="center">
          <el-table-column label="班别" width="50" align="center" />
        </el-table-column>
      </el-table-column>
      <el-table-column prop="target_trains" label="目标值" width="60" align="center" />
      <el-table-column prop="total_trains" label="总产量" width="60" align="center" />
      <el-table-column prop="dailyOutput" label="日均产量" width="70" align="center" />
      <el-table-column prop="completionRate" label="完成率" width="80" align="center" />
      <el-table-column v-for="(item,_key) in headDataGroup" :key="_key+new Date().getTime()" align="center" :label="_key.split('-')[0]">
        <el-table-column :label="_key.split('-')[1]" align="center">
          <el-table-column :label="item" align="center">
            <template slot-scope="{row}">
              {{ row[_key+'-'+item] }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { setDate, exportExcel } from '@/utils'
import { shiftProductionSummary } from '@/api/base_w_five'
import { globalCodesUrl } from '@/api/base_w'
export default {
  name: 'ShiftOutputIndex',
  data() {
    return {
      search: {
        target_month: setDate(null, null, 'month'),
      },
      td_flag: false,
      groud: '',
      tableData: [],
      headData: {},
      btnExportLoad: false,
      type: 1,
      loading: false,
      headDataGroup: [],
      tableData1: [],
      headDataNew: {},
      groups: []
    }
  },
  async created() {
    await this.getClassGroup()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        this.search.group_name = this.groud

        this.search.td_flag = this.td_flag ? 'Y' : undefined
        const data = await shiftProductionSummary('get', null, { params: this.search })
        this.headData = data.table_head || []
        this.tableData = data.data || []
        this.loading = false
        this.changeList()
      } catch (e) {
        this.loading = false
      }
    },
    changeGroup() {
      this.getList()
    },
    changeList() {
      const obj = {}
      const arrOne = []
      for (const key in this.headData) {
        if (Object.hasOwnProperty.call(this.headData, key)) {
          const element = this.headData[key]
          const _groud = this.groud.split('')
          if (element.indexOf(_groud[0]) > -1) {
            obj[key] = element
          }
          arrOne.push(key + ':' + element)
        }
      }
      // 头部插入总计
      let str = ''
      const arrTwo = []
      arrOne.forEach((d, i) => {
        if (!str) {
          arrTwo.push(d)
          str = d.split('-')[0]
        } else if (str === d.split('-')[0]) {
          arrTwo.push(d)
        } else {
          arrTwo.push(str + '-总计:')
          arrTwo.push(d)
          str = d.split('-')[0]
        }
        if (arrOne.length === i + 1) {
          arrTwo.push(str + '-总计:')
        }
      })
      const _obj = {}
      arrTwo.forEach(b => {
        const a = b.split(':')[0]
        const c = b.split(':')[1]
        _obj[a] = c
      })
      this.headDataNew = _obj
      // 头部插入总计end
      this.headDataGroup = obj || {}
      const arr = []
      this.tableData.forEach(d => {
        // 计算日均产量（日均产量=total_trains/days）和完成率（日均产量/目标值）
        d.dailyOutput = d.total_trains && d.days ? Math.round((d.total_trains / d.days / 2) * 100) / 100 : ''
        d.completionRate = d.dailyOutput && d.target_trains ? Math.round((d.dailyOutput / d.target_trains / 2 * 100) * 100) / 100 + '%' : ''
        // end
        // 获取每一排的不重复日期 总计使用
        let arrDay = []
        Object.keys(d).forEach(keyD => {
          if (keyD.split('-').length > 1) {
            arrDay.push(keyD.split('-')[0])
          }
        })
        arrDay = [...new Set(arrDay)]
        // end
        arrDay.forEach(dd => { // 计算总计
          d[dd + '-总计'] = this.setTotal(d, dd)
        })

        const obj1 = { total_trains: 0 }
        for (const key in d) {
          if (Object.hasOwnProperty.call(d, key)) {
            const element = d[key]
            obj1.equip_no = d.equip_no
            obj1.days = d.group_days
            obj1.target_trains = d.target_trains
            // 单独计算总产量给班组列表用
            const _groud = this.groud.split('')
            if (key.indexOf(_groud[0]) > -1) {
              obj1[key] = Number(element)
              obj1.total_trains += element
            }
          }
        }
        // 获取每一排的不重复日期 班组列表使用
        let arrDay1 = []
        Object.keys(this.headData).forEach(keyD => {
          if (keyD.split('-').length > 1) {
            arrDay1.push(keyD.split('-')[0])
          }
        })
        arrDay1 = [...new Set(arrDay1)]
        // end
        obj1.total_trains = obj1.total_trains ? Math.round(obj1.total_trains * 100) / 100 : ''
        // 计算日均产量（日均产量=total_trains/days）
        // 完成率（日均产量/目标值）   班组列表使用
        obj1.dailyOutput = obj1.total_trains && obj1.days ? Math.round((obj1.total_trains / obj1.days) * 100) / 100 : ''
        obj1.completionRate = obj1.dailyOutput && obj1.target_trains ? Math.round((obj1.dailyOutput / obj1.target_trains * 100) * 100) / 100 + '%' : ''
        // end
        arr.push(obj1)
      })
      this.tableData1 = arr || []
    },
    setTotal(d, str) {
      let strNum = 0
      for (const key in d) {
        if (Object.hasOwnProperty.call(d, key)) {
          const element = d[key]
          if (key.split('-').length > 1) {
            if (key.split('-')[0] === str) {
              strNum += element
            }
          }
        }
      }
      return Math.round(strNum * 100) / 100
    },
    getClassGroup(val) {
      globalCodesUrl('get', {
        params: {
          class_name: '班组'
        }
      }).then((response) => {
        this.groups = response.results
        this.groud = this.groups[0].global_name
        this.getList()
      }).catch(function() {
        this.groups = []
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return [1, 2]
      } else if (columnIndex === 1) {
        return [0, 0]
      }
    },
    exportTable(type) {
      this.type = type
      this.btnExportLoad = true
      setTimeout(d => {
        exportExcel(type === 1 ? '各班产量统计' : '单班班组产量', '综合合格率汇总')
        this.btnExportLoad = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
