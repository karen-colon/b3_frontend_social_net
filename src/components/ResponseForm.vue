<template>
  <div class="response-form">
    <textarea v-model="newResponseText" placeholder="Escribe tu respuesta..."></textarea>
    <button @click="submitResponse">Responder</button>
  </div>
</template>

<script>
export default {
  props: ['postId'],
  data() {
    return {
      newResponseText: '',
    };
  },
  methods: {
    submitResponse() {
      if (this.newResponseText.trim() !== '') {
        this.$emit('new-response', this.newResponseText);
        this.newResponseText = '';
      }
    },
  },
};
</script>

<style scoped>
.response-form {
  margin-top: 10px;
}
</style>
