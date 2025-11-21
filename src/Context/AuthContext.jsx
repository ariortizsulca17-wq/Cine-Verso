// src/context/authContext.jsx
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

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);            // Datos combinados
  const [datosUsuario, setDatosUsuario] = useState(null); // Firestore puro
  const [loading, setLoading] = useState(true);

  // 🔥 Cargar datos de Auth + Firestore
  const cargarUsuarioCompleto = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setDatosUsuario(null);
      return;
    }

    const userRef = doc(db, "usuarios", firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const profile = snap.data();
      setDatosUsuario(profile);               // <-- Guardamos Firestore
      setUser({
        ...firebaseUser,
        ...profile,
      });
    } else {
      setDatosUsuario(null);
      setUser(firebaseUser);
    }
  };

  // Escucha cambios de sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await cargarUsuarioCompleto(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ===============================
  //  ACTUALIZAR DATOS PERSONALES
  // ===============================
  const updateProfileData = async (data) => {
    if (!user) throw new Error("No hay usuario autenticado.");

    const userRef = doc(db, "usuarios", user.uid);
    const { nombre, apellido, ...rest } = data;

    const newDisplayName = `${nombre} ${apellido}`.trim();

    await updateProfile(auth.currentUser, {
      displayName: newDisplayName,
    });

    await updateDoc(userRef, {
      username: nombre,
      lastName: apellido,
      ...rest,
      updatedAt: serverTimestamp(),
    });

    await cargarUsuarioCompleto(auth.currentUser);
  };

  // ===============================
  //  ACTUALIZAR AVATAR
  // ===============================
  const updateAvatar = async (file) => {
    if (!user) throw new Error("No hay usuario autenticado.");

    const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(snapshot.ref);

    await updateProfile(auth.currentUser, { photoURL });

    const userRef = doc(db, "usuarios", user.uid);
    await updateDoc(userRef, { avatar: photoURL });

    await cargarUsuarioCompleto(auth.currentUser);
  };

  // ===============================
  //  REGISTRO
  // ===============================
  const register = async (email, password, { username, avatarFile }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = cred.user;

    let avatarUrl = "";

    if (avatarFile) {
      const fileRef = ref(
        storage,
        `avatars/${firebaseUser.uid}/${Date.now()}-${avatarFile.name}`
      );
      await uploadBytes(fileRef, avatarFile);
      avatarUrl = await getDownloadURL(fileRef);
    }

    await updateProfile(firebaseUser, {
      displayName: username || email.split("@")[0],
    });

    const userRef = doc(db, "usuarios", firebaseUser.uid);
    await setDoc(userRef, {
      uid: firebaseUser.uid,
      email,
      username,
      avatar: avatarUrl,
      rol: "usuario",
      provider: "password",
      createdAt: serverTimestamp(),
    });

    await cargarUsuarioCompleto(firebaseUser);
    return firebaseUser;
  };

  // ===============================
  //  LOGIN
  // ===============================
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await cargarUsuarioCompleto(cred.user);
    return cred.user;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const gUser = result.user;

    const userRef = doc(db, "usuarios", gUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: gUser.uid,
        email: gUser.email,
        username: gUser.displayName,
        avatar: gUser.photoURL,
        rol: "usuario",
        provider: "google",
        createdAt: serverTimestamp(),
      });
    }

    await cargarUsuarioCompleto(gUser);
    return gUser;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setDatosUsuario(null);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        datosUsuario,   // <-- Ahora SÍ existe para ProtectedRoute
        loading,
        register,
        login,
        logout,
        resetPassword,
        loginWithGoogle,
        updateProfileData,
        updateAvatar,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
