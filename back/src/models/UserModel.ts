import mongoose, {Schema, Document, Types} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document{
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    fullName: string;
    bio?: string;
    avatar?: string;
    posts?: Types.Array<Types.ObjectId>
    comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    bio: {type: String, default: ""},
    avatar: {type: String, default: ""},
    posts: { type: [{ type: Types.ObjectId, ref: "Post" }], default: [] },
})

UserSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
