import { auth } from "@/auth";
import Navbar from "./Navbar";

const NavbarServer = async () => {
  const result = await auth();
  const user = result?.user || null;
  const name = user?.name || null;
  const image = user?.image || null;

  return <Navbar image={image} name={name} user={user} />;
};

export default NavbarServer;
