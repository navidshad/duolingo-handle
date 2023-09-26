const { getCollection, reply } = require("@modular-rest/server");

const voucherModel = getCollection("exam", "voucher");

module.exports.checkVoucherMiddleWare = async (ctx, next) => {
  const voucherid = ctx.headers.voucher;

  if (!voucherid) {
    ctx.throw(401, reply.create("f", "voucher not found"));
    return;
  }

  const voucherDoc = await voucherModel.findOne({ _id: voucherid }).exec();

  if (!voucherDoc) {
    ctx.throw(401, reply.create("f", "invalid voucher"));
    return;
  }

  const remainingExams = voucherDoc.examVouchers.reduce((acc, examVoucher) => {
    acc += examVoucher.remainingExams;
    return acc;
  });

  if (remainingExams <= 0) {
    ctx.throw(401, reply.create("f", "no remaining exams"));
  }

  ctx.state.voucher = voucherDoc;
  await next();
};
