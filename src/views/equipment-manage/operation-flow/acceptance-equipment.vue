<template>
  <div>
    <!-- 验收维修工单 -->
    <el-form :inline="true">
      <el-form-item label="计划维修时间">
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
      <el-form-item label="计划名称">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          equip-type="密炼设备"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="工单编号">
        <el-input
          v-model="search.equip1"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.feedi"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in ['停机', '不停机']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重要程度">
        <el-select
          v-model="search.feed"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['高', '中', '低']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修标准">
        <el-input
          v-model="search.equip"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.feeding"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['已做成', '已接单', '等待物料', '等待外协维修', '已完成', '已关闭']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修人">
        <el-input
          v-model="search.person"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="验收人">
        <el-input
          v-model="search.person1"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="验收人">
        <el-select
          v-model="search.jg"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['合格','不合格']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要外协">
        <el-select
          v-model="search.f"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['Y','N']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要物料">
        <el-select
          v-model="search.fe"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['Y','N']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询本人待处理工单</el-button>
        <el-button type="primary" @click="dialog(false,'验收维修工单')">验收</el-button>
        <el-button type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      row-key="id"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column
        label="操作"
        width="220"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="primary"
              size="mini"
              @click="dialog(scope.row,'查看维修结果')"
            >查看维修结果
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="dialog(scope.row,'查看验收结果')"
            >查看验收结果
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="计划/报修编号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="计划/报修名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="工单编号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="部位名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修标准/故障原因"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
          >{{ scope.row.date }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="故障详情描述"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修记录"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="计划维修日期"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备条件"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="重要程度"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修开始时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修结束时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="是否需要物料"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="是否需要外协"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="指派人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="指派时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="接单人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="接单时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="报修人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="报修时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="验收人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="验收时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="验收结果"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="验收记录"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="operateType"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :inline="true" label-width="150px">
        <el-form-item label="验收说明" prop="note1">
          <el-input
            v-model="creatOrder.note1"
            :disabled="operateType!=='验收维修工单'"
            style="width:250px"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            v-if="operateType==='验收维修工单'"
            ref="elUploadImg"
            action=""
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="onChangeImg"
            :on-exceed="onExceed"
            :limit="1"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-image
            v-else
            style="width: 100px; height: 100px"
            :src="creatOrder.image"
            :preview-src-list="[creatOrder.image]"
          >
            <div slot="error" class="image-slot">
              暂无图片
            </div>
          </el-image>
          <el-dialog :visible.sync="dialogVisibleImg" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="验收结论">
          <el-radio-group v-model="creatOrder.radio1" :disabled="operateType!=='验收维修工单'">
            <el-radio label="1">合格</el-radio>
            <el-radio label="2">不合格</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button v-if="operateType==='验收维修工单'" :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'AcceptanceEquipment',
  components: { EquipSelect, page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      dateValue: [],
      tableData: [{ date: '1' }],
      total: 0,
      multipleSelection: [],
      dialogImageUrl: '',
      operateType: '',
      dialogVisible: false,
      submit: false,
      dialogVisibleImg: false,
      creatOrder: { radio: '' }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    generateFun(obj) {
      this.dialogVisible = true
      console.log(this.multipleSelection)
    },
    changeDate() {

    },
    getList() {

    },
    changeSearch() {
      this.getList()
    },
    onExceed() {
      this.$message.info('最多上传一张图片')
    },
    onChangeImg(file, fileList) {
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
      this.$set(this.creatOrder, 'image', file.raw)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleImg = true
    },
    equipSelected(obj) {
      this.creatOrder.equip_no = obj || null
      console.log(this.creatOrder.equip_no)
    },
    dialog(row, type) {
      console.log(type)
      this.operateType = type
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style>

</style>
