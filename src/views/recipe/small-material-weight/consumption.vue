<template>
  <div>
    <label style="margin-right:10px;">配料设备</label>
    <selectBatchingEquip v-model="equipValue" :created-is="true" :is-default="true" :multiple-is="true" @changeFun="selectBatchEquip" />
    <!-- 物料消耗报表 -->
    <div v-for="(item,index) in allTable" :key="index" class="cardBoxMy">
      <h3 style="margin-left:10px">{{ item.equip_no }}物料消耗报表</h3>
      <el-form :inline="true">
        <el-form-item label="计划编号">
          <el-input v-model="item.search.planid" clearable placeholder="计划编号" @input="debounceListChange(item,index)" />
        </el-form-item>
        <el-form-item label="配方编号">
          <el-input v-model="item.search.recipe" clearable placeholder="配方编号" @input="debounceListChange(item,index)" />
        </el-form-item>
        <el-form-item label="计划创建日期">
          <el-date-picker
            v-model="item.search.c_time"
            type="daterange"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changeList(item,index)"
          />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        :data="item.tableList"
        style="width: 100%"
        border
        max-height="400px"
      >
        <el-table-column
          prop="planid"
          label="计划编号"
          min-width="20"
        />
        <el-table-column
          prop="grouptime"
          label="班时"
          min-width="20"
        />
        <el-table-column
          prop="recipe"
          label="配方编号"
          min-width="20"
        />
        <el-table-column
          prop="recipe_ver"
          label="配方版本"
          min-width="20"
        />
        <el-table-column
          prop="setno"
          label="设定车数"
          min-width="20"
        />
        <el-table-column
          prop="车次"
          label="完成车数"
          min-width="20"
        />
        <el-table-column
          prop="material"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="时间"
          label="称量耗时"
          min-width="20"
        />
        <el-table-column
          prop="set_weight"
          label="设定重量"
          min-width="20"
        />
        <el-table-column
          prop="act_weight"
          label="实际重量"
          min-width="20"
        />
        <el-table-column
          prop="warning"
          label="检量"
          min-width="20"
          :formatter="(row)=>{
            if(row.warning === null){
              return '--'
            }
            if(Number(row.warning) === 1){
              return '不合格'
            }
            return '合格'
          }"
        />
        <el-table-column
          prop="set_error"
          label="设定误差"
          min-width="20"
        />
        <el-table-column
          prop="act_error"
          label="实际误差"
          min-width="20"
        />
      </el-table>
      <page
        :old-page="false"
        :total="item.total"
        :current-page="item.search.page"
        @currentChange="currentChange(arguments,item,index)"
      />
    </div>
  </div>
</template>

<script>
import { debounce, setDate } from '@/utils'
import selectBatchingEquip from '../components/select-batching-equip'
import { xlReportWeight } from '@/api/base_w_three'
import page from '@/components/page'
export default {
  name: 'SmallMaterialWeightTrainNumber',
  components: { selectBatchingEquip, page },
  data() {
    return {
      equipValue: [],
      options: [],
      currentSearch: {},
      currentIndex: '',
      loading: true,
      allTable: []
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await xlReportWeight('get', null, { params: this.currentSearch })
        this.loading = false
        return { data: data.results || [], total: data.count || 0 }
      } catch (e) {
        this.loading = false
      }
    },
    debounceListChange(row, index) {
      row.search.page = 1
      this.currentSearch = { ...row.search, equip_no: row.equip_no }
      this.currentIndex = index
      debounce(this, 'debounceList')
    },
    currentChange(arguments1, row, index) {
      var arr = [].slice.call(arguments1, 0)
      row.search.page = arr[0]
      row.search.page_size = arr[1]
      this.debounceList(row, index)
    },
    changeList(row, index) {
      row.search.page = 1
      this.debounceList(row, index)
    },
    async debounceList(row, index) {
      try {
        if (row) {
          this.currentSearch = { ...row.search, equip_no: row.equip_no }
          this.currentIndex = index
        }
        const b = this.allTable[this.currentIndex].search.c_time
        this.currentSearch.st = b ? b[0] : ''
        this.currentSearch.et = b ? b[1] : ''
        if (getDaysBetween(this.currentSearch.st, this.currentSearch.et) > 30) {
          this.$message('查询日期间隔不得超过31天')
          return
        }
        //   获取当前改变的那个列表 替换上去
        const data = await this.getList()
        this.allTable[this.currentIndex].tableList = data.data
        this.allTable[this.currentIndex].total = data.total
      } catch (e) {
        //
      }
    },
    selectBatchEquip(val) {
      const record = this.allTable
      if (val) {
        this.allTable = []
        val.forEach(async d => {
          this.currentSearch = {
            equip_no: d.equip_no
          }
          const b = this.allTable.filter(D => D.equip_no === d.equip_no)
          if (b.length === 0) {
            const c = record.filter(D => D.equip_no === d.equip_no)
            if (c.length > 0) {
              this.allTable.push(...c)
            } else {
              const a = await this.getList()
              this.allTable.push(
                {
                  equip_no: d.equip_no,
                  search: {
                    c_time: [getNextDate(setDate(), -31), setDate()]
                  },
                  tableList: a.data,
                  total: a.total
                }
              )
            }
          }
        })
      }
    }
  }
}
function getNextDate(date, day) {
  var dd = new Date(date)
  dd.setDate(dd.getDate() + day)
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
  return y + '-' + m + '-' + d
}
function getDaysBetween(dateString1, dateString2) {
  var startDate = Date.parse(dateString1)
  var endDate = Date.parse(dateString2)
  if (startDate > endDate) {
    return 0
  }
  if (startDate === endDate) {
    return 1
  }
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
  return days
}

</script>

<style lang='scss' scoped>
    .cardBoxMy{
        border:1px solid #eee;
        padding:5px;
        margin-top:6px;
    }
</style>
