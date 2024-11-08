import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ApiError, InterviewSlotCreate, InterviewSlotsService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "../../utils";

interface AddInterviewProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddItem ({ isOpen, onClose }: AddInterviewProps) {
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InterviewSlotCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      from_datetime: "",
      duration: 0,
      stack: ""
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InterviewSlotCreate) =>
      InterviewSlotsService.createInterviewSlot(data),
    onSuccess: () => {
      showToast("Success!", "Slot added successfully.", "success")
      onClose(); 
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
  })

  const onSubmit: SubmitHandler<InterviewSlotCreate> = async (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Schedule Interview</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.from_datetime}>
              <FormLabel htmlFor="date">Interview Date</FormLabel>
              <Input
                id="from_date_time"
                type="datetime-local"
                {...register("from_datetime", {
                  required: "Date and time are required.",
                })}
              />
              {errors.from_datetime && (
                <FormErrorMessage>{errors.from_datetime.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired mt={4} isInvalid={!!errors.duration}>
              <FormLabel htmlFor="duration">Duration (Hours)</FormLabel>
              <Input
                id="duration"
                type="number"
                {...register("duration", {
                  required: "Duration is required.",
                  min: { value: 1, message: "Duration must be at least 1 minute." }
                })}
              />
              {errors.duration && (
                <FormErrorMessage>{errors.duration.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired mt={4} isInvalid={!!errors.stack}>
              <FormLabel htmlFor="stack">Stack</FormLabel>
              <Select
                id="stack"
                placeholder="Select stack"
                {...register("stack", {
                  required: "Stack is required.",
                })}
              >
                <option value="python">python</option>
                <option value="go">go</option>
                <option value="algo">algo</option>
              </Select>
              {errors.stack && (
                <FormErrorMessage>{errors.stack.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddItem;