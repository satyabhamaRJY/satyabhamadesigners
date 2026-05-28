import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <View className="flex-1 bg-black">
      {/* Cinematic Hero */}
      <ImageBackground 
        source={{ uri: 'https://cdn.pixabay.com/photo/2016/11/29/01/34/fabric-1866579_1280.jpg' }}
        className="flex-1 justify-end p-6"
        imageStyle={{ opacity: 0.6 }}
      >
        <View className="absolute inset-0 bg-black/40" />
        
        <View className="z-10 mb-12">
          <View className="border border-gold/30 rounded-full px-4 py-1.5 self-start mb-4 bg-black/50">
            <Text className="text-gold text-xs font-bold tracking-widest uppercase">
              The Royal Collection
            </Text>
          </View>
          
          <Text className="text-white text-5xl font-serif mb-4 leading-tight">
            Woven in <Text className="text-gold">Gold.</Text>
            {'\n'}Draped in Heritage.
          </Text>
          
          <Text className="text-stone-300 text-sm font-light mb-8 leading-relaxed">
            Experience the divine craftsmanship of authentic Indian handlooms, perfectly optimized for mobile.
          </Text>
          
          <Link href="/collections" asChild>
            <TouchableOpacity className="bg-gold px-8 py-4 items-center justify-center rounded-sm">
              <Text className="text-black font-bold uppercase tracking-widest text-xs">
                Explore Collection
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}
