import { IResponse } from '@/src/common/interfaces';

export interface IPaginationRes<T> extends IResponse<T> {
  meta: {
    count: number;
  };
}
