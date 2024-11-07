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
import { useState, useMemo } from "react";

interface InterviewItem {
  Email: string;
  interviewDate: string;
  duration: number;
  technology: string;
}

const mockItems: InterviewItem[] = [
  { Email: "john.doe@example.com", interviewDate: "2023-10-01T09:00:00Z", duration: 2, technology: "python" },
  { Email: "alice.doe@example.com", interviewDate: "2023-09-25T10:00:00Z", duration: 1.5, technology: "python" },
  { Email: "charlie.doe@example.com", interviewDate: "2023-09-29T14:00:00Z", duration: 1, technology: "go" },
  { Email: "eve.doe@example.com", interviewDate: "2023-09-28T11:00:00Z", duration: 2.5, technology: "algo" },
];

interface SelectItemProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelectItem = ({ isOpen, onClose }: SelectItemProps) => {
  const [filters, setFilters] = useState({ email: "", date: "", technology: "" });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredItems = useMemo(() => {
    return mockItems.filter(item => {
      return (
        (!filters.email || item.Email.includes(filters.email)) &&
        (!filters.date || new Date(item.interviewDate).toLocaleDateString() === new Date(filters.date).toLocaleDateString()) &&
        (!filters.technology || item.technology === filters.technology)
      );
    });
  }, [filters]);

  /* const onSlotSelect = (selectedSlot: InterviewItem) => {
    setSelectedSlot(selectedSlot);
    onClose();
  }; */

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
              <FormLabel>Technology</FormLabel>
              <Select 
                name="technology"
                placeholder="Filter by Technology"
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
                  <Th>Technology</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredItems.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.Email}</Td>
                    <Td>{new Date(item.interviewDate).toLocaleString()}</Td>
                    <Td>{item.duration}</Td>
                    <Td><Badge colorScheme="blue">{item.technology}</Badge></Td>
                    <Td>
                      <Button variant="primary" type="submit" /*onClick={() => onSlotSelect(item)}*/>Choose Slot</Button>
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