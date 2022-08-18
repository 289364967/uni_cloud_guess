// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init({
  env: 'yudicloud-4gpvpsju0d42411d',
  // traceUser: true,
})


const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let res

  res = await eval(`${event.type}(event, context)`)

  return res
}



/**  getList() 获取城市列表
 *
 */

getList = async (event, context) => {
  let res
  try {
    let list = await db.collection('city').get()
    console.log(list)
    res = list

  } catch (error) {
    res = {
      message: error,
    }
  }
  return res
}

/**  add() 添加城市
 * name 名称
 * img 图片
 * rate 汇率
 */

add = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res

  try {
    const citys = db.collection('city')

    let add = await citys.add({
      data: {
        name: event.name,
        img: event.img,
        rate: event.rate,
        isWinner: false,
      }
    })
    console.log(add)
    res = add

  } catch (error) {

    res = {
      message: error,
    }
  }
  return res
}

/**  changeCity() 修改
 * _id 城市id
 * rate 
 * name
 * img
 */

changeCity = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res

  try {
    let user = await db.collection('user').where({ openID: OPENID }).get()
    if (user.data[0].role != 'ADMIN') {
      throw new SyntaxError("权限不足"); // (*)
    }
    let data = {}
    if (event.rate) data.rate = event.rate
    if (event.name) data.name = event.name
    if (event.img) data.img = event.img

    let up = await db.collection('city').doc(event._id).update({
      data: data
    })
    console.log(up)
    if (up.stats.updated == 0) {
      throw new SyntaxError("更新失败"); // (*)
    }
    res = {
      data: {
        success: 1
      }
    }
  } catch (e) {
    res = {
      message: e,
    }
  }
  return res
}

/**  remove() 删除城市
 * _id 城市id
 */

remove = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res

  try {
    let user = await db.collection('user').where({ openID: OPENID }).get()
    if (user.data[0].role != 'ADMIN') {
      throw new SyntaxError("权限不足"); // (*)
    }

    let del = await db.collection('city').doc(event._id).remove()
    console.log(del)
    if (del.stats.removed == 0) {
      throw new SyntaxError("删除失败"); // (*)
    }
    res = {
      data: {
        success: 1
      }
    }
  } catch (e) {
    res = {
      message: e,
    }
  }
  return res
}

