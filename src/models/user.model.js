import { Schema, model } from 'mongoose';

const { Types } = Schema;

class _Schema extends Schema {
  constructor() {
    super(
      {
        _id: {
          type: Types.ObjectId,
          auto: true,
        },
        firstName: {
          type: Types.String,
        },
        lastName: {
          type: Types.String,
        },
        email: {
          type: Types.String,
          required: true,
          unique: true,
        },
        password: {
          type: Types.String,
          required: true,
        },
      },
      {
        timestamps: true,
      },
    );
  }
}

const UserModel = model('users', new _Schema());

export default UserModel;
