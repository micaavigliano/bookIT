import mongoose from "mongoose";
import Room from "../app/backend/models/room";
import { rooms } from "./data";

const seedRooms = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/bookit-v2");
    await Room.deleteMany();
    await Room.insertMany(rooms);

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

seedRooms();
