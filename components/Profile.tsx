import {
  Avatar,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function ProfileModal({
  onOpen,
  onClose,
  isOpen,
}: {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const signout = async () => {
    onClose()
    await supabase.auth.signOut();
    // location.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>Your profile</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="0">
          {(session?.user && (
            <>
              <Flex align="center">
                {/* <Icon w="12" h="12" as={FaUserCircle} mr="2" /> */}
                <Avatar
                  mr="2"
                  name={session.user.user_metadata.name}
                  src={session?.user.user_metadata.avatar_url}
                  size="md"
                  onClick={onOpen}
                />
                <Flex direction="column" flex="1">
                  <Heading>{session.user.user_metadata.full_name}</Heading>
                  <Text>{session.user.email}</Text>
                </Flex>
                {/* <Spacer /> */}
                <Button onClick={signout}>
                  Sign out
                </Button>
              </Flex>
              <Flex mt="2">
                <Text>
                  Your Ntfy.sh link:{" "}
                  <b>
                    <a
                      href={`https://ntfy.kodeeater.xyz/resealed-monitoring-${session.user.id.slice(
                        0,
                        8
                      )}`}
                    >
                      https://ntfy.kodeeater.xyz/resealed-monitoring-
                      {session.user.id.slice(0, 8)}
                    </a>
                  </b>{" "}
                </Text>
              </Flex>
            </>
          )) || (
            <Flex
              flexDirection="column"
              w="100%"
              h="32"
              justifyContent="space-around"
              alignItems="center"
            >
              <Heading>Not logged in!</Heading>
              {/* <Button as={Link} to="/auth/signup">Sign up</Button> */}
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
