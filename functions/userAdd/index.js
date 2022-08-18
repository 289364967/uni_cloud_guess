// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init({
//   env:'yudicloud-4gpvpsju0d42411d',
//   traceUser: true,
// })

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let res
  if (event.type == "add") {
    res = await exports.add(event, context)
    console.log(res)
  }
  return res
}
exports.add = async (event, context) => {
  return event.x + event.y
}