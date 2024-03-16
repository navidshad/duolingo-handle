const {
  CollectionDefinition,
  Schema,
  Schemas,
  Permission,
  PermissionTypes,
  DatabaseTrigger,
} = require("@modular-rest/server");

const examVoucherSchema = new Schema({
  remainingExams: { type: Number, default: 4 },
  // https://www.npmjs.com/package/node-machine-id
  machineId: { type: String },
});

const voucherSchema = new Schema({
  email: { type: String, required: true, unique: true },
  examVouchers: {
    type: [examVoucherSchema],
    default: [{ remainingExams: 4 }],
  },
});

module.exports = [
  new CollectionDefinition({
    db: "exam",
    collection: "voucher",
    schema: voucherSchema,
    permissions: [
      new Permission({
        type: "advanced_settings",
        read: true,
        write: true,
      }),
      new Permission({
        type: "anonymous_access",
        read: true,
      }),
    ],
  }),
];
