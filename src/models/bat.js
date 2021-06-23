const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const batSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        unique: true,
      },
      subtitle: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      owner: Object,
      file: Object,
    },
    {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    },
);

batSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('bat', batSchema);
