import Mock from 'mockjs2'
import {getBody, responseSuccess} from '../util'

const countryList = (options) => {
  const parameters = getBody(options)

  const totalElements = 12
  const records = []
  const pageNumber = parseInt(parameters.page.pageNumber + '', 10)
  const pageSize = parseInt(parameters.page.pageSize + '', 10)
  const totalPages = Math.ceil(totalElements / pageSize)
  const key = (pageNumber - 1) * pageSize
  const next = (pageNumber >= totalPages ? (totalElements % pageSize) : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const id = key + i
    records.push({
      id: id,
      code: 'ZH',
      name: '中国',
      shortMark: '中国',
      fullMark: '中华人民共和国',
      resourceFullAddress: '/avatar2.jpg'
    })
  }

  return responseSuccess({
    pageSize: pageSize,
    pageNumber: pageNumber,
    totalElements: totalElements,
    totalPages: totalPages,
    records: records
  })
}

const goodsGroupList = (options) => {
  const parameters = getBody(options)

  const totalElements = 12
  const records = []
  const pageNumber = parseInt(parameters.page.pageNumber + '', 10)
  const pageSize = parseInt(parameters.page.pageSize + '', 10)
  const totalPages = Math.ceil(totalElements / pageSize)
  const key = (pageNumber - 1) * pageSize
  const next = (pageNumber >= totalPages ? (totalElements % pageSize) : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const id = key + i
    records.push({
      id: id,
      code: id,
      name: '服饰鞋帽',
      orderNum: id,
      keywords: '关键词',
      enable: true,
      children: [
        {
          id: 'sub1' + id,
          code: 'sub1' + id,
          name: '童装',
          orderNum: id,
          keywords: '关键词',
          enable: true
        },
        {
          id: 'sub2' + id,
          code: 'sub2' + id,
          name: '配饰',
          orderNum: id,
          keywords: '关键词',
          enable: true
        }
      ]
    })
  }

  return responseSuccess({
    pageSize: pageSize,
    pageNumber: pageNumber,
    totalElements: totalElements,
    totalPages: totalPages,
    records: records
  })
}

const brandList = (options) => {
  const parameters = getBody(options)

  const records = []
  const pageSize = parseInt(parameters.page.pageSize + '', 10)

  records.push({
    id: 1,
    code: 'Aptamil-deguo',
    firstLetter: 'A',
    nameCn: '爱他美',
    nameEn: 'Aptamil',
    countryName: '德国',
    enable: true,
    summary: '爱他美奶粉产自德国，是德国美乐宝（Milupa）集团旗下品牌，后美乐宝被达能集团收购。2007年，达能再收购Royal Numico（纽迪希亚持有人），将旗下的婴幼儿营养及医学营养进行了内部合并。爱他美与诺优能、可瑞康三个奶粉品牌均属于纽迪希亚旗下。',
    resourceFullAddress: '/avatar2.jpg'
  })

  records.push({
    id: 2,
    code: 'Nestle-deguo',
    firstLetter: 'Q',
    nameCn: '雀巢',
    nameEn: 'Nestle',
    countryName: '德国',
    enable: false,
    summary: '总部位于瑞士的雀巢集团，是世界上最大的食品公司，在中国有着长久的历史。雀巢公司，由亨利·内斯特莱(Henri Nestle)于1867年创建，总部设在瑞士日内瓦湖畔的沃韦(Vevey)，是世界最大的食品制造商。拥有138年历史的雀巢公司起源于瑞士，它最初是以生产婴儿食品起家的。2005年，雀巢公司在全球拥有500多家工厂，25万名员工，年销售额高达910亿瑞士法郎。从一个生产婴儿食品的乡村作坊发展成今天领先世界的食品公司，雀巢走过了130多年的发展历程。',
    resourceFullAddress: '/avatar2.jpg'
  })

  return responseSuccess({
    pageSize: pageSize,
    pageNumber: 1,
    totalElements: 1,
    totalPages: 1,
    records: records
  })
}

Mock.mock(/\/mock\/country\/getPage/, 'post', countryList)
Mock.mock(/\/mock\/country\/delete/, 'post', responseSuccess)
Mock.mock(/\/mock\/goodsGroup\/getPage/, 'post', goodsGroupList)
Mock.mock(/\/mock\/brand\/getPage/, 'post', brandList)
