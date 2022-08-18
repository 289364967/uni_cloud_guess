// 云函数入口文件
const cloud = require('wx-server-sdk')



cloud.init({
  env: 'yudicloud-4gpvpsju0d42411d',
  // traceUser: true,
})


const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
const businessType = {
  addIntegral: 'ADDINTEGRAL',
  delIntegral: 'DELINTEGRAL',
  addBeer: 'ADDBEER',
  delBeer: 'DELBEER',
}

// 云函数入口函数
exports.main = async (event, context) => {
  let res

  res = await eval(`${event.type}(event, context)`)

  return res
}

function dateFormat(time, format) {
  const t = new Date(time);
  // 日期格式
  format = format || "Y-m-d h:i:s";
  let year = t.getFullYear();
  // 由于 getMonth 返回值会比正常月份小 1
  let month = t.getMonth() + 1;
  let day = t.getDate();
  let hours = t.getHours();
  let minutes = t.getMinutes();
  let seconds = t.getSeconds();

  const hash = {
    y: year,
    m: month,
    d: day,
    h: hours,
    i: minutes,
    s: seconds,
  };
  // 是否补 0
  const isAddZero = (o) => {
    return /M|D|H|I|S/.test(o);
  };
  return format.replace(/\w/g, (o) => {
    let rt = hash[o.toLocaleLowerCase()];
    return rt > 9 || !isAddZero(o) ? rt : `0${rt}`;
  });
}

/**  addOrder() 添加订单
 * user_id 用户id
 * _id 代理商用户id
 * quantity  数量
 */

addOrder = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res
  try {
    const order = db.collection('order')
    const user = db.collection('user')

    var myDate = new Date();
    let now = dateFormat(myDate.getTime(), "Y-m-d h:i");
    let data = {
      date: now,
      quantity: event.quantity,
      integral: event.quantity,
      byUser_id: event._id,
      user_id: event.user_id
    }
    let add = await order.add({
      data: data
    })
    await user.doc(event.user_id).update({
      data: {
        integral: _.inc(event.quantity),
        orders: _.push({
          date: now,
          type: businessType.addIntegral,
          change: event.quantity
        })
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



/**  getOrderByAdmin() 查询订单
 * user_id 代理商用户id (可为空)
 *  
 */

getOrderByAdmin = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res
  try {
    const order = db.collection('order')
    let match = {}
    if (event.user_id) match.byUser_id = event.user_id

    let orders = await order.aggregate()
      .lookup({
        from: 'user',
        let: {
          user_id: '$user_id',
        },
        pipeline: $.pipeline()
          .match(_.expr(
            $.eq(['$_id', '$$user_id'])) //
          )
          .done(),
        as: 'user'
      })
      .lookup({
        from: 'user',
        let: {
          byUser_id: '$byUser_id',
        },
        pipeline: $.pipeline()
          .match(_.expr(
            $.eq(['$openID', '$$byUser_id'])) //
          )
          .done(),
        as: 'byUser'
      }).match(match)
      .end()

    console.log(orders)
    res = orders

  } catch (error) {
    res = {
      message: error,
    }
  }
  return res
}


/**  addGuess() 添加竞猜
 * city_id 竞猜城市id
 * city_img 竞猜城市id
 * city_rate 竞猜城市id
 * city_name 竞猜城市id
 */

addGuess = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  console.log(OPENID)
  let res
  try {
    const user = db.collection('user')
    let ME = await user.where({ openID: OPENID }).get()
    if (ME.data[0].integral < 1) {
      throw new SyntaxError("integral 不足"); // (*)
    }

    var myDate = new Date();
    let now = dateFormat(myDate.getTime(), "Y-m-d h:i");
    let data = {
      date: now,
      intoIntegral: 1,
      city_id: event.city_id,
      city_img: event.city_img,
      city_name: event.city_name,
      city_rate: event.city_rate,
    }
    let update = await user.where({
      openID: OPENID
    }).update({
      data: {
        integral: _.inc(-1),
        orders: _.push({
          date: now,
          type: businessType.delIntegral,
          change: 1
        }),
        guess: _.push(data),
      }
    })
    console.log(update)
    res = update

  } catch (error) {
    res = {
      message: error,
    }
  }
  return res
}

/**  getOrder() 查询订单
 * 
 *  
 */

getOrder = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res
  try {
    const user = db.collection('user')

    let guess = await user.where({ openID: OPENID }).get()
    console.log(guess.data[0].orders)
    res = guess.data[0].orders

  } catch (error) {
    res = {
      message: error,
    }
  }
  return res
}

/**  getGuess() 查询竞猜
 * 
 *  
 */

getGuess = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res
  try {
    const user = db.collection('user')

    let guess = await user.where({ openID: OPENID }).get()
    console.log(guess.data[0].guess)
    res = guess.data[0].guess


  } catch (error) {
    res = {
      message: error,
    }
  }
  return res
}


