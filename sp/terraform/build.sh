#!bin/bash

if [[ "$1" == "init" ]]; then
  terraform init
fi

terraform plan
terraform apply
