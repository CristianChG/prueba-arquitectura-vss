// Mock de localStorage
class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

(global as any).localStorage = new LocalStorageMock();

// Mock para atob / btoa
(global as any).atob = (data: string) =>
  Buffer.from(data, "base64").toString("binary");
(global as any).btoa = (data: string) =>
  Buffer.from(data, "binary").toString("base64");
