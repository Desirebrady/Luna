import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from "../../constants"
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { creatUser } from '../../lib/appwrite'

const SignUp = () => {

	const [form, setform] = useState({
		email: '',
		password: '',
		username: '',
		cpassword: '',
	});

	const [isSubmitting, setIsSubmitting] = useState(false)

	const submit = async () => {
		if (!form.username || !form.email || !form.password) {
			Alert.alert('Error', 'Please fill in all the fields');
		}

		setIsSubmitting(true);

		try {
			const result = await creatUser(form.email, form.password, form.username)

			//set it to global state....

			router.replace('/home');
		} catch (error) {
			Alert.alert('Error', error.message);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView>
				<View className="w-full flex justify-center h-full px-4 my-6">
					<View className="w-100 flex justify-center items-center">
						<Image
							source={images.logo}
							resizeMode='contain'
							className="w-[300px] h-[80px]"
						/>
						<Text className="text-2xl font-semibold text-white mt-5 font-psemibold">
							Sign up to Luna
						</Text>
					</View>
					<FormField
						title="Username"
						value={form.username}
						handleChangeText={(value) => setform({ ...form, username: value })}
						otherStyles="mt-10"
					/>
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
					<FormField
						title="Confirm Password"
						value={form.cpassword}
						secureText={true}
						handleChangeText={(value) => setform({ ...form, cpassword: value })}
						otherStyles="mt-7"
					/>

					<CustomButton
						title="Sign Up "
						handlePress={submit}
						containerStyles="mt-7"
						isLoading={isSubmitting}
					/>
					<View className="gap-2 justify-center pt-5 flex-row">
						<Text className="text-lg text-gray-100 font-pregular">Have an account?</Text>
						<Link href="/sign-in" className="text-secondary font-psemibold text-lg">Sign In</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default SignUp