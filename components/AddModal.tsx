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
import axios from "axios";
import { UUID } from "crypto";
import { ChangeEvent, useState } from "react";

export default function AddModal({
  onOpen,
  onClose,
  isOpen,
  products,
  setProducts
}: {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}) {

  const supabase = useSupabaseClient();
  const session = useSession();
  const [input, setInput] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [product, setProduct] = useState<{ name: string, price: number, img: string, offers: [] }>();
  const isError = !input.startsWith("http") && input != "";

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {console.log(e.target.value);
   setInput(e.target.value); setProduct(undefined); if(e.target.value.startsWith("http")) {fetchProductInfo(e.target.value)}}

  const fetchProductInfo = async (val: string) => {
    const parser = new DOMParser();
    setLoading(true)
    const res = await axios.post("/api/cors", { url: val });

    const doc = parser.parseFromString(res.data, "text/html");
    doc.querySelectorAll("head script").forEach(i => {
      console.log(i.innerHTML);
      if (i.innerHTML != "") {
        try {
          let EM = eval(i.innerHTML + "EM");
          let img : string = EM.product_thumb;
          setLoading(false)
          setProduct({ name: EM.product_title, price: EM.productDiscountedPrice, img: img.substring(0, img.indexOf(new URL(img).search)), offers: EM.used_offers })
          // console.log(EM.product_thumb);
          // console.log(EM.product_title);
          // console.log(EM.used_offers);
          
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  const insertProduct = async () => {
    const { data } = await supabase.from("monitored_products").insert<IMonitoredProducts>({name: product?.name || "", link: input, img: product?.img || "", price: product?.price || 0, user_id: session?.user.id as UUID, offers: JSON.stringify(product?.offers) || "[]"}).select();
    setProducts([...products, data])
    onClose()
  }

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
            <FormHelperText>Link for the product you want to be monitored.</FormHelperText>
          </FormControl>
          {isLoading && <Box display="flex" justifyContent="center" mt="4"><CircularProgress isIndeterminate color='green.300' /></Box>}

          {product && <Card mt="4">
            <Image mt="4" src={product.img} alt={product.name} w="120px" h="auto" alignSelf="center"/>
            <CardHeader>
              {product?.name}
            </CardHeader>
            <CardBody>
              {product?.offers.length} resigilate
            </CardBody>
          </Card>}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="outlined" isDisabled={Object.values(product || {}).length > 0 ? false : true} onClick={insertProduct}>Add product</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
