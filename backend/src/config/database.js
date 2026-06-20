const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "devArena", 
  });
  console.log(`✅ MongoDB connected → devArena`);
};
module.exports = connectDB;
