let Router = require("koa-router");

const { reply, getCollection } = require("@modular-rest/server");

let name = "voucher";
let backup = new Router();

backup.post("/check", async (ctx) => {
  const { voucher } = ctx.request.body || {};

  if (!voucher) {
    ctx.status = 400;
    ctx.body = reply.create("e", {
      message: "Please provide a voucher",
    });
  }

  let collection = getCollection("exam", "voucher");
  const voucherDoc = await collection
    .find({ _id: voucher })
    .exec()
    .catch((err) => null);

  if (!voucherDoc) {
    ctx.status = 404;
    ctx.body = reply.create("e", {
      message: "Voucher invalid",
    });
  } else {
    ctx.body = reply.create("s", {
      data: voucherDoc,
    });
  }
});

module.exports.name = name;
module.exports.main = backup;
