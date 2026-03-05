import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true }, // simpan salt untuk hashing
  },
  {
    timestamps: true,
  },
);

export default UserSchema;
