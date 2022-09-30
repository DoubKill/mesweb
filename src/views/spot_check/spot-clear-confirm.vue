<template>
  <div class="spot-clear-confirm">
    <!-- 日清扫检查确认 -->
    <el-form :inline="true">
      <el-form-item label="起止日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select
          style="width:100px"
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="检查表名称">
        <el-input v-model="getParams.point_standard_name" clearable @input="changDebounce" />
      </el-form-item>
      <el-form-item label="机台">
        <el-select
          v-model="getParams.equip_no"
          style="width:150px"
          placeholder="请选择"
          clearable
          @change="changSelect"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.equip_no"
            :value="item.equip_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位">
        <el-input v-model="getParams.station" style="width:150px" clearable @input="changDebounce" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="getParams.status"
          style="width:100px"
          placeholder="请选择"
          clearable
          @change="changSelect"
        >
          <el-option
            v-for="item in ['新建','已检查','已确认']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['daily_clean_table', 'export']" :loading="btnExportLoad" type="primary" style="margin-right:8px" @click="templateDownload">导出Excel</el-button>
        <el-button
          v-permission="['daily_clean_table', 'add']"
          type="primary"
          @click="onSubmit"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
      highlight-current-row
      row-key="id"
      :reserve-selection="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column
        prop="select_date"
        label="日期"
        width="90"
      />
      <el-table-column
        prop="classes"
        label="班次"
        width="60"
      />
      <el-table-column
        prop="point_standard_code"
        label="检查表编号"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="showDialog(scope.row,true,true)"
          >{{ scope.row.point_standard_code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="point_standard_name"
        label="检查表名称"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        width="60"
      />
      <el-table-column
        prop="station"
        label="岗位"
        width="150"
      />
      <el-table-column
        prop="check_result"
        label="检查结果"
        width="100"
      >
        <template slot-scope="scope">
          <span :style="{color:scope.row.check_result==='检查异常'?'red':'#606266'}">
            {{ scope.row.check_result }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="70"
      />
      <el-table-column
        prop="point_user"
        label="检查人"
        width="70"
      />
      <el-table-column
        prop="point_time"
        label="检查时间"
        width="150"
      />
      <el-table-column
        prop="confirm_user"
        label="确认人"
        width="70"
      />
      <el-table-column
        prop="confirm_time"
        label="确认时间"
        width="150"
      />
      <el-table-column label="操作" width="190">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['daily_clean_table', 'change']"
              :disabled="scope.row.finish_flag"
              size="mini"
              @click="showDialog(scope.row)"
            >检查</el-button>
            <el-button
              v-permission="['daily_clean_table', 'confirm']"
              :disabled="scope.row.status==='已确认'||!scope.row.finish_flag"
              size="mini"
              plain
              @click="showDialog(scope.row,true)"
            >确认
            </el-button>
            <el-button
              v-permission="['daily_clean_table', 'delete']"
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`岗位安全装置检查表${typeForm.id&&isLook?'确认':typeForm.id?'检查':'新建'}`"
      width="1150px"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="typeForm" :rules="rules" :model="typeForm" label-width="150px" inline>
        <el-form-item label="检查表编号">
          <el-input v-if="typeForm.id" v-model="typeForm.point_standard_code" style="width:250px" disabled />
          <el-input v-else style="width:250px" disabled />
        </el-form-item>
        <br>
        <el-form-item label="日期" prop="select_date">
          <el-date-picker
            v-model="typeForm.select_date"
            style="width:250px"
            :disabled="typeForm.id?true:false"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="班次" prop="classes">
          <class-select
            :is-clearable="false"
            :value-default="typeForm.classes"
            :is-disabled="typeForm.id?true:false"
            style="width:250px"
            @classSelected="classChanged1"
          />
        </el-form-item>
        <br>
        <el-form-item label="适用机台" prop="equip_no">
          <el-select
            v-model="typeForm.equip_no"
            :disabled="typeForm.id?true:false"
            style="width:250px"
            placeholder="请选择"
            @change="searchContent(true)"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="station">
          <el-select
            v-model="typeForm.station"
            :disabled="typeForm.id?true:false"
            style="width:250px"
            placeholder="请选择"
            @visible-change="visibleStation"
            @change="searchContent(false)"
          >
            <el-option
              v-for="item in options1"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="检查内容">
          <el-table
            :data="tableData1"
            border
            max-height="350"
            style="width: 940px"
          >
            <el-table-column
              prop="check_content"
              label="作业内容"
              width="320"
            />
            <el-table-column
              prop="check_style"
              label="检查方法"
              width="320"
            />
            <el-table-column
              prop="check_result"
              label="检查结果"
              width="150"
            >
              <template slot-scope="{row}">
                <el-select
                  v-model="row.check_result"
                  :disabled="isLook1"
                  placeholder=""
                  clearable
                  @change="changeRepaired(row)"
                >
                  <el-option
                    v-for="item in ['好','坏']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="is_repaired"
              label="是否整改"
              width="149"
            >
              <template slot-scope="{row}">
                <el-checkbox v-model="row.is_repaired" :disabled="isLook1||row.check_result==='好'||!row.check_result">已整改</el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            v-if="!isLook1"
            ref="elUploadImg"
            :disabled="isLook"
            action=""
            :on-remove="handleRemove"
            :file-list="objList"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="onChangeImg"
            :on-exceed="onExceed"
            :limit="5"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleImg" :modal-append-to-body="false" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
          <template v-for="(item, index) in typeForm.check_image_urls">
            <el-image
              v-if="isLook1&&typeForm.check_image_urls.length>0"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            />
          </template>
          <div v-if="typeForm.id&&isLook1&&typeForm.check_image_urls.length===0">
            暂无图片
          </div>
        </el-form-item>
        <br>
        <el-form-item v-if="isLook" label="异常确认说明">
          <el-input
            v-model="typeForm.confirm_desc"
            :disabled="isLook1"
            type="textarea"
            :rows="4"
            style="width:350px"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button
          v-if="!isLook1&&!isLook"
          type="primary"
          :loading="btnLoading"
          @click="handleEdit(false)"
        >{{ '保 存' }}</el-button>
        <el-button
          v-if="!isLook1"
          type="primary"
          :loading="btnLoading"
          @click="handleEdit(true)"
        >{{ isLook?'确 认':'提 交' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { getEquip } from '@/api/banburying-performance-manage'
import { dailyCleanTable, dailyCleanStandard, dailyCleanTableExport, uploadImages } from '@/api/jqy'
import classSelect from '@/components/ClassSelect'
import { setDate } from '@/utils'

export default {
  name: 'SpotClearConfirm',
  components: { page, classSelect },
  data: function() {
    return {
      dateValue: [],
      tableData: [],
      tableData1: [],
      point_standard_code: null,
      dialogEditVisible: false,
      typeForm: {},
      rules: {
        select_date: [{ required: true, message: '不能为空', trigger: 'blur' }],
        station: [{ required: true, message: '不能为空', trigger: 'blur' }],
        classes: [{ required: true, message: '不能为空', trigger: 'change' }],
        equip_no: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      getParams: {
        standard_type: '日清扫',
        page: 1
      },
      excelParams: {
        ids: []
      },
      objList: [],
      dialogImageUrl: '',
      dialogVisibleImg: false,
      multipleSelection: [],
      isLook: false,
      isLook1: false,
      currentPage: 1,
      total: 1,
      loading: false,
      options: [],
      options1: [],
      btnLoading: false,
      btnExportLoad: false
    }
  },
  created() {
    this.getList()
    this.visibleChange()
  },
  methods: {
    async visibleChange() {
      const obj = { all: 1, category_name: '密炼设备' }
      getEquip(obj).then(response => {
        this.options = response.results
        this.options.push({ id: 16, equip_no: '190E' })
      })
    },
    async visibleStation(val) {
      if (val) {
        if (this.typeForm.equip_no) {
          const data = await dailyCleanStandard('get', null, { params: { all_station: this.typeForm.equip_no, standard_type: '日清扫' }})
          this.options1 = data.results
        } else {
          this.$message('请先选择机台')
        }
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await dailyCleanTable('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.total = data.count || 0
        this.loading = false
      } catch (error) {
        this.loading = false
        this.tableData = []
      }
    },
    handleClose(done) {
      this.dialogEditVisible = false
      this.tableData1 = []
      this.typeForm = {}
      setTimeout(d => {
        this.$refs.typeForm.clearValidate()
      })
      if (done) {
        done()
      }
    },
    onSubmit() {
      this.isLook = false
      this.isLook1 = false
      this.objList = []
      this.dialogEditVisible = true
      this.typeForm = { select_date: setDate(), classes: null }
    },
    async searchContent(val) {
      if (val) {
        this.typeForm.station = null
        this.typeForm.check_point_standard = null
        this.typeForm.point_standard_code = null
        this.typeForm.point_standard_name = null
        this.tableData1 = []
        return
      }
      if (!this.typeForm.equip_no) {
        this.$message.info('请选择适用机台')
      } else if (!this.typeForm.station) {
        this.$message.info('请选择岗位')
      } else {
        const data = await dailyCleanTable('get', null, { params: { all_detail: 1, equip_no: this.typeForm.equip_no, station: this.typeForm.station }})
        this.typeForm.check_point_standard = data.check_point_standard
        this.typeForm.point_standard_code = data.point_standard_code
        this.typeForm.point_standard_name = data.point_standard_name
        this.tableData1 = data.table_details
      }
    },
    changSelect() {
      this.getParams.page = 1
      this.getList()
    },
    changDebounce() {
      this.$debounce(this, 'changSelect')
    },
    onExceed() {
      this.$message.info('最多上传五张图片')
    },
    async onChangeImg(file, fileList) {
      const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.raw.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg、jpg 、png格式!')
        fileList.pop()
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        fileList.pop()
        return
      }
      const picture = new FormData()
      picture.append('image_file_name', file.raw)
      picture.append('source_type', '点检')
      try {
        const data = await uploadImages('post', null, { data: picture })
        this.objList.push({ url: data.image_file_name })
      } catch (e) {
        this.$set(this, 'objList', this.objList)
      }
    },
    handleRemove(file, fileList) {
      this.objList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleImg = true
    },
    changeDate(arr) {
      this.getParams.select_date_after = arr ? arr[0] : ''
      this.getParams.select_date_before = arr ? arr[1] : ''
      this.getList()
    },
    classChanged(val) {
      this.getParams.classes = val
      this.getParams.page = 1
      this.getList()
    },
    changeRepaired(row) {
      if (row.check_result === '好' || !row.check_result) {
        this.$set(row, 'is_repaired', false)
      }
    },
    classChanged1(val) {
      this.$set(this.typeForm, 'classes', val)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showDialog(row, val, val1) {
      if (val) {
        this.isLook = true
      } else {
        this.isLook = false
      }
      if (val1) {
        this.isLook1 = true
      } else {
        this.isLook1 = false
      }
      this.typeForm = JSON.parse(JSON.stringify(row))
      this.typeForm.check_image_urls = []
      if (row.check_image_urls) {
        this.typeForm.check_image_urls = row.check_image_urls.split(',')
      }
      this.objList = []
      if (this.typeForm.check_image_urls.length > 0) {
        this.typeForm.check_image_urls.forEach(d =>
          this.objList.push({ url: d })
        )
      } else {
        this.objList = []
      }
      this.tableData1 = this.typeForm.table_details
      this.dialogEditVisible = true
    },
    handleDelete: function(row) {
      this.$confirm('此操作将删除' + row.point_standard_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dailyCleanTable('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    handleEdit: function(val) {
      this.$refs.typeForm.validate(async(valid) => {
        if (valid) {
          this.typeForm.standard_type = '日清扫'
          if (this.typeForm.id) {
            this.typeForm.ids = [this.typeForm.id]
            this.typeForm.opera_type = (this.isLook ? 2 : 1)
          }
          try {
            const url = []
            this.objList.forEach(d => url.push(d.url))
            this.typeForm.check_image_urls = url.join(',')
            if (this.tableData1.length === 0) {
              throw new Error('检查内容未添加,请选择机台及岗位来获取检查内容')
            }
            if (!this.typeForm.id) {
              this.typeForm.table_details = this.tableData1
            }
            this.typeForm.finish_flag = 0
            if (val) {
              if (!this.tableData1.every(d => d.check_result === '好' || d.check_result === '坏')) {
                throw new Error('检查内容中检查结果必须全填')
              }
              this.typeForm.finish_flag = 1
            }
            this.btnLoading = true
            this.typeForm.id ? await dailyCleanTableExport('post', null, { data: this.typeForm }) : await dailyCleanTable('post', null, { data: this.typeForm })
            this.btnLoading = false
            this.handleClose(false)
            this.$message.success('操作成功')
            this.getList()
          } catch (e) {
            this.btnLoading = false
            if (e.message) {
              this.$message(e.message)
            }
          }
        }
      })
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
    },
    templateDownload() {
      if (this.multipleSelection.length > 0) {
        this.excelParams.ids = []
        this.multipleSelection.forEach(d => {
          this.excelParams.ids.push(d.id)
        })
        this.btnExportLoad = true
        this.excelParams.opera_type = 3
        dailyCleanTableExport('post', null, { responseType: 'blob', data: this.excelParams }).then(response => {
          const link = document.createElement('a')
          const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '日清扫检查确认表.xls' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.$refs.multipleTable.clearSelection()
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
      } else {
        this.$message.info('请选择导出数据')
      }
    }
  }
}

</script>
<style lang="scss">
.spot-clear-confirm{
  .el-dialog{
    margin-top:10vh !important
  }
}
</style>
