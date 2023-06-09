<template>
  <div>
    <label style="margin-right:10px;">配料设备</label>
    <selectBatchingEquip v-model="equipValue" :read-is="readIs" :created-is="true" :is-default="true" :multiple-is="true" @changeFun="selectBatchEquip" />
    <!-- 计划管理 -->
    <div v-for="(item,index) in allTable" :key="index" class="cardBoxMy">
      <h3 style="margin-left:10px">{{ item.equip_no }}计划管理</h3>
      <div v-loading="index===currentIndex&&loading">
        <el-form :inline="true">
          <el-form-item label="日期">
            <el-date-picker
              v-model="item.search.date_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :clearable="false"
              @change="changeList(item,index)"
            />
          </el-form-item>
          <el-form-item label="班次">
            <class-select
              :is-clearable="false"
              :value-default="item.search.grouptime"
              @classSelected="classChanged($event,item,index)"
            />
          </el-form-item>
          <el-form-item label="配方">
            <recipeSelect
              v-model="item.search.recipe_id"
              :equip-no-val="item.equip_no"
              @changeFun="changeRecipeSelect($event,item,index)"
            />
            <!-- @changeFun="changeList(item,index)" -->
          </el-form-item>
          <el-form-item label="手自动状态:">
            <el-input v-model="item.search.auto" disabled style="width:80px;margin-right:8px" />
            <el-button v-permission="['xl_plan', 'auto']" type="primary" :disabled="!item.search.auto||btnAutoLoading" @click="autoChange(item,index)">手自动切换</el-button>
          </el-form-item>
          <!-- <el-form-item label="设定车次">
          <el-input v-model="item.search.setno" clearable placeholder="设定车次" @input="debounceListChange(item,index)" />
          </el-form-item> -->
          <el-form-item>
            <el-button
              v-permission="['xl_plan', 'add']"
              type="primary"
              :disabled="btnLoading1"
              @click="classDialog(item,index)"
            >班次切换</el-button>
            <el-button v-permission="['xl_plan', 'add']" type="primary" @click="addFun(item,index,true)">新增计划</el-button>
            <el-button v-permission="['xl_plan', 'delete']" type="primary" :disabled="item.currentRow&&item.currentRow.state!=='等待'||(item.equip_no==='F02'&&(item.currentRow&&Object.prototype.hasOwnProperty.call(item.currentRow, 'downtime') && item.currentRow.downtime?!!item.currentRow.downtime:false))" @click="delFun(item,index,'删除')">删除计划</el-button>
            <el-button v-permission="['xl_plan', 'issue']" type="primary" :disabled="item.currentRow&&item.currentRow.state!=='等待'||(item.equip_no==='F02'&&(item.currentRow&&Object.prototype.hasOwnProperty.call(item.currentRow, 'downtime') && item.currentRow.downtime?!!item.currentRow.downtime:false))" @click="delFun(item,index,'下达',1)">下达计划</el-button>
            <!-- <el-button v-permission="['xl_plan', 'reload']" type="primary" :disabled="item.currentRow&&item.currentRow.state!=='运行'" @click="delFun(item,index,'重传',2)">计划重传</el-button> -->
            <el-button v-permission="['xl_plan', 'change']" type="primary" :disabled="item.currentRow&&item.currentRow.state&&(item.currentRow.state).indexOf('运行')===-1" @click="addFun(item,index,false)">修改车次</el-button>
            <el-button v-permission="['xl_plan', 'stop']" type="primary" :disabled="(item.currentRow&&item.currentRow.state&&(item.currentRow.state).indexOf('运行')===-1)&&!(item.equip_no==='F02'&&(item.currentRow&&Object.prototype.hasOwnProperty.call(item.currentRow, 'downtime') && item.currentRow.downtime?!!item.currentRow.downtime:false))" @click="delFun(item,index,'停止',4)">计划停止</el-button>
            <el-button v-permission="['xl_plan', 'add']" type="primary" :disabled="item.currentRow&&item.currentRow.state!=='等待'" @click="delFun(item,index,'上移',null)">上移</el-button>
            <el-button v-permission="['xl_plan', 'add']" type="primary" :disabled="item.currentRow&&item.currentRow.state!=='等待'" @click="delFun(item,index,'下移',null)">下移</el-button>
            <el-button type="primary" @click="debounceList(item,index)">刷新</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="singleTable"
          :data="item.tableList"
          style="width: 100%"
          highlight-current-row
          border
          height="300"
          @current-change="handleCurrentChange($event,index)"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
          />
          <el-table-column
            prop="planid"
            label="计划编号"
            min-width="20"
          />
          <el-table-column
            prop="recipe"
            label="配方"
            min-width="20"
          />
          <el-table-column
            prop="starttime"
            label="开始时间"
            min-width="20"
          />
          <el-table-column
            prop="stoptime"
            label="结束时间"
            min-width="20"
          />
          <el-table-column
            prop="mix_trains"
            label="密炼车数"
            min-width="20"
          />
          <el-table-column
            prop="setno"
            label="设定车数"
            min-width="20"
          />
          <el-table-column
            prop="actno"
            label="完成车数"
            min-width="20"
          />
          <el-table-column
            prop="grouptime"
            label="班次"
            min-width="20"
          />
          <el-table-column
            prop="state"
            label="状态"
            min-width="20"
          />
          <el-table-column label="是否合包" width="110px">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.merge_flag"
                :disabled="!checkPermission(['xl_plan','merge'])"
                active-text="是"
                inactive-text="否"
                @change="changeSwitch(row,index)"
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- <page
          :old-page="false"
          :total="item.total"
          :current-page="item.search.page"
          @currentChange="currentChange(arguments,item,index)"
        /> -->
      </div>
    </div>

    <el-dialog
      :title="dialogAdd?'新增':'修改'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <div v-if="dialogAdd">
          <el-form-item label="日期" prop="date_time">
            <el-date-picker
              v-model="ruleForm.date_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="班次" prop="grouptime">
            <class-select
              :value-default="ruleForm.grouptime"
              @classSelected="dialogClassChanged"
            />
          </el-form-item>
          <el-form-item label="配方" prop="recipe_id">
            <recipeSelect
              v-model="ruleForm.recipe_id"
              :equip-no-val="ruleForm.equip_no"
              @changeFun="recipeChange"
            />
          </el-form-item>
        </div>
        <el-form-item label="密炼车数" prop="setno">
          <el-input-number
            v-model="ruleForm.setno"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="班次切换"
      :visible.sync="dialogVisible1"
      width="400px"
    >
      <el-form label-width="100px">
        <el-form-item label="班次切换">
          <class-select
            :is-clearable="false"
            :value-default="next_classes"
            @classSelected="dialogNextClassChanged"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading1" @click="submitForm1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce, checkPermission, setDate } from '@/utils'
