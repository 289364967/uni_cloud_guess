

/**
 * 设置User
 */
 export const setUser = user => {
    uni.setStorage({
      key: "USER_KEY",
      data: user,
      success: function () {
        console.log('user save success');
      }
    });
  };
/**
 * 获取User
 */
 export const getUser = () => {
    try {
      const user = uni.getStorageSync("USER_KEY");
      if (user) {
        return user
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  };
  
export function getUserProfile(code) {
    uni.showLoading({
        title: "加载中",
    });
    return new Promise((resolve, reject) => {
        wx.getUserProfile({
            desc: "用于完善会员资料",
            success: function (resUserInfo) {
                console.log("resUserInfo", resUserInfo);

                wx.cloud
                    .callFunction({
                        // 要调用的云函数名称
                        name: "test",
                        // 传递给云函数的 event 参数
                        data: {
                            userInfo: resUserInfo.userInfo,
                            type: 'addUser'
                        },
                    })
                    .then((res) => {
                        setUser(res.result.data);
                        resolve(res)
                        // output: res.result === 3
                    })
                    .catch((err) => {
                        console.log(err)
                        // handle error
                    });
            },
            fail: function (e) {
                console.log("fail", e);
                uni.showLoading({
                    title: "error fail",
                });
                setTimeout(function () {
                    uni.hideLoading();
                }, 1500);
                reject(e)
            },
        });
    })
}