const Router = require("koa-router");
const { reply } = require("@modular-rest/server");
const { check, redeem } = require("./service");

let name = "voucher";
let voucher = new Router();

voucher.post("/check", async (ctx) => {
  const { voucher } = ctx.request.body || {};

  if (!voucher) {
    ctx.status = 400;
    ctx.body = reply.create("e", {
      message: "Please provide a voucher",
    });
  }

  await check(voucher)
    .then((totalRemainingExams) => {
      ctx.body = reply.create("s", {
        data: { totalRemainingExams },
      });
    })
    .catch((err) => {
      ctx.status = 404;
      ctx.body = reply.create("e", {
        message: "Voucher invalid",
      });
    });
});

voucher.post("/redeem", async (ctx) => {
  const { voucher } = ctx.request.body || {};

  try {
    await redeem(voucher).then(({ totalRemainingExams, voucherUsed }) => {
      ctx.body = reply.create("s", {
        data: { totalRemainingExams, voucherUsed },
      });
    });
  } catch (err) {
    ctx.status = 404;
    ctx.body = reply.create("e", {
      message:
        "Something went wrong. Please contact support duolingo.handle@gmail.com",
    });
  }
});

module.exports.name = name;
module.exports.main = voucher;
