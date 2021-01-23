<template>
  <div class="work-state-style">
    <!-- 设备运行现况 -->
    <el-tag
      v-for="item in stateList"
      :key="item.label"
      :color="item.type"
      effect="dark"
    >
      {{ item.label }}
    </el-tag>

    <el-row style="margin-top:20px" :gutter="20">
      <el-col v-for="(o) in 3" :key="o" :span="8">
        <el-card :body-style="{ padding: '0px' }">
          99
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stateList: [
        { type: '#ff9000', label: '停机' },
        { type: '#FF0000', label: '故障' },
        { type: '#81D3F8', label: '维修开始' },
        { type: '#F4B084', label: '维修结束' },
        { type: '#AAAAAA', label: '空转' },
        { type: '#76C86F', label: '运行中' }
      ],
      list: [
        { name: 111, type: '停机' }
      ]
    }
  },
  created() {
    this.list.forEach(D => {
      // 按状态匹配颜色
      const obj = this.stateList.find(d => d.label === D.type)
      D._color = obj.type
    })
    console.log(this.list, 777)
  }
}
</script>

<style lang="scss" scoped>
.el-tag--dark{
      border-color:#fff;
}
</style>
