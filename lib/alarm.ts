import type { TimestampTrigger } from '@notifee/react-native'
import notifee, { AndroidImportance, AndroidNotificationSetting, AndroidVisibility, TriggerType } from '@notifee/react-native'

async function requestAlarmPermission() {
  await notifee.requestPermission()

  const settings = await notifee.getNotificationSettings()
  if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
  // Create timestamp trigger
  }
  else {
  // Show some user information to educate them on what exact alarm permission is,
  // and why it is necessary for your app functionality, then send them to system preferences:
    await notifee.openAlarmPermissionSettings()
  }
}

export async function setAlarm(
  title: string,
  message: string,
  date: Date,
) {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  }

  await requestAlarmPermission()

  await notifee.createChannel({
    id: 'task-alarm',
    name: 'Task Alarm',
    visibility: AndroidVisibility.PUBLIC,
    vibration: true,
    sound: 'default',
    importance: AndroidImportance.HIGH,
  })

  await notifee.createTriggerNotification({
    title,
    body: message,
    android: {
      channelId: 'task-alarm',
    },
  }, trigger)

  console.log('Alarm set for', date)
}
