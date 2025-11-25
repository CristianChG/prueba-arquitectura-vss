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
  blob_route?: string; // Optional: path to CSV file
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
  search?: string;
  fechaDesde?: string;
  fechaHasta?: string;
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
    if (params?.search) queryParams.append('search', params.search);
    if (params?.fechaDesde) queryParams.append('fecha_desde', params.fechaDesde);
    if (params?.fechaHasta) queryParams.append('fecha_hasta', params.fechaHasta);

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

  static async uploadCSV(
    nombre: string,
    fechaSnapshot: string,
    file: File
  ): Promise<GlobalHato & { warnings?: { message: string; invalid_rows: any[] } }> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('fecha_snapshot', fechaSnapshot);
    formData.append('file', file);

    const response = await axiosInstance.post<GlobalHato & { warnings?: { message: string; invalid_rows: any[] } }>(
      `${this.BASE_PATH}/upload-csv`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  static async downloadCSV(id: number): Promise<Blob> {
    const response = await axiosInstance.get(`${this.BASE_PATH}/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}
