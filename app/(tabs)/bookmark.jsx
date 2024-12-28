import { FlatList, SafeAreaView, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { getBookmarkedPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import EmptyState from '../../components/EmptyState';

const Bookmark = () => {
	const { user } = useGlobalContext();
	const { data: bookmarkedPosts, loading, refetch } = useAppwrite(() =>
		getBookmarkedPosts(user.$id)
	);

	return (
		<SafeAreaView className="bg-primary/95 h-full w-full">
			{loading ? (
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator size="large" color="#38BDF8" />
				</View>
			) : (
				<FlatList
					data={bookmarkedPosts}
					keyExtractor={(item) => item.$id}
					renderItem={({ item }) => (
						<VideoCard video={item} />
					)}
					refreshing={loading}
					onRefresh={refetch}
					ListEmptyComponent={() => (
						<EmptyState
							title="No Bookmarks Yet"
							subtitle="Videos you bookmark will appear here"
						/>
					)}
				/>
			)}
		</SafeAreaView>
	)
}

export default Bookmark