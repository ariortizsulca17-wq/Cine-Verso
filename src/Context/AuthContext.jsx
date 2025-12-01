// src/context/AuthContext.jsx
// 👇 Contexto de autenticación unificado: Auth + Firestore + Storage

import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, db, storage } from "../lib/firebase";

import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// 1. Creamos el contexto
const AuthContext = createContext();

// 2. Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

// 3. Componente proveedor
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ BANDERA: mostrar pantalla de bienvenida
  const [esNuevo, setEsNuevo] = useState(false);

  // Mezcla datos de Auth + Firestore
  const cargarUsuarioCompleto = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }

    try {
      const userRef = doc(db, "usuarios", firebaseUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const profile = snap.data();

        setUser({
          ...firebaseUser,
          ...profile, // ⭐ incluye gender también
        });
      } else {
        setUser(firebaseUser);
      }
    } catch (error) {
      console.error("Error al cargar usuario completo:", error);
      setUser(firebaseUser);
    }
  };

  // Escuchar cambios de sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await cargarUsuarioCompleto(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // =========================================================================
  // 🚀 ACTUALIZAR PERFIL
  // =========================================================================

  const updateProfileData = async (data) => {
    if (!user) throw new Error("No hay usuario autenticado para actualizar.");

    const userRef = doc(db, "usuarios", user.uid);

    const { nombre, apellido, gender, ...firestoreData } = data;

    const newDisplayName = `${nombre} ${apellido}`.trim();

    await updateProfile(auth.currentUser, {
      displayName: newDisplayName,
    });

    await updateDoc(userRef, {
      username: nombre,
      lastName: apellido,
      gender, // ⭐ permitir actualizar género
      ...firestoreData,
      updatedAt: serverTimestamp(),
    });

    await cargarUsuarioCompleto(auth.currentUser);
  };

  const updateAvatar = async (file) => {
    if (!user) throw new Error("No hay usuario autenticado para actualizar el avatar.");

    const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);

    const photoURL = await getDownloadURL(snapshot.ref);

    await updateProfile(auth.currentUser, { photoURL });

    const userRef = doc(db, "usuarios", user.uid);
    await updateDoc(userRef, { avatar: photoURL });

    await cargarUsuarioCompleto(auth.currentUser);
  };

  // =========================================================================
  // 🟢 REGISTRO
  // =========================================================================

  const register = async (
    email,
    password,
    {
      username,
      avatarFile,
      gender, // ⭐ NUEVO CAMPO
    }
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = cred.user;
    const uid = firebaseUser.uid;

    let avatarUrl = "";
    if (avatarFile) {
      const uniqueName = `${uid}-${Date.now()}-${avatarFile.name}`;
      const avatarRef = ref(storage, `avatars/${uid}/${uniqueName}`);
      await uploadBytes(avatarRef, avatarFile);
      avatarUrl = await getDownloadURL(avatarRef);
    }

    await updateProfile(firebaseUser, {
      displayName: username || email.split("@")[0],
    });

    const userRef = doc(db, "usuarios", uid);
    await setDoc(userRef, {
      uid,
      email,
      username,
      avatar: avatarUrl,
      provider: "password",
      gender,        // ⭐ GUARDADO EN FIRESTORE
      createdAt: serverTimestamp(),
    });

    await cargarUsuarioCompleto(firebaseUser);

    setEsNuevo(true);

    return firebaseUser;
  };

  // =========================================================================
  // 🟢 LOGIN EMAIL
  // =========================================================================

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = cred.user;

    await cargarUsuarioCompleto(firebaseUser);

    setEsNuevo(true);

    return firebaseUser;
  };

  // =========================================================================
  // 🟢 LOGIN GOOGLE
  // =========================================================================

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const gUser = result.user;

    const userRef = doc(db, "usuarios", gUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: gUser.uid,
        email: gUser.email,
        username: gUser.displayName || "",
        avatar: gUser.photoURL || "",
        provider: "google",
        gender: "no-especificado", // ⭐ Google no da género
        createdAt: serverTimestamp(),
      });

      setEsNuevo(true);
    } else {
      setEsNuevo(true);
    }

    await cargarUsuarioCompleto(gUser);

    return gUser;
  };

  // =========================================================================
  // 🟢 LOGOUT
  // =========================================================================

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // =========================================================================
  // 🟢 RESET PASSWORD
  // =========================================================================

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  // =========================================================================
  // 🟢 VALORES ENVIADOS AL CONTEXTO
  // =========================================================================

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    resetPassword,
    loginWithGoogle,
    updateProfileData,
    updateAvatar,

    // ⭐ bandera para mostrar bienvenida
    esNuevo,
    setEsNuevo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}