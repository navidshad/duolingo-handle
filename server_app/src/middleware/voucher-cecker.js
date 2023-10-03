const { getCollection, reply } = require("@modular-rest/server");

module.exports.checkVoucherMiddleWare = async (ctx, next) => {
  const voucherid = ctx.headers.voucher;

  if (!voucherid) {
    ctx.throw(401, reply.create("f", "voucher not found"));
    return;
  }

  const voucherModel = getCollection("exam", "voucher");

  const voucherDoc = await voucherModel.findOne({ _id: voucherid }).exec();

  if (!voucherDoc?.id) {
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
