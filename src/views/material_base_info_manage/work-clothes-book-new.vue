
<template>
  <div v-loading="loading">
    <!-- 工装管理台账  新 -->
    <el-form :inline="true">
      <el-form-item label="年">
        <el-date-picker
          v-model="search.year"
          type="year"
          value-format="yyyy"
          placeholder="选择年"
          :clearable="false"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button
          v-permission="['tool_manage_account', 'add']"
          type="primary"
          :loading="btnLoading"
          @click="submitFun"
        >保存</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      max-height="650"
      :data="tableData"
      border
    >
      <el-table-column
        prop="toolingName"
        width="168"
        label="工装名称"
        :fixed="!isExport"
      >
        <template slot-scope="{row,$index}">
          <el-input v-if="!isExport" v-model="row.toolingName" style="width:110px" placeholder="请输入" />
          <span v-else>{{ row.toolingName }}</span>
          <i v-if="$index===tableData.length-1" class="el-icon-circle-plus-outline icon-size" @click="addTable" />
          <i v-if="$index!==0" class="el-icon-remove-outline icon-size" @click="delTable($index)" />
        </template>
      </el-table-column>
      <el-table-column
        prop="useArea"
        align="center"
        width="120"
        label="使用区域"
        :fixed="!isExport"
      >
        <template slot-scope="{row}">
          <el-input v-if="!isExport" v-model="row.useArea" placeholder="请输入" />
          <span v-else>{{ row.useArea }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="imageUrl"
        align="center"
        width="178"
        label="工装图片"
        :fixed="!isExport"
      >
        <template slot-scope="{row,$index}">
          <el-upload
            v-if="!isExport"
            class="avatar-uploader"
            :action="actionUrl"
            :data="{source_type:'工装'}"
            name="image_file_name"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
            accept=".jpg"
          >
            <span
              v-if="row.imageUrl"
              class="el-upload-list__item-preview"
              @click.stop="handlePictureCardPreview(row.imageUrl)"
            >
              <i class="el-icon-zoom-in" />
            </span>
            <img v-if="row.imageUrl" :src="row.imageUrl" class="avatar" @click="clickAvatar($index)">
            <i v-else class="el-icon-plus avatar-uploader-icon" @click="clickAvatar($index)" />
          </el-upload>
          <img v-else-if="isExport&&row.imageUrl" :src="row.imageUrl" alt="" srcset="">
        </template>
      </el-table-column>
      <el-table-column
        prop="toolingSize"
        align="center"
        width="140"
        label="工装尺寸(长*宽*高)cm"
        :fixed="!isExport"
      >
        <template slot-scope="{row}">
          <el-input v-if="!isExport" v-model="row.toolingSize" placeholder="请输入" />
          <span v-else>{{ row.toolingSize }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item,index) in tableheaderAdd"
        :key="index"
        align="center"
      >
        <template slot="header" slot-scope="{row}">
          <el-input v-if="!isExport" v-model="tableheaderAdd[index]" style="width:120px" @input="changeDom($event,tableheaderAdd,index)" />
          <span v-else>{{ tableheaderAdd[index] }}</span>
          <i v-if="index===tableheaderAdd.length-1" class="el-icon-circle-plus-outline icon-size" size="30" @click="addTableheader()" />
          <i v-if="index!==0" class="el-icon-remove-outline icon-size" size="30" @click="deleteTableheader(index)" />
          <span v-if="false">{{ row }}</span>
        </template>
        <el-table-column align="center" label="购置数量" min-width="120">
          <template slot-scope="{row}">
            <el-input-number v-if="!isExport" v-model="row[index+'购置']" :disabled="tableheaderAdd[index]===''" style="width:100px" controls-position="right" :min="0" />
            <span v-else>{{ row[index+'购置'] }}</span>
          </template>
        </el-table-column>
        <el-table-column :key="2" align="center" label="实际运转数量" min-width="120">
          <template slot-scope="{row}">
            <el-input-number v-if="!isExport" v-model="row[index+'实际']" :disabled="tableheaderAdd[index]===''" style="width:100px" controls-position="right" :min="0" />
            <span v-else>{{ row[index+'实际'] }}</span>
          </template>
        </el-table-column>
        <el-table-column :key="3" align="center" label="损坏数量" min-width="120">
          <template slot-scope="{row}">
            <el-input-number v-if="!isExport" v-model="row[index+'损坏']" :disabled="tableheaderAdd[index]===''" style="width:100px" controls-position="right" :min="0" />
            <span v-else>{{ row[index+'损坏'] }}</span>
          </template>
        </el-table-column>
        <el-table-column :key="4" align="center" label="备注" min-width="130">
          <template slot-scope="{row}">
            <el-input v-if="!isExport" v-model="row[index+'备注']" :disabled="tableheaderAdd[index]===''" style="width:100px" />
            <span v-else>{{ row[index+'备注'] }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { setDate, exportExcel } from '@/utils'
import { toolManageAccount } from '@/api/base_w_five'
export default {
  name: 'RubberAccessRepair',
  data() {
    return {
      search: { year: setDate(false, false, 'month') },
      data: '',
      loading: false,
      tableheaderAdd: [],
      btnExportLoad: false,
      isExport: false,
      btnLoading: false,
      tableData: [],
      currentIndex: null,
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  created() {
    this.getList()
    this.actionUrl = (process.env.NODE_ENV === 'development' ? 'http://10.10.120.40:9009/' : '') + 'api/v1/equipment/upload-images/'
  },
  methods: {
    changeDom(val, table, index) {
      table[index] = val
      this.$nextTick(() => this.$forceUpdate())
    },
    async getList() {
      try {
        this.loading = true
        const data = await toolManageAccount('get', null, { params: this.search })
        this.tableheaderAdd = data.results.day
        this.tableData = data.results.content || []
        if (this.tableheaderAdd.length === 0) {
          this.tableheaderAdd = ['']
        }
        if (this.tableData.length === 0) {
          this.tableData = [{}]
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async submitFun() {
      const isLike = Array.from(new Set(this.tableheaderAdd)).length < this.tableheaderAdd.length
      if (!isLike) {
        try {
          const obj = {
            year: this.search.year,
            content: this.tableData,
            day: this.tableheaderAdd
          }
          this.btnLoading = true
          await toolManageAccount('post', null, { data: obj })
          this.$message.success('保存成功')
          this.btnLoading = false
          this.getList()
        } catch (e) {
          this.btnLoading = false
        }
      } else {
        this.$message.info('有相同表头数据,请检查')
        return
      }
    },
    clickAvatar(index) {
      this.currentIndex = index
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res) {
      const _url = process.env.NODE_ENV === 'development' ? 'http://10.10.120.40:9009' : ''
      this.$set(this.tableData[this.currentIndex], 'imageUrl', _url + res.image_file_name)
    },
    handleAvatarError() {
      this.$message.error('上传失败!')
    },
    addTableheader() {
      this.tableheaderAdd.push('')
      this.$nextTick(() => this.$forceUpdate())
    },
    deleteTableheader(index) {
      this.tableheaderAdd.splice(index, 1)
    },
    addTable() {
      this.tableData.push({})
    },
    delTable(index) {
      this.tableData.splice(index, 1)
    },
    async exportTable() {
      this.btnExportLoad = true
      this.loading = true
      setTimeout(d => {
        this.isExport = true
        setTimeout(d => {
          exportExcel('工装管理台账')
          this.isExport = false
          this.btnExportLoad = false
          this.loading = false
        }, 1000)
      }, 100)
    }
  }
}
</script>

  <style lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .el-upload-list__item-preview{
    position: absolute;
    top: 78px;
    left: 78px;
    font-size: 40px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .icon-size{
    font-size: 20px;
    vertical-align: middle;
  }
  </style>
