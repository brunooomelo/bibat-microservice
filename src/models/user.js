const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');

const userSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        unique: true,
        lowercase: true,
      },
      email: {
        type: String,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
        select: false,
      },
      passwordResetToken: {
        type: String,
        select: false,
      },
      passwordResetExpires: {
        type: Date,
        select: false,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
      autoIndex: true,
    },
);
userSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('user', userSchema);
