//


export function hasToken(): boolean {
  return !!localStorage.getItem("login");
}

export async function isAuthenticated(): Promise<boolean> {
  return false;
}