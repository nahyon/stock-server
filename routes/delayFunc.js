function delay() {
	return new Promise(resolve => setTimeout(resolve, 1000));//12050)); //12초이상 (5call/분)
}

async function delayedLog(symbol) {
	await delay();
	await callAPI(symbol);
	//console.log(symbol);
}
async function processArray(symbols) {
	for (const symbol of symbols) {
		await delayedLog(symbol);
	}
	console.log('Done!');
}

module.exports = {
    delay,
    delayedLog,
    processArray,
};
  