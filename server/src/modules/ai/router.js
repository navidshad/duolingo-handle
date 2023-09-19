let Router = require('koa-router');

const {
	reply,
	getCollection,
} = require('@modular-rest/server')

const visionAndSpeechService = require('./vision-speech.service').visionAndSpeechService;
const textService = require('./text.service').textService;

let name = 'ai';
let backup = new Router();

backup.get('/list', async (ctx) => {
	try {
		let collection = getCollection('flower', 'wildflowers');
		let result = await collection.find({}).exec();

		ctx.body = reply.create('s', {
			data: result
		});
	} catch (err) {
		ctx.code = 500;
		ctx.body = reply.create('e', {
			message: err.message || 'Something went wrong'
		});
	}
});

module.exports.name = name;
module.exports.main = backup;