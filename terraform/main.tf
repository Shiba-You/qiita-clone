provider "aws" {
  region = "ap-northeast-1"  # 東京リージョンなど
}

# VPC
resource "aws_vpc" "main" {
  cidr_block = "10.10.0.0/16"
}

# サブネット
resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.10.1.0/24"
  map_public_ip_on_launch = true
}

# インターネットゲートウェイ
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

# ルートテーブル
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

# サブネットにルートテーブルを関連付け
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# セキュリティグループ（HTTP, SSH許可）
resource "aws_security_group" "web" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Elastic IP（グローバルIP）
resource "aws_eip" "nginx" {
  vpc = true
}

# EC2インスタンス（Amazon Linux 2）
resource "aws_instance" "nginx" {
  ami                    = "ami-0c3fd0f5d33134a76"  # Amazon Linux 2（東京の場合）
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids        = [aws_security_group.web.id]
  associate_public_ip_address = true
  key_name               = var.key_name
  user_data              = file("install_nginx.sh")

  tags = {
    Name = "nginx-server"
  }
}

# EIPをEC2にアタッチ
resource "aws_eip_association" "nginx_ip" {
  instance_id   = aws_instance.nginx.id
  allocation_id = aws_eip.nginx.id
}

# Route53（Aレコード）
resource "aws_route53_record" "nginx" {
  zone_id = var.route53_zone_id
  name    = "nginx.example.com"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.nginx.public_ip]
}
