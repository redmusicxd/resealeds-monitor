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
    offers: "[]",
    price: 0,
  });
  const [isLoading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const data =
    typeof product?.offers === "string"
      ? JSON.parse(product?.offers)
      : product?.offers;
  const fetchProductInfo = async (val: string) => {
    const parser = new DOMParser();
    const res = await axios.post("/api/cors", { url: val });

    const doc = parser.parseFromString(res.data, "text/html");
    let data: IMonitoredProducts = {
      name: "",
      link: "",
      img: "",
      price: 0,
      offers: ""
    };
    doc.querySelectorAll("head script").forEach((i) => {
      // console.log(i.innerHTML);
      if (i.innerHTML != "") {
        try {
          let EM = eval(i.innerHTML + "EM");
          data = {
            ...product,
            name: EM.product_title,
            price: EM.productDiscountedPrice,
            offers: EM.used_offers,
            img: EM.product_thumb.substring(
              0,
              EM.product_thumb.indexOf(new URL(EM.product_thumb).search)
            ),
          };
        } catch (error) {
          console.error(error);
        }
      }
    });
    return data;
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
          setProduct(prod[0])
          let new_data = await fetchProductInfo(prod[0].link);
          if (new_data.offers.length != prod[0].offers.length) {
            setProduct({ ...prod[0], ...new_data });
            setLoading(false)
            await supabase.from("monitored_products").update({ offers: new_data.offers, updated_at: new Date() }).eq("id", id);
          } else setLoading(false)
        }
      }
    };

    fetchProducts();
  }, [supabase, id]);

  const updateInfo = async () => {
    if (product.link) {
      setLoading(true)
      let data = await fetchProductInfo(product.link);
      if (data.offers) {
        setProduct({...product, ...data})
        setLoading(false)
      }
    }
  }

  const deleteEntry = async () => {
    await supabase.from("monitored_products").delete().eq("id", id);
    router.push("/");
  };

  return (
    <Box mt="60px" pt="4" display="flex" justifyContent="center">
      {product.id && (
        <Card shadow="lg" maxW="520px" mt="5" mb="10" mx="4">
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
              />              <IconButton
                icon={<DeleteIcon />}
                aria-label="Delete"
                onClick={deleteEntry}
              />
            </Flex>
          </CardHeader>
          <CardBody pt="0">
          {isLoading && <Progress size='xs' isIndeterminate />}
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
