import { Alert, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from 'expo-blur';
import { useGlobalContext } from "../context/GlobalProvider";
import { toggleBookmark } from "../lib/appwrite";

const VideoCard = (item) => {
	const [play, setPlay] = useState(false);
	const { user } = useGlobalContext();
	const [isBookmarked, setIsBookmarked] = useState(
		user?.bookmarks?.includes(item.video.$id)
	);

	const handleBookmark = async () => {
		try {
			await toggleBookmark(user.$id, item.video.$id, isBookmarked);
			setIsBookmarked(!isBookmarked);
		} catch (error) {
			Alert.alert('Error', 'Failed to bookmark video');
		}
	};

	return (
		<View className="flex-col items-center px-4 mb-14">
			<View className="flex-row gap-3 items-start">
				<View className="justify-center items-center flex-row flex-1">
					<View className="w-[46px] h-[45px] rounded-lg border border-secondary">
						<Image
							source={{ uri: item.video.users?.avatar }}
							resizeMode='cover'
							className="w-full h-full rounded-lg"
						/>
					</View>
					<View className="flex justify-center flex-1 ml-3 gap-y-1">
						<Text className="font-psemibold text-sm text-white" numberOfLines={1}>{item.video.title}</Text>
						<Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>{item.video.users?.username}</Text>
					</View>
				</View>
				<TouchableOpacity onPress={handleBookmark}>
					<Image
						source={icons.bookmark}
						className="w-5 h-5"
						resizeMode="contain"
						tintColor={isBookmarked ? "#38BDF8" : "#94A3B8"}
					/>
				</TouchableOpacity>
			</View>

			{play ?
				(<Video
					source={{ uri: item.video.video }}
					className="w-full h-60 rounded-xl mt-3"
					resizeMode={ResizeMode.CONTAIN}
					useNativeControls
					shouldPlay
					onPlaybackStatusUpdate={(status) => {
						if (status.didJustFinish) {
							setPlay(false);
						}
					}}
				/>) :
				(
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => setPlay(true)}
						className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
					>
						<Image
							source={{ uri: item.video.thumbnail }}
							className="w-full h-full rounded-xl mt-3"
							resizeMode="cover"
						/>

						<Image
							source={icons.play}
							className="w-12 h-12 absolute"
							resizeMode="contain"
							tintColor="#38BDF8"
						/>
					</TouchableOpacity>
				)}
		</View >
	)
}

export default VideoCard