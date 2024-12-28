import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { images } from "../../constants"
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { useGlobalContext } from "../../context/GlobalProvider";


const SignIn = () => {
	const { setUser, setIsLoggedIn } = useGlobalContext();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [form, setform] = useState({
		email: '',
		password: ''
	});
	const submit = async () => {
		if (!form.email || !form.password) {
			Alert.alert('Error', 'Please fill in all the fields');
		}

		setIsSubmitting(true);

		try {
			await signIn(form.email, form.password)

			const result = await getCurrentUser();
			setUser(result);
			setIsLoggedIn(true);

			// Alert.alert("Success", "User signed in successfully");
			router.replace("/home");
		} catch (error) {
			Alert.alert('Error', error.message);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<SafeAreaView className="bg-primary/95 h-full">
			<ScrollView>
				<View className="w-full flex justify-center h-full px-4 my-6">
					<View className="w-100 flex justify-center items-center">
						<Image
							source={images.logo}
							resizeMode='contain'
							className="w-[300px] h-[80px]"
						/>
						<Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
							Log in to Luna
						</Text>
					</View>
					<FormField
						title="Email"
						value={form.email}
						handleChangeText={(value) => setform({ ...form, email: value })}
						otherStyles="mt-7"
						keyboardType="email-address"
					/>
					<FormField
						title="Password"
						value={form.password}
						secureText={true}
						handleChangeText={(value) => setform({ ...form, password: value })}
						otherStyles="mt-7"
					/>

					<CustomButton
						title="Sign In"
						handlePress={submit}
						containerStyles="mt-7"
						isLoading={isSubmitting}
					/>
					<View className="gap-2 justify-center pt-5 flex-row">
						<Text className="text-lg text-gray-100 font-pregular">Don't have an account?</Text>
						<Link href="/sign-up" className="text-secondary font-psemibold text-lg">Sign Up</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default SignIn