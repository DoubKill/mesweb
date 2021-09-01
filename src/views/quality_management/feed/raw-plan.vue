<template>
  <div class="raw-plan-style">
    <!-- 投料计划 -->
    <h4>本日班次密炼生产计划</h4>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 50%;"
      border
    >
      <el-table-column
        typ="id"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="date_now"
        label="生产日期"
        min-width="20"
      />
      <el-table-column
        prop="classes"
        label="班次"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="密炼机台号"
        min-width="20"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        prop="plan_trains"
        label="计划车数"
        min-width="20"
      />
    </el-table>
    <h4>炭黑罐投料提示信息</h4>
    <el-row class="dialogPlanAddIndex">
      <el-col :span="1" class="leftEquip">
        <el-checkbox
          v-model="checkAll"
          :disabled="disabledEquip"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <div
          v-for="item in equips"
          :key="item.id"
          style="position:relative"
        >
          <el-checkbox
            v-model="item.checkbox"
            :label="item.id"
            :disabled="disabledEquip"
            @change="changeEquip($event,item)"
            @click.native="clickEquip"
          >
            {{ item.equip_no }}
          </el-checkbox>
          <!-- <span
            v-if="item.checkbox"
            style="position:absolute;top:0;left:0;width:100%;height:100%;background:transparent;z-index:5"
            @click="changeEquip(false,item)"
          /> -->
        </div>
      <!-- </div> -->
      </el-col>
      <el-col
        v-loading="addPlanArrLoading"
        :span="23"
        class="rightContent"
        element-loading-text="拼命加载中"
      >
        <div
          v-for="(tableItem,i) in addPlanArr"
          :key="i"
          style="margin-bottom:10px;margin-left:10px"
        >
          <div class="tableTop">
            4443333
            <el-button style="float:right;margin:5px 10px" size="small">保存</el-button>
            <!-- {{ tableItem[0][0]?tableItem[0][0].equipNo:'--' }} -->
          </div>
          <el-table
            :key="i"
            :data="tableItem"
            border
            width="100%"
            :row-class-name="tableRowClassName"
            :span-method="objectSpanMethod"
          >
            >
            <el-table-column label="炭黑罐号" min-width="20">
              <template slot-scope="scope">
                {{ scope.row.classes_name }}
              </template>
            </el-table-column>
            <el-table-column
              min-width="20"
              label="料罐类别"
            >
              <template slot-scope="scope">
                {{ scope.row.classes_name }}
              </template>
            </el-table-column>
            <el-table-column
              label="炭黑物料名称"
              min-width="20"
            >
              <template slot-scope="scope">
                {{ scope.row.classes_name }}
              </template>
            </el-table-column>
            <el-table-column
              label="料位状态"
              min-width="20"
            >
              <template slot-scope="scope">
                {{ scope.row.classes_name }}
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="班次补料计算值kg"
              min-width="20"
            >
              <template slot-scope="scope">
                {{ scope.row.status }}
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="2小时补料计算值kg" min-width="20">
              <template slot-scope="scope">
                {{ scope.row.status }}
              </template>
            </el-table-column> -->
            <el-table-column label="补料设定值kg" min-width="20">
              <template slot-scope="scope">
                {{ scope.row.created_date }}
              </template>
            </el-table-column>
            <el-table-column label="投料口" width="170">
              <template slot-scope="scope">
                <el-select
                  v-if="!scope.row.isNoPortOne"
                  v-model="scope.row.aaaa"
                  placeholder="请选择"
                  @change="portChange($event,scope.$index,i,scope.row)"
                >
                  <el-option
                    v-for="(item,portI) in options"
                    :key="portI"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
                <span v-else>{{ scope.row.aaaa }}</span>
              </template>
            </el-table-column>
            <el-table-column label="投料物料信息" width="170">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.bb"
                  placeholder="请选择"
                  @change="MaterialChange($event,scope.$index,i,scope.row)"
                  @visible-change="visibleChangeMaterial($event,scope.row)"
                >
                  <el-option
                    v-for="(item,portI) in optionsMaterial"
                    :key="portI"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="是否出库" min-width="20">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.aaa"
                />
              </template>
            </el-table-column>
            <el-table-column label="投料状态" min-width="20">
              <template slot-scope="scope">
                {{ scope.row.created_date }}
              </template>
            </el-table-column>
            <el-table-column
              width="160"
              label="操作"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleStart(scope.$index,scope.row,i,true)"
                >开始
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleGroupDelete(scope.$index,scope.row,i,false)"
                >结束
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="炭黑罐投料 出库信息确认"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="160px">
        <el-form-item label="生产机台:">
          {{ '生产机台' }}
        </el-form-item>
        <el-form-item label="炭黑罐号:">
          {{ '炭黑罐号' }}
        </el-form-item>
        <el-form-item label="料罐物料:">
          {{ '料罐物料' }}
        </el-form-item>
        <el-form-item label="投料口:">
          {{ '投料口' }}
        </el-form-item>
        <el-form-item label="投料重量（kg）:">
          {{ '投料重量（kg）' }}
        </el-form-item>
        <el-form-item label="库存数量（托）:">
          {{ '投料口' }}
        </el-form-item>
        <el-form-item label="库库存重量（kg）:">
          {{ '库库存重量（kg）' }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { equipUrl } from '@/api/base_w'
import { feedCapacityPlan, carbonFeedingPrompt, thInventory } from '@/api/base_w_four'
export default {
  name: 'RawPlan',
  data() {
    return {
      tableData: [],
      equips: [],
      checkAll: [],
      disabledEquip: false,
      addPlanArrLoading: false,
      addPlanArr: [],
      options: [
        { name: '掺混1-1号口' },
        { name: '掺混1-2号口' },
        { name: '掺混2-1号口' },
        { name: '掺混2-2号口' },
        { name: '炭黑' },
        { name: '白炭黑' }
      ],
      optionsMaterial: [],
      dialogVisible: false,
      form: {},
      loading: true
    }
  },
  created() {
    this.getEquipList()
    this.getFeedingPort()
  },
  methods: {
    async getEquipList() {
      try {
        const equipData = await equipUrl('get', { params: { all: 1, category_name: '密炼设备' }})
        this.equips = equipData.results
      } catch (e) {
        //
      }
    },
    async getFeedingPort() {
      try {
        const data = await feedCapacityPlan('get')
        this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getOptionsMaterial() {
      try {
        const DATA = await thInventory('get', { params: { material_name: 1 }})
        this.optionsMaterial = DATA.results
      } catch (e) {
        //
      }
    },
    async handleCheckAllChange(val) {
      // const work_schedule = []
      if (val) {
        // 获取全部机台数据全部循环  this.addPlanArr不存在的就push
      }

      this.equips.forEach(D => {
        if (val) {
          D.checkbox = true
        } else {
          D.checkbox = false
          this.addPlanArr = []
        }
      })
    },
    async changeEquip(val, row) {
      if (val) {
        const work_schedule = await this.getInfoFun(row)
        // this.visibleChange(row.id, row.category, work_schedule)
        this.addPlanArr.push([{ equip_id: row.id }, { equip_id: row.id }, { equip_id: row.id }])
      } else {
        const arr = []
        this.addPlanArr.forEach(d => {
          if (d[0].equip_id !== row.id) {
            arr.push(d)
          }
        })
        this.addPlanArr = arr
      }
    },
    async getInfoFun(row) {
      try {
        const data = await carbonFeedingPrompt('get', null, { params: { equip_no: row.equip_no }})
        // this.tableData = data || []
      } catch (e) {
        //
      }
    },
    MaterialChange(val, index, i, row) {

    },
    visibleChangeMaterial(bool, row) {
      if (bool) {
        this.getOptionsMaterial()
      }
    },
    portChange(val, index, faIndex, row) {
      const row1 = this.addPlanArr[faIndex][index + 1] || null
      const _row = JSON.parse(JSON.stringify(row))
      // isNoPortOne 表示是附属添加的数据
      if (val === '掺混1-1号口') {
        _row.aaaa = '掺混1-2号口'
        _row.isNoPortOne = true
      } else if (val === '掺混1-2号口') {
        _row.aaaa = '掺混1-1号口'
        _row.isNoPortOne = true
      } else if (val === '掺混2-1号口') {
        _row.aaaa = '掺混2-2号口'
        _row.isNoPortOne = true
      } else if (val === '掺混2-2号口') {
        _row.aaaa = '掺混2-1号口'
        _row.isNoPortOne = true
      } else {
        if (row1 && row1.isNoPortOne) {
          this.addPlanArr[faIndex].splice(index + 1, 1)
        }
        console.log(this.addPlanArr, 8888)
        return
      }
      if (row1 && row1.isNoPortOne) {
        this.addPlanArr[faIndex][index + 1].aaaa = _row.aaaa
        return
      }
      this.addPlanArr[faIndex].splice(index + 1, 0, _row)
      console.log(this.addPlanArr, 8888)
    },
    clickEquip() {},
    handleGroupDelete(index, row, faIndex, bool) {
      this.$confirm(`是否确定结束?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // propertyTypeNode('delete', data.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '操作成功!'
        //     })
        //   }).catch(e => {
        //     //
        //   })
      })
    },
    handleStart(index, row, faIndex, bool) {
      this.dialogVisible = true
    },
    submitForm() {
      this.$confirm(`请预先切换好管路，点击确定后炭黑料包将从炭黑立库里输出，解包房将开始投料，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogVisible = false
        // propertyTypeNode('delete', data.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '操作成功!'
        //     })
        //   }).catch(e => {
        //     //
        //   })
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex < 5) {
      //   const _row = row.isOneMerge ? 2 : 1
      //   const _col = row.isOneMerge ? 1 : 0
      //   return {
      //     rowspan: _row,
      //     colspan: _col
      //   }
      // }
    },
    tableRowClassName({ row, rowIndex }) {
      switch (row.status) {
        case '等待':
          return 'wait-row'
        case '已保存':
          return 'danger-row'
        default:
          return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
 .wait-row{
       color: rgb(209, 206, 37) !important;
 }
 .danger-row{
       color: rgb(236,128,141) !important;
 }
 .raw-plan-style{
   .el-form-item{
     margin-bottom:0;
   }
 .tableTop{
   width:100%;
   text-align: center;
   line-height: 40px;
   overflow: hidden;
   background: #0bbd0b;
   color:#fff;
    border: 1px solid #EBEEF5;
    border-bottom: none;
 }
   .dialogPlanAddIndex{
    // display: flex;
    // min-width: 800px;
      .leftEquip{
        .el-checkbox{
          display: block;
          padding: 0 0 10px 0;
        }
      }
      .rightContent{
        padding-left:20px;
      }
   }
 }
</style>
