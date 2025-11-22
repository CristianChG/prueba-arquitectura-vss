import axiosInstance from './axiosConfig';

export interface User {
  id: number;
  name: string;
  email: string;
  role: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetUsersResponse {
  users: User[];
  pagination: Pagination;
}

export class UsersAPI {
  private static BASE_PATH = '/api/users';

  static async getAllUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role !== undefined) queryParams.append('role', params.role.toString());
    if (params?.sortBy) queryParams.append('sort_by', params.sortBy);
    if (params?.sortOrder) queryParams.append('sort_order', params.sortOrder);

    const url = queryParams.toString()
      ? `${this.BASE_PATH}?${queryParams.toString()}`
      : this.BASE_PATH;

    const response = await axiosInstance.get<GetUsersResponse>(url);
    return response.data;
  }

  static async updateUserRole(
    userId: number,
    role: number
  ): Promise<User> {
    const response = await axiosInstance.patch<User>(
      `${this.BASE_PATH}/${userId}/role`,
      { role }
    );
    return response.data;
  }
}
