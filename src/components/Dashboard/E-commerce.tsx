"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  const [totalVentas, setTotalViews] = useState<string | null>(null);
  const [totalGanancias, setTotalGanancias] = useState<string | null>(null);
  const [totalReservas, setTotalReservas] = useState<string | null>(null);
  const [clientes, setClientes] = useState<string | null>(null);
  const [totalClientes, setTotalClientes] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatNumber = (num: number | string | null): string | null => {
    if (num === null || num === undefined) return null;

    // Convertir a número si la entrada es una cadena
    const parsed = typeof num === "string" ? parseFloat(num) : num;

    // Verificar si es un número válido
    if (isNaN(parsed)) return null; // Si no es válido, devolver null

    // Formatear al estilo europeo
    return parsed.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    axios.get('/api/total_views')
      .then((response) => {
        // Al recibir la respuesta, guardamos el total_incoming
        setTotalViews(formatNumber(response.data.total_incoming));
        setIsLoading(false); // Cambiamos el estado a "no cargando"
      })
      .catch((err) => {
        console.error('Error fetching total views:', err);
        setIsLoading(false); // Cambiamos el estado a "no cargando"
      });
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <p>Total de vistas: {totalVentas}</p>
      )}
    </div>
  );
};

export default ECommerce;