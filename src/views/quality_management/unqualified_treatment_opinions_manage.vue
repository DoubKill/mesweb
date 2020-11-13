<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <!-- <el-button style="float: right" @click="handleNewType">新增</el-button> -->
        <el-table
          style="margin-top: 40px"
          :data="disposeTypeList"
          border
          highlight-current-row
          @current-change="disposeTypeCurrentRowChange"
        >
          <el-table-column type="index" label="No" align="center" />
          <el-table-column label="公用代码" width="80" align="center" prop="global_no" />
          <el-table-column label="处理类型" align="center" prop="global_name" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                @click="handleUpdateType(row)"
              >编辑</el-button>
              <!-- <el-button
                size="mini"
                type="danger"
                @click="handleDisposeTypeDelete(row)"
              >删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-button v-permission="['deal_suggestion','add']" style="float: right" :disabled="!disposeTypeCurrentRow" @click="handleNewOpinion">新增</el-button>
        <el-table
          border
          :data="opinionsList"
        >
          <el-table-column type="index" label="No" align="center" />
          <el-table-column label="处理意见" prop="suggestion_desc" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                v-permission="['deal_suggestion','change']"
                size="mini"
                @click="handleUpdateOpinion(row)"
              >编辑</el-button>
              <!-- <el-button
                size="mini"
                type="danger"
                @click="(row)"
              >删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      :title="textMap[dialogDisposeStatus] + '处理类型'"
      :visible.sync="dialogDisposeTypeVisible"
      :append-to-body="true"
    >
      <el-form ref="disposeTypeForm" :model="disposeTypeForm" :rules="disposeTypeRules">
        <el-form-item label="处理类型" label-width="110px" prop="global_name">
          <el-input v-model="disposeTypeForm.global_name" />
        </el-form-item>
        <el-form-item label="公用代码编号" label-width="110px" prop="global_no">
          <el-input v-model="disposeTypeForm.global_no" :disabled="dialogDisposeStatus==='update'" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDisposeTypeVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogDisposeStatus==='create'?createDisposeType():updateDisposeType()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="textMap[disposeOpinionStatus] + '处理意见'"
      :visible.sync="dialogOpinionVisible"
      :append-to-body="true"
    >
      <el-form ref="disposeOpinionForm" :model="disposeOpinionForm" :rules="disposeOpinionRules">
        <el-form-item label="处理意见" label-width="110px" prop="suggestion_desc">
          <el-input v-model="disposeOpinionForm.suggestion_desc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOpinionVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="disposeOpinionStatus==='create'?createOpinion():updateOpinion()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { disposeTypes, disposeTypeGlobalType, editDisposeType, dealSuggestion, editDealSuggestion } from '@/api/dispose-type'

export default {
  data() {
    return {
      globalType: null,
      disposeTypeList: [],
      dialogDisposeTypeVisible: false,
      dialogOpinionVisible: false,
      disposeTypeForm: {
        global_name: '',
        global_no: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogDisposeStatus: '',
      disposeTypeRules: {
        global_name: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
        global_no: [{ required: true, message: '该字段不能为空', trigger: 'blur' }]
      },
      disposeTypeCurrentRow: null,
      opinionsList: [],
      disposeOpinionStatus: '',
      disposeOpinionForm: {
        suggestion_desc: ''
      },
      disposeOpinionRules: {
        suggestion_desc: [{ required: true, message: '该字段不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getDisposeTypeGlobalType()
    this.getDisposeTypes()
  },
  methods: {
    disposeTypeCurrentRowChange(row) {
      this.disposeTypeCurrentRow = row
      this.opinionsList = []
      if (row) {
        dealSuggestion(row.id).then(response => {
          this.opinionsList = response.results
        })
      }
    },
    async getDisposeTypeGlobalType() {
      try {
        const response = await disposeTypeGlobalType()
        this.globalType = response.results[0].id
      // eslint-disable-next-line no-empty
      } catch (e) {
      }
    },
    async getDisposeTypes() {
      try {
        const response = await disposeTypes()
        this.disposeTypeList = response.results
        // console.log(response)
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    handleNewType() {
      this.disposeTypeForm = {
        global_name: '',
        global_no: ''
      }
      this.dialogDisposeStatus = 'create'
      this.dialogDisposeTypeVisible = true
      this.$nextTick(() => {
        this.$refs['disposeTypeForm'].clearValidate()
      })
    },
    handleUpdateType(row) {
      this.disposeTypeForm = Object.assign({}, row)
      this.dialogDisposeStatus = 'update'
      this.dialogDisposeTypeVisible = true
      this.$nextTick(() => {
        this.$refs['disposeTypeForm'].clearValidate()
      })
    },
    createDisposeType() {
      this.$refs['disposeTypeForm'].validate((valid) => {
        if (valid) {
          editDisposeType('post', null, {
            ...this.disposeTypeForm,
            global_type: this.globalType
          }).then(() => {
            this.dialogDisposeTypeVisible = false
            this.getDisposeTypes()
            this.$notify({
              title: '成功',
              message: `${this.disposeTypeForm.global_name}创建成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateDisposeType() {
      this.$refs['disposeTypeForm'].validate((valid) => {
        if (valid) {
          editDisposeType('patch', this.disposeTypeForm.id, {
            global_name: this.disposeTypeForm.global_name
          }).then(() => {
            this.dialogDisposeTypeVisible = false
            this.getDisposeTypes()
            this.$notify({
              title: '成功',
              message: `${this.disposeTypeForm.global_name}修改成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleNewOpinion() {
      this.disposeOpinionForm = {
        suggestion_desc: ''
      }
      this.disposeOpinionStatus = 'create'
      this.dialogOpinionVisible = true
      this.$nextTick(() => {
        this.$refs['disposeOpinionForm'].clearValidate()
      })
    },
    createOpinion() {
      this.$refs['disposeOpinionForm'].validate((valid) => {
        if (valid) {
          editDealSuggestion('post', null, {
            deal_type: this.disposeTypeCurrentRow.id,
            ...this.disposeOpinionForm
          }).then(() => {
            this.dialogOpinionVisible = false
            this.disposeTypeCurrentRowChange(this.disposeTypeCurrentRow)
            this.$notify({
              title: '成功',
              message: `${this.disposeOpinionForm.suggestion_desc}创建成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdateOpinion(row) {
      this.disposeOpinionForm = Object.assign({}, row)
      this.disposeOpinionStatus = 'update'
      this.dialogOpinionVisible = true
      this.$nextTick(() => {
        this.$refs['disposeOpinionForm'].clearValidate()
      })
    },
    updateOpinion() {
      this.$refs['disposeOpinionForm'].validate((valid) => {
        if (valid) {
          editDealSuggestion('patch', this.disposeOpinionForm.id, {
            suggestion_desc: this.disposeOpinionForm.suggestion_desc
          }).then(() => {
            this.dialogOpinionVisible = false
            this.disposeTypeCurrentRowChange(this.disposeTypeCurrentRow)
            this.$notify({
              title: '成功',
              message: `${this.disposeOpinionForm.suggestion_desc}修改成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
    // handleDisposeTypeDelete(row) {

    // }
  }
}
</script>
