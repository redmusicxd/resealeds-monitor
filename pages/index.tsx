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
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <title>Next.js Example</title>
      </Head>
      <main className={styles.main}>
        <>
          <Flex
            py="6"
            align="center"
            justify="center"
            flexDir="row"
            wrap={"wrap"}
            gap="3"
            mt="60px"
          >
            {!session && <Text>Please login!</Text>}
            {products.map((item, i) => (
              <Link key={i} as={NextLink} href={`/product/${item.id}`}>
                <Card
                  flexDir="row"
                  bg={colorMode == "dark" ? "gray.700" : "gray.100"}
                  shadow="md"
                  // maxW="430px"
                >
                  <Image
                    src={item.img}
                    width={["100px", "150px"]}
                    height="auto"
                    objectFit="cover"
                    alt={item.name}
                    borderRadius="2xl"
                    alignSelf="center"
                    p="2"
                  />
                  <Flex
                    flexDir="column"
                    borderRightRadius="4"
                    bg={colorMode == "dark" ? "#454958" : "blackAlpha.100"}
                    justifyContent="center"
                    // minW="190px"
                    maxW="160px"
                  >
                    <CardHeader noOfLines={3} p="0" m="0.8rem">
                      {item.name}
                    </CardHeader>
                  </Flex>
                  <Flex
                    bg={colorMode == "dark" ? "gray.700" : "gray.100"}
                    px="4"
                    borderLeftRadius={["6", "none"]}
                    borderRightRadius="6"
                    h={["60px", "auto"]}
                    justifyContent={["center", "normal"]}
                    maxW={["min", "min", "min", "max"]}
                  >
                    <Text alignSelf="center" overflowWrap="break-word">
                      {item.price} Lei
                    </Text>
                  </Flex>
                </Card>
              </Link>
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
