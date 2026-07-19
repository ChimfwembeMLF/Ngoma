export class PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export class ApiResponseDto<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
}
