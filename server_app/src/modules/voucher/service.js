let Router = require("koa-router");

const { reply, getCollection } = require("@modular-rest/server");

async function check(voucherId) {
  const collection = getCollection("exam", "voucher");

  return collection
    .findOne({ _id: voucherId })
    .exec()
    .then((voucherDoc) => {
      if (!voucherDoc) {
        return Promise.reject("Voucher invalid");
      }

      let totalRemainingExams = 0;

      for (const examVoucher of voucherDoc.examVouchers) {
        totalRemainingExams += examVoucher.remainingExams;
      }

      return Promise.resolve(totalRemainingExams);
    })
    .catch((err) => {
      return Promise.reject("Voucher invalid");
    });
}

async function redeem(voucherId) {
  const collection = getCollection("exam", "voucher");

  try {
    await check(voucherId);
  } catch (err) {
    return Promise.reject("Voucher invalid");
  }

  const voucher = await collection.findOne({ _id: voucherId }).exec();

  let voucherUsed = false;
  for (const examVoucher of voucher.examVouchers) {
    if (examVoucher.remainingExams > 0) {
      examVoucher.remainingExams--;
      voucherUsed = true;
      break;
    }
  }

  await voucher.save();
  const totalRemainingExams = await check(voucherId);

  return Promise.resolve({ totalRemainingExams, voucherUsed });
}

module.exports = {
  check,
  redeem,
};
