import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    token: '',
    name: '',
    avatar: '',
    permission: ''
  }
}

const state = () => {
  return {
    token: getToken(),
    name: Cookies.get('name'),
    avatar: '',
    permission: localStorage.getItem('permission')
  }
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
    Cookies.set('name', name)
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
    localStorage.setItem('permission', permission)
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.token)
        commit('SET_NAME', response.username)
        commit('SET_PERMISSION', JSON.stringify(response.permissions))
        // 登录获取token,存到全局中
        setToken(response.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      // let data = response
      // console.log(data, 'response')

      // if (!data) {
      //   return reject('Verification failed, please Login again.')
      // }
      // roles must be a non-empty array登录权限
      //  if (!roles || roles.length <= 0) {
      //   reject('getInfo: roles must be a non-null array!')
      // }

      // // 其他列表按钮的权限写这里，获取权限存起来
      // let data = {
      //   roles: ['admin'],
      //   name: 'name-admin', avatar: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2310890073,3469009192&fm=26&gp=0.jpg'
      // }

      // commit('SET_ROLES', JSON.stringify(data.results))
      // commit('SET_AVATAR', data.avatar)
      // resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      removeToken() // must remove  token  first
      resetRouter()
      rootState.permission.addRoutes = []
      commit('RESET_STATE', '')
      commit('SET_PERMISSION', '')
      commit('SET_NAME', '')
      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  }

  // remove token
  // resetToken({ commit }) {
  // return new Promise(resolve => {
  //   removeToken() // must remove  token  first
  //   commit('RESET_STATE','')
  //   resolve()
  // })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

