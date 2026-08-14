import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    // Who this session belongs to. Only staff authenticate today, but the
    // middleware asserts this rather than merely checking a token exists.
    kind?: "staff";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: string;
      kind: "staff";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    kind: "staff";
  }
}
