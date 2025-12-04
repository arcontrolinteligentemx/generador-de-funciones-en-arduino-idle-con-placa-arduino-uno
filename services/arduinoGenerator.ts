import { AppConfig } from '../types';

export const generateArduinoCode = (config: AppConfig): string => {
  const { useKeyboardLib, baudRate, buttons, coin, customLogic } = config;

  const timestamp = new Date().toLocaleString();
  
  // Headers
  let code = `/*
  GENERADO POR: AR CONTROL INTELIGENTE (Generador AR Arduino Core)
  AUTOR DEL SISTEMA: chrisrey91
  WEB: www.arcontrolinteligente.com
  FECHA: ${timestamp}
  PLACA: ${useKeyboardLib ? 'Arduino Leonardo/Micro (HID)' : 'Arduino Uno/Mega (Serial)'}
  DESCRIPCION: Sistema para Neo Geo, Rocolas y Tragamonedas.
*/

`;

  if (useKeyboardLib) {
    code += `#include <Keyboard.h>\n\n`;
  }

  // Pin Definitions
  code += `// --- DEFINICIÓN DE PINES ---\n`;
  code += `const int COIN_PIN = ${coin.pin};\n`;
  buttons.forEach(btn => {
    code += `const int PIN_${btn.id.toUpperCase()} = ${btn.pin}; // ${btn.description}\n`;
  });

  // Variables
  code += `\n// --- VARIABLES GLOBALES ---\n`;
  code += `volatile int pulseCount = 0;\n`;
  code += `unsigned long lastPulseTime = 0;\n`;
  code += `int credits = 0;\n`;
  code += `const int PULSES_PER_CREDIT = ${coin.pulsesPerCredit};\n`;
  code += `const int DEBOUNCE_DELAY = ${coin.bounceTime};\n`;
  code += `const unsigned long PULSE_TIMEOUT = 200; // Tiempo para confirmar fin de tren de pulsos\n`;
  code += `\n// Estado de Botones\n`;
  buttons.forEach(btn => {
    code += `int lastState_${btn.id} = HIGH;\n`;
  });

  // Setup
  code += `\nvoid setup() {\n`;
  code += `  Serial.begin(${baudRate});\n`;
  if (useKeyboardLib) {
    code += `  Keyboard.begin();\n`;
  }
  
  code += `\n  // Configurar Monedero\n`;
  code += `  pinMode(COIN_PIN, INPUT_PULLUP);\n`;
  code += `  attachInterrupt(digitalPinToInterrupt(COIN_PIN), coinISR, RISING);\n`;
  
  code += `\n  // Configurar Botones\n`;
  buttons.forEach(btn => {
    code += `  pinMode(PIN_${btn.id.toUpperCase()}, INPUT_PULLUP);\n`;
  });
  
  code += `\n  Serial.println("SISTEMA AR CONTROL INICIADO...");\n`;
  code += `}\n`;

  // Loop
  code += `\nvoid loop() {\n`;
  code += `  processCoins();\n`;
  code += `  readButtons();\n`;
  
  if (customLogic) {
    code += `\n  // --- LÓGICA PERSONALIZADA IA ---\n`;
    code += `  customRoutine();\n`;
  }
  
  code += `}\n`;

  // Interrupt Service Routine
  code += `\n// Interrupción para contar pulsos del monedero\n`;
  code += `void coinISR() {\n`;
  code += `  if (millis() - lastPulseTime > DEBOUNCE_DELAY) {\n`;
  code += `    pulseCount++;\n`;
  code += `    lastPulseTime = millis();\n`;
  code += `  }\n`;
  code += `}\n`;

  // Functions
  code += `\nvoid processCoins() {\n`;
  code += `  if (pulseCount > 0 && millis() - lastPulseTime > PULSE_TIMEOUT) {\n`;
  code += `    // El tren de pulsos ha terminado\n`;
  code += `    int newCredits = pulseCount / PULSES_PER_CREDIT;\n`;
  code += `    int remainder = pulseCount % PULSES_PER_CREDIT;\n`;
  code += `    \n`;
  code += `    if (newCredits > 0) {\n`;
  code += `      credits += newCredits;\n`;
  code += `      Serial.print("CREDITOS AGREGADOS: ");\n`;
  code += `      Serial.println(newCredits);\n`;
  code += `      Serial.print("TOTAL CREDITOS: ");\n`;
  code += `      Serial.println(credits);\n`;
  if (useKeyboardLib) {
    code += `      // Enviar tecla de crédito si es necesario (ej. tecla '5' para MAME)\n`;
    code += `      for(int i=0; i<newCredits; i++) { Keyboard.press('5'); delay(50); Keyboard.releaseAll(); delay(50); }\n`;
  }
  code += `    }\n`;
  code += `    \n`;
  code += `    // Resetear contador\n`;
  code += `    pulseCount = 0;\n`;
  code += `  }\n`;
  code += `}\n`;

  code += `\nvoid readButtons() {\n`;
  buttons.forEach(btn => {
    code += `  int currentState_${btn.id} = digitalRead(PIN_${btn.id.toUpperCase()});\n`;
    code += `  if (currentState_${btn.id} != lastState_${btn.id}) {\n`;
    code += `    if (currentState_${btn.id} == LOW) {\n`;
    code += `      // Botón Presionado\n`;
    code += `      Serial.println("BTN_${btn.id.toUpperCase()}_PRESSED");\n`;
    if (useKeyboardLib) {
        if (btn.key.length === 1) {
             code += `      Keyboard.press('${btn.key}');\n`;
        } else {
             code += `      // Tecla especial o macro: ${btn.key}\n`;
             // Handle special keys mapping broadly if needed
             code += `      // Keyboard.press(${btn.key}); \n`;
        }
    }
    code += `    } else {\n`;
    code += `      // Botón Soltado\n`;
    if (useKeyboardLib) {
         code += `      Keyboard.releaseAll();\n`;
    }
    code += `    }\n`;
    code += `    lastState_${btn.id} = currentState_${btn.id};\n`;
    code += `    delay(10); // Debounce simple\n`;
    code += `  }\n`;
  });
  code += `}\n`;

  if (customLogic) {
    code += `\n// --- FUNCIÓN PERSONALIZADA GENERADA POR IA ---\n`;
    code += `void customRoutine() {\n`;
    code += customLogic.split('\n').map(line => `  ${line}`).join('\n');
    code += `\n}\n`;
  }

  return code;
};