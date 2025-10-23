import { Feather } from '@expo/vector-icons';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

const TRENDING_TOPICS = [
  { topic: "#ReactNative", tweets: "125K" },
  { topic: "#TypeScript", tweets: "89K" },
  { topic: "#WebDevelopment", tweets: "234K" },
  { topic: "#AI", tweets: "567K" },
  { topic: "#TechNews", tweets: "98K" },
];


const Search = () => {
  return (
    <SafeAreaView className='  flex-1 bg-white'>
      {/* Header */}
      <View className='px-4 py-3 border-b border-gray-100 '>
        <View className='flex-row  items-center bg-gray-100 rounded-full px-4 py-3'>
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder='Search Zeply'
            className='flex-1 ml-3 text-base'
            placeholderTextColor="#657786"
          />
        </View>
      </View>

      {/* Trending Topics */}
      <ScrollView className=" flex-1">
        <View className=' p-4 '>
          <Text className='text-xl font-bold text-gray-900 mb-4'>Trending for you</Text>
          {
            TRENDING_TOPICS.map((item, idx) => (
              <TouchableOpacity key={idx} className='py-3 border-b border-gray-100'>
                <Text className=' text-gray-500 text-sm '>Trending in Technology</Text>
                <Text className='font-bold text-gray-900 text-lg'>{item.topic}</Text>
                <Text className='text-gray-500 text-sm'>{item.tweets}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default Search