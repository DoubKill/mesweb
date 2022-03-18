<template>
  <div>
    <!-- 原材料库 烘房状态实时显示 -->
    <el-form :inline="true">
      <el-form-item>
        <el-button v-permission="['','']" type="primary" @click="dialogVisible=true">手动出库</el-button>
        <el-button v-permission="['','']" type="primary" @click="getWorkList">任务列表</el-button>
        <el-button v-permission="['','']" type="primary" @click="getBoxList">待入箱列表</el-button>
        <el-button v-permission="['','']" type="primary" @click="getList">刷新</el-button>
      </el-form-item>
    </el-form>
    <div v-loading="boxLoading" class="conter-style">
      <div
        v-for="(item,index) in boxList"
        :key="index"
        class="conter-style-box"
      >
        <div style="flex:1;margin:10px;font-size:18px">
          <span class="topText">{{ item.OastNo }}#烘箱</span>
          <span class="topText" :style="{background:item.OastState===5?'#D9001B':'#95F204'}">{{ boxStatus.find(d=>d.id === item.OastState)?boxStatus.find(d=>d.id === item.OastState).name:null }}</span>
          <span class="topText">{{ item.OastTemperature }}℃</span>
          <span class="topText">开烘时间：{{ item.OastStartTime }}</span>
          <span class="topText">已烘时长：{{ item.OastServiceTime }}</span>
        </div>
        <div style="display: flex;margin-left:2%;margin-top:2%">
          <div class="bottomDiv" :style="{background:item.color}">
            <div class="bottomText">{{ (item.OastMatiles?item.OastMatiles[0]:null)?item.OastMatiles[0].ProductName:null }}</div>
          </div>
          <div class="bottomDiv" :style="{background:item.color}">
            <div class="bottomText">{{ (item.OastMatiles?item.OastMatiles[1]:null)?item.OastMatiles[1].ProductName:null }}</div>
          </div>
          <div class="bottomDiv" :style="{background:item.color}">
            <div class="bottomText">{{ (item.OastMatiles?item.OastMatiles[2]:null)?item.OastMatiles[2].ProductName:null }}</div>
          </div>
          <div class="bottomDiv" :style="{background:item.color}">
            <div class="bottomText">{{ (item.OastMatiles?item.OastMatiles[3]:null)?item.OastMatiles[3].ProductName:null }}</div>
          </div>
          <div class="bottomDiv" :style="{background:item.color}">
            <div class="bottomText">{{ (item.OastMatiles?item.OastMatiles[4]:null)?item.OastMatiles[4].ProductName:null }}</div>
          </div>
          <div class="bottomDiv" :style="{background:item.color}">
            <div class="bottomText"> {{ (item.OastMatiles?item.OastMatiles[5]:null)?item.OastMatiles[5].ProductName:null }}</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="手动出库选择"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px">
        <el-form-item label="选择烘箱" prop="OastNo">
          <el-select
            v-model="ruleForm.OastNo"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="烘箱任务列表"
      :visible.sync="dialogVisibleWork"
      width="90%"
    >
      <el-table
        v-loading="loading"
        :data="tableData"
        border
      >
        <el-table-column
          prop="quality_status"
          label="状态"
          min-width="20"
          :formatter="(row)=>{
            let obj = workStatus.find(d=>d.id === row.TaskState)
            return obj.name
          }"
        />
        <el-table-column
          prop="ProductName"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="RFID"
          label="RFID"
          min-width="20"
        />
        <el-table-column
          prop="TaskStartTime"
          label="开始时间"
          min-width="20"
        />
        <el-table-column
          prop="TaskEntTime"
          label="出库时间"
          min-width="20"
        />
        <el-table-column
          prop="OastInTime"
          label="入烘箱时间"
          min-width="20"
        />
        <el-table-column
          prop="OastOutTime"
          label="出烘箱时间"
          min-width="20"
        />
        <el-table-column
          prop="Runtime"
          label="时长"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="完成时间"
          min-width="20"
        />
        <el-table-column
          prop="RoadWay"
          label="巷道号"
          min-width="20"
        />
        <el-table-column
          prop="OastNo"
          label="烘箱号"
          min-width="20"
        />

      </el-table>
      <page
        :old-page="false"
        :total="total"
        :current-page="search.page"
        @currentChange="currentChange"
      />
    </el-dialog>

    <el-dialog
      title="待入箱队列"
      :visible.sync="dialogVisibleList"
      width="90%"
    >
      <el-table
        v-loading="loading"
        :data="tableData1"
        max-height="500"
        border
      >
        <el-table-column
          prop="ProductName"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="RFID"
          label="RFID"
          min-width="20"
        />
        <el-table-column
          prop="TaskStartTime"
          label="开始时间"
          min-width="20"
        />
        <el-table-column
          prop="RoadWay"
          label="巷道号"
          min-width="20"
        />
      </el-table>
      <page
        :old-page="false"
        :total="total1"
        :current-page="search1.page"
        @currentChange="currentChange1"
      />
    </el-dialog>
  </div>
