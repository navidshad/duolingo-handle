let Router = require("koa-router");

const { reply, getCollection } = require("@modular-rest/server");

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

async function check_token(ctx, next) {
  await next();
  return;

  if (!ctx.request.header.voucher_token) {
    ctx.code = 401;
    ctx.body = reply.create("e", {
      message: "Voucher token is required",
    });
  } else {
    await next();
  }
}

//
// Vision and Speech
//
router.post("/detect-text-positions", check_token, async (ctx) => {
  const { base64Content } = ctx.request.body;

  await visionAndSpeechService
    .detectTextPositionsFromImage(base64Content)
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

router.post("/detect-text", check_token, async (ctx) => {
  const { base64Content } = ctx.request.body;

  await visionAndSpeechService
    .detectTextFromImage(base64Content)
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

router.post("/detect-text-from-audio", check_token, async (ctx) => {
  const { base64Content } = ctx.request.body;

  await visionAndSpeechService
    .detectTextFromAudio(base64Content)
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

router.post("/translate-text", check_token, async (ctx) => {
  const { phrase, lang } = ctx.request.body;

  await visionAndSpeechService
    .translateText({ phrase, lang })
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

//
// Text
//
router.post("/validate-word", check_token, async (ctx) => {
  const { word } = ctx.request.body;

  await textService
    .handelWordValidation(word)
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

router.post("/create-completion", check_token, async (ctx) => {
  const { prompt, model } = ctx.request.body;

  await textService
    .createCompletion(prompt, model)
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

router.post("/create-chat-completion", check_token, async (ctx) => {
  const { messages, model } = ctx.request.body;

  await textService
    .createChatCompletion({ messages, model })
    .then((result) => handle_result(ctx, result))
    .catch((err) => handle_error(ctx, err));
});

module.exports.name = name;
module.exports.main = router;
