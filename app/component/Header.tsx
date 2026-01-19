"use client";

import { Button, Navbar, NavbarItem } from "@heroui/react";
import { useAuthActions } from "../store/authStore";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { logout } = useAuthActions();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Navbar>
      <NavbarItem>
        <Button onPress={handleLogout}>Cerrar Sesión</Button>
      </NavbarItem>
    </Navbar>
  );
};
