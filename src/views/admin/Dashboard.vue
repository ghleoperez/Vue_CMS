<template>
  <div class="dashboard">
    <h1>Admin Dashboard</h1>
    <div class="dashboard-content">
      <p>Welcome to the admin dashboard</p>
      <div class="dashboard-stats">
        <!-- Dashboard stats will go here -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard component logic will go here
</script>

<style scoped>
.dashboard {
  padding: 1rem;
}

.dashboard-content {
  margin-top: 1rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
</style>