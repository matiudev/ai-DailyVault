import App from "./App";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { Toast } from "./src/components/ui/CustomToast";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Toast />
      <App />
    </ThemeProvider>
  );
}
