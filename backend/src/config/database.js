const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "devArena", // explicit DB name — data will appear in Compass under "devtinder"
  });
  console.log(`✅ MongoDB connected → devArena`);
};
module.exports = connectDB;
