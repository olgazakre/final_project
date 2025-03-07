import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; 
  post: Types.ObjectId; 
  likes: Types.ObjectId[]; 
  text: string; 
  createdAt: Date; 
  author: Types.ObjectId;
}

const CommentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true }, 
  likes: [{ type: Types.ObjectId, ref: "Like", default: [] }],
  text: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
