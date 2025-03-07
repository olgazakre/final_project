import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubscription extends Document {
  follower: Types.ObjectId; 
  following: Types.ObjectId; 
  createdAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
  follower: { type: Types.ObjectId, ref: "User", required: true },
  following: { type: Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

SubscriptionSchema.index({ follower: 1, following: 1 }, { unique: true });

const Subscription = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
export default Subscription;
