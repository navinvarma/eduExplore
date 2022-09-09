#!/bin/sh
mongoimport --db study-in-usa --collection universities --type csv --headerline --drop --file list_of_univs.csv