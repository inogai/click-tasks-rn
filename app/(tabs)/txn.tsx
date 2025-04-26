import { formatISO } from 'date-fns'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LinkButton } from '~/components/link-button'
import { Button } from '~/components/ui/button'
import { Text, View } from '~/components/ui/text'

export function TxnScreen() {
  const router = useRouter()

  return (
    <SafeAreaView
      edges={['left', 'right']}
      className="flex-1"
    >
      <View className="flex-row">
        <Button onPress={() => router.navigate({
          pathname: '/task/create',
          params: {
            summary: 'Test1',
            due: formatISO(new Date()),
            status: 1,
          },
        })}
        >
          <Text>Back</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default TxnScreen
