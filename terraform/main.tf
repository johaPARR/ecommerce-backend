terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {}

# Apuntamos exactamente al nombre que muestra tu comando docker images
resource "docker_image" "mi_backend_image" {
  name         = "ecommerce-backend-app:latest"
  keep_locally = true
}

# Definimos el contenedor
resource "docker_container" "mi_backend_container" {
  image = docker_image.mi_backend_image.image_id
  name  = "backend-ecommerce-terraform"

  ports {
    internal = 3000
    external = 3000
  }

  # Pasamos las variables de entorno cubriendo los nombres más habituales
  env = [
    "MONGO_URI=mongodb://host.docker.internal:27017/ecommerce",
    "MONGODB_URI=mongodb://host.docker.internal:27017/ecommerce",
    "DB_URI=mongodb://host.docker.internal:27017/ecommerce"
  ]
}