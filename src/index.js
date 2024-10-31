const { default: axios } = require('axios');
require('colors');

async function run() {
	const names = {
		source: 'sapochek',
		target: 'makcon_bl4',
	};
	const ids = await getRaidIds(names.source, names.target);
	console.log(ids);
	if (!ids.sourceId || !ids.targetId) return console.log('1: Нету ids'.red);
	while (true) {
		const raid = await createRaid(ids.sourceId, ids.targetId);
		if (!raid) return;
		console.log(`Рейд создан. ${names.source} - ${names.target}`.green);
		await new Promise(r => setTimeout(r, 9000));
		const goRaidRes = await goRaid(ids.sourceId);
		if (!goRaidRes) return;
		console.log(`Рейд отправлен. ${names.source} - ${names.target}`.green);
		await new Promise(r => setTimeout(r, 6000));
	}
}

async function getRaidIds(sourceName, targetName) {
	try {
		const res = await axios.post(
			'https://gql.twitch.tv/gql',
			`[\n    {\n        "operationName": "chatRaidChannelIDs",\n        "variables": {\n            "sourceID": "${sourceName}",\n            "targetID": "${targetName}"\n        },\n        "extensions": {\n            "persistedQuery": {\n                "version": 1,\n                "sha256Hash": "22a78bb2a257874ae80ae914a667f7fdd65eeab678e4ae39d38f3d1e220c1811"\n            }\n        }\n    }\n]`,
			{
				headers: {
					authorization: 'OAuth ox0wgpqg76lqh1fd3yhdw9oa44mtyp',
					'client-id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
					'x-device-id': 'SlTlgj6hNrGLjarZJuUqtRus84NB8rrL',
					'client-integrity': null, // TODO: ОБЯЗАТЕЛЬНО,
				},
			}
		);
		return {
			sourceId: res?.data[0]?.data?.source?.id,
			targetId: res?.data[0]?.data?.target?.id,
		};
	} catch (error) {
		console.log(error.message);
	}
}

async function createRaid(sourceID, targetID) {
	try {
		const res = await axios.post(
			'https://gql.twitch.tv/gql',
			`[\n\t{\n\t\t"operationName": "chatCreateRaid",\n\t\t"variables": {\n\t\t\t"input": {\n\t\t\t\t"sourceID": "${sourceID}",\n\t\t\t\t"targetID": "${targetID}"\n\t\t\t}\n\t\t},\n\t\t"extensions": {\n\t\t\t"persistedQuery": {\n\t\t\t\t"version": 1,\n\t\t\t\t"sha256Hash": "f4fc7ac482599d81dfb6aa37100923c8c9edeea9ca2be854102a6339197f840a"\n\t\t\t}\n\t\t}\n\t}\n]`,
			{
				headers: {
					authorization: 'OAuth ox0wgpqg76lqh1fd3yhdw9oa44mtyp',
					'client-id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
					'x-device-id': 'SlTlgj6hNrGLjarZJuUqtRus84NB8rrL',
					'client-integrity': null, // TODO: ОБЯЗАТЕЛЬНО,
				},
			}
		);

		const data = res?.data[0];
		if (!data?.data?.createRaid?.raid) console.log('Рейд не создан'.red);

		if (data?.errors?.length) return console.log('Ошибка создания рейда'.red, data?.errors[0]);
		else if (data?.data?.createRaid?.error?.code) return console.log('Ошибка создания рейда'.red, data?.data?.createRaid?.error?.code);

		return data?.data?.createRaid?.raid;
	} catch (error) {
		console.log(error.message);
	}
}

async function goRaid(sourceID) {
	try {
		const res = await axios.post(
			'https://gql.twitch.tv/gql',
			`[\n    {\n        "operationName": "GoRaid",\n        "variables": {\n            "input": {\n                "sourceID": "${sourceID}"\n            }\n        },\n        "extensions": {\n            "persistedQuery": {\n                "version": 1,\n                "sha256Hash": "878ca88bed0c5a5f0687ad07562cffc0bf6a3136f15e5015c0f5f5f7f367f70a"\n            }\n        }\n    }\n]`,
			{
				headers: {
					authorization: 'OAuth ox0wgpqg76lqh1fd3yhdw9oa44mtyp',
					'client-id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
					'x-device-id': 'SlTlgj6hNrGLjarZJuUqtRus84NB8rrL',
					'client-integrity': null, // TODO: ОБЯЗАТЕЛЬНО,
				},
			}
		);

		const data = res?.data[0];
		if (!data?.data?.goRaid?.raid) console.log('Рейд не отправлен'.red);

		if (data?.errors?.length) return console.log('Ошибка отправки рейда'.red, data?.errors[0]);
		else if (data?.data?.goRaid?.error?.code) return console.log('Ошибка отправки рейда'.red, data?.data?.goRaid?.error?.code);

		return data?.data?.goRaid?.raid;
	} catch (error) {
		console.log(error.message);
	}
}

run();
