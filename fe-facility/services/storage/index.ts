import { jwtDecode } from "jwt-decode";

const TOKEN = "accessToken";

export class StorageService {
  constructor() { }

  static getUser(): any | string {
    const token = this.getToken(); // Lấy token từ localStorage
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Giải mã token
        return decodedToken; // Trả về đối tượng decodedToken (giả sử 'sub' chứa email hoặc thông tin người dùng)
      } catch (e) {
        return ""; // Nếu có lỗi giải mã, trả về chuỗi rỗng
      }
    }
    return ""; // Nếu không có token, trả về chuỗi rỗng
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return (window as any).localStorage.getItem(TOKEN);
    }
    return null;
  }

  static saveToken(token: string): void {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN);
      window.localStorage.setItem(TOKEN, token);
    }
  }

  static isLoggedIn(): boolean {
    if (this.getToken() === null) {
      return false;
    }
    return true;
  }

  static isExpired(): boolean {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token is expired
          return true;
        }
        return false;
      } catch (e) {
        return true; // If there's an error decoding the token, consider it expired
      }
    }
    return true; // If no token is found, consider it expired
  }

  static signout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN);
    }
  }
}
