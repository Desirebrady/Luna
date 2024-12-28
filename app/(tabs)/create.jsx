import { Image, SafeAreaView, ScrollView, Text, View, Alert } from 'react-native'
import React, { useState } from 'react'
import FormField from '../../components/FormField'
import { TouchableOpacity } from 'react-native'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import * as ImagePicker from 'expo-image-picker';
import { createVideoPost } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider'
import { router } from "expo-router";

export const FileType = {
	Video: 'Video',
	Image: 'Image'
};

const Create = () => {
	const { user } = useGlobalContext();
	const [uploading, setUploading] = useState(false)

	const uplaodFile = async (fileType) => {

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: fileType === FileType.Image ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
			quality: 1,
		});

		if (!result.canceled) {
			fileType === FileType.Image ? setForm({ ...form, thumbnail: result.assets[0] }) : setForm({ ...form, video: result.assets[0] });
		} else {

		}
	};

	const [form, setForm] = useState({
		title: '',
		video: null,
		thumbnail: null,
		prompt: ''
	});

	const submit = async () => {
		if (
			(form.prompt === "") |
			(form.title === "") |
			!form.thumbnail |
			!form.video
		) {
			return Alert.alert("Please provide all fields");
		}

		setUploading(true);
		try {
			await createVideoPost({
				...form,
				userId: user?.$id,
			});

			Alert.alert("Success", "Post uploaded successfully");
		} catch (error) {
			Alert.alert("Error", error.message);
		} finally {
			setForm({
				title: "",
				video: null,
				thumbnail: null,
				prompt: "",
			});

			setUploading(false);
		}
	};

	return (
		<SafeAreaView className="bg-primary/95 h-full flex-1">
			<ScrollView className="px-4 my-6">
				<Text className="text-2xl text-white font-psemibold mt-6">New Video</Text>
				<FormField
					title="Video Title"
					value={form.title}
					placeholder="Give your video a catchy title..."
					handleChangeText={(e) => setForm({ ...form, title: e })}
					otherStyles="mt-10" />
				<View className="mt-7 space-y-2">
					<Text className="text-base text-gray-100 font-pmedium">Video</Text>
					<TouchableOpacity onPress={() => uplaodFile(FileType.Video)}>
						{form.video ?
							(
								<Video
									source={{ uri: form.video.uri }}
									className="w-full h-64 rounded-2xl"
									useNativeControls
									resizeMode={ResizeMode.COVER}
									isLooping
								/>
							) :
							(<View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
								<View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
									<Image className="w-1/2 h-1/2" source={icons.upload} resizeMode='contain' />
								</View>
							</View>)
						}
					</TouchableOpacity>
				</View>
				<View className="mt-7 space-y-2 ">
					<Text className="text-base text-gray-100 font-pmedium">Thumbnail</Text>
					<TouchableOpacity onPress={() => uplaodFile(FileType.Image)}>
						{form.thumbnail ?
							(
								<Image source={{ uri: form.thumbnail.uri }} resizeMode='cover' className="w-full h-64 rounded-2xl" />
							) :
							(<View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
								<Image className="w-5 h-5" source={icons.upload} resizeMode='contain' />
								<Text className="text-sm text-gray-100 font-pmedium">Choose a file</Text>
							</View>)
						}
					</TouchableOpacity>
				</View>
				<FormField
					title="Prompt"
					value={form.prompt}
					placeholder="The prompt you used to create this video..."
					handleChangeText={(e) => setForm({ ...form, prompt: e })}
					otherStyles="mt-7" />

				<CustomButton
					title="Submit"
					handlePress={submit}
					isLoading={uploading}
					containerStyles="mt-10 align-bottom" />
			</ScrollView>
		</SafeAreaView>
	)
}

export default Create