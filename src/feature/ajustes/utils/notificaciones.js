import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function pedirPermisos() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function programarNotificacionDiaria(horas, minutos) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "DailyVault",
      body: "¿Ya completaste tus hábitos de hoy?",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: horas,
      minute: minutos,
    },
  });
}

export async function cancelarNotificaciones() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
