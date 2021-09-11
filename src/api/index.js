// 这个JS文件就是专门用于管理请求各种接口地址的
import Network from './network'

// 封装各种接口请求
// 例：export const getBanner = () => Network.get('banner?type=2')
//     export const getPlayList = (data) => Network.get('playlist/detail', data)
export const getLogin = (data) => Network.post('login', data)