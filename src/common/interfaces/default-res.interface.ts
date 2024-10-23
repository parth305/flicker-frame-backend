export interface IResponse<T> {
  data: T | T[];
  message: string;
}
