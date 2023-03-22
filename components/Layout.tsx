import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Flex, Spacer, IconButton, useColorMode, Text, Avatar, Button, Link, useDisclosure } from "@chakra-ui/react";
import { useSession } from "@supabase/auth-helpers-react";
import NextLink from "next/link";
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
        bg={colorMode == "dark" ? "gray.900" : "gray.50"}
        align="center"
        pl="4"
        flexShrink="0"
        pos="fixed"
        top="0"
        shadow="sm"
        zIndex={999}
      >
        <Link as={NextLink} href="/">Home</Link>
        <Spacer />
        <IconButton
          mr="4"
          onClick={() => setColorMode(colorMode == "dark" ? "light" : "dark")}
          icon={colorMode == "dark" ? <SunIcon /> : <MoonIcon />}
          aria-label="Color Mode toggle button"
        />
        {session ? (<Avatar mr="2" name={session.user.user_metadata.name} src={session?.user.user_metadata.avatar_url} size="md" onClick={onOpen} _hover={{cursor: "pointer"}} />) : <Button mr="2" onClick={onOpenLogin}>Login</Button>}
        {isOpen && <ProfileModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />}
        {isLogin && <LoginModal isOpen={isLogin} onOpen={onOpenLogin} onClose={onCloseLogin} />}
      </Flex>
      {children}
    </>
  );
}
