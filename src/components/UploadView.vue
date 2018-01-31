<template>
    <div class="uploadview">
        <div class="view" v-for="localId in localIds">
            <img :src="localId" class="img"/>
            <img src="../assets/img/icon_upload_close.svg" class="close" @click="remove(localId)">
        </div>
        <img src="../assets/img/icon_upload_img.svg" class="img" @click="upload"/>
    </div>
</template>

<script>
    export default {
        name: 'uploadView',
        data() {
            return {};
        },
        props: {
            localIds: {
                type: Array,
                default: []
            }
        },
        created() {
        },
        methods: {
            upload() {
                this.$emit('upload');
            },
            remove(localId) {
                this.$emit('remove', localId);
            },
            onClick() {
                this.$emit('onClick');
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../assets/scss/px2rem";

    .uploadview {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .view {
        margin-right: px2rem(10);
        position: relative;
        .close {
            position: absolute;
            top: 0;
            right: 0;
            width: px2rem(20);
            height: px2rem(20);
        }
    }

    .img {
        width: px2rem(50);
        height: px2rem(50);
    }
</style>