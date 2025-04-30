variable "key_name" {
  description = "EC2用のSSHキーペア名"
  type        = string
}

variable "route53_zone_id" {
  description = "Route53のゾーンID"
  type        = string
}