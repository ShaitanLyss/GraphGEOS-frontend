// https://gist.github.com/groundrace/b5141062b47dd96a5c21c93839d4b954

export function arrayBufferToBase64String(arrayBuffer: ArrayBuffer): string {
	const byteArray = new Uint8Array(arrayBuffer);
	let byteString = '';
	for (let i = 0; i < byteArray.byteLength; i++) {
		byteString += String.fromCharCode(byteArray[i]);
	}
	return btoa(byteString);
}

export function base64StringToArrayBuffer(b64str: string): ArrayBuffer {
	const byteStr = atob(b64str);
	const bytes = new Uint8Array(byteStr.length);
	for (let i = 0; i < byteStr.length; i++) {
		bytes[i] = byteStr.charCodeAt(i);
	}
	return bytes.buffer;
}

export function textToArrayBuffer(str: string) {
	const buf = unescape(encodeURIComponent(str)); // 2 bytes for each char
	const bufView = new Uint8Array(buf.length);
	for (let i = 0; i < buf.length; i++) {
		bufView[i] = buf.charCodeAt(i);
	}
	return bufView;
}

export function arrayBufferToText(arrayBuffer: ArrayBuffer): string {
	const byteArray = new Uint8Array(arrayBuffer);
	let str = '';
	for (let i = 0; i < byteArray.byteLength; i++) {
		str += String.fromCharCode(byteArray[i]);
	}
	return str;
}

export function arrayBufferToBase64(arr: ArrayBuffer): string {
	return btoa(String.fromCharCode.apply(null, new Uint8Array(arr) as unknown as number[]));
}

export function convertBinaryToPem(binaryData: ArrayBuffer, label: string) {
	const base64Cert = arrayBufferToBase64String(binaryData);
	let pemCert = '-----BEGIN ' + label + '-----\r\n';
	let nextIndex = 0;
	while (nextIndex < base64Cert.length) {
		if (nextIndex + 64 <= base64Cert.length) {
			pemCert += base64Cert.substr(nextIndex, 64) + '\r\n';
		} else {
			pemCert += base64Cert.substr(nextIndex) + '\r\n';
		}
		nextIndex += 64;
	}
	pemCert += '-----END ' + label + '-----\r\n';
	return pemCert;
}

function convertPemToBinary(pem: string) {
	const lines = pem.split('\n');
	let encoded = '';
	for (let i = 0; i < lines.length; i++) {
		if (
			lines[i].trim().length > 0 &&
			lines[i].indexOf('-BEGIN PRIVATE KEY-') < 0 &&
			lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
			lines[i].indexOf('-END PRIVATE KEY-') < 0 &&
			lines[i].indexOf('-END PUBLIC KEY-') < 0
		) {
			encoded += lines[i].trim();
		}
	}
	return base64StringToArrayBuffer(encoded);
}

export function importPublicKey(pemKey: string): Promise<CryptoKey> {
	return new Promise(function (resolve) {
		const importer = crypto.subtle.importKey(
			'spki',
			convertPemToBinary(pemKey),
			encryptAlgorithm,
			true,
			['encrypt']
		);
		importer.then(function (key) {
			resolve(key);
		});
	});
}

export function importPrivateKey(pemKey: string): Promise<CryptoKey> {
	return new Promise(function (resolve) {
		const importer = crypto.subtle.importKey(
			'pkcs8',
			convertPemToBinary(pemKey),
			signAlgorithm,
			true,
			['sign']
		);
		importer.then(function (key) {
			resolve(key);
		});
	});
}

export type KeyPair = { publicKey: CryptoKey; privateKey: CryptoKey };

function exportPublicKey(keys: KeyPair) {
	return new Promise(function (resolve) {
		window.crypto.subtle.exportKey('spki', keys.publicKey).then(function (spki) {
			resolve(convertBinaryToPem(spki, 'RSA PUBLIC KEY'));
		});
	});
}

function exportPrivateKey(keys: KeyPair) {
	return new Promise(function (resolve) {
		const expK = window.crypto.subtle.exportKey('pkcs8', keys.privateKey);
		expK.then(function (pkcs8) {
			resolve(convertBinaryToPem(pkcs8, 'RSA PRIVATE KEY'));
		});
	});
}

function exportPemKeys(keys: KeyPair) {
	return new Promise(function (resolve) {
		exportPublicKey(keys).then(function (pubKey) {
			exportPrivateKey(keys).then(function (privKey) {
				resolve({ publicKey: pubKey, privateKey: privKey });
			});
		});
	});
}

function signData(key: CryptoKey, data: string) {
	return window.crypto.subtle.sign(signAlgorithm, key, textToArrayBuffer(data));
}

function testVerifySig(pub: CryptoKey, sig: ArrayBuffer, data: ArrayBuffer) {
	return crypto.subtle.verify(signAlgorithm, pub, sig, data);
}

export function encryptData(
	vector: Uint8Array,
	key: CryptoKey,
	data: string
): Promise<ArrayBuffer> {
	return crypto.subtle.encrypt(
		{
			name: 'RSA-OAEP',
			iv: vector
		},
		key,
		textToArrayBuffer(data)
	);
}

function decryptData(vector: Uint8Array, key: CryptoKey, data: ArrayBuffer) {
	return crypto.subtle.decrypt(
		{
			name: 'RSA-OAEP',
			iv: vector
		},
		key,
		data
	);
}

// Test everything
const signAlgorithm = {
	name: 'RSASSA-PKCS1-v1_5',
	hash: {
		name: 'SHA-256'
	},
	modulusLength: 2048,
	extractable: false,
	publicExponent: new Uint8Array([1, 0, 1])
};

const encryptAlgorithm = {
	name: 'RSA-OAEP',
	modulusLength: 2048,
	publicExponent: new Uint8Array([1, 0, 1]),
	extractable: false,
	hash: {
		name: 'SHA-256'
	}
};
