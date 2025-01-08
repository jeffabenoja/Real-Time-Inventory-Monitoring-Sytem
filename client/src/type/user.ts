export interface AdminUser {
    name: string;
    role: "admin";
    email: string;
  }
  
export interface RegularUser {
    name: string;
    role: "user";
    email: string;
    access: {
      reports: { read: boolean; write: boolean };
      sales: { read: boolean; write: boolean };
      stocklist: { read: boolean; write: boolean };
      inventory: { read: boolean; write: boolean };
      users: { read: boolean; write: boolean };
    };
  }