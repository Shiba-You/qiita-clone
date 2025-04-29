#!/bin/bash

NODE_ENV=prod docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build