import { IMonitoredProducts } from "@/lib/database";
import { DeleteIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  IconButton,
  Link,
  Progress,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { PostgrestResponse } from "@supabase/supabase-js";
import axios from "axios";
import { useRouter } from "next/router";
import { Key, useEffect, useState } from "react";
import { FaSync } from "react-icons/fa";

export default function ProductID() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<IMonitoredProducts>({
    name: "",
    link: "",
    img: "",
    offers: [],
    price: 0,
  });
  const [isLoading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const data =
    typeof product?.offers === "string"
      ? JSON.parse(product?.offers)
      : product?.offers;
  const fetchProductInfo = async (val: string) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/info", {
        url: val,
      });

      return res.data;
    } catch (error) {
    let data = {};
    setLoading(true);
    const res = await axios.post(
      "https://pjtpjlygifiiuwwdboib.functions.supabase.co/cors-proxy",
      {
        url: val,
      }
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(res.data, "text/html");
    doc.querySelectorAll("head script").forEach((i) => {
      console.log(i.innerHTML);
      if (i.innerHTML != "") {
        try {
          let EM = eval(i.innerHTML + "EM");
          let img: string = EM.product_thumb;
          setLoading(false);
          data = {
            name: EM.product_title,
            price: EM.productDiscountedPrice,
            img: img.substring(0, img.indexOf(new URL(img).search)),
            offers: EM.used_offers,
          };
        } catch (error) {
          console.error(error);
        }
      }
    });
    return data;
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      if (id) {
        const { data: prod, error } = (await supabase
          .from("monitored_products")
          .select("*")
          .eq("id", id)) as PostgrestResponse<IMonitoredProducts>;

        if (error) {
          console.log("error", error);
        } else {
          setLoading(true);
          setProduct(prod[0]);
          let new_data = await fetchProductInfo(prod[0].link);

          if (
            prod[0].offers.filter(
              (o: { id: any }) =>
                !new_data.offers.some((l: { id: any }) => l.id === o.id)
            ).length > 0 ||
            new_data.price != prod[0].price
          ) {
            if (new_data.name) {
              setProduct({ ...prod[0], ...new_data });
              setLoading(false);
              const { error } = await supabase
                .from("monitored_products")
                .update({ ...new_data, updated_at: new Date() })
                .eq("id", prod[0].id);
              console.log(error);
            } else setLoading(false);
          } else setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [supabase, id]);

  const updateInfo = async () => {
    if (product.link) {
      setLoading(true);
      let data = await fetchProductInfo(product.link);
      if (data.offers) {
        setProduct({ ...product, ...data });
        setLoading(false);
      }
    }
  };

  const deleteEntry = async () => {
    await supabase.from("monitored_products").delete().eq("id", id);
    router.push("/");
  };

  return (
    <Box mt="60px" display="flex" justifyContent="center">
      {product.id && (
        <Card shadow="lg" maxW="520px" mt="5" mb="10" mx="4" minW="320px">
          <CardHeader pb="0">
            <Heading>{product?.name}</Heading>
            <Flex>
              <Box>
                <Link
                  href={
                    product?.link.includes("#used-products")
                      ? product?.link
                      : product?.link + "#used-products"
                  }
                  isExternal
                  pt="2"
                >
                  Go to product page
                  <ExternalLinkIcon mx="2px" />
                </Link>
                <Text>Price new: {product?.price} Lei</Text>
              </Box>
              <Spacer />
              <IconButton
                icon={<FaSync />}
                aria-label="Update"
                onClick={updateInfo}
                mr="2"
              />{" "}
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Delete"
                onClick={deleteEntry}
              />
            </Flex>
          </CardHeader>
          <CardBody pt="0">
            {isLoading && <Progress size="xs" isIndeterminate />}
            {data.length == 0 && (
              <>
                <Divider my="2" />
                <Heading>No Resealeds</Heading>
              </>
            )}
            {data.map(
              (
                item: {
                  description: {
                    offer: string;
                  };
                  price: {
                    current: string | number;
                  };
                },
                i: Key | null | undefined
              ) => (
                <>
                  <Divider my="2" />
                  <Flex key={i}>
                    <Text pr="4">{item.description.offer}</Text>
                    <Text>{item.price.current} Lei</Text>
                  </Flex>
                </>
              )
            )}
          </CardBody>
        </Card>
      )}
    </Box>
  );
}
