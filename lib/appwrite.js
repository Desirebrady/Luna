import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';
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
		return null;
	}
}

export const getAllPost = async () => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videosCollectionId
		);

		return posts.documents;
	} catch (error) {
		//TODO show error	
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
		//TODO show error	
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