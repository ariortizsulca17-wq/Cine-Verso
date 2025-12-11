import React, { createContext, useContext, useEffect, useState } from "react";
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

import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // combinación Auth + Firestore
  const [datosUsuario, setDatosUsuario] = useState(null); // datos puros de Firestore
  const [loading, setLoading] = useState(true);
  const [esNuevo, setEsNuevo] = useState(false);

  // Cargar datos combinados (Auth + Firestore)
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
        setUser({ ...firebaseUser, ...profile });
      } else {
        setDatosUsuario(null);
        setUser(firebaseUser);
      }
    } catch (error) {
      console.error("Error cargando datos del usuario:", error);
      setUser(firebaseUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await cargarUsuarioCompleto(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Actualizar perfil (Firestore + Firebase Auth displayName)
  const updateProfileData = async (data) => {
    if (!user) throw new Error("No hay usuario autenticado.");

    const userRef = doc(db, "usuarios", user.uid);
    const { nombre, apellido, ...rest } = data;

    const newDisplayName = `${nombre || ""} ${apellido || ""}`.trim();

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: newDisplayName });
      }
    } catch (err) {
      console.warn("updateProfile fallo:", err);
    }

    await updateDoc(userRef, {
      username: nombre || "",
      lastName: apellido || "",
      ...rest,
      updatedAt: serverTimestamp(),
    });

    await cargarUsuarioCompleto(auth.currentUser || user);
  };

  // Actualizar avatar
  const updateAvatar = async (file) => {
    if (!user) throw new Error("No hay usuario autenticado.");

    const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(snapshot.ref);

    try {
      if (auth.currentUser) await updateProfile(auth.currentUser, { photoURL });
    } catch (err) {
      console.warn("updateProfile (photoURL) fallo:", err);
    }

    const userRef = doc(db, "usuarios", user.uid);
    await updateDoc(userRef, { avatar: photoURL });

    await cargarUsuarioCompleto(auth.currentUser || user);
  };

  // Registro
  const register = async (email, password, { username, avatarFile, gender } = {}) => {
    console.log("[Auth] register - inicio", { email, username, gender, hasAvatar: !!avatarFile });

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = cred.user;
    const uid = firebaseUser.uid;

    // Creamos documento inicial para garantizar persistencia
    const userRef = doc(db, "usuarios", uid);
    const initialUserData = {
      uid,
      email,
      username: username || "",
      avatar: "",
      provider: "password",
      rol: "usuario",
      gender: gender || null,
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(userRef, initialUserData, { merge: true });
      console.log("[Auth] register - documento inicial creado", initialUserData);
    } catch (err) {
      console.error("[Auth] register - fallo al crear documento inicial:", err);
    }

    // Intentar subir avatar (no bloquearn el registro si falla)
    if (avatarFile) {
      try {
        const fileRef = ref(storage, `avatars/${uid}/${Date.now()}-${avatarFile.name}`);
        await uploadBytes(fileRef, avatarFile);
        const avatarUrl = await getDownloadURL(fileRef);
        try {
          await updateDoc(userRef, { avatar: avatarUrl });
        } catch (updErr) {
          console.warn("No se pudo actualizar avatar en Firestore:", updErr);
        }
      } catch (storageErr) {
        console.error("Fallo subida avatar (se continúa):", storageErr);
      }
    }

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: username || email.split("@")[0] });
      }
    } catch (updErr) {
      console.warn("updateProfile fallo:", updErr);
    }

    await cargarUsuarioCompleto(firebaseUser);
    setEsNuevo(true);

    return firebaseUser;
  };

  // Login email
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await cargarUsuarioCompleto(cred.user);
    setEsNuevo(true);
    return cred.user;
  };

  // Login Google
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const gUser = result.user;

    const userRef = doc(db, "usuarios", gUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const userData = {
        uid: gUser.uid,
        email: gUser.email,
        username: gUser.displayName || "",
        avatar: gUser.photoURL || "",
        provider: "google",
        rol: "usuario",
        gender: "no-especificado",
        createdAt: serverTimestamp(),
      };
      try {
        await setDoc(userRef, userData, { merge: true });
        console.log("[Auth] loginWithGoogle - creado documento usuario", userData);
      } catch (err) {
        console.error("[Auth] loginWithGoogle - fallo al crear documento:", err);
      }
    }

    await cargarUsuarioCompleto(gUser);
    setEsNuevo(true);
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

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export default AuthContext;

