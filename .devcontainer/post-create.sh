#!/bin/bash

if [[ ! -e .env ]]; then
    cp .devcontainer/.env.devcontainer .env
fi
