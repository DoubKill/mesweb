<template>
  <div>
    <label style="margin-right:10px;">配料设备</label>
    <selectBatchingEquip v-model="equipValue" :created-is="true" :is-default="true" :multiple-is="true" @changeFun="selectBatchEquip" />
    <!-- 配方管理 -->
    <div v-for="(item,index) in allTable" :key="index" class="cardBoxMy">
      <h3 style="margin-left:10px">{{ item.equip_no }}配方</h3>
      <el-form :inline="true">
        <el-form-item label="配方名称">
          <el-input v-model="item.search.name" clearable placeholder="配方名称" @input="debounceListChange(item,index)" />
        </el-form-item>
        <el-form-item label="版本">
          <el-input v-model="item.search.ver" clearable placeholder="版本" @input="debounceListChange(item,index)" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="item.search.remark1" clearable placeholder="备注" @input="debounceListChange(item,index)" />
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker
            v-model="item.search.materialCreateTimes"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="changeList(item,index)"
          />
        </el-form-item>
        <el-form-item label="是否使用">
          <el-select v-model="item.search.use_not" clearable placeholder="请选择" @change="changeList(item,index)">
            <el-option
              v-for="itemChild in [{name:'已使用',value:0},{name:'未使用',value:1}]"
              :key="itemChild.value"
              :label="itemChild.name"
              :value="itemChild.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-row v-loading="currentIndex===index&&loading">
        <el-col :span="14">
          <el-table
            ref="singleTable"
            :data="item.tableList"
            style="width: 100%"
            highlight-current-row
            border
            max-height="400px"
            @current-change="handleCurrentChange($event,item,index)"
          >
            <el-table-column
              prop="name"
              label="配方名称"
              min-width="40"
            />
            <el-table-column
              prop="ver"
              label="版本"
              min-width="15"
            />
            <el-table-column
              prop="weight"
              label="重量（kg）"
              min-width="20"
            />
            <el-table-column
              prop="error"
              label="总误差"
              min-width="20"
            />
            <el-table-column
              prop="remark1"
              label="备注"
              min-width="20"
            />
            <el-table-column
              prop="time"
              label="修改时间"
              min-width="20"
            />
            <el-table-column
              prop="use_not"
              label="是否使用"
              min-width="20"
              :formatter="(row)=>{
                if(row.use_not){
                  return '未使用'
                }
                return '已使用'
              }"
            />
            <el-table-column label="上传到MES" min-width="20">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="uploadMes(scope.row,index)"
                >上传
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <page
            :old-page="false"
            :total="item.total"
            :current-page="item.search.page"
            @currentChange="currentChange(arguments,item,index)"
          />
        </el-col>
        <el-col :span="10">
          <el-table
            :data="item.tableList1"
            style="width: 100%"
            border
            max-height="400px"
          >
            <el-table-column
              prop="id"
              label="序号"
              min-width="20"
            />
            <el-table-column
              prop="name"
              label="称量物料"
              min-width="20"
            />
            <el-table-column
              prop="weight"
              label="设定重量（kg）"
              min-width="20"
            />
            <el-table-column
              prop="error"
              label="误差（kg）"
              min-width="20"
            />
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import selectBatchingEquip from '../components/select-batching-equip'
import { xlRecipe, xlRecipeMaterial } from '@/api/base_w_three'
import page from '@/components/page'
export default {
  name: 'SmallMaterialWeightFormula',
  components: { selectBatchingEquip, page },
  data() {
    return {
      equipValue: [],
      options: [],
      currentIndex: null,
      currentSearch: {},
      allTable: [],
      loading: false
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await xlRecipe('get', null, { params: this.currentSearch })
        if (this.$refs['singleTable'] && this.currentIndex) {
          //   去掉当前操作的列表的 单行选中
          this.allTable[this.currentIndex].tableList1 = []
          this.$refs['singleTable'][this.currentIndex].setCurrentRow()
        }
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
        const a = this.allTable[this.currentIndex].search.materialCreateTimes
        this.currentSearch.st = a ? a[0] : ''
        this.currentSearch.et = a ? a[1] : ''

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
                  search: {},
                  tableList: a.data,
                  total: a.total,
                  tableList1: []
                }
              )
            }
          }
        })
      }
    },
    async handleCurrentChange(val, item, index) {
      // 当前的表格是哪个表格
      this.currentIndex = index
      try {
        const data = await xlRecipeMaterial('get', null, { params: { equip_no: item.equip_no, recipe_name: val.name }})
        this.allTable[index].tableList1 = data || []
      } catch (e) {
        //
      }
    },
    async uploadMes(row, faI) {
      try {
        await xlRecipe('post', null, { data: { equip_no: this.allTable[faI].equip_no, recipe_name: row.name, total_standard_error: row.error }})
        this.$message.success('上传成功')
      } catch (e) {
        //
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
