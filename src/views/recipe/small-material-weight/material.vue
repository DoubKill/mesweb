<template>
  <div>
    <label style="margin-right:10px;">配料设备</label>
    <selectBatchingEquip v-model="equipValue" :created-is="true" :is-default="true" :multiple-is="true" @changeFun="selectBatchEquip" />
    <!-- 物料管理 -->
    <div v-for="(item,index) in allTable" :key="index" class="cardBoxMy">
      <h3 style="margin-left:10px">{{ item.equip_no }}物料列表</h3>
      <el-form :inline="true">
        <el-form-item label="物料名称">
          <el-input v-model="item.search.name" clearable placeholder="物料名称" @input="debounceListChange(item,index)" />
        </el-form-item>
        <el-form-item label="物料代码">
          <el-input v-model="item.search.code" clearable placeholder="物料代码" @input="debounceListChange(item,index)" />
        </el-form-item>
        <el-form-item label="是否使用">
          <el-select v-model="item.search.use_not" clearable placeholder="请选择" @change="debounceList(item,index)">
            <el-option
              v-for="itemChild in [{name:'已使用',value:0},{name:'未使用',value:1}]"
              :key="itemChild.value"
              :label="itemChild.name"
              :value="itemChild.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-button v-permission="['xl_material', 'add']" type="primary" @click="showAdd(item,index)">新增</el-button>
        </el-form-item> -->
      </el-form>
      <el-table
        :data="item.tableList"
        style="width: 100%"
        max-height="300px"
      >
        <el-table-column
          type="index"
          label="序号"
        />
        <el-table-column
          prop="name"
          label="物料名称"
        />
        <el-table-column
          prop="code"
          label="物料代码"
        />
        <el-table-column
          prop="time"
          label="修改时间"
        />
        <el-table-column
          prop="use_not"
          label="是否使用"
          :formatter="(row)=>{
            if(row.use_not){
              return '未使用'
            }
            return '已使用'
          }"
        />
        <el-table-column
          prop="remark"
          label="来源"
          :formatter="(row)=>{
            if(row.remark==='MES'){
              return 'MES'
            }
            return '本地'
          }"
        />
        <!-- <el-table-column
          prop="address"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                plain
                @click="showEdit(scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="showDel(scope.row)"
              >删除</el-button>
            </el-button-group>
          </template>
        </el-table-column> -->
      </el-table>
    </div>

    <el-dialog
      :title="ruleForm.id?'编辑':'新增'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="物料名称" prop="name">
          <el-input v-model="ruleForm.name" :disabled="!!ruleForm.id" />
        </el-form-item>
        <el-form-item label="物料代码" prop="code">
          <el-input v-model="ruleForm.code" :disabled="!!ruleForm.id" />
        </el-form-item>
        <el-form-item label="" prop="use_not">
          <el-checkbox v-model="ruleForm.use_not">停用</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button v-loading="btnLoading" type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import selectBatchingEquip from '../components/select-batching-equip'
import { xlMaterial } from '@/api/base_w_three'
export default {
  name: 'SmallMaterialWeightMaterial',
  components: { selectBatchingEquip },
  data() {
    return {
      equipValue: [],
      options: [],
      allTable: [],
      dialogVisible: false,
      ruleForm: {
        name: '',
        code: '',
        use_not: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      currentSearch: {},
      currentIndex: '',
      btnLoading: false
    }
  },
  methods: {
    async getList() {
      try {
        const data = await xlMaterial('get', null, { params: this.currentSearch })
        return data
      } catch (e) {
        //
      }
    },
    showEdit(row) {
      this.ruleForm = JSON.parse(JSON.stringify(row))
      this.ruleForm.use_not = !!this.ruleForm.use_not
      this.dialogVisible = true
    },
    debounceListChange(row, index) {
      this.currentSearch = { ...row.search, equip_no: row.equip_no }
      this.currentIndex = index
      debounce(this, 'debounceList')
    },
    async debounceList(row, index) {
      try {
        if (row) {
          this.currentSearch = { ...row.search, equip_no: row.equip_no }
          this.currentIndex = index
        }
        //   获取当前改变的那个列表 替换上去
        const data = await this.getList()
        this.allTable[this.currentIndex].tableList = data
      } catch (e) {
        //
      }
    },
    showDel(row) {

    },
    showAdd(row, index) {
      this.currentSearch = { ...row.search, equip_no: row.equip_no }
      this.currentIndex = index
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      this.ruleForm = {
        name: '',
        code: '',
        use_not: 0
      }
      this.$refs.ruleForm.resetFields()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.ruleForm.use_not = this.ruleForm.use_not ? 1 : 0
            const ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
            ruleForm.equip_no = this.currentSearch.equip_no
            const _api = ruleForm.id ? 'patch' : 'post'
            this.btnLoading = true
            await xlMaterial(_api, ruleForm.id || '', { data: ruleForm })
            this.handleClose(false)
            this.debounceList()
            this.btnLoading = false
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    },
    selectBatchEquip(val) {
      const record = this.allTable
      if (val) {
        this.allTable = []
        val.forEach(async d => {
          this.currentSearch = {
            equip_no: d.equip_no
          }
          const b = this.allTable.filter(D => D.equip_no === d.equip_no)
          if (b.length === 0) {
            const c = record.filter(D => D.equip_no === d.equip_no)
            if (c.length > 0) {
              this.allTable.push(...c)
            } else {
              const a = await this.getList()
              this.allTable.push(
                {
                  equip_no: d.equip_no,
                  search: {},
                  tableList: a
                }
              )
            }
          }
        })
      }
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
</style>
