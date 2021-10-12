<template>
  <div class="personnel-framework">
    <!-- 人员组织架构 -->
    <el-container style="height:75vh;">
      <el-aside width="400px" class="border-style aside-style">
        <h3>部门管理</h3>
        <el-tree
          class="filter-tree"
          :highlight-current="true"
          :data="data"
          default-expand-all
          :props="defaultProps"
          @node-contextmenu="nodeContextmenu"
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main v-loading="loading" class="border-style">
        <h3>人员</h3>
      </el-main>
    </el-container>

    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <!-- <li @click="addNodeFun(1)">添加子节点</li>
      <li @click="addNodeFun(2)">上方添加节点</li>
      <li @click="addNodeFun(3)">下方添加节点</li>
      <li @click="copyNodeFun">复制节点</li>
      <li @click="pasteNodeFun">粘贴子节点</li>
      <li @click="upperPasteNodeFun">上方粘贴节点</li>
      <li @click="belowPasteNodeFun">下方粘贴节点</li> -->
      <li @click="delNodeFun">删除节点</li>
      <li @click="delNodeFun">修改节点</li>
      <li @click="delNodeFun">添加子节点</li>
    </ul>
  </div>
</template>

<script>
import { sectionTree } from '@/api/base_w_four'
import { personnelsUrl } from '@/api/user'
export default {
  name: 'EquipmentMasterDataPersonnelFramework',
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: false,
      left: '',
      top: '',
      visible: false,
      selectedTag: ''
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    async getTree() {
      try {
        const data = await sectionTree('get')
        this.data = data.results || []
      } catch (e) {
        //
      }
    },
    handleNodeClick() {
      this.closeMenu()
      //   this.loading = true
      this.loading = false
    },
    async getPersonnels() {
      try {
        this.loading = true
        const data = await personnelsUrl('get')
        this.data = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    nodeContextmenu(e, tag, node, event) {
      // console.log(e, tag, node, event, 888)
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 40 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY - 200
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    delNodeFun() {}
  }
}
</script>

<style lang="scss" scoped>
.personnel-framework{

  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-thumb {
      background: #eee
  }
  .el-main{
    padding:0;
  }
  .border-style{
    border:1px solid #eee;
    padding-left:10px;
  }
  .aside-style{
    // padding: 20px;
    margin-right:10px;
  }
  .el-input{
    width:250px;
  }
   .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}

</style>
