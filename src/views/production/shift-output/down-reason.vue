<template>
  <div>
    <!-- 各机台停机原因分析 -->
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="search.select_date"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择日期"
          :clearable="false"
          @change="dateSearch"
        />
      </el-form-item>
      <el-form-item label="班组">
        <el-select
          v-model="search.group"
          placeholder="请选择"
          @change="groupChange"
        >
          <el-option
            v-for="(item,key) in optionsGroup"
            :key="key"
            :label="item.group__global_name"
            :value="item.group__global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="机台">
        <el-select
          v-model="search.equip_no"
          placeholder="请选择"
          @change="getList(false)"
        >
          <el-option
            v-for="item in optionsEquip"
            :key="item.id"
            :label="item.equip_no"
            :value="item.equip_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班次">
        <el-input
          v-model="search.classes"
          disabled
        />
      </el-form-item>
      <el-form-item>
        <el-button v-if="search.equip_no&&search.group" v-permission="['equip_down_analysis','add']" :disabled="loadingBtn" type="primary" @click="saveAll">
          全部保存
        </el-button>
        <el-button type="primary" @click="lookAll">
          查看全部
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      max-height="600px"
    >
      <el-table-column
        label="时间区间"
        min-width="40"
      >
        <template slot-scope="{row}">
          <el-time-select
            v-model="row.begin_time"
            :clearable="false"
            placeholder="起始时间"
            :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '23:58'
            }"
            @change="changeTime(row)"
          />
          -
          <el-time-select
            v-model="row.end_time"
            :clearable="false"
            placeholder="结束时间"
            :picker-options="{
              start: '00:01',
              step: '00:01',
              end: '23:59'
            }"
            @change="changeTime(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="时间间隔/min"
        prop="times"
        min-width="20"
      />
      <el-table-column
        label="停机原因"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-input v-model="row.down_reason" />
        </template>
      </el-table-column>
      <el-table-column
        label="停机类型"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-select
            v-model="row.down_type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200px"
      >
        <template slot-scope="{row,$index}">
          <el-button
            v-if="search.equip_no&&search.group"
            v-permission="['equip_down_analysis','delete']"
            type="danger"
            :disabled="loadingBtn"
            @click="delSet(row,$index)"
          >
            删除</el-button>
          <el-button
            v-if="search.equip_no&&search.group"
            v-permission="['equip_down_analysis','add']"
            :disabled="loadingBtn"
            type="primary"
            @click="saveSet([row],$index)"
          >
            保存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:15px">
      <el-button
        v-if="search.equip_no&&search.group"
        size="small"
        :disabled="loadingBtn"
        @click="addSet"
      >插入一行</el-button>
    </div>
    <br>
    <el-table
      v-if="bottomTable"
      v-loading="bottomLoading"
      :data="tableDataAll"
      style="width: 100%"
      border
    >
      <el-table-column
        v-for="item in optionsEquip"
        :key="item.id"
        align="center"
        :label="item.equip_no"
      >
        <el-table-column
          width="100"
          align="center"
          label="时间区间"
        >
          <template slot-scope="{row}">
            <span>{{ row[item.equip_no+'-begin_time']+(row[item.equip_no+'-begin_time']?'-':'')+row[item.equip_no+'-end_time'] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          :prop="item.equip_no+'-times'"
          label="时间间隔/min"
        />
        <el-table-column
          align="center"
          :prop="item.equip_no+'-down_reason'"
          label="停机原因"
        />
        <el-table-column
          align="center"
          :prop="item.equip_no+'-down_type'"
          label="停机类型"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import { getEquip } from '@/api/banburying-performance-manage'
import { equipDownAnalysis } from '@/api/jqy'
import { classesListUrl } from '@/api/base_w'

export default {
  name: 'DownReason',
  components: { },
  data() {
    return {
      search: {
        group_flag: 1,
        select_date: setDate()
      },
      tableDataAll: [],
      optionsEquip: [],
      optionsGroup: [],
      bottomLoading: false,
      bottomTable: false,
      options: [],
      loadingBtn: false,
      tableData: [],
      loading: false
    }
  },
  created() {
    this.getList(true)
    this.getType()
    this.visibleChange()
  },
  methods: {
    visibleChange() {
      const obj = { all: 1, category_name: '密炼设备' }
      getEquip(obj).then(response => {
        this.optionsEquip = response.results
      })
    },
    async getList(val) {
      try {
        if (val) {
          this.search.group_flag = 1
          this.search.group = null
          this.search.classes = null
        } else {
          this.search.group_flag = 0
        }
        this.loading = true
        const data = await equipDownAnalysis('get', null, { params: this.search })
        this.optionsGroup = data.group_classes || []
        this.tableData = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getType() {
      const obj = { all: 1, class_name: '停机类型' }
      const data = await classesListUrl('get', null, { params: obj })
      this.options = data.results
    },
    delSet(row, index) {
      if (row.id) {
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          equipDownAnalysis('post', null, { data: { delete_ids: row.id }})
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.lookAll()
              this.tableData.splice(index, 1)
            }).catch(e => {
            //
            })
        })
      } else {
        this.tableData.splice(index, 1)
      }
    },
    groupChange() {
      this.search.classes = this.optionsGroup.find(d => this.search.group === d.group__global_name).classes__global_name
      this.getList()
    },
    dateSearch() {
      this.getList(true)
      this.lookAll()
    },
    async lookAll() {
      try {
        this.bottomTable = true
        var equip = ''
        this.optionsEquip.forEach(d => {
          equip += d.equip_no + ','
        })
        equip = equip.substring(0, equip.lastIndexOf(','))
        this.bottomLoading = true
        const data = await equipDownAnalysis('get', null, { params: { select_date: this.search.select_date, all_equip: equip }})
        this.tableDataAll = data.results || []
        this.bottomLoading = false
      } catch (e) {
        this.bottomLoading = false
      }
    },
    saveAll() {
      if (!this.tableData.length) {
        this.$message({
          message: '暂无可提交的数据!'
        })
        return
      }
      this.saveSet(this.tableData)
    },
    async saveSet(row) {
      try {
        row.forEach(d => {
          if (!d.begin_time || !d.end_time || !d.down_reason || !d.down_type) {
            throw new Error('每行数据必填')
          }
        })
        const arr = row
        this.loadingBtn = true
        await equipDownAnalysis('post', null, { data: { factory_date: this.search.select_date, equip_no: this.search.equip_no, group: this.search.group, classes: this.search.classes, set_data: arr }})
        this.$message.success('提交成功')
        this.loadingBtn = false
        this.getList()
        this.lookAll()
      } catch (e) {
        this.loadingBtn = false
        if (e.message === '每行数据必填') {
          this.$message(e.message)
        }
      }
    },
    changeTime(row) {
      if (row.begin_time && row.end_time) {
        if (row.begin_time <= row.end_time) {
          this.$set(row, 'times', getMinute(row.begin_time, row.end_time))
        } else {
          this.$set(row, 'times', getMinute('2022-01-01 ' + row.begin_time, '2022-01-02 ' + row.end_time))
        }
      }
    },
    addSet() {
      this.tableData.push({})
    }
  }
}
function getMinute(s1, s2) {
  var reDate = /\d{4}-\d{1,2}-\d{1,2} /
  s1 = new Date((reDate.test(s1) ? s1 : '2018-1-1 ' + s1).replace(/-/g, '/'))
  s2 = new Date((reDate.test(s2) ? s2 : '2018-1-1 ' + s2).replace(/-/g, '/'))
  var ms = s2.getTime() - s1.getTime()
  if (ms < 0) return 0
  return Math.floor(ms / 1000 / 60) // 小时
}
</script>

<style lang="scss" scoped>

</style>