/**  openCity() 开奖
 * city_id 开奖城市id
 *  
 */


openCity = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res
  try {
    const city = db.collection('city')
    const config = db.collection('config')


    let clear = await city.where({}).update({
      data: {
        isWinner: false
      }
    })

    let configUpdate = await config.doc("0ab5303b62af24ee0a22c2fd52a962d8").update({
      data: {
        isOpenGuess: true
      }
    })

    let update = await city.doc(event.city_id).update({
      data: {
        isWinner: true
      }
    })

    res = update

  } catch (error) {
    res = {
      message: error,
    }
  }
  return res
}

/**  openGuess() 开奖
 *  
 */


openGuess = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res
  try {
    const user = db.collection('user')
    const city = db.collection('city')

    let city_guess = await city.where({
      'isWinner': true
    }).get()

    let winnerCity = city_guess.data[0]._id

    let me_dom = await user.where({ openID: OPENID }).get()
    let me = me_dom.data[0]

    let addBeer = 0
    let guessStatus = false
    if (!!me.guess && !!me.openGuess == false) {
      for (item in me.guess) {
        console.log(1)
        if (me.guess[item].city_id == winnerCity) {
          console.log(2)
          guessStatus = true
          addBeer = addBeer + parseInt(me.guess[item].city_rate)

          console.log(me.guess[item].city_rate)
        }
      }
      var myDate = new Date();
      let now = dateFormat(myDate.getTime(), "Y-m-d h:i");

      let update = await user.where({ openID: OPENID }).update({
        data: {
          beer: _.inc(addBeer),
          openGuess: true,
          orders: _.push({
            date: now,
            type: businessType.addBeer,
            change: addBeer
          }),
        }
      })
    }




    res = {
      addBeer, guessStatus
    }

  } catch (error) {
    res = {
      message: error,
    }
  }
  return res
}

/**  vertifyBeer() 核销beer
 *  user_id 核销用户id
 * _id 代理商用户id
 *  quantity 数量
 */


vertifyBeer = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res
  try {
    const vertify = db.collection('vertify')
    const user = db.collection('user')

    let ME = await user.doc(event.user_id).get()
    if (ME.data.beer < 1) {
      throw new SyntaxError("beer 不足"); // (*)
    }

    var myDate = new Date();
    let now = dateFormat(myDate.getTime(), "Y-m-d h:i");
    let data = {
      date: now,
      quantity: event.quantity ? event.quantity : 1,
      byUser_id: event._id,
      user_id: event.user_id
    }
    let add = await vertify.add({
      data: data
    })

    await user.doc(event.user_id).update({
      data: {
        beer: _.inc(-event.quantity),
        orders: _.push({
          date: now,
          type: businessType.delBeer,
          change: event.quantity
        })
      }
    })

    res = {
      success: add._id ? true : false
    }

  } catch (error) {
    res = {
      message: error,
    }
  }
  return res
}


/**  getVertifyBeer() 查询核销记录
 *  _id 自己的id
 */


getVertifyBeer = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let res
  try {
    const vertify = db.collection('vertify')
    let match = {}
    if (event.user_id) match.byUser_id = event.user_id

    let vertifys = await vertify.where({ byUser_id: event._id }).get()

    console.log(vertifys)
    res = vertifys

  } catch (error) {
    res = {
      message: error,
    }
  }
  return res
}
