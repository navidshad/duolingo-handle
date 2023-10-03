let Router = require("koa-router");

const { reply } = require("@modular-rest/server");

const { checkVoucherMiddleWare } = require("../../middleware/voucher-cecker");
const { visionAndSpeechService } = require("./vision-speech.service");
const { textService } = require("./text.service");

let name = "ai";
let router = new Router();

function handle_result(ctx, result) {
  ctx.body = reply.create("s", {
    data: result,
  });
}

function handle_error(ctx, err) {
  ctx.code = 500;
  ctx.body = reply.create("e", {
    message: err.message || "Something went wrong",
  });
}

//
// Vision and Speech
//
router.post("/detect-text-positions", checkVoucherMiddleWare, async (ctx) => {
  const { base64Content } = ctx.request.body;

  await visionAndSpeechService
    .detectTextPositionsFromImage(base64Content)
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

router.post("/detect-text", checkVoucherMiddleWare, async (ctx) => {
  const { base64Content } = ctx.request.body;

  await visionAndSpeechService
    .detectTextFromImage(base64Content)
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

router.post("/detect-text-from-audio", checkVoucherMiddleWare, async (ctx) => {
  const { base64Content } = ctx.request.body;

  await visionAndSpeechService
    .detectTextFromAudio(base64Content)
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

router.post("/translate-text", checkVoucherMiddleWare, async (ctx) => {
  const { phrase, lang } = ctx.request.body;

  await visionAndSpeechService
    .translateText({ phrase, lang })
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

//
// Text
//
router.post("/validate-word", checkVoucherMiddleWare, async (ctx) => {
  const { word } = ctx.request.body;

  await textService
    .handelWordValidation(word)
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

router.post("/create-completion", checkVoucherMiddleWare, async (ctx) => {
  const { prompt, model } = ctx.request.body;

  await textService
    .createCompletion(prompt, model)
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

router.post("/create-chat-completion", checkVoucherMiddleWare, async (ctx) => {
  const { messages, model } = ctx.request.body;

  await textService
    .createChatCompletion({ messages, model })
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

module.exports.name = name;
module.exports.main = router;
