<template>
  <div v-loading="loading">
    <!-- 称量系统料仓信息管理 -->
    <el-form :inline="true" :model="getParams">
      <el-form-item label="配料设备">
        <select-batching-equip
          v-model="getParams.equip_id"
          :created-is="true"
          :is-default="true"
          @changeFun="changeEquip"
        />
      </el-form-item>
      <el-form-item label="料仓编码">
        <el-input v-model="getParams.tank_no" @input="setList" />
      </el-form-item>
      <el-form-item label="物料编码">
        <materialCodeSelect :is-all-obj="true" @changeSelect="materialCodeChange" />
      </el-form-item>
      <el-form-item label="料罐状态">
        <el-select
          v-model="getParams.status"
          placeholder="请选择"
          clearable
          @change="setList"
        >
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['weight_tank','add']" @click="add">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        width="40"
        label="No"
      />
      <el-table-column
        prop="equip_no"
        label="配料设备"
      />
      <el-table-column
        prop="tank_no"
        label="料仓编码"
      />
      <el-table-column
        prop="material_no"
        label="物料编码"
      />
      <el-table-column
        prop="material_name"
        label="物料名称"
      />
      <el-table-column
        label="料罐状态"
      >
        <template slot-scope="{row}">
          {{ row.status === 1?'低位':'高位' }}
        </template>
      </el-table-column>
      <el-table-column
        label="开门状态"
      >
        <template slot-scope="{row}">
          {{ row.open_flag?'开':'关' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['weight_tank','change']"
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['weight_tank','delete']"
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >{{ scope.row.use_flag?'停用':'启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="currentObj.id?'编辑':'新建'"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
      class="dialog-style"
    >
      <el-form
        ref="ruleForm"
        :model="currentObj"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="配料设备" prop="equip_id">
          <select-batching-equip
            v-model="currentObj.equip_id"
            :read-is="currentObj.id?true:false"
            @changeFun="changeEquipDialog"
          />
        </el-form-item>
        <el-form-item label="料仓编码" prop="tank_no">
          <el-input
            v-model="currentObj.tank_no"
            :disabled="currentObj.id?true:false"
          />
        </el-form-item>
        <el-form-item label="料仓名称" prop="tank_name">
          <el-input v-model="currentObj.tank_name" />
        </el-form-item>
        <el-form-item label="物料编码" prop="material_no">
          <materialCodeSelect
            :is-all-obj="true"
            :default-val="currentObj.material_no"
            @changeSelect="materialCodeCurrent"
          />
        </el-form-item>
        <el-form-item label="物料名称" prop="material_name">
          <materialCodeSelect
            :is-all-obj="true"
            :default-val="currentObj.material_name"
            label-name="material_name"
            @changeSelect="materialCodeCurrent"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import selectBatchingEquip from '../components/select-batching-equip'
// import materialTankSelect from '@/components/select_w/materialTank'
import materialCodeSelect from '@/components/materialCodeSelect'
import { weightingTackStatus } from '@/api/base_w_two'
export default {
  name: 'MaterialTank',
  components: { selectBatchingEquip, materialCodeSelect },
  data() {
    return {
      getParams: {},
      dialogVisible: false,
      loading: false,
      tableData: [],
      currentObj: {},
      statusList: [{ id: 2, name: '高位' }, { id: 1, name: '低位' }],
      rules: {
        equip_id: [
          { required: true, message: '请选择配料设备', trigger: 'change' }
        ],
        tank_no: [
          { required: true, message: '请填写料仓编码', trigger: 'blur' }
        ],
        tank_name: [
          { required: true, message: '请填写料仓名称', trigger: 'blur' }
        ],
        material_no: [
          { required: true, message: '请选择物料编码', trigger: 'change' }
        ],
        material_name: [
          { required: true, message: '请选择物料名称', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await weightingTackStatus('get', null, { params: this.getParams })
        this.tableData = data || []
      } catch (e) {
        //
      }
      this.loading = false
    },
    changeEquip(val) {
      this.getParams.equip_id = val.id
      this.getParams.equip_no = val.equip_no
      this.getList()
    },
    changeEquipDialog(obj) {
      this.currentObj.equip_no = obj ? obj.equip_no : ''
    },
    setList() {
      this.getList()
    },
    materialCodeChange(obj) {
      this.getParams.material_no = obj ? obj.material_no : ''
      this.getList()
    },
    materialCodeCurrent(obj) {
      this.$set(this.currentObj, 'material_name', obj ? obj.material_name : '')
      this.$set(this.currentObj, 'material_no', obj ? obj.material_no : '')
    },
    add() {
      this.currentObj = {}
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.dialogVisible = true
    },
    handleClose(done) {
      this.currentObj = {}
      this.$refs.ruleForm.resetFields()
      if (done) {
        done()
      }
    },
    showEditDialog(row) {
      this.dialogVisible = true
      this.currentObj = JSON.parse(JSON.stringify(row))
      this.currentObj.equip_id = this.getParams.equip_id
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.tank_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await weightingTackStatus('delete', row.id)
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.getList()
      })
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          const _post = this.currentObj.id ? 'put' : 'post'
          this.currentObj.status = this.currentObj.status || 2
          // this.currentObj.open_flag = this.currentObj.open_flag || 2
          await weightingTackStatus(_post, this.currentObj.id || null,
            { data: this.currentObj })
          this.dialogVisible = false
          this.handleClose()
          this.$message.success('操作成功')
          this.getList()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.dialog-style{
.el-input{
    width: 250px;
  }
}
</style>
