import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Select,
  Input,
  Badge,
} from "@chakra-ui/react";
import { useState, useMemo, useEffect } from "react";
import { ApiError, InterviewSlotPublic, InterviewSlotsService } from "../../client";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "../../utils";
import useCustomToast from "../../hooks/useCustomToast";

interface SelectItemProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelectItem = ({ isOpen, onClose }: SelectItemProps) => {
  const showToast = useCustomToast()
  const [filters, setFilters] = useState({ email: "", date: "", stack: "" });
  const [data, setData] = useState<InterviewSlotPublic[]>([]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    try {
      const response = await InterviewSlotsService.getInterviewSlots();
      setData(response);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const mutation = useMutation({
    mutationFn: (id: number) =>
      InterviewSlotsService.selectInterviewSlot(id),
    onSuccess: () => {
      showToast("Success!", "Slot selected successfully.", "success");
      onClose(); 
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
  });

  const handleSelectSlot = (id: number) => {
    mutation.mutate(id);
  };

  const filteredItems = useMemo(() => {
    return data.filter(item => {
      return (
        (!filters.email || item.email.includes(filters.email)) &&
        (!filters.date || new Date(item.from_datetime).toLocaleDateString() === new Date(filters.date).toLocaleDateString()) &&
        (!filters.stack || item.stack === filters.stack)
      );
    });
  }, [data, filters]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent maxH="1000px" maxW="1000px">
        <ModalHeader>Select Interview Slot</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input 
                name="email"
                placeholder="Filter by Email"
                onChange={handleFilterChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Interview Date</FormLabel>
              <Input 
                type="date" 
                name="date"
                onChange={handleFilterChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Stack</FormLabel>
              <Select 
                name="stack"
                placeholder="Filter by Stack"
                onChange={handleFilterChange}
              >
                <option value="python">python</option>
                <option value="go">go</option>
                <option value="algo">algo</option>
              </Select>
            </FormControl>

            <Table size="lg">
              <Thead>
                <Tr>
                  <Th>Email</Th>
                  <Th>Interview Date</Th>
                  <Th>Duration (Hours)</Th>
                  <Th>Stack</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredItems.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.email}</Td>
                    <Td>{item.from_datetime}</Td>
                    <Td>{item.duration}</Td>
                    <Td><Badge colorScheme="blue">{item.stack}</Badge></Td>
                    <Td>
                      <Button 
                        variant="primary" 
                        type="submit" 
                        onClick={() => handleSelectSlot(item.id)}
                      >
                        Choose Slot
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectItem;