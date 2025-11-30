import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    lastLoginAt: {
      type: Date,
      default: null
    },
    tier: {
      type: String,
      enum: ['Platinum', 'Gold', 'Silver', 'Guest'],
      default: 'Guest'
    },
    ordersCount: {
      type: Number,
      default: 0
    },
    lifetimeValue: {
      type: Number,
      default: 0
    },
    location: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

UserSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    tier: this.tier,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
