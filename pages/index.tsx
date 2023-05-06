import Head from "next/head";
import styles from "@/styles/Home.module.css";
import {
  Card,
  CardBody,
  Flex,
  Text,
  Image,
  CardHeader,
  useColorMode,
  IconButton,
  useDisclosure,
  Box,
  Heading,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import AddModal from "@/components/AddModal";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import LoginModal from "@/components/LoginModal";
import { useEffect, useState } from "react";
import { UUID } from "crypto";
import { PostgrestResponse } from "@supabase/supabase-js";
import { IMonitoredProducts } from "@/lib/database";

export default function Home() {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState<IMonitoredProducts[]>([]);
  const session = useSession();
  const supabase = useSupabaseClient();

  supabase.auth.onAuthStateChange((ev, session) => {
    if (ev == "SIGNED_OUT") {
      setProducts([]);
    }
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: prod, error } = (await supabase
        .from("monitored_products")
        .select("*")
        .order("id", {
          ascending: true,
        })) as PostgrestResponse<IMonitoredProducts>;

      if (error) console.log("error", error);
      else setProducts(prod);
    };

    fetchProducts();
  }, [supabase]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=auto"
        />
        <title>Resealeds Monitor</title>
      </Head>
      <main className={styles.main}>
        <>
          <Flex
            px="2"
            align="center"
            justify="center"
            flexDir="row"
            wrap={"wrap"}
            gap="3"
            mt="60px"
            flex="1"
            alignContent={["flex-start", "center"]}
            pt="2"
            pb="5"
          >
            {!session && <Text>Please login!</Text>}
            {products.length == 0 && session && (
              <Flex h="full" flex="1" align="center" justify="center">
                <Heading textColor="#888888">No products added!</Heading>
              </Flex>
            )}
            {products.map((item, i) => (
              <Card
                key={i}
                flexDir="row"
                bg={colorMode == "dark" ? "gray.700" : "gray.100"}
                shadow="md"
                minW={["auto", "220px", "320px", "390px"]}
                maxW={["auto", "270px", "390px", "auto"]}
              >
                <Image
                  src={item.img}
                  width={["100px", "110px", "120px", "150px"]}
                  height="auto"
                  objectFit="cover"
                  alt={item.name}
                  borderRadius="2xl"
                  alignSelf="center"
                  p="2"
                  flex="1"
                />
                <Flex
                  flexDir="column"
                  borderRightRadius="4"
                  justifyContent="center"
                  flex="2.5"
                  px="2"
                  pb="2"
                  align="self-end"
                >
                  <Link
                    as={NextLink}
                    href={`/product/${item.id}`}
                  >
                    <Flex flex="2" w="100%" borderRadius="md">
                      <Text
                        noOfLines={3}
                        my="2"
                        alignSelf="center"
                        flex="2"
                        textAlign="center"
                      >
                        {item.name}
                      </Text>
                    </Flex>
                  </Link>
                  <Flex
                    bg={colorMode == "dark" ? "gray.700" : "gray.200"}
                    flex="1"
                    w="100%"
                    borderRadius="md"
                    justify="center"
                  >
                    <Text overflowWrap="break-word" py="2" textAlign="center">
                      {item.price} Lei
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
          {isOpen && (
            <AddModal
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              products={products}
              setProducts={setProducts}
            />
          )}
          <IconButton
            borderRadius="25"
            size="lg"
            pos="fixed"
            bottom="25px"
            right="25px"
            shadow="md"
            colorScheme="green"
            onClick={onOpen}
            isDisabled={session ? false : true}
            icon={<AddIcon />}
            aria-label="Add button"
          />
        </>
      </main>
    </>
  );
}
