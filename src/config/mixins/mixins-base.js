import {EventBus, Constants, JsBridge} from '../index';

// 混入 mixins
export default {

  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    //console.log('beforeRouteEnter:' + to.name);

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
    //console.log('beforeRouteLeave:' + from.name);
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

    // 监听 监听 浏览器返回
    lisBack() {
      pushHistory();
      var _this = this
      window.addEventListener("popstate", function (e) {
        _this.goBack && _this.goBack()
        console.log('goBack')
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
