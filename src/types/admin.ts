export interface AdminUser {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  is_active: boolean
  is_super_admin: boolean
  last_login_at: string
  created_at: string
  updated_at: string
}

export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminLoginResponse {
  message: string
  admin: AdminUser
  token: string
}

export interface AdminRegisterRequest {
  email: string
  password: string
  first_name?: string
  last_name?: string
  phone_number?: string
}

export interface AdminListParams extends PaginationParams {
  is_active?: boolean
  is_super_admin?: boolean
}

export interface UpdateAdminRequest {
  id: string
  first_name?: string
  last_name?: string
  phone_number?: string
  is_active?: boolean
  is_super_admin?: boolean
}

export interface ResetAdminPasswordRequest {
  id: string
  password?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}

export interface ApiPagination {
  current_page: number
  total_pages: number
  total_count: number
  limit: number
  has_next: boolean
  has_prev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
}

export interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string | null
  is_active: boolean
  address: string | null
  city: string | null
  district: string | null
  created_at: string
  updated_at: string
}

export interface CustomerListParams extends PaginationParams {
  is_active?: boolean
}

export interface UpdateCustomerRequest {
  id: string
  is_active?: boolean
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string | null
  address?: string | null
  city?: string | null
  district?: string | null
}

export interface Workplace {
  id: string
  name: string
  industry_type_id?: number
  address?: string
  phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WorkplaceListParams extends PaginationParams {
  industry_type_id?: number
}

export interface CreateWorkplaceRequest {
  title?: string
  name?: string
  address?: string | null
  phone?: string | null
  industry_type_id?: number | null
  is_active?: boolean
}

export interface UpdateWorkplaceRequest {
  id: string
  is_active?: boolean
  title?: string
  address?: string | null
  phone?: string | null
  industry_type_id?: number | null
}

export interface Worker {
  id: string
  name: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  phone_number?: string | null
  workplace_id?: string
  workplace_name?: string
  is_active: boolean
  is_author: boolean
  role?: string
  role_id?: number
  created_at: string
  updated_at: string
}

export interface WorkerListParams extends PaginationParams {
  workplace_id?: string
}

export interface UpdateWorkerRequest {
  id: string
  is_active?: boolean
  workplace_id?: string
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string | null
  role_id?: number | null
}

export interface CreateWorkerRequest {
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string | null
  workplace_id?: string
  role_id?: number | null
  password?: string
  is_active?: boolean
}

export interface UpdateWorkerServiceRequest {
  workerId: string
  service_id: string | number
}

export interface RemoveWorkerServiceRequest {
  workerId: string
  serviceId: string | number
}

export interface Permission {
  id: string
  name: string
  display_name?: string
  description?: string
  group?: string
  category?: string
  is_active?: boolean
}

export interface Role {
  id: number
  name: string
  display_name?: string
  description?: string
  is_active?: boolean
  permissions?: Permission[]
}

export interface RoleDetail extends Role {
  permissions: Permission[]
}

export interface UpdateRolePermissionsRequest {
  roleId: number
  permission_names: string[]
}

export interface CreateRoleRequest {
  display_name: string
  description?: string
  is_active?: boolean
}

export interface UpdateRoleRequest {
  roleId: number
  display_name?: string
  description?: string
  is_active?: boolean
}

export interface CreatePermissionRequest {
  name: string
  display_name: string
  description?: string
  category?: string
  is_active?: boolean
}

export interface UpdatePermissionRequest {
  id: string
  display_name?: string
  description?: string
  category?: string
  is_active?: boolean
}

export interface WorkerPermissions {
  worker_id: string
  role: Role
  effective_permissions: Permission[]
  overrides?: {
    grants: string[]
    revokes: string[]
  }
}

export interface UpdateWorkerRoleRequest {
  workerId: string
  role_id?: number
  role_name?: string
}

export interface UpdateWorkerOverridesRequest {
  workerId: string
  grants?: string[]
  revokes?: string[]
  reset?: boolean
}

export interface DashboardData {
  total_users: number
  total_workers: number
  total_workplaces: number
  total_appointments: number
  total_services: number
  total_industries: number
  recent_registrations: RecentRegistration[]
  appointment_stats: AppointmentStat[]
  [key: string]: unknown
}

export interface RecentRegistration {
  date: string
  new_users: number
  new_workers: number
  new_workplaces: number
}

export type AppointmentStat = Record<string, unknown>

export interface MonthlyGrowth {
  month: string
  new_users: number
  new_workers: number
  new_workplaces: number
}

export interface PopularService {
  name: string
  worker_count: number
  appointment_count: number
}

export interface IndustryDistribution {
  type: string
  workplace_count: number
  worker_count: number
}

export interface SystemStats {
  monthly_growth: MonthlyGrowth[]
  popular_services: PopularService[]
  industry_distribution: IndustryDistribution[]
  [key: string]: unknown
}

export interface Appointment {
  id: string
  customer_name?: string
  worker_name?: string
  workplace_name?: string
  service_name?: string
  start_at?: string
  end_at?: string
  status?: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface AppointmentListParams extends PaginationParams {
  status?: string
  workplace_id?: string
  worker_id?: string
  date_from?: string
  date_to?: string
}

export interface Industry {
  id: string
  type: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface IndustryListParams extends PaginationParams {}

export interface CreateIndustryRequest {
  type: string
}

export interface UpdateIndustryRequest {
  id: string
  type?: string
}

export interface Service {
  id: string
  name: string
  description?: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface ServiceListParams extends PaginationParams {
  industry_id?: number
}

export interface CreateServiceRequest {
  name: string
  description: string
}

export interface UpdateServiceRequest {
  id: string
  name?: string
  description?: string
}

export interface IndustryService {
  id: string
  industry_id?: number | string
  service_id?: number | string
  industry_name?: string
  service_name?: string
  description?: string
  created_at?: string
  [key: string]: unknown
}

export interface IndustryServiceListParams extends PaginationParams {
  industry_id?: number | string
  service_id?: number | string
}

export interface CreateIndustryServiceRequest {
  industry_id: number | string
  service_id: number | string
}

export interface BlockedTime {
  id: string
  worker_id?: string
  workplace_id?: string
  start_at?: string
  end_at?: string
  reason?: string
  created_at?: string
  [key: string]: unknown
}

export interface BlockedTimeListParams extends PaginationParams {
  worker_id?: string
  workplace_id?: string
}

export interface CreateBlockedTimeRequest {
  worker_id?: string
  workplace_id?: string
  start_at: string
  end_at: string
  reason?: string
}

export interface UpdateBlockedTimeRequest {
  id: string
  worker_id?: string
  workplace_id?: string
  start_at?: string
  end_at?: string
  reason?: string
}

export interface Reminder {
  id: string
  appointment_id?: string
  type?: string
  message?: string
  send_at?: string
  created_at?: string
  [key: string]: unknown
}

export interface ReminderListParams extends PaginationParams {
  appointment_id?: string
}

export interface CreateReminderRequest {
  appointment_id: string
  message?: string
  send_at?: string
  type?: string
}

export interface UpdateReminderRequest {
  id: string
  message?: string
  send_at?: string
  type?: string
}

export interface CancellationReason {
  id: string | number
  reason_text?: string
  app_type?: 'user' | 'owner_worker'
  is_active?: boolean
  created_at?: string
  [key: string]: unknown
}

export interface CancellationReasonListParams extends Partial<PaginationParams> {}

export interface CreateCancellationReasonRequest {
  reason_text: string
  app_type: 'user' | 'owner_worker'
  is_active?: boolean
}

export interface UpdateCancellationReasonRequest {
  id: string | number
  reason_text?: string
  app_type?: 'user' | 'owner_worker'
  is_active?: boolean
}

export interface AppointmentCancellation {
  id: string
  appointment_id?: string
  reason_id?: string
  cancelled_by?: string
  created_at?: string
  [key: string]: unknown
}

export interface AuditLog {
  id: string
  actor_admin_id?: string
  actor_admin_name?: string
  action?: string
  entity_type?: string
  entity_id?: string
  old_values?: Record<string, unknown> | null
  new_values?: Record<string, unknown> | null
  ip?: string
  user_agent?: string
  created_at?: string
  [key: string]: unknown
}

export interface AuditLogListParams extends PaginationParams {
  actor_admin_id?: string
  action?: string
  entity_type?: string
  date_from?: string
  date_to?: string
}

export interface SystemHealth {
  db?: unknown
  firebase?: unknown
  push_queue?: unknown
  memory?: unknown
  uptime?: number | string
  table_stats?: unknown
  [key: string]: unknown
}

export interface Subscription {
  id: string
  status?: string
  expires_at?: string
  product_id?: string
  workplace_id?: string
  workplace_title?: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface SubscriptionListParams extends PaginationParams {
  status?: string
  workplace_id?: string
  search?: string
}

export interface UpdateSubscriptionRequest {
  id: string
  status?: string
  expires_at?: string
  product_id?: string
}

export type ConfigValue = string | number | boolean | null

export interface ConfigItem {
  id?: number
  key: string
  value: ConfigValue
  description?: string
  updated_by?: string | number | null
  created_at?: string
  updated_at?: string
  updated_by_name?: string | null
  updated_by_last_name?: string | null
  [key: string]: unknown
}

export interface UpdateConfigRequest {
  key: string
  value: ConfigValue
}

export interface AppointmentCancellationListParams extends PaginationParams {
  appointment_id?: string
}

export interface UpdateAppointmentCancellationRequest {
  id: string
  reason_id?: string
  status?: string
}

export interface IdpConfig {
  name: string
  enabled: boolean
  appleSignInConfig?: {
    bundleIds?: string[]
  }
  clientId?: string
  clientSecret?: string
  [key: string]: unknown
}

export interface FirebaseIdpResponse {
  message?: string
  idpConfigs: IdpConfig[]
  supportedProviders: Record<string, string>
}

export interface FirebaseIdp {
  id: string
  provider_id?: string
  name?: string
  is_enabled?: boolean
  created_at?: string
  [key: string]: unknown
}

export interface FirebaseIdpListParams extends PaginationParams {}

export interface CreateFirebaseIdpRequest {
  provider_id: string
  name?: string
  client_id?: string
  client_secret?: string
  is_enabled?: boolean
  [key: string]: unknown
}

export interface UpdateFirebaseIdpRequest {
  id: string
  name?: string
  client_id?: string
  client_secret?: string
  is_enabled?: boolean
  [key: string]: unknown
}

export interface AppleVerifyBatchRequest {
  receipts: string[]
}

export interface AppleVerifyBatchResponse {
  success: boolean
  [key: string]: unknown
}