import selectBatchingEquip from '../components/select-batching-equip'
import classSelect from '@/components/ClassSelect'
import recipeSelect from '../components/recipe-select'
import { xlPlan, upDownMove, updateFlagCount, currentFactoryDate, rotateClasses, autoMan } from '@/api/base_w_three'
// import page from '@/components/page'

export default {
  name: 'SmallMaterialWeightPlan',
  components: { selectBatchingEquip, classSelect, recipeSelect },
  data() {
    return {
      equipValue: [],
      options: [],
      currentIndex: null,
      currentSearch: {},
      currentQuip: '',
      allTable: [],
      dialogVisible: false,
      ruleForm: {
        date_time: null,
        grouptime: '',
        recipe_id: '',
        setno: undefined
      },
      rules: {
        date_time: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        grouptime: [
          { required: true, message: '请选择班次', trigger: 'change' }
        ],
        recipe_id: [
          { required: true, message: '请选择配方', trigger: 'change' }
        ],
        setno: [
          { required: true, message: '请输入密炼车数', trigger: 'blur' }
        ]
      },
      dialogAdd: false,
      loading: false,
      btnLoading: false,
      readIs: false,
      getFactoryDate: {},
      next_classes: '',
      btnLoading1: false,
      dialogVisible1: false,
      btnAutoLoading: false
    }
  },
  created() {

  },
  methods: {
    checkPermission,
    async getList() {
      try {
        // if (this.$refs['singleTable']) {
        // //   去掉当前操作的列表的 单行选中
        //   this.$refs['singleTable'].forEach((d, i) => {
        //     this.$refs['singleTable'][i].setCurrentRow()
        //   })
        // }
        this.loading = true
        this.readIs = true
        const data = await xlPlan('get', null, { params: this.currentSearch })
        this.getAutoMan(false)
        this.readIs = false
        this.loading = false
        return { data: data || [] }
        // total: data.count || 0 }
      } catch (e) {
        this.loading = false
        this.readIs = false
      }
    },
    async getAutoMan(bool, row) {
      try {
        const auto = !bool ? 2 : row.search.auto === '手动' ? 1 : 0
        this.btnAutoLoading = true
        const data1 = await autoMan('post', null, { data: { equip_no: this.currentSearch.equip_no, auto: auto }})
        if (data1 === 1) {
          this.$set(this.allTable[this.currentIndex].search, 'auto', '自动')
        } else if (data1 === 0) {
          this.$set(this.allTable[this.currentIndex].search, 'auto', '手动')
        } else {
          this.$set(this.allTable[this.currentIndex].search, 'auto', '')
        }
        if (bool) {
          this.$message.success('切换成功')
        }
        if (bool && data1 === '获取手自动模式失败') {
          this.$message.error('获取手自动模式失败')
        }
        this.btnAutoLoading = false
      } catch (e) {
        this.btnAutoLoading = false
      }
    },
    classChanged(val, row, index) {
      row.search.grouptime = val || ''
      this.debounceList(row, index)
    },
    dialogClassChanged(val) {
      this.ruleForm.grouptime = val
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
    changeRecipeSelect(val, row, index) {
      row.search.recipe = val ? val.name : ''
      this.changeList(row, index)
    },
    autoChange(row, index) {
      if (row) {
        this.currentSearch = { ...row.search, equip_no: row.equip_no }
        this.currentIndex = index
      }
      this.getAutoMan(true, row)
    },
    async debounceList(row, index) {
      try {
        if (row) {
          this.currentSearch = { ...row.search, equip_no: row.equip_no }
          this.currentIndex = index
        }
        //   获取当前改变的那个列表 替换上去
        const data = await this.getList()
        this.$set(this.allTable[this.currentIndex], 'tableList', data.data)
        this.$set(this.allTable[this.currentIndex], 'total', data.total)
      } catch (e) {
        //
      }
    },
    async getSurrentFactoryDate() {
      try {
        const data = await currentFactoryDate('get')
        this.getFactoryDate = data
        this.ruleForm.date_time = data.factory_date
        // this.ruleForm.grouptime = data.classes

        const current = setDate(false, false, 'hour').toString()
        if ((current < '08:15' && current > '07:45')) {
          this.next_classes = '早班'
        } else if (current < '16:15' && current > '15:45') {
          this.next_classes = '中班'
        } else if ((current < '20:15' && current > '19:45') ||
        (current < '24:00' && current > '23:45')) {
          this.next_classes = '晚班'
        } else {
          this.next_classes = this.getFactoryDate.classes
        }
      } catch (e) {
        //
      }
    },
    async selectBatchEquip(val) {
      await this.getSurrentFactoryDate()
      const record = this.allTable
      if (val) {
        this.allTable = []
        val.forEach(async d => {
          this.currentSearch = {
            equip_no: d.equip_no,
            date_time: this.getFactoryDate.factory_date,
            grouptime: this.getFactoryDate.classes
          }
          const b = this.allTable.filter(D => D.equip_no === d.equip_no)
          if (b.length === 0) {
            const c = record.filter(D => D.equip_no === d.equip_no)
            if (c.length > 0) {
              this.allTable.push(...c)
            } else {
              this.currentIndex = this.allTable.length
              const a = await this.getList()
              this.allTable.push(
                {
                  equip_no: d.equip_no,
                  search: { date_time: this.getFactoryDate.factory_date,
                    grouptime: this.getFactoryDate.classes },
                  tableList: a ? a.data : [],
                  total: a ? a.total : 0,
                  currentRow: {}
                }
              )
            }
          }
        })
      }
    },
    handleCurrentChange(val, index) {
      // 当前的表格是哪个表格
      this.currentIndex = index
      this.$set(this.allTable[index], 'currentRow', val)
    },
    addFun(row, index, bool) {
      // bool 是 true == 新增 否则 修改
      if (!bool) {
        if (!this.allTable[index].currentRow || JSON.stringify(this.allTable[index].currentRow) === '{}') {
          this.$message.info('请选中一行计划')
          return
        }
        this.ruleForm.actno = this.allTable[index].currentRow.actno || 0
      } else {
        this.ruleForm.actno = 0
        this.getHistoryClass(row.equip_no)
      }
      this.currentSearch = { ...row.search, equip_no: row.equip_no }
      this.currentIndex = index
      this.ruleForm.equip_no = row.equip_no
      this.dialogAdd = bool
      this.dialogVisible = true
    },
    getHistoryClass(equip_no) {
      xlPlan('get', null, { params: { get_classes: 1, equip_no: equip_no }})
        .then(response => {
          this.ruleForm.grouptime = response.results || ''
        }).catch(e => {
          //
        })
    },
    recipeChange(val) {
      this.ruleForm.recipe = val ? val.name : ''
      this.ruleForm.recipe_ver = val ? val.ver : ''
    },
    delFun(row, index, val, action) {
      if (!this.allTable[index].currentRow || JSON.stringify(this.allTable[index].currentRow) === '{}') {
        this.$message.info('请选中一行计划')
        return
      }
      this.$confirm(`是否确定${val}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _api = val === '删除' ? 'delete' : 'patch'
        let id = this.allTable[index].currentRow.id
        let _xlPlan = xlPlan
        const date_time = this.allTable[index].search.date_time

        let n_id = null
        if (['上移', '下移'].includes(val)) {
          const _index = this.allTable[index].tableList.indexOf(this.allTable[index].tableList.filter(d => d.id === id)[0])
          if (val === '上移') {
            if (_index === 0) {
              this.$message('不可移动')
              return
            }
            n_id = this.allTable[index].tableList[_index - 1].id
          } else if (val === '下移') {
            if (_index === this.allTable[index].tableList.length - 1) {
              this.$message('不可移动')
              return
            }
            n_id = this.allTable[index].tableList[_index + 1].id
            console.log(n_id, '_index')
          }
          _api = 'post'
          id = null
          _xlPlan = upDownMove
        }
        _xlPlan(_api, id, { data: { equip_no: row.equip_no, c_id: this.allTable[index].currentRow.id,
          n_id: n_id, action: action, date_time: date_time }})
          .then(response => {
            this.$message({
              type: 'success',
              message: val + '成功!'
            })
            this.debounceList(row, index)
            this.handleClose(false)
          }).catch(e => {
            //
          })
      })
    },
    releaseFun() {},
    againFun() {},
    editFun() {},
    refreshFun() {},
    stopFun() {},
    async changeSwitch(row, faI) {
      try {
        await updateFlagCount('post', null, { data: {
          equip_no: this.allTable[faI].equip_no,
          id: row.id, oper_type: '计划', merge_flag: row.merge_flag
        }})
        this.$message.success('操作成功')
      } catch (e) {
        //
      }
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.ruleForm.resetFields()
      if (done) {
        done()
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            if (this.dialogAdd) {
              await xlPlan('post', null, { data: this.ruleForm })
              this.$message.success('添加成功')
            } else {
              await xlPlan('put', this.allTable[this.currentIndex].currentRow.id, { data: { setno: this.ruleForm.setno, equip_no: this.ruleForm.equip_no, action: 3 }})
              this.$message.success('修改成功')
            }
            this.btnLoading = false
            this.handleClose(false)
            this.debounceList()
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    },
    dialogNextClassChanged(val) {
      this.next_classes = val
    },
    classDialog(item) {
      this.currentQuip = item.equip_no
      this.dialogVisible1 = true
      // this.next_classes = this.getFactoryDate.classes
    },
    async submitForm1() {
      try {
        this.btnLoading1 = true
        await rotateClasses('post', null, { data: { equip_no: this.currentQuip, next_classes: this.next_classes }})
        this.$message.success('切换成功')
        this.dialogVisible1 = false
        this.debounceList()
      } catch (e) {
        //
      }
      this.btnLoading1 = false
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
    .el-input{
      width: auto;
    }
</style>
