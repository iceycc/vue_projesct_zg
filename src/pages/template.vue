<template>
    <div class="page">
        <div class="title">测试rem-{{version}}--{{localValue}}</div>
        <component-template></component-template>
        <auto-list-view :url="url" :flag="1">
            <template slot="item" slot-scope="props">
                <div>{{props.item.name}}</div>
            </template>
        </auto-list-view>
    </div>
</template>

<script>
    import {Constants, EventBus, mixins} from '../config/index';

    import ComponentTemplate from "../components/template";
    import AutoListView from "../components/commons/AutoListView";

    export default {
        components: {
            AutoListView,
            ComponentTemplate
        },
        mixins: [mixins.base, mixins.wx],
        name: 'about',
        data() {
            return {
                url: Constants.Method.test,
                title: '关于',
                version: process.env.APP_VERSION,
                localValue: this.$ls.get(Constants.LocalStorage.test, '-1')
            };
        },
        computed: {},
        created() {
        },
        methods: {}
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/px2rem";

    .title {
        display: block;
        padding: px2rem(16);
        font-size: px2rem(16);
        margin: 0;
    }
</style>
