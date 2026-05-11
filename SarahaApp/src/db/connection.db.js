import mongoose from "mongoose";

const connectionDB = async () => {
  try {
    const URI =
      "mongodb://elsayedatef469_db_user:aEOvfRATMxxP2Uka@ac-rd1guct-shard-00-00.zw5aok1.mongodb.net:27017,ac-rd1guct-shard-00-01.zw5aok1.mongodb.net:27017,ac-rd1guct-shard-00-02.zw5aok1.mongodb.net:27017/sarahaApp?ssl=true&replicaSet=atlas-tgoz4z-shard-0&authSource=admin&appName=Cluster0";

    await mongoose.connect(URI);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectionDB;