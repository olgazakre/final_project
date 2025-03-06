import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost extends Document {
  description?: string; 
  image: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[]; 
  comments: Types.ObjectId[]; 
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  description: { type: String, required: false }, 
  image: { type: String, required: true }, 
  author: { type: Types.ObjectId, ref: "User", required: true },
  likes: [{ type: Types.ObjectId, ref: "Like", default: [] }], 
  comments: [{ type: Types.ObjectId, ref: "Comment", default: [] }], 
  createdAt: { type: Date, default: Date.now },
});

 const Post = mongoose.model<IPost>("Post", PostSchema);
 export default Post