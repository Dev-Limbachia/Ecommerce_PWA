<template>
  <div class="subject-container" v-if="showProduct">
    <div class="subject-box" v-for="(subject, subjectIndex) in subjects" :key="subject.id">
      <figure>
        <img :src="'https://webstore-rest-api-f979.onrender.com' + subject.image" alt="Subject Image" />
      </figure>
      <h2 v-text="subject.title"></h2>
      <p>Location: {{subject.location}}</p>
      <p>Price: £{{subject.price}}</p>
      <p>Availability: {{subject.availableInventory}}</p>

      <button class="button" @click="addToCart(subject, subjectIndex)" v-if="canAddToCart(subject)">
        Add to cart
      </button>
      <button class="disabled" v-else>Add to cart</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["subjects", "showProduct"], // Include showProduct as a prop
  methods: {
    addToCart(subject) {
      if (this.canAddToCart(subject)) {
        this.$emit('addToCart', subject);
      }
    },
    canAddToCart(subject) {
      return subject.availableInventory > 0;
    }
  }
};
</script>
