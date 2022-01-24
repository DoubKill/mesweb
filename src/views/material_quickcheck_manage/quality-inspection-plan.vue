<template>
  <div class="quality-plan">
    <!-- 原材料 质量检测计划 -->
    <el-form :inline="true">
      <el-form-item label="检测机号">
        <el-select
          v-model="search.material_report_equip"
          style="width:180px"
          :clearable="false"
          placeholder="请选择"
          @visible-change="getTestEquipList"
          @change="changeTestEquip"
        >
          <el-option
            v-for="d in testEquipList"
            :key="d.id"
            :label="d.no"
            :value="d.id"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="实验区分">
        <el-select
          v-model="search.test_method_name"
          style="width:180px"
          :disabled="startBtnLoading"
          :clearable="false"
          placeholder="请选择"
          @visible-change="getTestIndicators"
        >
          <el-option
            v-for="(group,_i) in testIndicatorsList"
            :key="_i"
            :label="group.name"
            :value="group.name"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="检测日期">
        <el-date-picker
          v-model="search.test_time"
          style="width:180px"
          :clearable="false"
          :disabled="startBtnLoading"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <!-- <el-form-item label="检测班次">
        <class-select
          style="width:180px"
          :value-default="search.test_classes"
          :is-clearable="false"
          :is-disabled="startBtnLoading"
          @classSelected="classChanged"
        />
      </el-form-item> -->
      <!-- <el-form-item label="检测班组">
        <el-select
          v-model="search.test_group"
          style="width:180px"
          :clearable="false"
          :disabled="startBtnLoading"
          placeholder="请选择"
          @visible-change="getClassGroup"
        >
          <el-option
            v-for="group in groups"
            :key="group.id"
            :label="group.global_name"
            :value="group.global_name"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="试验方法">
        <el-select
          v-model="search.test_type"
          style="width:300px"
          :clearable="false"
          :disabled="startBtnLoading"
          placeholder="请选择"
          @visible-change="changeTestMethod"
        >
          <el-option
            v-for="group in testMethodList"
            :key="group.id"
            :label="group.name"
            :value="group.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="样品条码">
        <el-input
          v-model="material_tmh"
          style="width:400px"
          @keyup.enter.native="addTestFun"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addTestFun">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['examine_test_plan', 'begin']" type="primary" :disabled="startBtnLoading" @click="startTestFun">开始检测</el-button>
        <el-button v-permission="['examine_test_plan', 'end']" type="primary" @click="endTestFun">结束检测</el-button>
        <el-button type="primary" @click="getWaitPlan">刷新</el-button>
      </el-form-item>
      <el-form-item label="检测计划单据号">
        <el-input
          v-model="plan_uid"
          :disabled="true"
          style="width:250px"
        />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="material_tmh"
        label="样品条码"
        min-width="20"
      />
      <el-table-column
        prop="material_name"
        label="原材料名称"
        min-width="20"
      />
      <el-table-column
        prop="qualified"
        label="是否合格"
        min-width="20"
      >
        <template slot-scope="{row}">
          <span v-if="row.qualified===true">合格</span>
          <span v-if="row.qualified===false">不合格</span>
          <span v-if="row.qualified===null">待检</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="material_batch"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="test_value"
        label="检测值"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="20"
      >
        <template slot-scope="{row}">
          <span v-if="row.status===1">待检测</span>
          <span v-if="row.status===2">完成</span>
          <span v-if="row.status===4">强制结束</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="20">
        <template slot-scope="{row,$index}">
          <el-button
            size="mini"
            type="danger"
            @click="delRow($index,row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { globalCodesUrl, testIndicators } from '@/api/base_w'
