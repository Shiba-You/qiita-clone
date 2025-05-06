#!/bin/bash

NODE_ENV=dev docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build