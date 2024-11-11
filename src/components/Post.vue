<template>
  <div class="post">
    <h3>{{ post.title }}</h3>
    <p>{{ post.content }}</p>

    <div v-for="response in post.responses" :key="response._id">
      <p>{{ response.text }}</p>
      <small>{{ response.user.name }}</small>
    </div>

    <ResponseForm :postId="post._id" @new-response="addResponse" />
  </div>
</template>

<script>
import ResponseForm from './ResponseForm.vue';

export default {
  components: {
    ResponseForm,
  },
  props: ['post'],
  methods: {
    addResponse(responseText) {
      // Llamar a una función que envíe la respuesta al backend
      this.$emit('submit-response', { postId: this.post._id, text: responseText });
    },
  },
};
</script>

<style scoped>
.post {
  margin-bottom: 20px;
}
</style>
