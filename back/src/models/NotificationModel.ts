import mongoose, { Schema, Document, Types } from "mongoose";

type NotificationType = "liked your post" | "liked your comment" | "commented on your post" | "started following you";

export interface INotification extends Document {
  user: Types.ObjectId;  
  sender: Types.ObjectId;  
  type: NotificationType;  
  post?: Types.ObjectId;  
  comment?: Types.ObjectId;  
  isRead: boolean; 
  createdAt: Date;  
}

const NotificationSchema: Schema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true }, 
  sender: { type: Types.ObjectId, ref: "User", required: true },  
  type: { 
    type: String, 
    required: true, 
    enum: [
      "liked your post",
      "liked your comment",
      "commented on your post",
      "started following you"
    ] 
  },
  post: { type: Types.ObjectId, ref: "Post" },  
  comment: { type: Types.ObjectId, ref: "Comment" },  
  isRead: { type: Boolean, default: false },  
  createdAt: { type: Date, default: Date.now }  
});

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;

