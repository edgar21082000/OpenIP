export type Body_login_login_access_token = {
  grant_type?: string | null
  username: string
  password: string
  scope?: string
  client_id?: string | null
  client_secret?: string | null
}

export type HTTPValidationError = {
  detail?: Array<ValidationError>
}

export type ValidationError = {
  loc: Array<string | number>
  msg: string
  type: string
}

export type Token = {
  access_token: string
  token_type?: string
}

export type Message = {
  message: string
}

export type NewPassword = {
  token: string
  new_password: string
}

export type UpdatePassword = {
  current_password: string
  new_password: string
}

export type UserPublic = {
  role: 'applicant' | 'interviewer' | 'HR'
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  id: string
}

export type UsersPublic = {
  data: Array<UserPublic>
  count: number
}

export type UserCreate = {
  role: 'applicant' | 'interviewer' | 'HR'
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  password: string
}

export type UserRegister = {
  role: 'applicant' | 'interviewer' | 'HR'
  email: string
  password: string
  full_name?: string | null
}

export type UserUpdate = {
  role: 'applicant' | 'interviewer' | 'HR'
  email?: string | null
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  password?: string | null
}

export type UserUpdateMe = {
  full_name?: string | null
  email?: string | null
}

export type ScoreBoardRecord = {
  mail: string
  status: boolean
  stack: string
  mark: number
}

export type InterviewSlotPublic = {
  id: number
  email: string
  from_datetime: string
  duration: number
  stack: string
}

export interface InterviewSlotSelectResult {
  status: string
}

export interface InterviewSlotCreate {
  from_datetime: string
  duration: number
  stack: string
}

export interface InterviewHistory {
  interview_id: number
  date: string
  summary: string
  rating: number
}

export interface SetMarkResult {
  status: string
}

export interface SetMarkData {
  interview_id: string
  mark: string
}