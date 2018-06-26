<template>
    <div class="template">{{test}}</div>
</template>

<script>
    import {EventBus, Constants} from '../config/index'

    export default {
        name: 'component-template',
        props: {
            test: {
                type: String,
                default: 'i am a template components'
            }
        },
        data () {
            return {}
        },
        created(){
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    .template {
        background-color: #afafaf;
        padding: 10px;
    }
</style>