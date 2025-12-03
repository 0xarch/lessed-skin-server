#!/bin/bash

if [[ ! -e .env ]]; then
    ln -sf .devcontainer/.env.devcontainer .env
fi