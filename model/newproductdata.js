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
    productdescription:{type: String,required:true},
    
    popularproduct:{type: String,required:true},   // new added
    productoffer:{type: String,required:true},
    topratedproduct:{type: String,required:true},
    
    newCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'newcategorydata',
      required: true,
    },
    image: { type: String, trim: true },
    image1: { type: String, trim: true },
    image2: { type: String, trim: true },
    video: { type: String, trim: true },

    structureId: {
      type: Schema.Types.ObjectId,
      ref: 'StructureData',
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      ref: 'ContentData',
      required: true,
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
    },
    designId: {
      type: Schema.Types.ObjectId,
      ref: 'DesignData',
      required: true,
    },
    colorId: { type: Schema.Types.ObjectId, ref: 'ColorData', required: true },
    css: { type: String, required: true, trim: true },
    motifsizeId: {
      type: Schema.Types.ObjectId,
      ref: 'MotifsizeData',
      required: true,
    },
    suitableforId: {
      type: Schema.Types.ObjectId,
      ref: 'SuitableforData',
      required: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'VendorData',
      required: true,
    },
    groupcodeId: {
      type: Schema.Types.ObjectId,
      ref: 'GroupCode',
      required: true,
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
    description: { type: String, required: true, trim: true, maxlength: 160 },
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
