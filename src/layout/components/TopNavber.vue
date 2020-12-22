<template>
  <div class="TopNavber">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <el-menu
      :default-active="activeMenu"
      background-color="rgb(48 65 86)"
      text-color="#fff"
      class="el-menu-demo"
      mode="horizontal"
      active-text-color="rgb(11, 189, 11)"
      @select="handleSelect"
    >
      <div
        v-for="route in routes"
        :key="route.path"
        style="display:inline-block"
      >
        <app-link
          v-if="!route.hasOwnProperty('hidden')||!route.hidden"
          :to="resolvePath(route.path)"
        >
          <el-menu-item :index="route.meta.title">
            {{ route.meta.title }}
          </el-menu-item>
        </app-link>
      </div>
    </el-menu>

    <div class="right-menu">
      <el-dropdown
        class="avatar-container"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <span>用户名：{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="user-dropdown"
        >
          <router-link to="/">
            <el-dropdown-item>
              首 页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item
            divided
            @click.native="logout"
          >
            <span style="display:block;">退 出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import { isExternal } from '@/utils/validate'
import AppLink from './Sidebar/Link'
export default {
  components: {
    Hamburger,
    AppLink
  },
  data() {
    return {
      basePath: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu: {
      get() {
        const route = this.$route
        const { meta, matched } = route
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return matched[0].meta.title
      },
      set(val) {
        return val
      }
    }
  },
  watch: {
    $route(to, from) {
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    handleSelect(val) {
      this.activeMenu = val
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

.TopNavber {
//   height: 60px;
  overflow: hidden;
  position: relative;
  color:#fff !important;
  background: rgb(48 65 86);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .el-menu.el-menu--horizontal{
      border-bottom: none;
  }
  .is-active{
      border-bottom: 3px solid;
  }
  .el-menu-demo{
      display: inline-block;
  }
  .right-menu .avatar-container .avatar-wrapper{
    margin-top: 0 !important;
  }
  .hamburger-container {
    line-height: 56px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 56px;
    margin-bottom:4px;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        color:#fff;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 22px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
