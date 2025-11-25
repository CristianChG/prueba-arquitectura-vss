import axiosInstance from './axiosConfig';

export interface Cow {
  id: number;
  global_hato_id: number;
  numero_animal: string;
  nombre_grupo: string;
  produccion_leche_ayer: number;
  produccion_media_7dias: number;
  estado_reproduccion: string;
  dias_ordeno: number;
}

export interface GlobalHato {
  id: number;
  user_id: number;
  nombre: string;
  fecha_snapshot: string; // ISO date string
  total_animales: number;
  grupos_detectados: number;
  created_at: string; // ISO datetime string
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GetGlobalHatosParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetGlobalHatosResponse {
  global_hatos: GlobalHato[];
  pagination: Pagination;
}

export interface CreateGlobalHatoData {
  nombre: string;
  fecha_snapshot: string; // ISO date string (YYYY-MM-DD)
  cows: Array<{
    numero_animal: string;
    nombre_grupo: string;
    produccion_leche_ayer: number;
    produccion_media_7dias: number;
    estado_reproduccion: string;
    dias_ordeno: number;
  }>;
}

export class GlobalHatosAPI {
  private static BASE_PATH = '/api/global-hatos';

  static async getAllGlobalHatos(params?: GetGlobalHatosParams): Promise<GetGlobalHatosResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sort_by', params.sortBy);
    if (params?.sortOrder) queryParams.append('sort_order', params.sortOrder);

    const url = queryParams.toString()
      ? `${this.BASE_PATH}?${queryParams.toString()}`
      : this.BASE_PATH;

    const response = await axiosInstance.get<GetGlobalHatosResponse>(url);
    return response.data;
  }

  static async createGlobalHato(data: CreateGlobalHatoData): Promise<GlobalHato> {
    const response = await axiosInstance.post<GlobalHato>(this.BASE_PATH, data);
    return response.data;
  }

  static async deleteGlobalHato(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_PATH}/${id}`);
  }
}
