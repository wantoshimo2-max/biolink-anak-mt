import { env } from '$env/dynamic/private';

export async function uploadToBunny(file: File, fileName: string) {
	const hostname = env.BUNNYCDN_HOSTNAME;
	const storageZone = env.BUNNYCDN_STORAGE_ZONE;
	const accessKey = env.BUNNYCDN_ACCESS_KEY;
	const basePath = env.BUNNYCDN_PATH;
	const shareUrl = env.BUNNYCDN_SHARE_URL;

	// Construct the URL
	const url = `https://${hostname}/${storageZone}/${basePath}/${fileName}`;

	const arrayBuffer = await file.arrayBuffer();

	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			AccessKey: accessKey,
			'Content-Type': 'application/octet-stream'
		},
		body: Buffer.from(arrayBuffer)
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`BunnyCDN upload failed: ${errorText}`);
	}

	return `${shareUrl}/${fileName}`;
}

export async function deleteFromBunny(fileUrl: string) {
	const hostname = env.BUNNYCDN_HOSTNAME;
	const storageZone = env.BUNNYCDN_STORAGE_ZONE;
	const accessKey = env.BUNNYCDN_ACCESS_KEY;
	const basePath = env.BUNNYCDN_PATH;
	const shareUrl = env.BUNNYCDN_SHARE_URL;

	if (!fileUrl.startsWith(shareUrl)) return; // Not a Bunny CDN URL we manage

	const fileName = fileUrl.split('/').pop();
	if (!fileName) return;

	const url = `https://${hostname}/${storageZone}/${basePath}/${fileName}`;

	const response = await fetch(url, {
		method: 'DELETE',
		headers: {
			AccessKey: accessKey
		}
	});

	if (!response.ok && response.status !== 404) {
		const errorText = await response.text();
		console.error(`BunnyCDN delete failed: ${errorText}`);
	}
}

