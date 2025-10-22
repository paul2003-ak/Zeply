import { Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutButton from '@/components/signOutButton'

const Home = () => {
  return (
    <SafeAreaView>
        <Text>Home</Text>
        <SignOutButton/>
    </SafeAreaView>
  )
}

export default Home