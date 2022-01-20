<template>
  <div class="quality-plan">
    <!-- 原材料 质量检测计划 -->
    <el-form :inline="true">
      <el-form-item label="检测机号">
        <el-select
          v-model="search.test_equip"
          :disabled="startBtnLoading"
          clearable
          placeholder="请选择"
          @visible-change="changeVisibleTestEquip"
          @change="changeTestEquip"
        >
          <el-option
            v-for="(group,groupI) in testEquipList"
            :key="groupI"
            :label="group&&group.no"
            :value="group&&group.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="实验区分">
        <el-select
          v-model="search.test_indicator_name"
          :disabled="startBtnLoading"
          placeholder="请选择"
          @visible-change="changeVisibleTestIndicators"
          @change="changeTestIndicators"
        >
          <el-option
            v-for="(group,_i) in testIndicatorsList"
            :key="_i"
            :label="group.name"
            :value="group.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="search.factory_date"
          :disabled="startBtnLoading"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          clearable
          @change="searchList"
        />
      </el-form-item>
      <el-form-item label="生产班次">
        <class-select
          :is-disabled="startBtnLoading"
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="检测班组" prop="test_group">
        <el-select
          v-model="search.test_group"
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
      </el-form-item>
      <el-form-item label="试验方法" prop="test_method_name">
        <el-select
          v-model="search.test_method_name"
          :disabled="startBtnLoading"
          placeholder="请选择"
          @visible-change="changeTestMethod"
        >
          <el-option
            v-for="group in testMethodList"
            :key="group.id"
            :label="group.name"
            :value="group.name"
            :disabled="!group.allowed"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="样品条码" prop="test_method_name">
        <el-input
          v-model="search.test_method_name"
          style="width:400px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addTestFun">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['examine_test_plan', 'begin']" type="primary" :disabled="startBtnLoading" @click="startTestFun">开始检测</el-button>
        <el-button v-permission="['examine_test_plan', 'end']" type="primary" @click="endTestFun">结束检测</el-button>
        <el-button type="primary" @click="getList">刷新</el-button>
      </el-form-item>
      <el-form-item label="检测计划单据号">
        <el-input
          v-model="search.plan_uid"
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
        prop="equip_no"
        label="样品条码"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="物料规格"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="检测值"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="状态"
        min-width="20"
      />
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
import classSelect from '@/components/ClassSelect'
import { exportExcel } from '@/utils/index'
import { globalCodesUrl, testIndicators, matTestIndicatorMethods } from '@/api/base_w'
import { productReportEquip } from '@/api/base_w_four'
export default {
  name: 'QualityInspectionPlan',
  components: { classSelect },
  data() {
    return {
      testEquipList: [],
      testMethodList: [],
      startBtnLoading: false,
      testIndicatorsList: [],
      groups: [],
      search: {},
      btnExportLoad: false,
      loading: false,
      tableData: []
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await equipStatement('get', null, { params: this.search })
        // this.tableData = data
        // this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeVisibleTestEquip(bool) {
      if (bool) {
        this.getTestEquipList(false)
      }
    },
    changeVisibleTestIndicators(bool) {
      if (bool) {
        this.getTestIndicators()
      }
    },
    addTestFun() {
      this.tableData.push({ name: 1 })
    },
    startTestFun() {
      // if (this.tableData.length === 0) {
      //   this.$message.info('没有可检测数据，请添加')
      //   return
      // }
      this.startBtnLoading = true
    },
    endTestFun() {
      this.startBtnLoading = false
      // if (!this.ruleForm.plan_uid) {
      //   this.$message.info('没有可结束计划,如果存在请刷新页面查看')
      //   return
      // }
      // this.$confirm('此操作将结束检测, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(async() => {
      //   try {
      //     await productTestPlan('delete', this.ruleForm.id, { params: { }})
      //     this.btnLoading = false
      //     this.$message.success('已全部结束检测')
      //     this.ruleForm.plan_uid = ''
      //     this.tableDataRight = []
      //     this.ruleForm.product_no = ''
      //     // this.$nextTick(() => {
      //     // this.$refs.ruleForm.clearValidate()
      //     // })
      //   } catch (e) {
      //     //
      //   }
      // })
    },
    changeTestIndicators() {
      this.ruleForm.test_method_name = ''
    },
    async getTestEquipList(bool) {
      try {
        const data = await productReportEquip('get', null, { params: { all: 1 }})
        this.testEquipList = data || []
        if (bool) {
          this.search.test_equip = data && data[0].id
          this.getWaitPlan()
          this.getTestIndicatorsList()
        }
      } catch (e) {
        //
      }
    },
    async delRow(index, row) {
    //   if (!row.id) {
    //     this.tableDataRight.splice(index, 1)
    //     return
    //   }
    //   if (this.tableDataRight.length === 1) {
    //     this.$message.info('最少保留一列数据')
    //     return
    //   }
    //   try {
    //     await productTestPlanDetail('delete', row.id)
    //     this.$message.success('操作成功')
    //     this.isDelRow = true
    //     this.refreshFun()
    //   } catch (e) {
    //     //
    //   }
    },
    async changeTestMethod(bool) {
      console.log(bool)
      if (bool) {
        try {
          const data = await matTestIndicatorMethods('get', null, { params: { material_no: this.ruleForm.product_no }})
          let arr = []
          arr = data.filter(d => d.test_indicator === this.search.test_indicator_name)
          this.testMethodList = arr[0].methods
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
      try {
        const data = await testIndicators('get', null, { params: { all: 1 }})
        this.testIndicatorsList = data
        if (bool) {
          this.search.test_indicator_name = data[0].name
        }
      } catch (e) {
        //
      }
    },
    getTestIndicatorsList() {
      this.search.test_indicator_name = ''
      const obj = this.testEquipList.find(d => d.id === this.search.test_equip)
      this.testIndicatorsList = obj.test_indicator_name || []
    //   if (!this.ruleForm.plan_uid) {
    //     this.search.test_indicator_name = this.testIndicatorsList[0].test_indicator__name
    //   }
    },
    changeTestEquip() {
      this.tableDataRight = []
      this.tableData = []
      this.btnLoading = false
      this.ruleForm.plan_uid = ''
      this.ruleForm.product_no = ''
      this.search.product_no = ''
      this.getTestIndicatorsList()
      this.getWaitPlan()
    },
    classChanged(val) {
      this.search.classes = val
      this.searchList()
    },
    searchList() {
      this.search.product_no = ''
      this.ruleForm.product_no = ''
      this.getList()
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.getList()
    },
    exportExcel() {
      exportExcel('机台别-生产量汇总')
    }
  }
}
</script>

<style lang="scss">
.quality-plan{
    .el-input,.el-select{
      width:180px;
    }
  }
</style>
