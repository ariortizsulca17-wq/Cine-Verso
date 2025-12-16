// src/Componentes/DashboardAdmi/AdminInicio.jsx
import React, { useEffect, useState } from 'react';
import { Users, Film, Star, TrendingUp, User, DollarSign } from "lucide-react";
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    where,
    documentId,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

import TarjetaResumen from './TarjetaResumen';
import WidgetCliente from './WidgetCliente';
import ChartVentasPlaceholder from './ChartVentasPlaceholder';

// Importamos ThemeContext
import { useTheme } from "../../Context/ThemeContext";

export default function AdminInicio() {
    const [data, setData] = useState({
        stats: {},
        clientesMasCompras: [],
        salesDataForChart: [],
    });
    const [loading, setLoading] = useState(true);

    const { theme } = useTheme(); // Extraemos theme

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersSnapshot, moviesSnapshot, comprasSnapshot] = await Promise.all([
                getDocs(collection(db, "usuarios")),
                getDocs(collection(db, "peliculas")),
                getDocs(collection(db, "compras"))
            ]);

            const totalUsuarios = usersSnapshot.size;
            const peliculasActivas = moviesSnapshot.size;

            const qTopRated = query(
                collection(db, "peliculas"),
                orderBy("rating", "desc"),
                limit(1)
            );
            const topRatedSnapshot = await getDocs(qTopRated);
            const highestRating = topRatedSnapshot.docs[0]?.data().rating || 0;

            const comprasData = comprasSnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));

            let totalVentasGlobal = comprasData.reduce((sum, compra) => sum + (parseFloat(compra.totalCompra) || 0), 0);

            const monthlySales = comprasData.reduce((acc, compra) => {
                const date = compra.fecha?.toDate() || new Date();
                const monthYearDay = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const precio = parseFloat(compra.totalCompra) || 0;
                acc[monthYearDay] = (acc[monthYearDay] || 0) + precio;
                return acc;
            }, {});

            const salesDataForChart = Object.entries(monthlySales)
                .map(([dateKey, total]) => ({ mes: dateKey, total }))
                .sort((a, b) => a.mes.localeCompare(b.mes))
                .slice(-5)
                .map(item => ({ ...item, mes: item.mes.substring(5).replace('-', '/') }));

            const userPurchaseStats = comprasData.reduce((acc, compras) => {
                const userId = compras.uid;
                const precio = parseFloat(compras.totalCompra) || 0;
                if (userId) {
                    acc[userId] = (acc[userId] || { count: 0, totalSpent: 0 });
                    acc[userId].count += 1;
                    acc[userId].totalSpent += precio;
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
                const qTopClients = query(
                    collection(db, "usuarios"),
                    where(documentId(), 'in', topUserIdsArray)
                );
                const clientsSnapshot = await getDocs(qTopClients);
                const clientDetailsMap = clientsSnapshot.docs.reduce((acc, doc) => {
                    acc[doc.id] = doc.data();
                    return acc;
                }, {});

                clientesMasCompras = topUserIds.map(topUser => {
                    const details = clientDetailsMap[topUser.userId] || {};
                    return {
                        nombre: details.nombre || details.email || `Usuario ID: ${topUser.userId.substring(0, 5)}...`,
                        totalCompras: topUser.count,
                        totalGastado: topUser.totalSpent.toFixed(2),
                        id: topUser.userId
                    };
                });
            }

            setData({
                stats: {
                    totalUsuarios,
                    peliculasActivas,
                    ratingPromedio: highestRating,
                    ventasTotal: totalVentasGlobal,
                },
                clientesMasCompras,
                salesDataForChart
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
        return <div className={`p-8 text-center text-lg ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`}>Cargando datos del Dashboard desde Firestore...</div>;
    }

    const { stats, clientesMasCompras } = data;

    const bgMain = theme === 'dark' ? 'bg-[#0B1014] text-white' : 'bg-gray-100 text-gray-900';
    const cardBg = theme === 'dark' ? 'bg-[#1A1F25] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900';

    return (
        <div className={`p-6 md:p-10 min-h-full ${bgMain}`}>
            <h1 className="text-4xl font-extrabold mb-2">Panel Administrador</h1>
            <p className={theme === 'dark' ? 'text-gray-400 mb-8' : 'text-gray-600 mb-8'}>
                Resumen de métricas clave y rendimiento.
            </p>

            {/* TARJETAS DE RESUMEN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <TarjetaResumen title="Total Usuarios" value={(stats.totalUsuarios || 0).toLocaleString()} icon={Users} color="sky" theme={theme} />
                <TarjetaResumen title="Películas Activas" value={stats.peliculasActivas} icon={Film} color="green" theme={theme} />
                <TarjetaResumen title="Mayor Rating" value={(stats.ratingPromedio || 0).toFixed(1)} icon={Star} color="yellow" theme={theme} />
                <TarjetaResumen title="Venta Total (Global)" value={`$${(stats.ventasTotal || 0).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={DollarSign} color="fuchsia" theme={theme} />
            </div>

            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className={`${cardBg} p-6 rounded-xl shadow-2xl border border-gray-700`}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-fuchsia-400" /> Rendimiento Mensual
                        </h2>
                        <ChartVentasPlaceholder data={data.salesDataForChart} theme={theme} />
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className={`${cardBg} p-6 rounded-xl shadow-2xl border border-gray-700`}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-green-400" /> TOP Clientes con Más Compras
                        </h2>
                        <div className="space-y-3">
                            {clientesMasCompras.length > 0 ? (
                                clientesMasCompras.map((cliente, index) => (
                                    <WidgetCliente key={cliente.id} cliente={cliente} index={index + 1} theme={theme} />
                                ))
                            ) : (
                                <p className={theme === 'dark' ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>
                                    No hay datos de compras para mostrar el Top 5.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
