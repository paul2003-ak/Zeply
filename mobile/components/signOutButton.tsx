import { TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { useLogout } from '@/hooks/uselogout'

const SignOutButton = () => {
    const { handleSignout } = useLogout();
    return (
        <TouchableOpacity onPress={handleSignout}>
            <Feather name='log-out' size={24} color={'#E0245E'} />
        </TouchableOpacity>
    )
}

export default SignOutButton