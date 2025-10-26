import { Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutButton from '@/components/signOutButton'
import { useUserSync } from '@/hooks/useUsersync'

const Home = () => {
  useUserSync()
  return (
    <SafeAreaView>
        <Text>Home</Text>
        <SignOutButton/>
    </SafeAreaView>
  )
}

export default Home