import { v4 as uuidv4 } from 'uuid';

const id = uuidv4();

export interface Task {
  id: typeof id;
  text: string;
  completed: boolean;
  editing?: boolean;
}

export interface AuthResponse {
  access_token: string;
}

