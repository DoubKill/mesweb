const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  permission: (state) => {
    if (state.user.permission && (typeof state.user.permission) === 'string') {
      return JSON.parse(state.user.permission)
    } else {
      return state.user.permission
    }
  },
  name: state => state.user.name,
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes
}
// 获取vuex数据
// import { mapGetters } from "vuex";
// computed: {
//   ...mapGetters(["name"]),
// },
export default getters
