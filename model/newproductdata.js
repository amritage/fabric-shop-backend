const mongoose = require('mongoose');
const { Schema } = mongoose;

function maxKeywordsString(val) {
  return (
    typeof val === 'string' &&
    val.split(',').filter((s) => s.trim()).length <= 20
  );
}

const NewProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    productdescription: { type: String, required: false },

    popularproduct: { type: String, required: true }, // new added
    productoffer: { type: String, required: true },
    topratedproduct: { type: String, required: true },

    newCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'newcategorydata',
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('newcategorydata')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid newCategoryId: No matching newcategorydata found',
      },
    },
    image: { type: String, trim: true },
    image1: { type: String, trim: true },
    image2: { type: String, trim: true },
    video: { type: String, trim: true },

    structureId: {
      type: Schema.Types.ObjectId,
      ref: 'StructureData',
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('StructureData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid structureId: No matching StructureData found',
      },
    },
    substructureId: {
      type: Schema.Types.ObjectId,
      ref: 'SubstructureData',
      required: false,
      validate: {
        validator: async function (value) {
          if (!value) return true;
          const exists = await mongoose
            .model('SubstructureData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid substructureId: No matching SubstructureData found',
      },
    },
    contentId: {
      type: Schema.Types.ObjectId,
      ref: 'ContentData',
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('ContentData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid contentId: No matching ContentData found',
      },
    },
    gsm: { type: Number, required: true },
    oz: { type: Number, required: true },
    cm: { type: Number, required: true },
    inch: { type: Number, required: true },
    quantity: { type: Number, required: true },
    um: { type: String, required: true, trim: true },
    currency: { type: String, required: true, trim: true },

    finishId: {
      type: Schema.Types.ObjectId,
      ref: 'FinishData',
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('FinishData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid finishId: No matching FinishData found',
      },
    },
    subfinishId: {
      type: Schema.Types.ObjectId,
      ref: 'SubfinishData',
      required: false,
      validate: {
        validator: async function (value) {
          if (!value) return true;
          const exists = await mongoose
            .model('SubfinishData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid subfinishId: No matching SubfinishData found',
      },
    },
    designId: {
      type: Schema.Types.ObjectId,
      ref: 'DesignData',
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('DesignData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid designId: No matching DesignData found',
      },
    },
    colorId: {
      type: Schema.Types.ObjectId,
      ref: 'ColorData',
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('ColorData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid colorId: No matching ColorData found',
      },
    },
    css: { type: String, required: true, trim: true },
    motifsizeId: {
      type: Schema.Types.ObjectId,
      ref: 'MotifsizeData',
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('MotifsizeData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid motifsizeId: No matching MotifsizeData found',
      },
    },
    suitableforId: {
      type: Schema.Types.ObjectId,
      ref: 'SuitableforData',
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('SuitableforData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid suitableforId: No matching SuitableforData found',
      },
    },
    subsuitableId: {
      type: Schema.Types.ObjectId,
      ref: 'SubsuitableData',
      required: false,
      validate: {
        validator: async function (value) {
          if (!value) return true;
          const exists = await mongoose
            .model('SubsuitableData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid subsuitableId: No matching SubsuitableData found',
      },
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'VendorData',
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('VendorData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid vendorId: No matching VendorData found',
      },
    },
    groupcodeId: {
      type: Schema.Types.ObjectId,
      ref: 'GroupCode',
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('GroupCode')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid groupcodeId: No matching GroupCode found',
      },
    },

    charset: {
      type: String,
      required: true,
      enum: ['UTF-8'],
      default: 'UTF-8',
    },
    xUaCompatible: {
      type: String,
      trim: true,
      maxlength: 20,
      default: 'IE=edge',
    },
    viewport: {
      type: String,
      trim: true,
      maxlength: 100,
      default: 'width=device-width, initial-scale=1.0',
    },
    title: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, required: true, trim: false, maxlength: 160 },
    keywords: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      validate: {
        validator: maxKeywordsString,
        message: 'Up to 20 comma-separated keywords allowed',
      },
    },
    robots: {
      type: String,
      trim: true,
      enum: [
        'index, follow',
        'noindex, nofollow',
        'index, nofollow',
        'noindex, follow',
      ],
      default: 'index, follow',
    },
    contentLanguage: { type: String, trim: true, maxlength: 10, default: 'en' },
    googleSiteVerification: { type: String, trim: true, maxlength: 100 },
    msValidate: { type: String, trim: true, maxlength: 100 },
    themeColor: {
      type: String,
      match: /^#[0-9A-Fa-f]{6}$/,
      default: '#ffffff',
    },
    mobileWebAppCapable: { type: Boolean, default: true },
    appleStatusBarStyle: {
      type: String,
      enum: ['default', 'black', 'black-translucent'],
      default: 'default',
    },
    formatDetection: {
      type: String,
      enum: ['telephone=no', 'telephone=yes'],
      default: 'telephone=no',
    },
    ogLocale: { type: String, trim: true, maxlength: 10, default: 'en_US' },
    ogTitle: { type: String, required: true, trim: true, maxlength: 60 },
    ogDescription: { type: String, required: true, trim: true, maxlength: 160 },
    ogType: { type: String, trim: true, maxlength: 50, default: 'product' },
    ogUrl: { type: String, required: true, trim: true, maxlength: 2048 },
    ogSiteName: { type: String, trim: true, maxlength: 100 },
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image', 'app', 'player'],
      default: 'summary_large_image',
    },
    twitterSite: { type: String, trim: true, maxlength: 25 },
    twitterTitle: { type: String, trim: true, maxlength: 60 },
    twitterDescription: { type: String, trim: true, maxlength: 160 },

    hreflang: { type: String, trim: true, maxlength: 10 },
    x_default: { type: String, trim: true, maxlength: 10 },
    author_name: { type: String, trim: true, maxlength: 100 },

    sku: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, trim: true, maxlength: 255 },
    canonical_url: { type: String, trim: true, maxlength: 2048 },
    description_html: { type: String, trim: true },
    rating_value: { type: Number, default: 0, min: 0 },
    rating_count: { type: Number, default: 0, min: 0 },

    // ✅ New fields added
    purchasePrice: { type: Number, required: true },
    salesPrice: { type: Number, required: true },
    locationCode: {
      type: String,
      required: true,
      maxlength: 3,
    },
    productIdentifier: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'published_at', updatedAt: 'updated_at' },
  },
);

module.exports = mongoose.model('newproductdata', NewProductSchema);
