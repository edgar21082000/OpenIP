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
  VStack,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import Navbar from "../../components/Common/Navbar.tsx";
import AddItem from "../../components/Items/AddItem.tsx";
import { PaginationFooter } from "../../components/Common/PaginationFooter.tsx";
import SelectItem from "../../components/Items/SelectItem.tsx";
import { InterviewHistory, SetMarkData, UserPublic } from "../../client/models.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InterviewsService } from "../../client/services.ts";
import useCustomToast from "../../hooks/useCustomToast.ts";
import { handleError } from "../../utils.ts";
import { ApiError } from "../../client/index.ts";

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/items")({
  component: Items,
  validateSearch: (search) => itemsSearchSchema.parse(search),
});

const RatingSelect = ({ interview_id, currentRating, onRatingChange }: any) => {
  const [rating, setRating] = useState(currentRating || "");
  const showToast = useCustomToast();

  const mutation = useMutation({
    mutationFn: (data: SetMarkData) => InterviewsService.setMark(data),
    onSuccess: () => {
      showToast("Success!", "Rating submitted successfully.", "success");
      onRatingChange(interview_id, rating);
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
  });

  const handleRatingChange = () => {
    if (rating) {
      mutation.mutate({ interview_id: interview_id, mark: rating });
    }
  };

  return currentRating ? (
    <span>{currentRating}</span>
  ) : (
    <Flex>
      <Select value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Select Rating">
        {["A", "B", "C", "D", "E"].map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </Select>
      <Button onClick={handleRatingChange} disabled={!rating}>
        Set Rating
      </Button>
    </Flex>
  );
};

const PER_PAGE = 5;

function ItemsTable() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
  const { page } = Route.useSearch();
  const router = useRouter();
  const [filters, setFilters] = useState({ rating: "", date: "" });
  const [data, setData] = useState<InterviewHistory[]>([]);

  const fetchData = async () => {
    try {
      const response = await InterviewsService.getInterviewHistory();
      setData(response);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Фильтрация и сортировка
  const filteredItems = useMemo(() => {
    return data
      .filter(item => {
        return (
          (!filters.date || new Date(item.date).toLocaleDateString() === new Date(filters.date).toLocaleDateString())
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice((page - 1) * PER_PAGE, page * PER_PAGE);
  }, [data, filters, page]);

  const updateRating = (interview_id: number, newRating:  number) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.interview_id == interview_id ? { ...item, rating: newRating } : item
      )
    );
  };

  return (
    <>
      <VStack align="start" spacing={4} mb={4}>
        <FormControl mb={4}>
          <FormLabel>Interview Date</FormLabel>
          <Input type="date" name="date" onChange={handleFilterChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Rating</FormLabel>
          <Select name="rating" onChange={handleFilterChange} placeholder="Filter by Rating">
            {["A", "B", "C", "D", "E"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        </FormControl>
      </VStack>

      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>Interview Id</Th>
              <Th>Interviewee Date</Th>
              <Th>Interview Summary</Th>
              <Th>Rating</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredItems.map((item, index) => (
              <Tr key={index}>
                <Td>{item.interview_id}</Td>
                <Td>{new Date(item.date).toLocaleString()}</Td>
                <Td>{item.summary}</Td>
                <Td>
                  {(currentUser?.role === 'interviewer' && !item.rating) ?
                    <RatingSelect interview_id={item.interview_id} currentRating={item.rating} onRatingChange={updateRating}/> :
                    item.rating
                  }
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
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
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  // Функция для создания комнаты
  const handleCreateRoom = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8001/create_room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create room");
      }
      const data = await response.json();
      if (data.room_id) {
        // Открываем новую вкладку с комнатой
        window.open(`http://127.0.0.1:3000/room/${data.room_id}`, "_blank");
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Interviews
      </Heading>

      <Flex py={8} gap={4} alignItems="center">
        {currentUser?.role === 'interviewer' && (
          <>
            <Navbar text={"Schedule interview"} addModalAs={AddItem} />
            <Button onClick={handleCreateRoom} colorScheme="teal" variant="solid">
              Create interview room
            </Button>
          </>
        )}
        {currentUser?.role === 'applicant' && (
          <Navbar text={"Choose interview slot"} addModalAs={SelectItem} />
        )}
      </Flex>
      <ItemsTable />
    </Container>
  );
}