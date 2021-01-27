<template>
  <div>
    <!-- 设备维修单管理 -->
    <el-form :inline="true">
      <el-form-item label="日期:">
        <el-date-picker
          v-model="search.time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="设备编码:">
        <el-input v-model="search.a" @input="changeList" />
      </el-form-item>
      <el-form-item label="设备编码:">
        <el-input v-model="search.b" @input="changeList" />
      </el-form-item>
      <el-form-item label="设备编码:">
        <el-input v-model="search.c" @input="changeList" />
      </el-form-item>
      <el-form-item class="button-right">
        <el-button @click="add">新建</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        label="No"
        width="40"
      />
      <el-table-column
        prop="date"
        label="时间"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="单号"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="设备编码"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="设备名称"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="设备部位"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="初步诊断"
        min-width="20"
        show-overflow-tooltip
      />
      <el-table-column
        prop="address"
        label="故障原因"
        min-width="20"
        show-overflow-tooltip
      />
      <el-table-column
        prop="address"
        label="状态"
        min-width="20"
      />

      <el-table-column
        prop="name"
        label="维护人"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="操作"
        min-width="32"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              style="margin-bottom:2px"
              size="mini"
              type="primary"
              @click="add(scope.row)"
            >派发
            </el-button>
            <el-button
              style="margin-bottom:2px"
              size="mini"
              @click="add(scope.row)"
            >关闭
            </el-button>
            <el-button
              style="margin-bottom:2px"
              size="mini"
              type="warning"
              @click="add(scope.row)"
            >认领
            </el-button>
            <el-button
              style="margin-bottom:2px"
              size="mini"
              type="info"
              @click="add(scope.row)"
            >退单
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="确认人"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="维修开始时间"
        min-width="20"
        show-overflow-tooltip
      />
      <el-table-column
        prop="address"
        label="维修结束时间"
        min-width="20"
        show-overflow-tooltip
      />
      <el-table-column
        prop="address"
        label="维修时间"
        min-width="20"
        show-overflow-tooltip
      />
      <el-table-column
        prop="address"
        label="确认时间"
        min-width="20"
      />
    </el-table>

    <el-dialog
      title="新建"
      :visible.sync="dialogVisible"
      width="600"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="时间" prop="name">
          {{ ruleForm.data }}
        </el-form-item>
        <el-form-item label="设备" prop="a">
          <EquipSelect @equipSelected="equipSelected" />
        </el-form-item>
        <el-form-item label="设备部位" prop="e">
          //
        </el-form-item>
        <el-form-item label="停机类型" prop="b">
          <shutdownMoldSelect @shutdownMoldChange="shutdownMoldChange" />
          <el-checkbox v-model="ruleForm.checked" style="margin-left:10px">已停机</el-checkbox>
        </el-form-item>
        <el-form-item label="原因" prop="c">
          <el-input
            v-model="ruleForm.textarea"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            ref="elUploadImg"
            action=""
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="onChangeImg"
            :limit="3"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleImg" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect'
import shutdownMoldSelect from '../components/shutdown-mold-select'
import { setDate } from '@/utils'
export default {
  components: { EquipSelect, shutdownMoldSelect },
  data() {
    return {
      search: {},
      tableData: [{}],
      dialogVisible: false,
      ruleForm: {
        data: setDate(null, true)
      },
      rules: {},
      dialogVisibleImg: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    changeList() {

    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.elUploadImg.clearFiles()
      if (done) {
        done()
      }
    },
    add() {
      this.dialogVisible = true
    },
    equipSelected() {},
    shutdownMoldChange() {},
    onChangeImg(file, fileList) {
      console.log(file, fileList)
      const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.raw.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpeg、jpg 、png格式!')
        fileList.pop()
        return
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        fileList.pop()
        return
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleImg = true
    }
  }
}
</script>

<style>

</style>
