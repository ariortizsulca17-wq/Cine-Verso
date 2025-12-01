// src/context/AuthContext.jsx

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
  const [user, setUser] = useState(null);              // Mezcla Auth + Firestore
  const [datosUsuario, setDatosUsuario] = useState(null); // Solo Firestore
  const [loading, setLoading] = useState(true);

  // ⭐ bandera para bienvenida de usuarios nuevos
  const [esNuevo, setEsNuevo] = useState(false);

  // ============================================================
  // 🔥 CARGAR USUARIO COMPLETO
  // ============================================================

  const cargarUsuarioCompleto = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setDatosUsuario(null);
      return;
    }

    try {
      const userRef = doc(db, "usuarios", firebaseUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const profile = snap.data();

        setDatosUsuario(profile);
        setUser({
          ...firebaseUser,
          ...profile, // Incluye username, avatar, rol, gender, etc.
        });
      } else {
        setDatosUsuario(null);
        setUser(firebaseUser);
      }
    } catch (error) {
      console.error("Error cargando datos del usuario:", error);
      setUser(firebaseUser);
    }
  };

  // Escucha cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await cargarUsuarioCompleto(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ============================================================
  // 🔷 ACTUALIZAR PERFIL
  // ============================================================

  const updateProfileData = async (data) => {
    if (!user) throw new Error("No hay usuario autenticado.");

    const userRef = doc(db, "usuarios", user.uid);

    const { nombre, apellido, gender, ...rest } = data;

    const newDisplayName = `${nombre} ${apellido}`.trim();

    await updateProfile(auth.currentUser, { displayName: newDisplayName });

    await updateDoc(userRef, {
      username: nombre,
      lastName: apellido,
      gender,
      ...rest,
      updatedAt: serverTimestamp(),
    });

    await cargarUsuarioCompleto(auth.currentUser);
  };

  // ============================================================
  // 🔷 ACTUALIZAR AVATAR
  // ============================================================

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

  // ============================================================
  // 🟢 REGISTRO
  // ============================================================

  const register = async (
    email,
    password,
    { username, avatarFile, gender }
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = cred.user;
    const uid = firebaseUser.uid;

    let avatarUrl = "";

    if (avatarFile) {
      const fileRef = ref(storage, `avatars/${uid}/${Date.now()}-${avatarFile.name}`);
      await uploadBytes(fileRef, avatarFile);
      avatarUrl = await getDownloadURL(fileRef);
    }

    await updateProfile(firebaseUser, {
      displayName: username || email.split("@")[0],
    });

    const userRef = doc(db, "usuarios", firebaseUser.uid);
    await setDoc(userRef, {
      uid,
      email,
      username,
      avatar: avatarUrl,
      provider: "password",
      rol: "usuario",
      gender,
      createdAt: serverTimestamp(),
    });

    await cargarUsuarioCompleto(firebaseUser);

    setEsNuevo(true);

    return firebaseUser;
  };

  // ============================================================
  // 🟢 LOGIN EMAIL
  // ============================================================

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await cargarUsuarioCompleto(cred.user);

    setEsNuevo(true);

    return cred.user;
  };

  // ============================================================
  // 🟢 LOGIN GOOGLE
  // ============================================================

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
        provider: "google",
        rol: "usuario",
        gender: "no-especificado",
        createdAt: serverTimestamp(),
      });
    }

    await cargarUsuarioCompleto(gUser);

    setEsNuevo(true);

    return gUser;
  };

  // ============================================================
  // 🟢 LOGOUT
  // ============================================================

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setDatosUsuario(null);
  };

  // ============================================================
  // 🟢 RESET PASSWORD
  // ============================================================

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  // ============================================================
  // PROVIDER VALUE
  // ============================================================

  const value = {
    user,
    datosUsuario,
    loading,

    register,
    login,
    logout,
    resetPassword,
    loginWithGoogle,

    updateProfileData,
    updateAvatar,

    esNuevo,
    setEsNuevo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
