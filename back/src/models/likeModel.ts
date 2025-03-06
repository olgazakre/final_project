import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILike extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema ({
  user: { type: Types.ObjectId, ref: "User", required: true },
  post: { type: Types.ObjectId, ref: "Post", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Like = mongoose.model<ILike>("Like", LikeSchema);
export default Like;
