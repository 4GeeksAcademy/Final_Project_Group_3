// Simple in-app users (demo only). Replace with real auth later.
// Passwords are plain text for demo purposes.
export const USERS = [
  // Manager
  {
    id: "mgr-1",
    role: "manager",
    email: "manager@glamour.com",
    password: "secret123",
    displayName: "Salon Manager",
  },

  // Technicians — email must map to STAFF names used in bookings
  {
    id: "tech-maria",
    role: "tech",
    email: "maria@glamour.com",
    password: "maria123",
    displayName: "Maria Rodriguez",
  },
  {
    id: "tech-jess",
    role: "tech",
    email: "jessica@glamour.com",
    password: "jessica123",
    displayName: "Jessica Chen",
  },
  {
    id: "tech-ash",
    role: "tech",
    email: "ashley@glamour.com",
    password: "ashley123",
    displayName: "Ashley Johnson",
  },
  {
    id: "tech-sofia",
    role: "tech",
    email: "sofia@glamour.com",
    password: "sofia123",
    displayName: "Sofia Martinez",
  },
];

export function findUser(email, password) {
  return (
    USERS.find(
      (u) =>
        u.email.toLowerCase() === String(email).toLowerCase() &&
        u.password === password
    ) || null
  );
}
