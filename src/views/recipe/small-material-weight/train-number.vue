<template>
  <div>
    <label style="margin-right:10px;">配料设备</label>
    <selectBatchingEquip v-model="equipValue" :created-is="true" :is-default="true" :multiple-is="true" @changeFun="selectBatchEquip" />
    <!-- 车次报表 -->
    <div v-for="(item,index) in allTable" :key="index" class="cardBoxMy">
      <h3 style="margin-left:10px">{{ item.equip_no }}车次报表</h3>
      <el-form :inline="true">
        <el-form-item label="计划编号">
          <el-input v-model="item.search.planid" clearable placeholder="计划编号" @input="debounceListChange(item,index)" />
        </el-form-item>
        <el-form-item label="配方编号">
          <el-input v-model="item.search.recipe" clearable placeholder="配方编号" @input="debounceListChange(item,index)" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="item.search.s_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="debounceList(item,index)"
          />
        </el-form-item>
        <el-form-item label="计划创建日期">
          <el-date-picker
            v-model="item.search.c_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="debounceList(item,index)"
          />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        :data="item.tableList"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="planid"
          label="计划编号"
          min-width="20"
        />
        <el-table-column
          prop="starttime"
          label="开始时间"
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
          prop="actno"
          label="完成车数"
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
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import selectBatchingEquip from '../components/select-batching-equip'
import { xlReportBasic } from '@/api/base_w_three'
export default {
  name: 'SmallMaterialWeightTrainNumber',
  components: { selectBatchingEquip },
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
        const data = await xlReportBasic('get', null, { params: this.currentSearch })
        this.loading = false
        return data
      } catch (e) {
        this.loading = false
      }
    },
    debounceListChange(row, index) {
      this.currentSearch = { ...row.search, equip_no: row.equip_no }
      this.currentIndex = index
      debounce(this, 'debounceList')
    },
    async debounceList(row, index) {
      try {
        if (row) {
          this.currentSearch = { ...row.search, equip_no: row.equip_no }
          this.currentIndex = index
        }
        const a = this.allTable[this.currentIndex].search.s_time
        this.currentSearch.s_st = a ? a[0] : ''
        this.currentSearch.s_et = a ? a[1] : ''
        const b = this.allTable[this.currentIndex].search.c_time
        this.currentSearch.c_st = b ? b[0] : ''
        this.currentSearch.c_et = b ? b[1] : ''
        //   获取当前改变的那个列表 替换上去
        const data = await this.getList()
        this.allTable[this.currentIndex].tableList = data
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
                  search: {},
                  tableList: a
                }
              )
            }
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
    .cardBoxMy{
        border:1px solid #eee;
        padding:5px;
        margin-top:6px;
    }
</style>
