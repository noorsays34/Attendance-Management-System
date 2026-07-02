variable "aws_region" {
  description = "AWS region where the ECS stack will be created."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix for all AWS resources."
  type        = string
  default     = "attendance-management-system-2-app"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"
}

variable "frontend_image" {
  description = "Container image URI for the React frontend, for example an ECR image URI."
  type        = string
}

variable "backend_image" {
  description = "Container image URI for the Express backend, for example an ECR image URI."
  type        = string
}

variable "frontend_desired_count" {
  description = "Number of frontend ECS tasks to run."
  type        = number
  default     = 1
}

variable "backend_desired_count" {
  description = "Number of backend ECS tasks to run."
  type        = number
  default     = 1
}

variable "task_cpu" {
  description = "CPU units for each ECS task."
  type        = number
  default     = 256
}

variable "task_memory" {
  description = "Memory in MiB for each ECS task."
  type        = number
  default     = 512
}