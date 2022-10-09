<template>
  <div>
    <!-- MES配方变更履历 -->
    <el-form :inline="true">
      <el-form-item label="胶料名称">
        <el-input v-model="getParams.recipe_no" clearable @change="changeList" />
      </el-form-item>
      <el-form-item label="机型">
        <equip-category-select v-model="getParams.dev_type_id" clearable @changeFun="changeListType" />
      </el-form-item>
      <el-form-item label="修改时间范围">
        <el-date-picker
          v-model="datePicker"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="配方状态">
        <el-select v-model="getParams.used_types" multiple clearable placeholder="请选择" @change="changeList">
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
      v-loading="loading"
      element-loading-background="transparent"
      :data="tableData"
      border
      :span-method="objectSpanMethod"
    >
      <el-table-column
        prop="recipe_no"
        label="胶料名称"
        fixed
      >
        <template slot-scope="{row,$index}">
          <div>
            <span v-if="row.recipe_no" @click="tableLoad($index,row)">
              <i v-if="row._show" class="el-icon-arrow-down" />
              <i v-if="!row._show" class="el-icon-arrow-up" />
            </span>
            {{ row.recipe_no }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="dev_type"
        label="机型"
        width="50"
        fixed
      />
      <el-table-column
        prop="used_type"
        label="状态"
        width="50"
        fixed
        :formatter="usedTypeFormatter"
      />
      <el-table-column
        prop="created_time"
        label="创建时间"
        width="90"
        fixed
      />
      <el-table-column
        prop="created_username"
        label="创建人"
        width="80"
        fixed
      />
      <el-table-column
        prop="updated_username"
        label="修改人"
        width="80"
        fixed
      />
      <el-table-column
        prop="updated_time"
        label="修改时间"
        width="90"
        fixed
      />
      <el-table-column
        prop="变更履历"
        label="变更履历"
        width="100"
        fixed
      />
      <el-table-column
        v-for="(item) in headNum"
        :key="item"
        :label="`变更${item}`"
      >
        <template slot-scope="{row}">
          <span
            v-if="row.change_desc&&row.change_desc[item-1]"
            v-html="row.change_desc[item-1].val"
          />
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import EquipCategorySelect from '@/components/EquipCategorySelect'
import page from '@/components/page'
import { recipeChangeHistory } from '@/api/base_w_five'
export default {
  name: 'FormulaResume',
  components: { EquipCategorySelect, page },
  data() {
    return {
      getParams: {},
      datePicker: [],
      options: [{
        value: 1, label: '编辑'
      }, {
        value: 2, label: '提交'
      }, {
        value: 4, label: '启用'
      }, {
        value: 7, label: '停用'
      }, {
        value: 5, label: '驳回'
      }, {
        value: 6, label: '废弃'
      }
      ],
      tableData: [],
      total: 0,
      loading: false,
      SelectEquipOptions: [],
      headNum: 0,
      spanArr: [],
      pos: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const obj = JSON.parse(JSON.stringify(this.getParams))
        obj.used_types = this.getParams.used_types ? this.getParams.used_types.join(',') : ''
        const data = await recipeChangeHistory('get', null, { params: obj })
        this.headNum = 0
        const arr = []
        if (data.results.length) {
          for (let i = 0; i < data.results.length; i++) {
            const D = data.results[i]
            if (D.change_desc.length > this.headNum) {
              this.headNum = D.change_desc.length
            }
            for (let index = 0; index < 2; index++) {
              const val = index === 0 ? '变更日期' : '变更内容'
              const arr1 = []
              D.change_desc.forEach(dd => {
                if (index === 0) {
                  arr1.push({
                    val: dd.changed_time__date
                  })
                }
                if (index === 1) {
                  arr1.push({
                    val: dd.desc
                  })
                }
              })
              arr.push({ ...D, change_desc: arr1, '变更履历': val, _id: D.id + val })
            }
          }
        }
        this.tableData = arr
        this.setData()
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    setData() {
      this.spanArr = []
      this.pos = null
      if (this.tableData.length) {
        for (let i = 0; i < this.tableData.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1)
            this.pos = 0
          } else {
            if (this.tableData[i].recipe_no && this.tableData[i].recipe_no === this.tableData[i - 1].recipe_no && this.tableData[i].equip_no === this.tableData[i - 1].equip_no) {
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
      }
    },
    changeList() {
      this.getParams.st = this.datePicker ? this.datePicker[0] : ''
      this.getParams.et = this.datePicker ? this.datePicker[1] : ''
      this.getParams.page = 1
      this.getList()
    },
    changeListType(val) {
      this.getParams.dev_type_id = val ? val.id : ''
      this.getParams.dev_type = val ? val.category_name : ''
      this.getParams.page = 1
      this.getList()
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
    },
    async tableLoad(_index, row) {
      row._show = !row._show
      row._childNum = 11
      let current_index = _index
      if (row._show) {
        this.tableData = this.tableData.filter((d, _i) => {
          if (_index !== _i) {
            if (d._show) {
              if (_i < current_index) {
                current_index = current_index - 11
              }
            }
            d._show = false
          }
          return !d._listShow
        })
        try {
          const data = await recipeChangeHistory('get', row.id)
          const resumeName = ['MES配方', '投料方式', '称量误差', '提交人', '提交时间', '确认人', '确认时间', '群控下传人', '群控下传时间', '称量下传人', '称量下传时间']
          const resumeList = []
          resumeName.forEach((d, i) => {
            resumeList[i] = {
              '变更履历': d,
              change_desc: [],
              _listShow: true
            }
          })
          for (let index = 0; index < data.change_details.length; index++) {
            const d = data.change_details[index]
            const object = d.details ? JSON.parse(d.details) : {}
            console.log(object, 'object')
            let str1 = '<span style="font-weight: 700;">胶料</span>：<br>'
            let str2 = '<span style="font-weight: 700;">炭黑</span>：<br>'
            let str3 = '<span style="font-weight: 700;">油料</span>：<br>'
            let str4 = '<span style="font-weight: 700;">料包</span>：<br>'
            let weighing1 = '<span style="font-weight: 700;">胶料</span>：<br>'
            let weighing2 = '<span style="font-weight: 700;">炭黑</span>：<br>'
            let weighing3 = '<span style="font-weight: 700;">油料</span>：<br>'
            let weighing4 = '<span style="font-weight: 700;">料包</span>：<br>'
            let feeding1 = '<span style="font-weight: 700;">胶料</span>：<br>'
            let feeding2 = '<span style="font-weight: 700;">炭黑</span>：<br>'
            let feeding3 = '<span style="font-weight: 700;">油料</span>：<br>'
            let feeding4 = '<span style="font-weight: 700;">料包</span>：<br>'
            for (const key in object) {
              if (Object.hasOwnProperty.call(object, key)) {
                const element = object[key]
                element.forEach(dd => {
                  if (Number(key) === 1) {
                    if (dd.type === 1) {
                      str1 = this.seta(dd, str1)
                    }
                    if (dd.type === 2) {
                      str2 = this.seta(dd, str2)
                    }
                    if (dd.type === 3) {
                      str3 = this.seta(dd, str3)
                    }
                    if (dd.type === 4) {
                      str4 = this.seta(dd, str4)
                    }
                  }
                  if (Number(key) === 3) {
                    if (dd.type === 1) {
                      weighing1 = this.seta(dd, weighing1)
                    }
                    if (dd.type === 2) {
                      weighing2 = this.seta(dd, weighing2)
                    }
                    if (dd.type === 3) {
                      weighing3 = this.seta(dd, weighing3)
                    }
                    if (dd.type === 4) {
                      weighing4 = this.seta(dd, weighing4)
                    }
                  }
                  if (Number(key) === 2) {
                    if (dd.type === 1) {
                      feeding1 = this.seta(dd, feeding1)
                    }
                    if (dd.type === 2) {
                      feeding2 = this.seta(dd, feeding2)
                    }
                    if (dd.type === 3) {
                      feeding3 = this.seta(dd, feeding3)
                    }
                    if (dd.type === 4) {
                      feeding4 = this.seta(dd, feeding4)
                    }
                  }
                })
              }
            }
            if (index === 0) {
              resumeList[0].change_desc[index] = { val: '新增' }
              resumeList[1].change_desc[index] = { val: '新增' }
              resumeList[2].change_desc[index] = { val: '新增' }
            } else {
              resumeList[0].change_desc[index] = { val: str1 + '<br>' + str2 + '<br>' + str3 + '<br>' + str4 }
              resumeList[1].change_desc[index] = { val: feeding1 + '<br>' + feeding2 + '<br>' + feeding3 + '<br>' + feeding4 }
              resumeList[2].change_desc[index] = { val: weighing1 + '<br>' + weighing2 + '<br>' + weighing3 + '<br>' + weighing4 }
            }
            resumeList[3].change_desc[index] = { val: d.submit_username }
            resumeList[4].change_desc[index] = { val: d.submit_time }
            resumeList[5].change_desc[index] = { val: d.confirm_username }
            resumeList[6].change_desc[index] = { val: d.confirm_time }
            resumeList[7].change_desc[index] = { val: d.sfj_down_username }
            resumeList[8].change_desc[index] = { val: d.sfj_down_time }
            resumeList[9].change_desc[index] = { val: d.weight_down_username }
            resumeList[10].change_desc[index] = { val: d.weight_down_time }
          }
          this.tableData.splice(current_index + 2, 0, ...resumeList)
        } catch (e) {
        //
        }
      } else {
        this.tableData.splice(current_index + 2, row._childNum)
      }
      this.loading = true
      setTimeout(d => {
        this.setData()
        this.loading = false
      })
    },
    seta(dd, jiaoliao) {
      if (dd.flag === '新增') {
        jiaoliao += `${dd.flag}: ${dd.key}(${dd.cv})<br>`
      }
      if (dd.flag === '删除') {
        if (dd.cv || dd.cv === 0) {
          jiaoliao += `${dd.flag}: ${dd.key}(${dd.cv})<br>`
        } else {
          jiaoliao += `${dd.flag}: ${dd.key}<br>`
        }
      }
      if (dd.flag === '修改') {
        if (dd.pv || dd.pv === 0) {
          jiaoliao += `${dd.flag}: ${dd.key}(${dd.pv}→${dd.cv})<br>`
        } else {
          jiaoliao += `${dd.flag}: ${dd.key}(${dd.cv})<br>`
        }
      }
      return jiaoliao
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 7 && this.spanArr) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    usedTypeFormatter: function(row, column) {
      return this.usedTypeChoice(row.used_type)
    },
    usedTypeChoice: function(usedType) {
      switch (usedType) {
        case 1:
          return '编辑'
        case 2:
          return '提交'
        case 3:
          return '校对'
        case 4:
          return '启用'
        case 5:
          return '驳回'
        case 7:
          return '停用'
        case 6:
          return '废弃'
      }
    }
  }
}
</script>

<style>

</style>
