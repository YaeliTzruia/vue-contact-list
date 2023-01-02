<template>
  <div>
    <div class="parent">
      <div v-if="!users">Loading Please wait...</div>
      <div
        v-else
        v-for="user in users"
        :key="user.id"
        class="content-box use-box"
      >
        <div class="content">
          <div class="img-section">
            <img
              alt="profile image"
              v-bind:src="
                require(`@/assets/${user.img}`) || '../assets/monica smith.jpg'
              "
            />

            <input
              type="text"
              v-model="user.role"
              v-if="editingId == user.id"
            />
            <small v-else>{{ user.role }}</small>
          </div>

          <div class="info">
            <div class="top">
              <input
                type="text"
                v-model="user.name"
                v-if="editingId == user.id"
              />
              <h1 v-else>{{ user.name }}</h1>
              <div class="location-box">
                <img
                  class="location"
                  alt="location"
                  src="../assets/location.png"
                />
                <p>{{ user.liveLocation }}</p>
              </div>
            </div>
            <div>
              <small class="bold">Latitude: {{ user.coordinates.lat }} </small>
              <small class="bold">Longitude:{{ user.coordinates.lng }}</small>
            </div>
            <div class="bottom">
              <h2>Twitter, Inc.</h2>

              <input
                type="text"
                v-if="editingId == user.id"
                v-model="user.address1"
              />
              <p v-else>{{ user.address1 }}</p>

              <input
                type="text"
                v-if="editingId == user.id"
                v-model="user.address2"
              />
              <p v-else>{{ user.address2 }}</p>

              <input
                @keyup="onlyNumberEdit(user)"
                v-model="user.phone"
                v-if="editingId == user.id"
              />
              <div v-else>
                <p>P: {{ user.phone }}</p>
                <p class="error"></p>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <button
            @click="saveEdit(user)"
            class="submit clickable"
            v-if="editingId == user.id"
          >
            Save Changes
          </button>

          <div v-else>
            <img
              @click="showEditFunc(user)"
              class="footer-img clickable"
              alt="edit"
              src="../assets/edit.png"
            />
            <img
              @click="deleteUser(user.id)"
              class="footer-img clickable"
              alt="delete"
              src="../assets/trash.png"
            />
          </div>
        </div>
      </div>
      <div v-if="showAddBox" class="content-box">
        <form @submit.prevent="addUser(user)">
          <div class="form">
            <img
              class="new-img"
              alt="new img"
              src="../assets/janeth carton.jpg"
            />
            <div class="form-container">
              <input
                v-model="user.name"
                type="text"
                placeholder="Full Name..."
              />
              <input v-model="user.role" type="text" placeholder="Role..." />
              <input
                required
                v-model="user.address1"
                type="text"
                placeholder="Address..."
              />
              <input
                required
                v-model="user.address2"
                type="text"
                placeholder="Locality & Postalcode..."
              />

              <input
                @keyup="onlyNumber"
                v-model="user.phone"
                placeholder="Phone..."
              />
            </div>
          </div>
          <div class="check footer">
            <button class="submit clickable" type="submit">Submit</button>
          </div>
        </form>
      </div>

      <div class="add-container">
        <img
          @click="showBoxAddFunc"
          type="submit"
          class="add clickable"
          alt="add"
          src="../assets/add.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UsersBox",
  data() {
    return {
      users: [],
      editingId: "",
      showAddBox: false,
      user: {
        img: "janeth carton.jpg",
        name: "",
        role: "",
        liveLocation: "Riviera State 32/106",
        address1: "",
        address2: "",
        phone: "",
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
    };
  },
  async mounted() {
    this.users = await this.fetchUsers();
    console.log(this.users, "this.users");
    this.showInfo = true;
  },

  methods: {
    onlyNumberEdit(user) {
      user.phone = user.phone.replace(/[^()+\s,0-9]/gi, "");
    },
    onlyNumber() {
      this.user.phone = this.user.phone.replace(/[^()+\s,0-9]/gi, "");
    },
    async fetchUser(id) {
      const res = await fetch(`api/users${id}`);
      const data = await res.json();
      return data;
    },

    async fetchUsers() {
      const res = await fetch("api/users");
      const data = await res.json();
      return data;
    },

    showBoxAddFunc() {
      this.showAddBox = true;
    },
    showEditFunc(data) {
      this.editingId = data.id;
    },
    async saveEdit(userData) {
      await this.updateLocation(userData);
      await fetch(`api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },

        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((userData) => console.log(userData));

      this.editingId = "";
    },

    async addUser(newUser) {
      const user = this.user;
      await this.getLocation(newUser);

      const res = await fetch("api/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      this.users = [...this.users, data];

      console.log(this.user);
      // this last line is to clear the text after submit
      this.user = {
        img: "janeth carton.jpg",
        name: "",
        role: "",
        liveLocation: "Riviera State 32/106",
        address1: "",
        address2: "",
        phone: "",
      };
      this.showAddBox = false;
    },
    async updateLocation(updatedUser) {
      console.log(
        updatedUser.coordinates.lat,
        updatedUser.coordinates.lng,
        "newUser"
      );
      const API_KEY = process.env.API_KEY;
      const API_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${updatedUser.address1}+${updatedUser.address2}&key=${API_KEY}`;
      const apiResponse = await fetch(API_URL);
      const locationData = await apiResponse.json();
      updatedUser.coordinates.lat =
        locationData.results[0].geometry.location.lng;
      updatedUser.coordinates.lng =
        locationData.results[0].geometry.location.lat;
    },

    async getLocation(newUser) {
      const API_KEY = "AIzaSyDkWzva7dAFQTO6rQVxZZawYTrcuo04PfI";
      const API_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${newUser.address1}+${newUser.address2}&key=${API_KEY}`;
      const apiResponse = await fetch(API_URL);
      const locationData = await apiResponse.json();
      console.log(locationData, "location");
      console.log(locationData.results[0].geometry.location.lng, "lng");
      console.log(locationData.results[0].geometry.location.lat, "lat");
      console.log(this.user.coordinates.lat, "edit user lat");
      this.user.coordinates.lat = locationData.results[0].geometry.location.lng;
      this.user.coordinates.lng = locationData.results[0].geometry.location.lat;
    },

    async deleteUser(id) {
      const res = await fetch(`api/users/${id}`, {
        method: "DELETE",
      });
      res.status === 200
        ? (this.users = this.users.filter((user) => user.id !== id))
        : alert("Error deleting user");
    },
  },
};
</script>

<style src="./Box.css" scoped></style>
