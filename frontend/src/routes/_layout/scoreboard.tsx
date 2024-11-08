import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Container,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { PaginationFooter } from "../../components/Common/PaginationFooter.tsx";
import { ScoreBoardRecord } from "../../client/models.ts";
import { ScoreBoardService } from "../../client/services.ts";

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/scoreboard")({
  component: ScoreBoard,
  validateSearch: (search) => itemsSearchSchema.parse(search),
});

const PER_PAGE = 5;

function ScoreBoard() {
  const { page } = Route.useSearch();
  const router = useRouter(); 

  const [data, setData] = useState<ScoreBoardRecord[]>([]);

  const fetchData = async () => {
    const response = await ScoreBoardService.getScoreBoard();
    setData(response);
  };
    
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
        Score board
      </Heading>

      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Mark</Th>
              <Th>Status</Th>
              <Th>Stack</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, index) => (
              <Tr key={index}>
                <Td>{item.mail}</Td>
                <Td>{item.mark}</Td>
                <Td>{item.status ? "Active" : "Not active"}</Td>
                <Td>{item.stack}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <PaginationFooter
        page={page}
        onChangePage={(newPage) => router.navigate({ search: { page: newPage } })}
        hasNextPage={data.length === PER_PAGE}
        hasPreviousPage={page > 1}
      />
    </Container>
  );
}