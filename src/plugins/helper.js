function test (){
	console.log('test方法');
}

function IsURL(str_url) {
    return (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm).test(str_url);
}

function AnalysisURL(url) {
    return /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i.exec(url);
}


const permission = {
	test:test,
	IsURL:IsURL,
	AnalysisURL:AnalysisURL
}

module.exports = permission