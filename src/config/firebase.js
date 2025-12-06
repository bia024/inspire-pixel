import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const getFirebaseConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (!config.apiKey || !config.authDomain || !config.projectId) {
    throw new Error(
      "ERRO DE CONFIGURAÇÃO: Variáveis de ambiente do Firebase não definidas corretamente no Vercel."
    );
  }

  return config;
};

let firebaseApp;
let authService;
let dbService;

try {
  const firebaseConfig = getFirebaseConfig();

  firebaseApp = initializeApp(firebaseConfig);
  authService = getAuth(firebaseApp);
  dbService = getFirestore(firebaseApp);

  signInAnonymously(authService)
    .then(() => console.log("[Firebase] Login anônimo realizado com sucesso."))
    .catch((error) => {
      console.error("[Firebase] Falha no login anônimo:", error.code, error.message);
    });
} catch (error) {
  console.error("[Firebase] Erro ao inicializar:", error.message);
}

export const auth = authService;
export const db = dbService;
export default firebaseApp;

// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithCustomToken, signInAnonymously } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const isCanvasEnvironment = typeof __firebase_config !== 'undefined';
// const isInitialAuthTokenDefined = typeof __initial_auth_token !== 'undefined';

// const getFirebaseConfig = () => {
//   if (isCanvasEnvironment) {
//     console.log("[Firebase Init] Modo Canvas detectado. Usando __firebase_config.");
//     return JSON.parse(__firebase_config);
//   }

//   console.log("[Firebase Init] Modo de Produção. Usando import.meta.env.");
  
//   const config = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   };

//   if (!config.apiKey) {
//     throw new Error("API_KEY_MISSING: VITE_FIREBASE_API_KEY não está definido no Vercel.");
//   }
//   return config;
// };
// let authService = null;
// let dbService = null;
// let firebaseApp = null;

// try {
//   const firebaseConfig = getFirebaseConfig();
  
//   firebaseApp = initializeApp(firebaseConfig);
//   authService = getAuth(firebaseApp);
//   dbService = getFirestore(firebaseApp);

//   const handleAuth = async () => {
//     if (isCanvasEnvironment && isInitialAuthTokenDefined) {
//       try {
//         await signInWithCustomToken(authService, __initial_auth_token);
//         console.log("[Firebase Auth] Usuário Canvas autenticado.");
//       } catch (error) {
//         console.warn("[Firebase Auth] Token Customizado falhou. Tentando Login Anónimo...");
//         await signInAnonymously(authService);
//       }
//     } else {
//       await signInAnonymously(authService);
//       console.log("[Firebase Auth] Login Anónimo efetuado.");
//     }
//   };

//   handleAuth();

// } catch (error) {
//   if (error.code === 'auth/invalid-api-key') {
//       console.error("ERRO CRÍTICO: Chave de API inválida. Verifique os valores no Vercel.");
//   } else if (error.message.includes("API_KEY_MISSING")) {
//       console.error(`ERRO DE CONFIGURAÇÃO: ${error.message}`);
//   } else {
//       console.error("Erro inesperado ao inicializar o Firebase:", error.message);
//   }
// }

// export const auth = authService;
// export const db = dbService;
// export default firebaseApp;