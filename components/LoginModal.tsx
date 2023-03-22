import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorMode,
} from "@chakra-ui/react";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function LoginModal({
  onOpen,
  onClose,
  isOpen,
}: {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  
  const supabase = useSupabaseClient()
  const { colorMode } = useColorMode();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <Box display="flex" alignItems="center" justifyContent="center">
            <Box display="flex" alignItems="center" justifyContent="center" p="4">
              <Box p="5">
                <span>
                  In order to proceed further please login
                </span>
                <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme={colorMode} providers={["google", "github"] } onlyThirdPartyProviders />
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
