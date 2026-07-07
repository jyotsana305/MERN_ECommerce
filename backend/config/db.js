import mongoose from "mongoose";
const connectMongoDatabase=()=>{
    mongoose.connect(process.env.DB_URI).then((data)=>{
        console.log(`MongoDB is connected with server ${data.connection.host}`);

    })
}
export default connectMongoDatabase;