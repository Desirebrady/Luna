import { ScrollView, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useGlobalContext } from "../../context/GlobalProvider";
import { EntypoIcon } from '../../constants/icons';
import { TouchableOpacity } from 'react-native';
import { signOut } from '../../lib/appwrite';

const Settings = () => {
	const { setUser, setIsLoggedIn } = useGlobalContext();

	const logout = async () => {
		await signOut();
		setUser(null);
		setIsLoggedIn(false);

		router.replace("/sign-in");
	};

	return (
		<SafeAreaView className="bg-primary/95 h-full">
			<ScrollView>
				<View className="w-full flex-1 justify-center h-full px-4">
					{/* <Text className="text-white mb-10">Settings</Text> */}
					<View className="border-b-4 border-gray-500 mb-5">
						<Text className="text-gray-300 font-normal text-sm mb-4">More info and Support</Text>
						<TouchableOpacity className="flex flex-row space-x-4">
							<EntypoIcon name="help" size={20} color="#fff" />
							<Text className="mb-2 text-white font-psemibold ">Help</Text>
						</TouchableOpacity>
						<TouchableOpacity className="flex flex-row space-x-4">
							<EntypoIcon name="shield" size={20} color="#fff" />
							<Text className="mb-2 text-white font-psemibold ">Privacy Center</Text>
						</TouchableOpacity>
						<TouchableOpacity className="flex flex-row space-x-4">
							<EntypoIcon name="info" size={20} color="#fff" />
							<Text className="mb-2 text-white font-psemibold ">About</Text>
						</TouchableOpacity>
					</View>
					<View className="border-b-4 border-gray-500 mb-5">
						<Text className="text-gray-300 font-normal text-sm mb-4">Login</Text>
						<TouchableOpacity className="flex flex-row space-x-4" onPress={logout}>
							<EntypoIcon name="log-out" size={20} color="#ef4444" />
							<Text className="mb-2 text-red-500 font-psemibold ">Log out</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default Settings