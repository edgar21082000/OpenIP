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
//import { useMutation } from "@tanstack/react-query";
//import { useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

//import { type ApiError } from "../../client";
//import useCustomToast from "../../hooks/useCustomToast";
//import { handleError } from "../../utils";

export interface InterviewCreate {
  date: string;
  time: string;
  duration: number;
  technology: string;
}

interface AddInterviewProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddItem ({ isOpen, onClose }: AddInterviewProps) {
  //const queryClient = useQueryClient();
  //const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    //reset,
    formState: { errors, isSubmitting },
  } = useForm<InterviewCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      date: "",
      duration: 0,
      technology: "",
    },
  });

  /* const mutation = useMutation({
    mutationFn: (data: InterviewCreate) => {},
      InterviewService.createInterview({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Interview scheduled successfully.", "success");
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  }); */

  const onSubmit: SubmitHandler<InterviewCreate> = () => {
    //mutation.mutate(data);
  };

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
            <FormControl isRequired isInvalid={!!errors.date}>
              <FormLabel htmlFor="date">Date and Time</FormLabel>
              <Input
                id="date"
                type="datetime-local"
                {...register("date", {
                  required: "Date and time are required.",
                })}
              />
              {errors.date && (
                <FormErrorMessage>{errors.date.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired mt={4} isInvalid={!!errors.duration}>
              <FormLabel htmlFor="duration">Duration (in minutes)</FormLabel>
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
            <FormControl isRequired mt={4} isInvalid={!!errors.technology}>
              <FormLabel htmlFor="technology">Technology</FormLabel>
              <Select
                id="technology"
                placeholder="Select technology"
                {...register("technology", {
                  required: "Technology is required.",
                })}
              >
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="Ruby on Rails">Ruby on Rails</option>
              </Select>
              {errors.technology && (
                <FormErrorMessage>{errors.technology.message}</FormErrorMessage>
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