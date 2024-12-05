"use client"
import { useState, useEffect } from "react";
import axios from "axios";

const TableThree = () => {
  const [reservas, setReservas] = useState<any[]>([]);  // Array para almacenar todas las reservas
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/reservas") // Endpoint de la API
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setReservas(response.data);  // Guardamos todas las reservas en el estado
        } else {
          setError("No se encontraron reservas");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar los datos");
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Nombre
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Email
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Fecha Inicio
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Fecha Fin
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Verificamos el estado de carga */}
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-5 text-center">Cargando...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-4 py-5 text-center text-red-500">{error}</td>
              </tr>
            ) : (
              reservas.map((reserva, index) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {reserva.nombre_cliente}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {reserva.email_cliente}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {/* Aquí podrías formatear la fecha si la necesitas */}
                      {new Date(reserva.fecha_inicio).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {/* Aquí podrías formatear la fecha si la necesitas */}
                      {new Date(reserva.fecha_fin).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {reserva.estado}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        {/* Aquí puedes agregar iconos u otras acciones */}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
