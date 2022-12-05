#!/usr/bin/env bash

cd api && yarn install --ignore-engines --force
cd ../client && yarn install --ignore-engines --force
