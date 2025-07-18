module.exports = {
  async up(db, client) {
    await db.collection("Users").updateMany({}, {
      $set: {
        phoneNumber: null,
        address: null
      }
    });
  },

  async down(db, client) {
    await db.collection("Users").updateMany({}, {
      $unset: {
        phoneNumber: "",
        address: ""
      }
    });
  }
};
