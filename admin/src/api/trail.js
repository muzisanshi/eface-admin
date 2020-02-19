// 人员轨迹接口
import { axios } from '@/utils/request'

const URI = {
  getEstates: '/userTrack/getEstates',
  getBehaviorTracks: '/userTrack/getBehaviorTracks',
}

function getEstates (data) {
  return axios({
    url: URI.getEstates,
    params: data
  })
}

function getBehaviorTracks (data) {
  return axios({
    url: URI.getBehaviorTracks,
    params: data
  })
}

export default {
  getEstates,
  getBehaviorTracks,
}