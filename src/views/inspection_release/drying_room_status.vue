<template>
  <div>
    <!-- 原材料库 烘房状态实时显示 -->
    <el-form :inline="true">
      <el-form-item>
        <el-button v-permission="['material_hf_real_data','outbound']" type="primary" @click="showDialog()">手动出库</el-button>
        <el-button type="primary" @click="getWorkList">任务列表</el-button>
        <el-button type="primary" @click="getBoxList">待入箱列表</el-button>
        <el-button type="primary" @click="getList">刷新</el-button>
        <el-button type="primary" @click="showDialog(1)">强制出料</el-button>
        <el-button type="primary" @click="showDialog(2)">强制烘烤</el-button>
        <el-button type="primary" @click="temperatureDialog">设置温度时长</el-button>
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
          <div v-if="item.OastMatiles&&item.OastMatiles.length" style="display:inline-block">
            <span class="topText">设定烘烤时长：{{ item.OastStandardTime }}</span>
            <span class="topText">设定烘烤温度：{{ item.OastSTemperature }}</span>
            <span class="topText">开烘时间：{{ item.OastStartTime }}</span>
            <span class="topText">已烘时长：{{ item.OastServiceTime }}</span>
          </div>
        </div>
        <div style="display: flex;margin-left:2%;margin-top:2%">
          <div v-for="_item in 6" :key="_item" class="bottomDiv" :style="{background:item.color,'padding': '0 4px'}">
            <div v-if="item.OastMatiles[_item-1]" class="bottomText">{{ item.OastMatiles[_item-1].ProductName }}
              /{{ item.OastMatiles[_item-1].RFID }}</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :title="`${type===1?'强制出料 烘箱选择':type===2?'强制烘烤 烘箱选择':'手动出库选择'}`"
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

    <el-dialog
      title="原材料 烘烤温度及时长设置"
      :visible.sync="dialogVisibleSet"
      width="60%"
    >
      <div style="text-align:right;margin-bottom:5px">
        <el-button :loading="loadingDialog" type="primary" @click="saveAll">
          全部保存
        </el-button>
      </div>
      <el-table
        v-loading="loadingDialog"
        :data="dialogFormData"
        border
        max-height="600px"
      >
        <el-table-column
          label="原材料名称"
          min-width="40"
        >
          <template slot-scope="{row}">
            <el-select
              v-model="row.material_name"
              style="width:380px"
              placeholder="请选择原材料"
              filterable
            >
              <el-option
                v-for="item in optionsProduct"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="烘烤温度（℃）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.temperature_set" :precision="0" :min="1" controls-position="right" :max="100" />
          </template>
        </el-table-column>
        <el-table-column
          label="烘烤时长（小时）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.bake_time" :precision="1" :min="1" controls-position="right" :max="200" />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200px"
        >
          <template slot-scope="{row,$index}">
            <el-button type="danger" :disabled="loadingDialog" @click="delSet(row,$index)">
              删除</el-button>
            <el-button :disabled="loadingDialog" type="primary" @click="saveSet([row],$index)">
              保存</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:15px">
        <el-button
          size="small"
          :disabled="loadingDialog"
          @click="addSet"
        >插入一行</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFalse">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { hfRealStatus, hfForceHandle, hfConfigSet, wmsMaterials } from '@/api/jqy'
import page from '@/components/page'
export default {
  name: 'MaterialDelivery',
  components: { page },
  data() {
    return {
      options: [],
      submit: false,
      boxLoading: false,
      search: { type: 1 },
      search1: { type: 2 },
      dialogVisible: false,
      dialogVisibleWork: false,
      dialogVisibleList: false,
      ruleForm: { OastNo: null },
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
      },
      type: null,
      dialogVisibleSet: false,
      dialogFormData: [],
      optionsProduct: [],
      loadingDialog: false
    }
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.fullPath === '/internal/drying-room-status') {
          this.getList()
          this._setInterval = setInterval(d => {
            this.getList()
          }, 30000)
        } else {
          window.clearInterval(this._setInterval)
        }
      },
      deep: true, // 深度监听
      immediate: true // 第一次初始化渲染就可以监听到
    }
  },
  created() {
    // this.getList()
    this.getProduct()
  },
  mounted() {
  },
  destroyed() {
    window.clearInterval(this._setInterval)
  },
  methods: {
    async getList() {
      try {
        this.boxLoading = true
        const data = await hfRealStatus('get', null, { params: { type: 0 }})
        this.boxList = data.results || []
        this.options = []
        this.boxList.forEach((d, index) => {
          if (d.OastState === 2) {
            this.boxList[index].color = '#FFFF80'
          } else if (d.OastState === 3) {
            this.boxList[index].color = '#95F204'
          } else if (d.OastState === 5) {
            this.boxList[index].color = '#D9001B'
          }
          this.options
          if (d.OastMatiles.length) {
            this.options.push({ id: d.OastNo.toString(), label: d.OastNo + '号烘箱' })
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
    async getProduct() {
      try {
        const data = await wmsMaterials('get', null, {})
        this.optionsProduct = data || []
      } catch (e) {
        //
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
            const _obj = JSON.parse(JSON.stringify(this.ruleForm))
            const _api = this.type ? hfForceHandle : hfRealStatus
            if (this.type) {
              _obj.opera_type = this.type
              if (this.type === 1) {
                delete _obj.OastMatiles
              } else {
                const _OastObj = this.boxList.find(d => Number(d.OastNo) === Number(this.ruleForm.OastNo))
                _obj.OastMatiles = _OastObj.OastMatiles
              }
            }
            this.submit = true
            await _api('post', null, { data: _obj })
            this.$message.success('操作成功')
            this.submit = false
          } catch (e) {
            this.submit = false
          }
        } else {
          return false
        }
      })
    },
    showDialog(val) {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.dialogVisible = true
      this.type = val
    },
    temperatureDialog() {
      this.dialogFormData = []
      this.dialogVisibleSet = true
      this.getDialogFormData()
    },
    async getDialogFormData() {
      try {
        this.loadingDialog = true
        const data = await hfConfigSet('get', null, { })
        this.dialogFormData = data.results || []
      } catch (e) {
        //
      }
      this.loadingDialog = false
    },
    saveAll() {
      if (!this.dialogFormData.length) {
        this.$message({
          message: '暂无可提交的数据!'
        })
        return
      }
      this.saveSet(this.dialogFormData)
    },
    delSet(row, index) {
      if (row.id) {
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          hfConfigSet('post', null, { data: { delete_data: row.id }})
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.dialogFormData.splice(index, 1)
            }).catch(e => {
            //
            })
        })
      } else {
        this.dialogFormData.splice(index, 1)
      }
    },
    async saveSet(row) {
      try {
        const arr = row
        this.loadingDialog = true
        await hfConfigSet('post', null, { data: { set_data: arr }})
        this.$message.success('提交成功')
        this.loadingDialog = false
        this.getDialogFormData()
      } catch (e) {
        this.loadingDialog = false
      }
    },
    addSet() {
      this.dialogFormData.push({})
    },
    dialogFalse() {
      this.dialogVisibleSet = false
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
