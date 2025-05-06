#!/bin/bash
mkdir -p ./certs
openssl req -x509 -newkey rsa:2048 -keyout ./certs/key.pem -out ./certs/cert.pem -days 365 -nodes \
  -subj "/CN=localhost"

cp ./certs/cert.pem ../sp/backend/certs/idp/