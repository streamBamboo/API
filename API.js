
//TODO 缺少再补上对应的封装
module.exports = {
    /**
     *  wx.request() API封装
     * @param url
     * @param data
     * @param method
     * @returns {Promise<any>}
     */
    call(url, data, method) {
        return new Promise((resolve, reject) => {
            //TODO url在项目中调用还能对URL再做封装
            wx.request({
                url: url,
                data: data,
                method: method,
                header: {'content-type': 'application/x-www-form-urlencoded'},
                success: (res) => {
                    resolve(res)
                },
                fail: (error) => {
                    reject(error)
                }
            })
        })
    },
    /**
     * post 请求
     * @param url
     * @param data
     * @returns {*|Promise<any>}
     */
    post(url, data) {
        return this.call(url, data, 'POST')
    },
    /**
     * get 请求
     * @param url
     * @param data
     * @returns {*|Promise<any>}
     */
    get(url, data) {
        return this.call(url, data, 'GET')
    },
    /**
     * 封装本地存储
     * @param key
     * @param dataVal
     * @param expire
     * @returns {boolean}
     */
    setCache(key, dataVal, expire) {
        let expireTimestamp = +new Date / 1000, // +new Date => new Date().getTime(); 获取毫秒
            result = true,
            storeData = {
                expire: expire ? expireTimestamp + parseInt(expire) : 0,
                value: dataVal,
            };
        try {
            wx.setStorageSync(key, storeData)
        } catch (e) {
            result = false
        }
        return result
    },
    /**
     * 获取本地存储
     * @param key
     * @param defaultValue
     * @returns {string|string}
     */
    getCache(key, defaultValue = '') {
        //获取时间戳
        let newDate = +new Date / 1000, result = '';
        newDate = parseInt(newDate);
        //try...catch语句将能引发错误的代码放在try块中，并且对应一个响应，然后有异常被抛出。
        try {
            result = wx.getStorageSync(key);
            //判断获取本地key的时间戳比new Date()的时间戳大，即new Date()先执行，获取本地key后执行
            if (result.expire > newDate || 0 === result.expire) {
                result = result.value
            } else {
                result = '';
                Cache.remove(key)
            }
        } catch (e) {
            result = defaultValue;
        }
        return result || defaultValue
    },
    /**
     * 删除缓存
     * @param key
     * @returns {boolean}
     */
    removeCache(key) {
        // console.log('删除了', key);
        let result = true
        try {
            wx.removeStorageSync(key)
        } catch (e) {
            result = false
        }
        return result
    },
    /**
     * 监听小程序是否有更新
     */
    monitorUpdate() {
        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        });

        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        });

        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
        })
    },
    /**
     * 传入金额，返回标准的金钱表述
     *
     * @param money
     * @returns {string}
     */
    getMoneyText(money) {
        if (isNaN(money)) {
            money = 0
        }
        money = parseFloat(money)
        money = money.toFixed(2);
        return `￥${money}`
    }
};


