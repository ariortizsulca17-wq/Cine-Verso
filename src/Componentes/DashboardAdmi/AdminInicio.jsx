// src/Componentes/DashboardAdmi/AdminInicio.jsx (ACTUALIZADO)

import React, { useEffect, useState } from 'react';
import { Users, Film, Star, TrendingUp, User, DollarSign } from "lucide-react"; // Se eliminan Clock y ShoppingCart
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    where,
    documentId,
} from "firebase/firestore";

// 👇 ¡IMPORTANTE! MODIFICA ESTA RUTA A DONDE EXPORTAS TU INSTANCIA DE FIRESTORE (db)
import { db } from "../../lib/firebase";

// Importa tus subcomponentes
import TarjetaResumen from './TarjetaResumen';
// import WidgetPelicula from './WidgetPelicula'; // Ya no se usa para listas de películas
import WidgetCliente from './WidgetCliente'; // Componente que crearemos
import ChartVentasPlaceholder from './ChartVentasPlaceholder';


export default function AdminInicio() {
    const [data, setData] = useState({
        stats: {},
        clientesMasCompras: [], // Nuevo estado para Top Clientes
        salesDataForChart: [],
    });
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        setLoading(true);

        try {
            // ----------------------------------------------------
            // 1. CONTEO GLOBAL Y CONSULTA DE COMPRAS
            // ----------------------------------------------------
            const [usersSnapshot, moviesSnapshot, comprasSnapshot] = await Promise.all([
                getDocs(collection(db, "usuarios")),
                getDocs(collection(db, "peliculas")),
                getDocs(collection(db, "compras"))
            ]);

            const totalUsuarios = usersSnapshot.size;
            const peliculasActivas = moviesSnapshot.size;

            // ----------------------------------------------------
            // 2. TOP RATING (para tarjeta) y VENTA TOTAL (para tarjeta)
            // ----------------------------------------------------
            const qTopRated = query(
                collection(db, "peliculas"),
                orderBy("rating", "desc"),
                limit(1)
            );
            const topRatedSnapshot = await getDocs(qTopRated);
            const highestRating = topRatedSnapshot.docs[0]?.data().rating || 0;

            // ----------------------------------------------------
            // 3. TOP 5 CLIENTES CON MÁS COMPRAS (Lógica de agregación en cliente)
            // ----------------------------------------------------
            const comprasData = comprasSnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id // Incluir ID por si acaso
            }));

            let totalVentasGlobal = comprasData.reduce((sum, compra) => sum + (parseFloat(compra.totalCompra) || 0), 0);



            // ****************************************************
            // 👇 AQUÍ EMPIEZA LA LÓGICA PARA LA GRÁFICA DE VENTAS MENSUALES
            // ----------------------------------------------------
            // LÓGICA DE GRÁFICO: Ingresos por Mes (Últimos 6-12 meses)
            // ----------------------------------------------------
            const monthlySales = comprasData.reduce((acc, compra) => {
                const date = compra.fecha?.toDate() || new Date();

                // 👇 CAMBIO CLAVE: Cambiamos la clave de agrupación a AÑO-MES-DÍA
                const monthYearDay = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

                const precio = parseFloat(compra.totalCompra) || 0;

                // Sumamos el precio total para ese día
                acc[monthYearDay] = (acc[monthYearDay] || 0) + precio;
                return acc;
            }, {});

            // Convertir el objeto a un array ordenado para la gráfica (ej: [{ mes: '2025-11', total: 1200 }, ...])
            const salesDataForChart = Object.entries(monthlySales)
                .map(([dateKey, total]) => ({ mes: dateKey, total }))
                .sort((a, b) => a.mes.localeCompare(b.mes)) // Ordena cronológicamente (YYYY-MM-DD)

                // 👇 Puedes usar slice(-5) si quieres mostrar los últimos 5 puntos de data
                // Si solo tienes un punto (el 27/11), mostrará solo ese.
                .slice(-5)

                // 👇 Formatear el label del eje X para que solo muestre el día/mes
                .map(item => ({
                    ...item,
                    // Convierte 'YYYY-MM-DD' a 'DD/MM' para mejor visualización en el gráfico
                    mes: item.mes.substring(5).replace('-', '/')
                }));


            const userPurchaseStats = comprasData.reduce((acc, compras) => {
                // ...
                const userId = compras.uid;



                // DESPUÉS (Usa 'totalCompra' y lo convierte a número):
                const precio = parseFloat(compras.totalCompra) || 0;

                if (userId) {
                    acc[userId] = (acc[userId] || { count: 0, totalSpent: 0 });
                    acc[userId].count += 1;
                    acc[userId].totalSpent += precio; // Usa 'precio' (el valor numérico) aquí
                }
                return acc;
            }, {});

            const topUserIds = Object.entries(userPurchaseStats)
                .sort(([, dataA], [, dataB]) => dataB.count - dataA.count)
                .slice(0, 5)
                .map(([userId, stats]) => ({ userId, ...stats }));

            let clientesMasCompras = [];

            if (topUserIds.length > 0) {
                const topUserIdsArray = topUserIds.map(u => u.userId);

                // Consultamos los detalles de los usuarios por su ID de documento
                const qTopClients = query(
                    collection(db, "usuarios"),
                    // ⭐ CAMBIO CLAVE: Usamos documentId( ) directamente
                    where(documentId(), 'in', topUserIdsArray)
                );
                const clientsSnapshot = await getDocs(qTopClients);

                const clientDetailsMap = clientsSnapshot.docs.reduce((acc, doc) => {
                    acc[doc.id] = doc.data();
                    return acc;
                }, {});

                // Combinamos los datos de conteo con los detalles del usuario
                clientesMasCompras = topUserIds.map(topUser => {
                    const details = clientDetailsMap[topUser.userId] || {};
                    return {
                        // ...
                        nombre: details.nombre || details.email || `Usuario ID: ${topUser.userId.substring(0, 5)}...`, // Usa nombre o email
                        totalCompras: topUser.count,
                        totalGastado: topUser.totalSpent.toFixed(2), // Cadena con dos decimales
                    };
                });
            }


            // ----------------------------------------------------
            // 4. ASIGNAR DATOS AL ESTADO
            // ----------------------------------------------------
            setData({
                stats: {
                    totalUsuarios,
                    peliculasActivas,
                    ratingPromedio: highestRating,
                    ventasTotal: totalVentasGlobal,
                },
                clientesMasCompras,
                salesDataForChart: salesDataForChart,

            });

        } catch (error) {
            console.error("Error al obtener datos de Firestore:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-cyan-400 text-lg">Cargando datos del Dashboard desde Firestore...</div>;
    }

    const { stats, clientesMasCompras } = data;

    return (
        <div className="p-6 md:p-10 bg-gray-900 min-h-full text-white">
            <h1 className="text-4xl font-extrabold mb-2 text-white">
                Dashboard de Contenido 🎬
            </h1>
            <p className="text-gray-500 mb-8">
                Resumen de métricas clave y rendimiento.
            </p>

            {/* 1. SECCIÓN DE TARJETAS DE RESUMEN (Métricas Cuatro) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                <TarjetaResumen
                    title="Total Usuarios"
                    // ⭐ Asegurar que es un número antes de toLocaleString
                    value={(stats.totalUsuarios || 0).toLocaleString()}
                    icon={Users}
                    color="sky"
                />

                <TarjetaResumen
                    title="Películas Activas"
                    value={stats.peliculasActivas}
                    icon={Film}
                    color="green"
                />

                <TarjetaResumen
                    title="Mayor Rating"
                    // ⭐ Asegurar que es un número antes de toFixed
                    value={(stats.ratingPromedio || 0).toFixed(1)}
                    icon={Star}
                    color="yellow"
                />

                <TarjetaResumen
                    title="Venta Total (Global)"
                    // ⭐ Corrección: Encadenamiento opcional en stats?.ventasTotal
                    value={`$${(stats.ventasTotal || 0).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    color="fuchsia"
                />
            </div>

            {/* 2. GRID PRINCIPAL (GRÁFICO + TOP CLIENTES) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 📊 COLUMNA 1: GRÁFICO (OCUPA 2/3) */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-fuchsia-400" /> Rendimiento Mensual
                        </h2>
                        <ChartVentasPlaceholder data={data.salesDataForChart} />
                    </div>
                </div>

                {/* 👤 COLUMNA 2: TOP CLIENTES (OCUPA 1/3) */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-green-400" /> TOP Clientes con Más Compras
                        </h2>
                        <div className="space-y-3">
                            {clientesMasCompras.length > 0 ? (
                                clientesMasCompras.map((cliente, index) => (
                                    <WidgetCliente
                                        key={cliente.id} // <-- Esto debe ser 'cliente.id' o 'cliente.userId'
                                        cliente={cliente}
                                        index={index + 1}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No hay datos de compras para mostrar el Top 5.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}