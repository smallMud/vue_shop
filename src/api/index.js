// 这个JS文件就是专门用于管理请求各种接口地址的
import Network from './network'

// 封装各种接口请求
// 例：export const getBanner = () => Network.get('banner?type=2')
//     export const getPlayList = (data) => Network.get('playlist/detail', data)
export const getLogin = (data) => Network.post('login', data)
export const getMenus = () => Network.get('menus')
export const getUsers = (data) => Network.get('users', data)
export const setUserInfo = (path) => Network.put(path)
export const addUser = (data) => Network.post('users', data)
export const getUser = (path) => Network.get(path)
export const updataUser = (path, data) => Network.put(path, data)
export const deleteUser = (path) => Network.delete(path)
export const getRights = (path) => Network.get(path)
export const getRoleRights = (path) => Network.get(path)
export const setRoleRights = (path, data) => Network.post(path, data)
export const getRoles = () => Network.get('roles')
export const putRole = (path, data) => Network.put(path, data)
// export const getRole = (path) => Network.get(path)
export const deleteRigth = (path) => Network.delete(path)
export const getCategories = (data) => Network.get('categories', data)
export const addCategories = (data) => Network.post('categories', data)
