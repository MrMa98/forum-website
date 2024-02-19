<template>
    <div class="buttom-group">
        <a-upload :before-upload="beforeUpload" :show-upload-list="false">
            <a-button>
                <upload-outlined />
                上传图片
            </a-button>
        </a-upload>
        <a-button v-if="uploadImgSrc" @click="rotate">
            <RedoOutlined />
            旋转
        </a-button>
        <a-button v-if="uploadImgSrc" @click="flipX">
            <ColumnWidthOutlined />
            左右翻转
        </a-button>
        <a-button v-if="uploadImgSrc" @click="flipY">
            <ColumnHeightOutlined />
            上下翻转
        </a-button>
        <a-button v-if="uploadImgSrc" @click="cropperImg">
            <HeartOutlined />
            预览头像
        </a-button>
    </div>
    <vue-cropper v-if="uploadImgSrc" :aspect-ratio="1 / 1" ref="cropper" :src="uploadImgSrc" alt="图片加载失败..."
        :containerStyle="{ width: '561px', 'max-height': '561px' }">
    </vue-cropper>
    <label v-if="uploadImgSrc">
        头像预览展示：
    </label>
    <div class="preview" v-if="uploadImgSrc">
        <img :src="img" alt="">
    </div>
    <div style="text-align: right;" v-if="uploadImgSrc && img">
        <a-button @click="saveAvatar">
            <HeartFilled />
            设为头像
        </a-button>
    </div>
</template>

<script lang="ts" setup>
import vueCropper from "vue-cropperjs";
import 'cropperjs/dist/cropper.css';
import { UploadOutlined, RedoOutlined, ColumnWidthOutlined, HeartFilled, ColumnHeightOutlined, HeartOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'ant-design-vue';
import { updateAvator, userInfo } from "@/service/users";
import { openNotification } from "./antvNotification";
import { useUserInfoStore } from "@/stores/userInfo";
const cropper = ref();
const img = ref('');
let uploadImgSrc = ref<string>('');
const scaleX = ref(1);
const scaleY = ref(1);

const rotate = () => {
    cropper.value.rotate(45);
}

const flipX = () => {
    scaleX.value = scaleX.value === 1 ? -1 : 1;
    cropper.value.scaleX(scaleX.value);
}

const flipY = () => {
    scaleY.value = scaleY.value === 1 ? -1 : 1;
    cropper.value.scaleX(scaleY.value);
}

const cropperImg = () => {
    console.log(cropper.value.getCroppedCanvas().toDataURL());
    
    img.value = cropper.value.getCroppedCanvas().toDataURL();
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
    uploadImgSrc.value = '';
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        uploadImgSrc.value = reader.result as string;
    };
    return false;
};


const converter = () => {
    // Base64 编码的图片数据
    const base64Image = img.value;

    // 截取逗号后的部分，即去除"data:image/png;base64,"
    const base64Data = base64Image.split(",")[1];

    // 解码 Base64 数据
    const binaryData = atob(base64Data);

    // 将二进制数据转换为 Uint8Array
    const uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
    }

    // 创建 Blob 对象
    const blob = new Blob([uint8Array], { type: 'image/png' });
    

    // 创建 File 对象
    const file = new File([blob], 'filename.png', { type: 'image/png' });

    // 现在，file 就是包含图片数据的 File 对象
    return file;
}

const saveAvatar = () => {
    updateAvator(converter()).then((res) => {
        const isError = res.data;
        userInfo().then((user)=>{
            useUserInfoStore().$patch({userInfoData: user.data})
        })
        openNotification('bottomRight', '', '修改成功', false, isError);
    })
}
</script>

<style lang="less" scoped>
.avatar-uploader>.ant-upload {
    width: 128px;
    height: 128px;
}

.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}

.buttom-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

label {
    margin-bottom: 8px;
}

.preview {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 200px;
        height: 200px;
        border-radius: 50%;
    }
}
</style>