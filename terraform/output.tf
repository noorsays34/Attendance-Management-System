output "load_balancer_url" {
  description = "Public URL for the deployed website."
  value       = "http://${aws_lb.main.dns_name}"
}

output "backend_health_url" {
  description = "Public backend health check URL."
  value       = "http://${aws_lb.main.dns_name}/health"
}

output "backend_docs_url" {
  description = "Public backend Swagger docs URL."
  value       = "http://${aws_lb.main.dns_name}/api-docs"
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster."
  value       = aws_ecs_cluster.main.name
}

output "frontend_service_name" {
  description = "Name of the frontend ECS service."
  value       = aws_ecs_service.frontend.name
}

output "backend_service_name" {
  description = "Name of the backend ECS service."
  value       = aws_ecs_service.backend.name
}