</template>

<script>
import { hfRealStatus } from '@/api/jqy'
import page from '@/components/page'
export default {
  name: 'MaterialDelivery',
  components: { page },
  data() {
    return {
      options: [
        { id: '1', label: '1号烘箱' },
        { id: '2', label: '2号烘箱' },
        { id: '3', label: '3号烘箱' },
        { id: '4', label: '4号烘箱' },
        { id: '5', label: '5号烘箱' },
        { id: '6', label: '6号烘箱' },
        { id: '7', label: '7号烘箱' },
        { id: '8', label: '8号烘箱' }],
      submit: false,
      boxLoading: false,
      search: { type: 1 },
      search1: { type: 2 },
      dialogVisible: false,
      dialogVisibleWork: false,
      dialogVisibleList: false,
      ruleForm: {},
      total: 0,
      total1: 0,
      boxStatus: [
        { id: 0, name: '空闲' },
        { id: 1, name: '入箱中' },
        { id: 2, name: '烘烤中' },
        { id: 3, name: '等待出箱' },
        { id: 4, name: '出箱中' },
        { id: 5, name: '异常中断' }
      ],
      workStatus: [
        { id: 1, name: '入库中' },
        { id: 2, name: '烘烤运行' },
        { id: 3, name: '出库中' },
        { id: 4, name: '等待烘烤' },
        { id: 5, name: '等待出库' },
        { id: 6, name: '已出库' },
        { id: 7, name: '取消' }
      ],
      loading: false,
      boxList: [],
      tableData: [],
      tableData1: [],
      rules: {
        OastNo: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.timer = setInterval(d => {
      this.getList()
    }, 300000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    async getList() {
      try {
        this.boxLoading = true
        const data = await hfRealStatus('get', null, { params: { type: 0 }})
        this.boxList = data.results || []
        this.boxList.forEach((d, index) => {
          if (d.OastState === 2) {
            this.boxList[index].color = '#FFFF80'
          } else if (d.OastState === 3) {
            this.boxList[index].color = '#95F204'
          } else if (d.OastState === 5) {
            this.boxList[index].color = '#D9001B'
          }
        })
        this.boxLoading = false
      } catch (e) {
        this.boxLoading = false
        //
      }
    },
    async getWorkList() {
      this.dialogVisibleWork = true
      try {
        this.loading = true
        const data = await hfRealStatus('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.total_data
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getBoxList() {
      this.dialogVisibleList = true
      try {
        this.loading = true
        const data = await hfRealStatus('get', null, { params: this.search1 })
        this.tableData1 = data.results || []
        this.total1 = data.total_data
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getWorkList()
    },
    currentChange1(page, page_size) {
      this.search1.page = page
      this.search1.page_size = page_size
      this.getBoxList()
    },
    generateFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.submit = true
            await hfRealStatus('post', null, { data: this.ruleForm })
            this.$message.success('操作成功')
            this.submit = false
          } catch (e) {
            this.submit = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .conter-style{
    margin-left:10px;
    margin-top:20px;
      .conter-style-box{
        text-align: left;
        display: inline-block;
        margin-bottom:15px;
        border-radius: 15px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        width:49%;
        height:160px;
        margin-right: 14px;
      }
    }
    .topText{
      margin-left: 20px;
    }
    .bottomDiv{
      display:table;
      border:1px solid #000;
      height: 80px;
      margin:0px -1px 0px 0px;
      text-align: center;
      width: 16.5%;
    }
    .bottomText{
      display:table-cell;
      vertical-align:middle;
      word-break:break-all;
    }
</style>
