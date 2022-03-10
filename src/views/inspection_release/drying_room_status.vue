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
    <div class="conter-style">
      <div
        v-for="item in 8"
        :key="item"
        class="conter-style-box"
      >
        <div style="flex:1;margin:10px;font-size:18px">
          <span class="topText">1#烘箱</span>
          <span class="topText" :style="{background:color}">运行中</span>
          <span class="topText">80℃</span>
          <span class="topText">开烘时间：2022-03-02 10:20:30</span>
          <span class="topText">已烘时长： 120分钟</span>
        </div>
        <div style="display: flex;margin-left:2%;margin-top:2%">
          <div :style="{background:color}" class="bottomDiv">
            <div class="bottomText">越南SVR3L-X越南SVR3L-X越南SVR3L-X越南SVR3L-X越南SVR3L-X</div>
          </div>
          <div class="bottomDiv">
            <div class="bottomText">越南SVR3L-X越南SVR3L-X越南SVR3L-X</div>
          </div>
          <div class="bottomDiv">
            <div class="bottomText"> 越南SVR3L-X</div>
          </div>
          <div class="bottomDiv">
            <div class="bottomText"> 越南SVR3L-X</div>
          </div>
          <div class="bottomDiv">
            <div class="bottomText">越南SVR3L-X</div>
          </div>
          <div class="bottomDiv">
            <div class="bottomText"> 越南SVR3L-X</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="手动出库选择"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :model="ruleForm" :rules="rules" label-width="150px">
        <el-form-item label="选择烘箱" prop="suggestion_desc">
          <el-select
            v-model="ruleForm.suggestion_desc"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item"
              :value="item"
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
        max-height="500"
        border
      >
        <el-table-column
          prop="quality_status"
          label="状态"
          min-width="20"
        />
        <el-table-column
          prop="lot_no"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="in_storage_time"
          label="RFID"
          min-width="20"
        />
        <el-table-column
          prop="unit"
          label="开始时间"
          min-width="20"
        />
        <el-table-column
          prop="qty"
          label="出库时间"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="入烘箱时间"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="出烘箱时间"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="时长"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="完成时间"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="巷道号"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="烘箱号"
          min-width="20"
        />
        <page
          :old-page="false"
          :total="total"
          :current-page="search.page"
          @currentChange="currentChange"
        />
      </el-table>
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
          prop="lot_no"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="in_storage_time"
          label="RFID"
          min-width="20"
        />
        <el-table-column
          prop="unit"
          label="开始时间"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="巷道号"
          min-width="20"
        />
        <page
          :old-page="false"
          :total="total1"
          :current-page="search.page"
          @currentChange="currentChange1"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import page from '@/components/page'
export default {
  name: 'MaterialDelivery',
  components: { page },
  data() {
    return {
      options: ['1号烘箱', '2号烘箱', '3号烘箱', '4号烘箱', '5号烘箱', '6号烘箱', '7号烘箱', '8号烘箱'],
      color: 'red',
      submit: false,
      search: {},
      dialogVisible: false,
      dialogVisibleWork: false,
      dialogVisibleList: false,
      ruleForm: {},
      total: 0,
      total1: 0,
      loading: false,
      tableData: [],
      tableData1: [],
      rules: {
        suggestion_desc: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      currentTime: setDate(null, true)
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
        // this.loading = true
        // const data = await equipPlan('get', null, { params: this.search })
        // this.tableData = data.results || []
      } catch (e) {
        //
      }
    },
    getWorkList() {
      this.dialogVisibleWork = true
    },
    getBoxList() {
      this.dialogVisibleList = true
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
    //   this.getList()
    },
    currentChange1(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
    //   this.getList()
    },
    generateFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.submit = true
            // await equipPlan('post', null, { data: this.creatOrder })
            this.$message.success('操作成功')
            this.getList()
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
