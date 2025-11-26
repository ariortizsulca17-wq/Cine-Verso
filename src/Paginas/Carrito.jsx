import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../Context/AuthContext";
import { 
    Trash2, ShoppingCart, Loader, CreditCard, Banknote, Minus, Plus, 
    CheckCircle, XCircle, ChevronLeft, Mail, Percent, AlertTriangle, Check
} from "lucide-react"; // Importamos iconos nuevos para mejor UX
import toast from "react-hot-toast"; 

// Definición de métodos de pago
const METODOS_PAGO = [
  { id: "tarjeta", nombre: "Tarjeta", icono: <CreditCard className="w-4 h-4" /> },
  { id: "yape", nombre: "Yape", icono: <Banknote className="w-4 h-4" /> },
  { id: "plin", nombre: "Plin", icono: <Banknote className="w-4 h-4" /> },
];

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  
  // Lógica de Cupón
  const [inputCupon, setInputCupon] = useState("");
  const [descuento, setDescuento] = useState(0); // Valor de descuento aplicado
  const [cuponAplicado, setCuponAplicado] = useState(null); // String del cupón aplicado
  const [cuponError, setCuponError] = useState(""); // Mensaje de error de cupón

  const { user } = useAuth();
  
  const PRECIO_BASE = 19.99; 

  // --- Lógica del Carrito (Mantenida) ---

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const carritoInicializado = carritoGuardado.map(p => ({
        ...p,
        price: p.price || PRECIO_BASE,
        quantity: p.quantity || 1,
    }));
    setCarrito(carritoInicializado);

    window.addEventListener("carritoActualizado", actualizarCarritoDesdeStorage);
    return () => {
        window.removeEventListener("carritoActualizado", actualizarCarritoDesdeStorage);
    };
  }, []);

  const actualizarCarritoDesdeStorage = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado.map(p => ({
        ...p,
        price: p.price || PRECIO_BASE,
        quantity: p.quantity || 1, 
    })));
  };

  const guardarCarrito = (nuevoCarrito) => {
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito);
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  const eliminar = (id) => {
    const nuevoCarrito = carrito.filter((p) => p.id !== id);
    guardarCarrito(nuevoCarrito);
    toast("Item eliminado del carrito.", { 
        icon: '🗑️',
        style: {
            backgroundColor: '#1A1F25',
            color: '#FFFFFF',
            border: '1px solid #FF4D4D'
        }
    });
  };

  const cambiarCantidad = (id, delta) => {
    const nuevoCarrito = carrito.map(p => {
        if (p.id === id) {
            const newQuantity = Math.max(1, p.quantity + delta);
            return { ...p, quantity: newQuantity };
        }
        return p;
    });
    guardarCarrito(nuevoCarrito);
  };
  
  // CÁLCULOS
  const totalItems = carrito.reduce((acc, p) => acc + p.quantity, 0);
  const subtotal = carrito.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  const totalUnico = carrito.length;

  // CÁLCULO DEL TOTAL FINAL CON DESCUENTO
  const totalFinal = subtotal - descuento;


  // LÓGICA DEL CUPÓN
  const aplicarCupon = () => {
      setCuponError("");
      setDescuento(0);
      setCuponAplicado(null);

      // Cupón de ejemplo: 10% de descuento
      if (inputCupon.toUpperCase() === "WELCOME10") {
          const valorDescuento = subtotal * 0.10; // 10%
          setDescuento(valorDescuento);
          setCuponAplicado(inputCupon.toUpperCase());
          toast.success("¡Cupón 'WELCOME10' aplicado! 10% de descuento.", { 
              icon: <Percent className="text-green-500 w-5 h-5" /> 
          });
      } else if (inputCupon.trim() !== "") {
          setCuponError("El cupón ingresado no es válido.");
      }
  };

  // FINALIZAR COMPRA
  const finalizarCompra = async () => {
    if (!user || !user.uid) {
      toast.error("Debes iniciar sesión para realizar una compra.", { icon: '🔒' });
      return;
    }

    if (carrito.length === 0) {
      toast.error("Tu carrito está vacío.", { icon: '🛒' });
      return;
    }

    if (!metodoPago) {
        toast.error("Selecciona un método de pago.", { icon: '💳' });
        return;
    }

    setIsSaving(true);

    try {
      const itemsCompra = carrito.map((p) => ({
        titulo: p.titulo || p.title || "Sin título",
        imagen: p.imagen || "https://via.placeholder.com/150x220/1f2937/67e8f9?text=🎬",
        cantidad: p.quantity,
        precioUnitario: p.price,
        subtotal: (p.price * p.quantity).toFixed(2),
      }));

      const compra = {
        uid: user.uid,
        email: user.email || null,
        items: itemsCompra,
        totalItems: totalItems,
        subtotal: subtotal.toFixed(2),
        descuentoAplicado: cuponAplicado || null,
        montoDescuento: descuento.toFixed(2),
        totalCompra: totalFinal.toFixed(2),
        metodoPago: metodoPago,
        fecha: serverTimestamp(),
      };

      await addDoc(collection(db, "compras"), compra);

      // ✅ Mensaje de agradecimiento y CTA mejorado
      toast(
        (t) => (
            <div className="flex flex-col items-start p-2">
                <div className="flex items-center mb-2">
                    <CheckCircle className="text-green-500 w-6 h-6 mr-3" />
                    <span className="font-bold text-lg text-white">¡Gracias por tu compra!</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">El comprobante y el acceso a tus películas han sido enviados a tu correo: {user.email}</p>
                <button
                    className="mt-2 px-4 py-2 bg-[#00C8D7] text-gray-900 font-bold rounded-lg hover:bg-[#00E0FF] transition text-sm"
                    onClick={() => {
                        toast.dismiss(t.id);
                        window.location.href = '/'; // Redirige al inicio para seguir comprando
                    }}
                >
                    Seguir explorando el Catálogo
                </button>
            </div>
        ),
        { 
            duration: 8000, 
            style: { 
                backgroundColor: '#1A1F25', 
                border: '2px solid #00C8D7',
                color: 'white',
                maxWidth: '400px'
            }
        }
      );
      
      localStorage.removeItem("carrito");
      setCarrito([]);
      setDescuento(0);
      setCuponAplicado(null);
      setInputCupon("");
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      toast.error("Ocurrió un error al guardar la compra.", { 
          icon: <XCircle className="text-red-500 w-6 h-6" /> 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Renderizado y UI/UX Ajustado ---

  return (
    <div className="min-h-screen bg-[#0B1014] p-4 sm:p-8 text-gray-100 flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto rounded-xl p-6 md:p-10"> 
        
        {/* Título y Navegación */}
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-[#00C8D7] mb-2 leading-tight">
              <ShoppingCart className="inline-block w-8 h-8 mr-2 text-cyan-500" />
              TU CARRITO
            </h1>
            <p className="text-gray-400 text-base sm:text-lg font-light">Tienes {totalUnico} {totalUnico === 1 ? 'película única' : 'películas únicas'} ({totalItems} items)</p>
            <div className="mt-4">
                <a href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition font-medium text-sm">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Seguir Comprando
                </a>
            </div>
        </div>

        {totalItems === 0 ? (
          // Contenido de Carrito Vacío
          // ... (mantengo el diseño anterior para carrito vacío)
          <div className="bg-[#1A1F25] rounded-xl p-8 shadow-lg border border-gray-700 flex flex-col items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-gray-500 mb-5" />
            <p className="text-gray-400 text-center text-lg font-medium">
              Tu carrito está vacío. ¡Es un buen momento para explorar nuestra colección!
            </p>
            <a href="/" className="mt-6 px-5 py-2 bg-[#00C8D7] text-gray-900 font-bold rounded-lg shadow-md hover:bg-[#00E0FF] transition-all flex items-center text-sm">
                <ChevronLeft className="w-4 h-4 mr-2" /> Ir al Catálogo
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMNA PRINCIPAL: LISTA DE PRODUCTOS Y CANTIDAD (2/3 de ancho) */}
            <div className="lg:col-span-2 space-y-4"> 
              <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2 mb-4">Productos en tu Carrito</h2>
              {/* Contenido de películas (mantenido) */}
              {carrito.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#1A1F25] p-4 rounded-xl flex items-center shadow-lg border border-gray-700 hover:border-[#00C8D7]/40 transition-all"
                >
                  <img
                    src={p.imagen}
                    alt={p.titulo}
                    className="w-16 h-20 object-cover rounded-lg mr-4 border border-[#00C8D7]/50 flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src ="https://via.placeholder.com/100x120/4a5568/99f6e4?text=🎥";
                    }}
                  />
                  <div className="flex-grow flex flex-col justify-center">
                    <span className="block text-base font-semibold text-white mb-0.5 truncate max-w-[200px] sm:max-w-none">{p.titulo}</span>
                    <span className="text-xs text-gray-400">Precio Unitario: <span className="font-bold text-[#00C8D7]">S/ {p.price ? p.price.toFixed(2) : PRECIO_BASE.toFixed(2)}</span></span>
                  </div>
                  <div className="flex items-center mx-3 p-0.5 bg-gray-700 rounded-lg shadow-inner flex-shrink-0">
                    <button
                      onClick={() => cambiarCantidad(p.id, -1)}
                      className="text-cyan-400 hover:text-cyan-300 p-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={p.quantity <= 1}
                      title="Disminuir Cantidad"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white font-bold w-6 text-center text-sm">{p.quantity}</span>
                    <button
                      onClick={() => cambiarCantidad(p.id, 1)}
                      className="text-cyan-400 hover:text-cyan-300 p-1 transition"
                      title="Aumentar Cantidad"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-base font-bold text-white w-[80px] text-right hidden sm:block flex-shrink-0">
                    S/ {(p.price * p.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => eliminar(p.id)}
                    className="bg-red-600 text-white p-2 rounded-lg font-medium hover:bg-red-700 transition duration-200 ml-3 shadow-md flex items-center flex-shrink-0"
                    title="Eliminar Película"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Bloque de Indicaciones de Entrega Digital */}
              <div className="bg-[#1A1F25] p-4 rounded-xl border border-[#00C8D7]/40 shadow-xl mt-6">
                <h3 className="text-lg font-bold text-[#00C8D7] mb-2 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Entrega Digital Inmediata
                </h3>
                <p className="text-sm text-gray-300">
                    Una vez confirmada la compra, recibirás en tu correo registrado (<span className="font-semibold text-white">{user?.email || 'Inicia sesión para ver tu correo'}</span>):
                </p>
                <ul className="list-disc list-inside text-sm text-gray-400 mt-2 ml-4 space-y-1">
                    <li className="flex items-start"><Check className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />El comprobante de pago electrónico.</li>
                    <li className="flex items-start"><Check className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />El **acceso directo** para visualizar y disfrutar tus películas.</li>
                </ul>
                <p className="text-xs text-yellow-400 mt-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" /> Revisa tu bandeja de spam si no lo encuentras.
                </p>
              </div>
            </div>

            {/* COLUMNA LATERAL: RESUMEN Y PAGO (1/3 de ancho) */}
            <div className="lg:col-span-1 space-y-6 bg-[#1A1F25] p-5 rounded-xl shadow-2xl border border-gray-700 h-fit sticky top-4">
              <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2 mb-4">Resumen de Compra</h2>
              
              {/* Campo de Cupón de Descuento */}
              <div className="pt-2 border-t border-gray-700">
                <h3 className="text-base font-bold text-white mb-2">¿Tienes un cupón?</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="CUPON10"
                        value={inputCupon}
                        onChange={(e) => setInputCupon(e.target.value)}
                        className={`w-full p-2 rounded-lg text-sm bg-gray-700 border ${cuponError ? 'border-red-500' : 'border-gray-700 focus:border-[#00C8D7]'} text-white placeholder-gray-400 transition`}
                        disabled={cuponAplicado !== null}
                    />
                    <button
                        onClick={aplicarCupon}
                        disabled={cuponAplicado !== null || inputCupon.trim() === ""}
                        className={`py-2 px-3 rounded-lg text-sm font-bold transition flex items-center ${
                            cuponAplicado 
                                ? 'bg-green-600 text-white cursor-not-allowed'
                                : 'bg-[#00C8D7] text-gray-900 hover:bg-[#00E0FF]'
                        }`}
                    >
                        {cuponAplicado ? <Check className="w-4 h-4" /> : <Percent className="w-4 h-4" />}
                    </button>
                </div>
                {cuponError && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />{cuponError}</p>}
                {cuponAplicado && <p className="text-green-500 text-xs mt-1 font-semibold">Cupón "{cuponAplicado}" aplicado.</p>}
              </div>

              {/* Resumen de costos (Sin Envío Gratis) */}
              <div className="space-y-2 text-sm pt-4 border-t border-gray-700">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white">S/ {subtotal.toFixed(2)}</span>
                </div>
                
                {/* Descuento Aplicado */}
                <div className="flex justify-between text-green-400 font-semibold">
                  <span>Descuento ({cuponAplicado || '0%'}):</span>
                  <span>- S/ {descuento.toFixed(2)}</span>
                </div>
                
                {/* Total Final */}
                <div className="border-t border-gray-700 pt-3 mt-3"></div> 
                <div className="flex justify-between text-lg font-extrabold pt-1">
                  <span>Total a Pagar:</span>
                  <span className="text-[#00C8D7]">S/ {totalFinal.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Método de Pago (Estilo Filtro/Compacto) */}
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-base font-bold text-white mb-3">Selecciona Método de Pago</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3"> 
                  {METODOS_PAGO.map(metodo => (
                    <button 
                        key={metodo.id} 
                        className={`py-2 px-3 rounded-lg flex items-center text-sm font-medium transition-all border
                            ${metodoPago === metodo.id 
                                ? 'bg-[#00C8D7] text-gray-900 border-[#00C8D7] shadow-lg' 
                                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                            }`}
                        onClick={() => setMetodoPago(metodo.id)}
                    >
                        {metodo.icono}
                        <span className="ml-1.5">{metodo.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón Finalizar Compra */}
              <div className="pt-6 border-t border-gray-700 mt-6">
                <button
                  onClick={finalizarCompra}
                  disabled={isSaving || totalItems === 0}
                  className={`w-full py-3 rounded-lg font-bold uppercase text-base tracking-wider shadow-xl transition flex items-center justify-center
                    ${isSaving || totalItems === 0 
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                        : "bg-[#00C8D7] text-gray-900 hover:bg-[#00E0FF]"
                    }`}
                >
                  {isSaving ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pagar S/ {totalFinal.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}