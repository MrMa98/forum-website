const bufferToBase64 = (buffer: { data: ArrayBuffer }) => {
    // 假设这是从数据源获取的Uint8Array图片数据
    const uint8Array = new Uint8Array(buffer.data);

    // 将Uint8Array转换成字符串
    let binaryString = "";
    for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
    }

    // 将字符串转换成Base64编码
    const base64Data = btoa(binaryString);

    // 创建Blob URL
    return "data:image/png;base64," + base64Data;
};

export { bufferToBase64 };
