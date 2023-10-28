let Router = require("koa-router");

const { reply, getCollection } = require("@modular-rest/server");

async function check(voucherId) {
  const collection = getCollection("exam", "voucher");

  return collection
    .findOne({ _id: voucherId })
    .exec()
    .catch((err) => {
      return null;
    })
    .then((voucherDoc) => {
      if (!voucherDoc) {
        return Promise.reject("Voucher invalid");
      }

      let totalRemainingExams = 0;

      for (const examVoucher of voucherDoc.examVouchers) {
        totalRemainingExams += examVoucher.remainingExams;
      }

      if (totalRemainingExams <= 0) {
        return Promise.reject("Voucher fully redeemed");
      }

      return Promise.resolve(totalRemainingExams);
    });
}

async function redeem(voucherId) {
  const collection = getCollection("exam", "voucher");

  try {
    await check(voucherId);
  } catch (err) {
    return Promise.reject(err);
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
