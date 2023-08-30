import { User } from './user';

export interface FilterUsersResponse {
    rows: User[];
    count: number;
}