import { materialExamineType } from '@/api/base_w_three'
import { glsb, materialTestPlan, materialTestPlanDetail } from '@/api/jqy'
import { materialReportEquip } from '@/api/base_w_four'
export default {
  name: 'QualityInspectionPlan',
  components: { },
  data() {
    return {
      testEquipList: [],
      material_tmh: '',
      testMethodList: [],
      plan_uid: null,
      id: null,
      startBtnLoading: false,
      testIndicatorsList: [],
      groups: [],
      search: {
        material_report_equip: null,
        test_time: null,
        test_type: null
      },
      btnExportLoad: false,
      loading: false,
      tableData: []
    }
  },
  methods: {
    async addTestFun() {
      if (!this.search.material_report_equip) {
        this.$message('请先选择检测机号')
        return
      }
      if (!this.material_tmh) {
        this.$message('请先输入样品条码')
        return
      }
      if (this.tableData.some(d => d.material_tmh === this.material_tmh)) {
        this.$message('已有此样品条码相关信息')
        this.material_tmh = ''
        return
      }
      const data = await glsb('get', null, { params: { sb: this.material_tmh }})
      if (!data.res) {
        this.$message('无此样品条码相关信息')
        this.material_tmh = ''
        return
      }
      const obj = {
        material_tmh: data.res.TMH,
        material_name: data.res.WLMC,
        material_batch: data.res.SCRQ
      }
      if (this.startBtnLoading === true) {
        try {
          // this.$set(this.search, 'material_list', [obj])
          await materialTestPlan('put', this.id, { data: obj })
          this.getWaitPlan()
          this.material_tmh = ''
        } catch {
          //
        }
      } else {
        this.tableData.push(obj)
        this.material_tmh = ''
      }
    },
    async startTestFun() {
      if (this.tableData.length === 0) {
        this.$message.info('没有可检测数据，请添加')
        return
      }
      if (!this.search.material_report_equip) {
        this.$message.info('请选择检测机号')
        return
      }
      // if (!this.search.test_method_name) {
      //   this.$message.info('请选择实验区分')
      //   return
      // }
      if (!this.search.test_time) {
        this.$message.info('请选择工厂日期')
        return
      }
      // if (!this.search.test_classes) {
      //   this.$message.info('请选择班次')
      //   return
      // }
      // if (!this.search.test_group) {
      //   this.$message.info('请选择班组')
      //   return
      // }
      if (!this.search.test_type) {
        this.$message.info('请选择试验方法')
        return
      }
      try {
        this.$set(this.search, 'material_list', this.tableData)
        await materialTestPlan('post', null, { data: this.search })
        this.$message.success('开始检测')
        this.startBtnLoading = true
      } catch (e) {
        this.startBtnLoading = false
      }
    },
    endTestFun() {
      if (!this.id) {
        this.$message.info('没有可结束计划,如果存在请刷新页面查看')
        return
      }
      this.$confirm('此操作将结束检测, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await materialTestPlan('delete', this.id, { params: { }})
          this.startBtnLoading = false
          this.$message.success('已全部结束检测')
          this.tableData = []
          this.plan_uid = null
          this.id = null
          this.search.material_report_equip = null
          // this.search.test_method_name = null
          this.search.test_time = null
          // this.search.test_classes = null
          // this.search.test_group = null
          this.search.test_type = null
        } catch (e) {
          //
        }
      })
    },
    async getTestEquipList(bool) {
      if (bool) {
        try {
          const data = await materialReportEquip('get', null, { params: { all: 1 }})
          this.testEquipList = data.results || []
        } catch (e) {
          this.testEquipList = []
        }
      }
    },
    async delRow(index, row) {
      if (!row.id) {
        this.tableData.splice(index, 1)
        return
      }
      if (this.tableData.length === 1) {
        this.$message.info('最少保留一列数据')
        return
      }
      try {
        await materialTestPlanDetail('delete', row.id)
        this.tableData.splice(index, 1)
        this.$message.success('操作成功')
      } catch (e) {
        //
      }
    },
    async changeTestMethod(bool) {
      if (bool) {
        try {
          const data = await materialExamineType('get', null, { params: { all: 1 }})
          this.testMethodList = data.results
        } catch (e) {
          this.testMethodList = []
        }
      }
    },
    getClassGroup(val) {
      if (val) {
        globalCodesUrl('get', {
          params: {
            class_name: '班组'
          }
        }).then((response) => {
          this.groups = response.results
        }).catch(function() {
        })
      }
    },
    async getTestIndicators(bool) {
      if (bool) {
        try {
          const data = await testIndicators('get', null, { params: { all: 1 }})
          this.testIndicatorsList = data
        } catch (e) {
        //
        }
      }
    },
    changeTestEquip() {
      this.tableData = []
      // this.search.test_method_name = null
      this.search.test_time = null
      // this.search.test_classes = null
      // this.search.test_group = null
      this.search.test_type = null
      this.material_tmh = null
      this.startBtnLoading = false
      this.getWaitPlan()
    },
    async getWaitPlan() {
      try {
        const data = await materialTestPlan('get', null, { params: { material_report_equip: this.search.material_report_equip }})
        this.changeTestMethod(true)
        if (data.length === 0) {
          this.btnLoading = false
          this.tableData = []
          this.btnLoading = false
          this.plan_uid = null
          this.id = null
          return
        }
        if (data[0].status === 1) {
          this.startBtnLoading = true
          this.id = data[0].id
          this.plan_uid = data[0].plan_uid
          // this.search.test_method_name = data[0].test_method_name
          this.search.test_time = data[0].test_time
          // this.search.test_classes = data[0].test_classes
          // this.search.test_group = data[0].test_group
          this.search.test_type = data[0].test_type
          this.tableData = data[0].material_test_plan_detail
          this.$message('正在检测中')
        } else {
          this.$message.success('全部检测完毕')
          this.tableData = []
          this.btnLoading = false
          this.id = null
          this.plan_uid = null
        }
      } catch (e) {
        this.startBtnLoading = false
        this.tableData = []
        this.id = null
        this.plan_uid = null
      }
    },
    classChanged(val) {
      this.search.test_classes = val
    }
  }
}
</script>

<style lang="scss">
</style>
