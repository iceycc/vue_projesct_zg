import {EventBus, Constants, JsBridge} from '../index';
import {ifWX} from "../util";
// 混入 mixins
export default {

    beforeRouteEnter(to, from, next) {
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不！能！获取组件实例 `this`
        // 因为当守卫执行前，组件实例还没被创建
        //// console.log('beforeRouteEnter:' + to.name);

        //你可以通过传一个回调给 next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
        next(vm => {
            // 通过 `vm` 访问组件实例
        })
    },
    beforeRouteUpdate(to, from, next) {
        // 在当前路由改变，但是该组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
        next()
    },
    //
    beforeRouteLeave(to, from, next) {
        //// console.log('beforeRouteLeave:' + from.name);
        this.pagePause();
        next();// 不支持回调  因为应可以访问this
    },
    //
    created() {
        if (this.$route.meta && this.$route.meta.title) {
            this.title = this.$route.meta.title;
        }
    },
    methods: {
        fenXiang(content, fn) {
            if (!ifWX) return
            let data = {
                title: content.title || '诸葛装修，全方位解决您的装修问题',
                link: content.link || window.location.href,
                imgUrl: content.imgUrl || 'http://image1.uzhuang.com/zhuge-logo.png',
                type: content.type || '',
                dataUrl: content.dataUrl || '',
                desc: content.desc || '',
            }
            fn && fn()
            // // console.log(data)
            wx.onMenuShareTimeline({
                title: data.title, // 分享标题
                link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: data.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                fail: function () {
                    // 用户确认分享后执行的回调函数
                }
            })


            wx.onMenuShareAppMessage({
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: data.imgUrl, // 分享图标
                type: data.type, // 分享类型,music、video或link，不填默认为link
                dataUrl: data.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
// 用户确认分享后执行的回调函数
                },
                cancel: function () {
// 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareQQ({
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接
                imgUrl: data.imgUrl, // 分享图标
                success: function () {
// 用户确认分享后执行的回调函数
                },
                cancel: function () {
// 用户取消分享后执行的回调函数
                }
            });


            wx.onMenuShareWeibo({
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接
                imgUrl: data.imgUrl, // 分享图标
                success: function () {
// 用户确认分享后执行的回调函数
                },
                cancel: function () {
// 用户取消分享后执行的回调函数
                }
            });


            wx.onMenuShareQZone({
                title: data.title, //data. 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接
                imgUrl: data.imgUrl, // 分享图标
                success: function () {
// 用户确认分享后执行的回调函数
                },
                cancel: function () {
// 用户取消分享后执行的回调函数
                }
            });
        },
        pagePause() {
            this._pagePause && this._pagePause()
        },
        //
        pushPage(action) {
            let rou = {
                name: action.name
            };

            if (action.query) {
                rou.query = action.query;
            }

            if (action.params) {
                rou.params = action.params;
            }
            this.$router.push(rou);
        },
        // 这里为啥不管 todo
        filters: {
            crtTime: function (val) {
                if (val != null) {
                    // let data = new Date()
                    var date = new Date(val * 1000);
                    // return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
                    //     + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                    return moment(date).format("YYYY-MM-DD HH:mm:ss")
                    // return date
                }
            }
        },

        // 监听 监听 浏览器返回
        lisBack() {
            pushHistory();
            var _this = this
            window.addEventListener("popstate", function (e) {
                _this.goBack && _this.goBack()
                // console.log('goBack')
                if (window.event) {
                    //IE中阻止函数器默认动作的方式
                    window.event.returnValue = false;
                }
                else {
                    //阻止默认浏览器动作(W3C)
                    e.preventDefault();
                }

            }, false);

            function pushHistory() {
                var state = {
                    title: "title",
                    url: "#"
                };
                window.history.pushState(state, "title", "#");
            }
        },
    }
}
