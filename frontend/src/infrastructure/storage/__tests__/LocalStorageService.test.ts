import { LocalStorageService } from "@storage/LocalStorageService";

const mockUser = { id: 1, name: "Test User" };

describe("LocalStorageService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should store and retrieve access token", () => {
    LocalStorageService.setAccessToken("abc123");
    expect(LocalStorageService.getAccessToken()).toBe("abc123");
  });

  it("should store and retrieve user data", () => {
    LocalStorageService.setUser(mockUser as any);
    expect(LocalStorageService.getUser()).toEqual(mockUser);
  });
});
