import { FlatList, Image, SafeAreaView, View } from 'react-native'
import EmptyState from "../../components/EmptyState";
import { getUserPosts, signOut } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';

import { useGlobalContext } from '../../context/GlobalProvider'
import { TouchableOpacity } from 'react-native';
import InfoBox from '../../components/InfoBox';

import { router } from "expo-router";
import { EntypoIcon } from '../../constants/icons';


const Profile = () => {
	const { user, setUser, setIsLoggedIn } = useGlobalContext();
	const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

	return (
		<SafeAreaView className="bg-primary/95 h-full w-full">
			<FlatList
				data={posts}
				keyExtractor={(item) => item.$id}
				renderItem={({ item }) => (
					<VideoCard video={item} />
				)}
				ListHeaderComponent={() => (
					<View className="w-full mt-20 flex justify-center items-center mb-12 px-4">
						<TouchableOpacity
							onPress={() => router.replace('/settings')}
							className="flex w-full items-end mb-5"
						>
							<EntypoIcon name="menu" size={30} color="#fff" />
						</TouchableOpacity>
						<View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
							<Image source={{ uri: user?.avatar }}
								className="w-[90%] h-[90%] rounded-lg"
								resizeMode='cover' />
						</View>
						<InfoBox
							title={user?.username}
							containerStyles="mt-5"
							titleStyles="text-lg"
						/>
						<View className="mt-5 flex-row">
							<InfoBox
								title={posts.length || 0}
								subtitle="Posts"
								containerStyles="mr-10"
								titleStyles="text-xl"
							/>
							<InfoBox
								title="1.2k"
								subtitle="Followers"
								titleStyles="text-xl"
							/>
						</View>
					</View>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title="No Videos Found"
						subtitle="No videos found for this search query"
					/>
				)}
			/>
		</SafeAreaView>
	)
}

export default Profile;