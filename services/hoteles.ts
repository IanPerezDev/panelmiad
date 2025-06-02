import { FullHotelData } from "@/app/dashboard/hoteles/_components/hotel-table";
import { API_KEY } from "../constant";
import { TypeFilters } from "@/types";

// Fetch all hotels
export const fetchHoteles = async (callback: (data) => void = (data) => {}) => {
  try {
    const response = await fetch(
      "https://mianoktos.vercel.app/v1/mia/hoteles",
      {
        headers: {
          "x-api-key": API_KEY || "",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      }
    ).then((res) => res.json());
    if (response.error) {
      console.log("Error en la respuesta de hoteles: ", response.error);
      throw new Error("Error al cargar los datos de los hoteles");
    }
    callback(response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error al cargar los datos de los hoteles");
  }
};

// Advanced filter for hotels
export const fetchHotelesFiltro_Avanzado = async (
  filters: TypeFilters,
  callback: (data: FullHotelData[]) => void
) => {
  try {
    console.log("Preparando filtros:", filters);

    const payload = Object.entries(filters).reduce((acc, [key, value]) => {
      if (typeof value === "boolean") {
        return { ...acc, [key]: value ? 1 : 0 };
      }
      if (value !== null && value !== undefined && value !== "") {
        return { ...acc, [key]: value };
      }
      return acc;
    }, {});

    console.log("Payload enviado:", payload);

    const response = await fetch(
      "https://mianoktos.vercel.app/v1/mia/hoteles/Filtro-avanzado",
      {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const rawData = result.hoteles || result.data || result;
    const hoteles = Array.isArray(rawData) ? rawData : [rawData];

    console.log("Hoteles recibidos:", hoteles);
    callback(hoteles);
    return hoteles;
  } catch (error) {
    console.error("Error en fetchHotelesFiltro_Avanzado:", error);
    callback([]);
    throw error;
  }
};

// Search postal code
export const searchCodigoPostal = async (codigo: string) => {
  try {
    const response = await fetch(
      `https://mianoktos.vercel.app/v1/sepoMex/buscar-codigo-postal?d_codigo=${codigo}`,
      {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ERROR ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("ERROR AL BUSCAR CODIGO POSTAL:", error);
    return [];
  }
};

// Search agents
export const searchAgentes = async (nombre: string, correo: string) => {
  try {
    const response = await fetch(
      `https://mianoktos.vercel.app/v1/mia/agentes/get-agente-id?nombre=${encodeURIComponent(
        nombre
      )}&correo=${encodeURIComponent(correo)}`,
      {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("ERROR EN LA RESPUESTA:", response.status);
      return [];
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("ERROR AL BUSCAR AGENTES:", error);
    return [];
  }
};

// Create new hotel
export const createHotel = async (payload: any) => {
  const response = await fetch(
    "https://mianoktos.vercel.app/v1/mia/hoteles/Agregar-hotel/",
    {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `ERROR ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

// Update hotel
export const updateHotel = async (payload: any) => {
  const response = await fetch(
    "https://mianoktos.vercel.app/v1/mia/hoteles/Editar-hotel/",
    {
      method: "PATCH",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `ERROR ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

// Delete hotel
export const deleteHotel = async (id_hotel: string) => {
  const response = await fetch(
    "https://mianoktos.vercel.app/v1/mia/hoteles/Eliminar-hotel/",
    {
      method: "PATCH",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_hotel }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `ERROR ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

// Get hotel rates
export const getHotelRates = async (id_hotel: string) => {
  const response = await fetch(
    `https://mianoktos.vercel.app/v1/mia/hoteles/Consultar-tarifas-por-hotel/${id_hotel}`,
    {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`ERROR ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Update hotel rate
export const updateHotelRate = async (payload: any) => {
  const response = await fetch(
    "https://mianoktos.vercel.app/v1/mia/hoteles/Actualiza-tarifa",
    {
      method: "PATCH",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(`ERROR ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Delete preferential rate
export const deletePreferentialRate = async (payload: {
  id_tarifa_preferencial_sencilla?: number | null;
  id_tarifa_preferencial_doble?: number | null;
}) => {
  const response = await fetch(
    "https://mianoktos.vercel.app/v1/mia/hoteles/Eliminar-tarifa-preferencial",
    {
      method: "PATCH",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `ERROR ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

// Get hotel by ID
export const getHotelById = async (id_hotel: string) => {
  const response = await fetch(
    `https://mianoktos.vercel.app/v1/mia/hoteles/${id_hotel}`,
    {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`ERROR ${response.status}: ${response.statusText}`);
  }

  return response.json();
};