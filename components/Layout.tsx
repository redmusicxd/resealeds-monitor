import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Flex, Spacer, IconButton, useColorMode, Text, Avatar, Button, Link, useDisclosure } from "@chakra-ui/react";
import { useSession } from "@supabase/auth-helpers-react";
import NextLink from "next/link";
import { AiFillHome } from "react-icons/ai";
import LoginModal from "./LoginModal";
import ProfileModal from "./Profile";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children } : Props) {
  const { colorMode, setColorMode } = useColorMode();
  const session = useSession()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure();
  
  return (
    <>
      <Flex
        h="60px"
        w="100%"
        bg={colorMode == "dark" ? "gray.800" : "white"}
        align="center"
        px="5"
        flexShrink="0"
        pos="fixed"
        top="0"
        // shadow="sm"
        zIndex={999}
      >
        <Link as={NextLink} href="/"><AiFillHome size="1.5rem"/></Link>
        <Spacer />
        <IconButton
          mr="4"
          variant="ghost"
          onClick={() => setColorMode(colorMode == "dark" ? "light" : "dark")}
          icon={colorMode == "dark" ? <SunIcon /> : <MoonIcon />}
          aria-label="Color Mode toggle button"
        />
        {session ? (<Avatar name={session.user.user_metadata.name} src={session?.user.user_metadata.avatar_url} size="sm" onClick={onOpen} _hover={{cursor: "pointer"}} />) : <Button mr="2" onClick={onOpenLogin}>Login</Button>}
        {isOpen && <ProfileModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />}
        {isLogin && <LoginModal isOpen={isLogin} onOpen={onOpenLogin} onClose={onCloseLogin} />}
      </Flex>
      {children}
    </>
  );
}
