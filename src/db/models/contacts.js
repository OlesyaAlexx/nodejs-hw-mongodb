import { model, Schema } from 'mongoose';
import { typeList } from '../../constants/contact-constants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

//Створення схеми
const contactSchema = new Schema(
  {
    name: {
      type: String,
      min: [3, 'Must be at least 3, got {VALUE}'],
      max: 20,
      required: true,
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\+380\d{9}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, 'User phone number required'],
    },
    email: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`, // Повідомлення про помилку
      },
      required: [false, 'User email is optional'], // Email не є обов'язковим
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      required: true,
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactSchema.post('save', mongooseSaveError);

contactSchema.pre('findOneAndUpdate', setUpdateSettings);

contactSchema.post('findOneAndUpdate', mongooseSaveError);

export const ContactsCollection = model('contacts', contactSchema);
