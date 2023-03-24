import { IMonitoredProducts } from "@/lib/database";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { PostgrestResponse } from "@supabase/supabase-js";
import axios from "axios";
import { UUID } from "crypto";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

export default function AddModal({
  onOpen,
  onClose,
  isOpen,
  products,
  setProducts,
}: {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  products: IMonitoredProducts[];
  setProducts: Dispatch<SetStateAction<IMonitoredProducts[]>>;
}) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [input, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [product, setProduct] = useState<{
    name: string;
    price: number;
    img: string;
    offers: [];
  }>();
  const isError = !input.startsWith("http") && input != "";

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setInput(e.target.value);
    setProduct(undefined);
    if (e.target.value.startsWith("http")) {
      fetchProductInfo(e.target.value);
    }
  };

  const fetchProductInfo = async (val: string) => {
    setLoading(true);
    const res = await axios.post(
      "/api/info",
      {
        url: val,
      }
    );

    setProduct(res.data);
    
    setLoading(false)
  };

  const insertProduct = async () => {
    const { data } = (await supabase
      .from("monitored_products")
      .insert<IMonitoredProducts>({
        name: product?.name || "",
        link: input,
        img: product?.img || "",
        price: product?.price || 0,
        user_id: session?.user.id as UUID,
        offers: product?.offers || [],
      })
      .select()) as PostgrestResponse<IMonitoredProducts>;
    data && setProducts([...products, ...data]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={isError}>
            <FormLabel>URL</FormLabel>
            <Input value={input} onChange={handleInputChange} type="url" />
            {isError && <FormErrorMessage>URL invalid</FormErrorMessage>}
            <FormHelperText>
              Link for the product you want to be monitored.
            </FormHelperText>
          </FormControl>
          {isLoading && (
            <Box display="flex" justifyContent="center" mt="4">
              <CircularProgress isIndeterminate color="green.300" />
            </Box>
          )}

          {product && (
            <Card mt="4">
              <Image
                mt="4"
                src={product.img}
                alt={product.name}
                w="120px"
                h="auto"
                alignSelf="center"
              />
              <CardHeader>{product?.name}</CardHeader>
              <CardBody>{product?.offers?.length || 0} resigilate</CardBody>
            </Card>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outlined"
            isDisabled={Object.values(product || {}).length > 0 ? false : true}
            onClick={insertProduct}
          >
            Add product
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
