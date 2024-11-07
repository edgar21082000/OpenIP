import {
  Container,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Select,
  VStack,
  Flex,
  Badge
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import Navbar from "../../components/Common/Navbar.tsx";
import AddItem from "../../components/Items/AddItem.tsx";
import { PaginationFooter } from "../../components/Common/PaginationFooter.tsx";
import SelectItem from "../../components/Items/SelectItem.tsx";
import { UserPublic } from "../../client/models.ts";
import { useQueryClient } from "@tanstack/react-query"

// Определяем интерфейс для элемента интервью
interface InterviewItem {
  interviewerEmail: string;
  intervieweeEmail: string;
  interviewDate: string;
  duration: number; // в часах
  technology: string;
  status: string;
  rating: string; // A, B, C, D, E
}

// Моковые данные
const mockData: InterviewItem[] = [
  {
    interviewerEmail: "john.doe@example.com",
    intervieweeEmail: "jane.smith@example.com",
    interviewDate: "2023-10-01T09:00:00Z",
    duration: 2,
    technology: "python",
    status: "pending",
    rating: "-",
  },
  {
    interviewerEmail: "alice.doe@example.com",
    intervieweeEmail: "bob.smith@example.com",
    interviewDate: "2023-09-25T10:00:00Z",
    duration: 1.5,
    technology: "python",
    status: "done",
    rating: "B",
  },
  {
    interviewerEmail: "charlie.doe@example.com",
    intervieweeEmail: "dana.smith@example.com",
    interviewDate: "2023-09-29T14:00:00Z",
    duration: 1,
    technology: "go",
    status: "done",
    rating: "C",
  },
  {
    interviewerEmail: "eve.doe@example.com",
    intervieweeEmail: "frank.smith@example.com",
    interviewDate: "2023-09-28T11:00:00Z",
    duration: 2.5,
    technology: "algo",
    status: "done",
    rating: "A",
  },
  {
    interviewerEmail: "grace.doe@example.com",
    intervieweeEmail: "hank.smith@example.com",
    interviewDate: "2023-09-30T13:00:00Z",
    duration: 2,
    technology: "go",
    status: "done",
    rating: "B",
  },
  {
    interviewerEmail: "grace.doe@example.com",
    intervieweeEmail: "hank.smith@example.com",
    interviewDate: "2023-09-30T13:00:00Z",
    duration: 2,
    technology: "python",
    status: "done",
    rating: "B",
  },
  {
    interviewerEmail: "grace.doe@example.com",
    intervieweeEmail: "hank.smith@example.com",
    interviewDate: "2023-09-30T13:00:00Z",
    duration: 2,
    technology: "python",
    status: "done",
    rating: "B",
  },
  {
    interviewerEmail: "grace.doe@example.com",
    intervieweeEmail: "hank.smith@example.com",
    interviewDate: "2023-09-30T13:00:00Z",
    duration: 2,
    technology: "python",
    status: "done",
    rating: "B",
  },
];

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/items")({
  component: Items,
  validateSearch: (search) => itemsSearchSchema.parse(search),
});

const PER_PAGE = 5;

function ItemsTable() {
  const { page } = Route.useSearch();
  const router = useRouter(); 

  const [filters, setFilters] = useState({
    rating: "",
    technology: "",
    status: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Фильтрация и сортировка
  const filteredItems = useMemo(() => {
    return mockData
      .filter(item => {
        return (
          (!filters.rating || item.rating === filters.rating) &&
          (!filters.technology || item.technology === filters.technology) &&
          (!filters.status || item.status === filters.status)
        );
      })
      .sort((a, b) => new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime())
      .slice((page - 1) * PER_PAGE, page * PER_PAGE);
  }, [filters, page]);

  return (
    <>
      <VStack align="start" spacing={4} mb={4}>
        <Select
          name="rating"
          placeholder="Filter by Rating"
          onChange={handleFilterChange}
        >
          {["A", "B", "C", "D", "E"].map((rate) => (
            <option key={rate} value={rate}>
              {rate}
            </option>
          ))}
        </Select>

        <Select
          name="technology"
          placeholder="Filter by Technology"
          onChange={handleFilterChange}
        >
          <option value="go">algo</option>
          <option value="go">python</option>
          <option value="go">go</option>
        </Select>

        <Select
          name="status"
          placeholder="Filter by Status"
          onChange={handleFilterChange}
        >
          <option value="progress">progress</option>
          <option value="progress">done</option>
        </Select>
      </VStack>

      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>Interviewer Email</Th>
              <Th>Interviewee Email</Th>
              <Th>Interview Date</Th>
              <Th>Duration (Hours)</Th>
              <Th>Technology</Th>
              <Th>Status</Th>
              <Th>Rating</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredItems.map((item, index) => (
              <Tr key={index}>
                <Td>{item.interviewerEmail}</Td>
                <Td>{item.intervieweeEmail}</Td>
                <Td>{new Date(item.interviewDate).toLocaleString()}</Td>
                <Td>{item.duration}</Td>
                <Td><Badge colorScheme="blue">{item.technology}</Badge></Td>
                <Td>{item.status}</Td>
                <Td>{item.rating}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {/* Добавляем пагинацию, если необходимо */}
      <PaginationFooter
        page={page}
        onChangePage={(newPage) => router.navigate({ search: { page: newPage } })}
        hasNextPage={filteredItems.length === PER_PAGE}
        hasPreviousPage={page > 1}
      />
    </>
  );
}

function Items() {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Interviews
      </Heading>

      <Flex py={8} gap={4}>
        {currentUser?.role == 'interviewer' && <Navbar text={"Schedule interview"} addModalAs={AddItem} />}
        {currentUser?.role == 'applicant' && <Navbar text={"Choose interview slot"} addModalAs={SelectItem} />}
      </Flex>
      <ItemsTable />
    </Container>
  );
}
