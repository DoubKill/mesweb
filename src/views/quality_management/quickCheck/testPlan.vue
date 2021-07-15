<template>
  <div class="quickCheck-testPlan">
    <!-- 快检检测计划 -->
    <!-- 右边列表 按生产机号 生产班次 车次 去重 -->
    <div class="left-box">
      <el-form ref="searchForm" :model="search" :inline="true" :rules="rulesLeft">
        <el-form-item label="检测机号">
          //
        </el-form-item>
        <el-form-item label="实验区分">
          //
        </el-form-item>
        <el-form-item label="工厂日期">
          <el-date-picker
            v-model="search.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            clearable
            @change="searchList"
          />
        </el-form-item>
        <el-form-item label="生产班次">
          <class-select
            @classSelected="classChanged"
          />
        </el-form-item>
        <el-form-item label="生产机号">
          <equip-select :equip_no_props="search.equip_no" @changeSearch="equipSearch" />
        </el-form-item>
        <el-form-item label="胶料规格">
          //
        </el-form-item>
        <el-form-item label="胶料段次">
          <MaterialTypeSelect v-model="search.material_type" @change="searchList" />
        </el-form-item>
        <el-form-item label="是否已检测">
          <el-select
            v-model="search.reason"
            clearable
            placeholder="请选择"
            @change="searchList"
          >
            <el-option
              v-for="(item,k) in [{name:'已检测'},{name:'未检测'}]"
              :key="k"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        border
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="date"
          label="生产机号"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="生产班次"
          min-width="20"
        />
        <el-table-column
          prop="address"
          label="胶料规格"
          min-width="20"
        />
        <el-table-column
          prop="address"
          label="车次"
          min-width="20"
        />
        <el-table-column
          prop="address"
          label="收皮条码"
          min-width="20"
        />
        <el-table-column
          prop="address"
          label="已检测"
          min-width="20"
        />
      </el-table>
    </div>
    <div class="center-box">
      <div class="center-box-child">
        <!-- eslint-disable-next-line vue/no-parsing-error -->
        <el-button size="small" type="primary" :disabled="btnLoading"><<</el-button>
        <div style="margin-top:10px" />
        <el-button size="small" type="primary" :disabled="btnLoading">>></el-button>
      </div>
    </div>
    <div class="right-box">
      <el-form ref="ruleForm" :inline="true" :rules="rules" :model="ruleForm">
        <el-form-item label="检测日期">
          <el-date-picker
            v-model="ruleForm.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="检测班次">
          <class-select
            @classSelected="classChangedTest"
          />
        </el-form-item>
        <el-form-item label="检测班组">
          <el-select
            v-model="ruleForm.group"
            clearable
            placeholder="请选择"
            @visible-change="changeGroup"
          >
            <el-option
              v-for="group in groups"
              :key="group.id"
              :label="group.global_name"
              :value="group.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="试验方法">
          //
        </el-form-item>
        <el-form-item label="试验次数">
          //
        </el-form-item>
        <el-form-item label="检测间隔">
          //
        </el-form-item>
        <el-form-item label="胶料规格">
          <el-input
            v-model="ruleForm.product_no"
            clearable
          />
        </el-form-item>
        <el-form-item label="试验车次">
          <el-input-number
            v-model="ruleForm.num"
            controls-position="right"
            :min="1"
            :max="ruleForm.num1"
            size="mini"
            clearable
          /> --
          <el-input-number
            v-model="ruleForm.num1"
            size="mini"
            controls-position="right"
            :min="ruleForm.num"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="btnLoading">添加</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" :disabled="btnLoading" @click="startTestFun">开始检测</el-button>
      <el-button type="primary" :disabled="endBtnLoading" @click="endTestFun">结束检测</el-button>
      <el-button type="primary" :disabled="btnLoading" @click="refreshFun">刷新</el-button>
      <div style="float:right">
        检测计划单据号:
        <el-input
          v-model="ruleForm.product_no"
          :disabled="true"
        />
      </div>
      <el-table
        ref="multipleTable"
        :data="tableDataRight"
        style="width: 100%;margin-top:10px"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="date"
          label="生产日期"
          min-width="20"
        />
        <el-table-column
          prop="name"
          label="生产班次"
          min-width="20"
        />
        <el-table-column
          prop="address"
          label="生产机号"
          min-width="20"
        />
        <el-table-column
          prop="address"
          label="胶料规格"
          min-width="20"
        />
        <el-table-column
          prop="address"
          label="车次"
          min-width="20"
        />
        <el-table-column
          prop="address"
          label="检测值"
          min-width="20"
        />
        <el-table-column
          prop="address"
          label="状态"
          min-width="20"
        />
        <el-table-column
          prop="address"
          label="收皮条码"
          min-width="20"
        />
      </el-table>
      <div style="text-align:center;margin-top:5px;">
        <el-button type="primary" :disabled="btnLoading" @click="addRowFun">新增一行</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import classSelect from '@/components/ClassSelect'
import equipSelect from '@/components/select_w/equip'
import MaterialTypeSelect from '@/components/MaterialTypeSelect'
import { globalCodesUrl } from '@/api/base_w'

export default {
  name: 'TestPlan',
  components: { classSelect, equipSelect, MaterialTypeSelect },
  data() {
    return {
      search: {},
      loading: false,
      tableData: [],
      tableDataRight: [],
      rules: {},
      rulesLeft: {},
      groups: [],
      ruleForm: {},
      btnLoading: false
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await materialTestTypes('get', null, { params: this.search })
        // this.total = data.count || 0
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    searchList() {

    },
    classChanged() {},
    classChangedTest() {},
    equipSearch(val) {
      this.search.equip_no = val
      this.getList()
    },
    handleSelectionChange(arr) {

    },
    changeGroup(bool) {
      if (bool) {
        this.getClassGroup()
      }
    },
    getClassGroup() {
      globalCodesUrl('get', {
        params: {
          class_name: '班组'
        }
      }).then((response) => {
        this.groups = response.results
      }).catch(function() {
      })
    },
    async startTestFun() {
      try {
        this.btnLoading = true
        this.endBtnLoading = true
        // const data = await materialTestTypes('get', null, { params: this.search })
        // this.btnLoading = false
        this.endBtnLoading = false
      } catch (e) {
        this.endBtnLoading = false
      }
    },
    endTestFun() {
      try {
        this.btnLoading = true
        // const data = await materialTestTypes('get', null, { params: this.search })
        // this.btnLoading = false
      } catch (e) {
        // this.btnLoading = false
      }
    },
    refreshFun() {
      this.btnLoading = false
    },
    addRowFun() {
      this.tableDataRight.push({})
    },
    tableRowClassName({ row, rowIndex }) {
      // 已检测
      if (rowIndex === 1) {
        return 'detected-row'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .quickCheck-testPlan{
    display: flex;
    .el-input{
      width:auto;
    }
    .detected-row{
      background: #fafafa;
    }
    .center-box{
      width:100px;
      position: relative;
        .center-box-child{
          position: absolute;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
    }
    .left-box{
      flex: 1;
    }
    .right-box{
      flex:1;
    }
  }
</style>
