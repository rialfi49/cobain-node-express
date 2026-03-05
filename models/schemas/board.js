import { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    title: String,
    content: String,

    // 🔥 Relasi ke User
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // HARUS sama dengan nama model
      required: true,
    },
  },
  { timestamps: true },
);

export default PostSchema;

// import { Schema } from "mongoose";

// const PostSchema = new Schema(
//   {
//     author: String,
//     title: String,
//     content: String,
//   },
//   {
//     timestamps: true,
//   },
// );

// export default PostSchema;
