<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <mu-toast v-if="toast.show" :message="toast.message"></mu-toast>
        <mu-dialog :open="login" title="登录成功">
            <div style="text-align: center">
                关注诸葛装修公众号<br>
                第一时间收到回答提醒<br>
                更多悬赏问题推送,助你拿取赏金
            </div>
            <mu-flat-button label="确定" slot="actions" primary @click="login = false"/>
        </mu-dialog>
    </div>
</template>

<script>
    import {EventBus, Constants, mixins} from '../assets/js/index';

    export default {
        name: 'app',
        mixins: [mixins.base, mixins.request],
        data() {
            return {
                open: false,
                docked: false,
                toast: {
                    show: false,
                    message: '',
                    Timer: null
                },
                login: false
            };
        },
        created() {
            EventBus.$on(Constants.EventBus.showToast, value => {
                this.showMessage(value);
            });

            EventBus.$on(Constants.EventBus.login, value => {
                this.login = true;
            });
        },
        methods: {
            showMessage(value) {
                this.toast.show = true;
                this.toast.message = value.message;

                if (this.toast.Timer) clearTimeout(this.toast.Timer);
                this.toast.Timer = setTimeout(() => {
                    this.toast.show = false;
                }, 2000);
            },
        }
    };
</script>

<style lang="scss">
    @import "../assets/scss/base";
</style>
