import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
const client = new Client();


//TODO destruct this.
export const config = {
	endpoint: 'https://cloud.appwrite.io/v1',
	platform: 'com.jsm.luna',
	projectId: '66aa26570014d1735dd5',
	databaseId: '66aa27940002219be206',
	userCollectionId: '66aa27a7003ded556e16',
	videosCollectionId: '66aa27bd0032b4f63651',
	storageId: '66aa28e100251f15ec14'
}

client
	.setEndpoint(config.endpoint)
	.setProject(config.projectId)
	.setPlatform(config.platform)

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const creatUser = async (email, password, username) => {
	try {
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		)

		if (!newAccount) throw Error;
		const avatarUrl = avatars.getInitials(username)

		await signIn(email, password);

		return databases.createDocument(
			config.databaseId,
			config.userCollectionId,
			ID.unique(),
			{
				accountId: newAccount.$id,
				email,
				username,
				avatar: avatarUrl
			});

	} catch (error) {
		throw new Error(error);
	}
}

export const signIn = async (email, password) => {
	try {
		return await account.createEmailPasswordSession(email, password);
	} catch (error) {
		throw new Error(error);
	}
}

export async function signOut() {
	try {
		const session = await account.deleteSession("current");

		return session;
	} catch (error) {
		throw new Error(error);
	}
}

export async function getAccount() {
	try {
		const currentAccount = await account.get();

		return currentAccount;
	} catch (error) {
		throw new Error(error);
	}
}

export const getCurrentUser = async () => {
	try {
		const currentAccount = await getAccount();
		if (!currentAccount) throw Error;

		const currentUser = await databases.listDocuments(
			config.databaseId,
			config.userCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (!currentUser) throw Error;

		return currentUser.documents[0];
	} catch (error) {
		throw new Error(error);
	}
}

export const getAllPost = async () => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId,
			[Query.orderDesc('$createdAt')]
		);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}

export const getLatestPost = async () => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId,
			[Query.orderDesc('$createdAt', Query.limit(7))]
		);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}

export const searchPosts = async (query) => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId,
			[Query.search("title", query)]
		);

		if (!posts) throw new Error("Something went wrong");

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}

export const getUserPosts = async (userId) => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId,
			[Query.equal("users", userId)]
		);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
}

// Upload File
export async function uploadFile(file, type) {
	if (!file) return;

	try {

		const uploadedFile = await storage.createFile(
			config.storageId,
			ID.unique(),
			{
				type: file.mimeType,
				name: file.fileName,
				size: file.fileSize,
				uri: file.uri
			}
		);

		const fileUrl = await getFilePreview(uploadedFile.$id, type);
		return fileUrl;
	} catch (error) {
		throw new Error(error);
	}
}

// Get File Preview
export async function getFilePreview(fileId, type) {
	let fileUrl;

	try {
		if (type === "video") {
			fileUrl = storage.getFileView(config.storageId, fileId);
		} else if (type === "image") {
			fileUrl = storage.getFilePreview(
				config.storageId,
				fileId,
				2000,
				2000,
				"top",
				100
			);
		} else {
			throw new Error("Invalid file type");
		}

		if (!fileUrl) throw Error;

		return fileUrl;
	} catch (error) {
		throw new Error(error);
	}
}

export async function createVideoPost(form) {
	try {
		const [thumbnailUrl, videoUrl] = await Promise.all([
			uploadFile(form.thumbnail, "image"),
			uploadFile(form.video, "video"),
		]);

		const newPost = await databases.createDocument(
			config.databaseId,
			config.videosCollectionId,
			ID.unique(),
			{
				title: form.title,
				thumbnail: thumbnailUrl,
				video: videoUrl,
				prompt: form.prompt,
				users: form.userId,
			}
		);

		return newPost;
	} catch (error) {
		throw new Error(error);
	}
}

export const toggleBookmark = async (userId, videoId, isBookmarked) => {
	try {
		const user = await databases.getDocument(
			config.databaseId,
			config.userCollectionId,
			userId
		);

		let bookmarks = user.bookmarks || [];

		if (isBookmarked) {
			bookmarks = bookmarks.filter(id => id !== videoId);
		} else {
			bookmarks.push(videoId);
		}

		const result = await databases.updateDocument(
			config.databaseId,
			config.userCollectionId,
			userId,
			{
				bookmarks: bookmarks
			}
		);

		return result;
	} catch (error) {
		throw new Error(error);
	}
};

export const getBookmarkedPosts = async (userId) => {
	try {
		const user = await databases.getDocument(
			config.databaseId,
			config.userCollectionId,
			userId
		);

		if (!user.bookmarks || user.bookmarks.length === 0) return [];

		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId,
			[Query.equal('$id', user.bookmarks)]
		);

		return posts.documents;
	} catch (error) {
		throw new Error(error);
	}
};
