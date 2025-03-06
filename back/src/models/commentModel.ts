import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  post: Types.ObjectId;
  text: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
;
