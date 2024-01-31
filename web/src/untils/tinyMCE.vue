<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'

const callback = (_request: unknown, respondWith: { string: (arg0: () => Promise<never>) => unknown; }) => {
  console.log(_request, respondWith);

  respondWith.string(() => Promise.reject("See docs to implement AI Assistant"))
};
const textValue = defineModel();
</script>

<template>
  <main id="sample">
    <!-- 通过v-bind="$attrs"透传  本来想用label的for获取焦点 但是富文本的焦点不是在Editor上所以这行代码啥用没有就单独加了一个id-->
    <Editor api-key="kt0cyd9hyfw9klr7hafzsi55last4b7emxvtypzn1e1d9776" v-bind="$attrs" :init="{
      toolbar_mode: 'sliding',
      plugins: 'ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
      toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
      tinycomments_mode: 'embedded',
      tinycomments_author: 'Author name',
      mergetags_list: [
        { value: 'First.Name', title: 'First Name' },
        { value: 'Email', title: 'Email' },
      ],
      ai_request: callback
    }" v-model="textValue" />
  </main>
</template>


<style scoped>
@media (min-width: 1024px) {
  #sample {
    display: flex;
    flex-direction: column;
    place-items: center;
    width: 600px;
  }
}
</style>