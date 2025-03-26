export class StorageService {

    // Lưu trữ thông tin người dùng vào localStorage
    static setUser(user: any): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Lấy thông tin người dùng từ localStorage
    static getUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    static isLoggedIn(): boolean {
        return !!this.getUser();
    }

    // Xóa thông tin người dùng khỏi localStorage
    static clearUser(): void {
        localStorage.removeItem('user');
    }

    // Lưu trữ bất kỳ dữ liệu nào vào localStorage với key tùy chọn
    static setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Lấy dữ liệu từ localStorage bằng key
    static getItem(key: string): any {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    // Xóa dữ liệu khỏi localStorage theo key
    static removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}
