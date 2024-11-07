import { useState, useEffect } from "react"
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
  SkeletonText,
  Button,
  Flex,
  VStack,
} from "@chakra-ui/react"
import axios from "axios"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

interface Candidate {
  id: number
  name: string
  stack: string
  rating: number
  status: string
}

const API_BASE_URL = "http://localhost:8000"

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/scoreboard")({
  component: ScoreBoardPage,
  validateSearch: (search) => itemsSearchSchema.parse(search),
})

function ScoreBoardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStack, setSelectedStack] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedRating, setSelectedRating] = useState("")

  const fetchCandidates = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/candidates`, {
        params: {
          stack: selectedStack,
          status: selectedStatus,
          rating: selectedRating,
        },
      })
      setCandidates(response.data)
    } catch (error) {
      console.error("Ошибка при загрузке кандидатов:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [selectedStack, selectedStatus, selectedRating])

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign="center" pt={12}>
        Кандидаты
      </Heading>

      <Flex mt={8} align="start">
        <VStack
          spacing={4}
          align="stretch"
          width="250px"
          mr={8}
          padding="16px"
          bg="gray.100"
          borderRadius="md"
        >
          <Select
            placeholder="Выберите стек"
            value={selectedStack}
            onChange={(e) => setSelectedStack(e.target.value)}
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Fullstack">Fullstack</option>
          </Select>

          <Select
            placeholder="Выберите статус"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="actively_looking">В активном поиске</option>
            <option value="not_looking">Не ищет</option>
          </Select>

          <Select
            placeholder="Выберите рейтинг"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
          </Select>

          <Button onClick={fetchCandidates} colorScheme="blue" width="full">
            Применить фильтр
          </Button>
        </VStack>

        <TableContainer flex="1">
          <Table size="md">
            <Thead>
              <Tr>
                <Th>Имя Фамилия</Th>
                <Th>Стек</Th>
                <Th>Средняя Оценка</Th>
                <Th>Статус</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  {new Array(4).fill(null).map((_, index) => (
                    <Td key={index}>
                      <SkeletonText noOfLines={1} paddingBlock="16px" />
                    </Td>
                  ))}
                </Tr>
              ) : (
                candidates.map((candidate) => (
                  <Tr key={candidate.id}>
                    <Td>{candidate.name}</Td>
                    <Td>{candidate.stack}</Td>
                    <Td>{candidate.rating}</Td>
                    <Td>{candidate.status}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Container>
  )
}

export default ScoreBoardPage
