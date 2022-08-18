// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init({
//   env:'yudicloud-4gpvpsju0d42411d',
//   traceUser: true,
// })

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let res
  if (event.type == "addUser") {
    res = await addUser(event, context)
  } else if (event.type == "add") {
    res = await add(event, context)
  } else {
    res = await eval(`${event.type}(event, context)`)
    console.log(res)
  }
  return res
}

/**  getUser() 获取用户个人信息
 * 
 */

getUser = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res
  try {
    let user = await db.collection('user').where({ openID: OPENID }).get()
    if (user.data.length == 1) {
      res = {
        data: user.data[0]
      }
    }
  } catch (e) {
    res = {
      message: e,
    }
  }
  return res
}

/**  getAgent() 获取代理商
 * 
 */

getAgent = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res
  try {
    let user = db.collection('user')
    let me = await user.where({ openID: OPENID }).get()
    if (me.data[0].role != 'ADMIN') {
      throw new SyntaxError("权限不足"); // (*)
    }

    let users = await user.where({ role: 'AGENT' }).get()
    res = users
  } catch (e) {
    res = {
      message: e,
    }
  }
  return res
}

/**  changeRole() 修改用户角色信息
 * _id 修改用户的ID
 * role 修改用户的角色字段 USER/AGENT
 */

changeRole = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res

  try {
    let user = await db.collection('user').where({ openID: OPENID }).get()
    if (user.data[0].role != 'ADMIN') {
      throw new SyntaxError("权限不足"); // (*)
    }
    let up = await db.collection('user').doc(event._id).update({
      data: {
        role: event.role
      }
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
test = async (event, context) => {
  console.log(cloud.getWXContext(), event, context)
  return 'hello world'
}
add = async (event, context) => {
  return event.x + event.y
}
addUser = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res
  try {
    const users = db.collection('user')
    let user = await users.where({ openID: OPENID }).get()
    console.log('user', user)
    if (user.data.length == 1) {
      res = {
        data: user.data[0]
      }
    } else {
      let add = await users.add({
        data: {
          name: event.userInfo.nickName,
          role: "USER",
          integral: 0,
          beer: 0,
          avatar: event.userInfo.avatarUrl,
          openID: OPENID
        }
      })
      console.log(add)
      res = await users.doc(add._id).get()

    }
  } catch (e) {
    res = {
      message: e,
    }
  }
  return res
}