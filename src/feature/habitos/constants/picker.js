export const ICONOS = [
  // Salud y cuerpo
  "Heart", "HeartPulse", "Activity", "Dumbbell", "PersonStanding", "Stethoscope",
  "Pill", "Syringe", "Brain", "Eye", "Thermometer", "Bandage",

  // Comida y bebida
  "Apple", "Utensils", "ChefHat", "Coffee", "GlassWater", "Wine",
  "Cookie", "Sandwich", "IceCream", "Pizza", "Beef", "Carrot",

  // Naturaleza y aire libre
  "Leaf", "Sprout", "Flower2", "TreePine", "Mountain", "Footprints",
  "Sun", "Moon", "Sunrise", "Sunset", "Cloud", "Snowflake",
  "Droplets", "Wind", "Umbrella", "Compass", "Map", "Tent",

  // Deporte y movimiento
  "Bike", "Flame", "Trophy", "Target", "Award", "Medal",
  "Sword", "Shield", "Zap", "Timer", "Hourglass", "Gauge",

  // Aprendizaje y trabajo
  "BookOpen", "BookMarked", "GraduationCap", "Newspaper", "FileText", "Pen",
  "Pencil", "Microscope", "Laptop", "Code", "Briefcase", "Presentation",

  // Música, arte y entretenimiento
  "Music", "Headphones", "Palette", "Paintbrush", "Camera", "Film",
  "Tv", "Gamepad2", "Radio", "Mic", "Guitar", "Drum",

  // Finanzas y compras
  "DollarSign", "Wallet", "ShoppingCart", "ShoppingBag", "TrendingUp", "Gem",
  "CreditCard", "PiggyBank", "BarChart2", "Coins", "Banknote", "Receipt",

  // Hogar y vida
  "Home", "Bed", "Bath", "Sofa", "Lamp", "Key",
  "Baby", "Dog", "Cat", "Bird", "Fish", "Scissors",

  // Social y comunicación
  "Users", "Globe", "Phone", "Smartphone", "MessageSquare", "Bell",
  "Mail", "Send", "Share2", "Heart", "ThumbsUp", "Star",

  // Tiempo y organización
  "Calendar", "Clock", "AlarmClock", "Watch", "ListTodo", "CheckSquare",
  "ClipboardList", "Inbox", "Archive", "Bookmark", "Tag", "Crown",

  // Viaje y transporte
  "Plane", "Car", "Bus", "Train", "Ship", "Bike",

  // Otros
  "Smile", "Laugh", "Zap", "Sparkles", "Rocket", "Telescope",
  "Wrench", "Hammer", "Flashlight", "Magnet", "Puzzle", "Dices",
];

// Eliminar duplicados que se colaron por error
const seen = new Set();
export const ICONOS_UNICOS = ICONOS.filter((ic) => {
  if (seen.has(ic)) return false;
  seen.add(ic);
  return true;
});

export const COLORES = [
  "#EF4444", "#F97316", "#FF6B00", "#F59E0B",
  "#EAB308", "#84CC16", "#22C55E", "#14B8A6",
  "#06B6D4", "#3B82F6", "#6366F1", "#A855F7",
  "#EC4899", "#64748B", "#94A3B8",
];
